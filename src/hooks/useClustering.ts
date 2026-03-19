import { useEffect, useRef, useState } from 'react';
import { useStore } from '../stores/newsStore';
import { generateEmbeddings, initModel } from '../services/clusterEngine';
import { agglomerativeClustering } from '../utils/clustering';
import { prepareForEmbedding } from '../utils/text';
import { averageDate } from '../utils/time';
import type { StoryCluster, Article } from '../types';

export function useClustering() {
  const { state, dispatch } = useStore();
  const embeddingsCache = useRef<Map<string, Float32Array>>(new Map());
  const isClusteringRef = useRef(false);
  const [isClustering, setIsClustering] = useState(false);

  useEffect(() => {
    if (state.articles.length === 0) return;
    if (state.isRefreshing) return;

    let isMounted = true;

    async function processClusters() {
      // Use ref for race-condition-safe guard (not stale closure state)
      if (isClusteringRef.current) return;
      isClusteringRef.current = true;
      setIsClustering(true);

      try {
        // 1. Initialize model
        if (state.modelStatus === 'idle' || state.modelStatus === 'error') {
          dispatch({ type: 'SET_MODEL_STATUS', payload: 'loading' });
          await initModel((progress, status) => {
            if (!isMounted) return;
            dispatch({ type: 'SET_MODEL_STATUS', payload: status });
            dispatch({ type: 'SET_MODEL_PROGRESS', payload: progress });
          });
        }

        if (!isMounted) return;

        // 2. Prune stale entries from cache (articles no longer in current set)
        const currentIds = new Set(state.articles.map(a => a.id));
        for (const cachedId of embeddingsCache.current.keys()) {
          if (!currentIds.has(cachedId)) {
            embeddingsCache.current.delete(cachedId);
          }
        }

        // 3. Compute missing embeddings
        const articlesToEmbed = state.articles.filter(a => !embeddingsCache.current.has(a.id));

        if (articlesToEmbed.length > 0) {
          const texts = articlesToEmbed.map(a => prepareForEmbedding(a.title, a.description));

          const newEmbeddings = await generateEmbeddings(texts);

          articlesToEmbed.forEach((a, i) => {
            embeddingsCache.current.set(a.id, newEmbeddings[i]);
          });
        }

        if (!isMounted) return;

        // 4. Cluster all current articles
        const currentEmbeddings = state.articles.map(a =>
          embeddingsCache.current.get(a.id)!
        ).filter(Boolean);

        if (currentEmbeddings.length !== state.articles.length) {
          console.warn('Embedding mismatch, falling back to unclustered view');
          const sortedUnclustered = [...state.articles].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
          dispatch({
            type: 'SET_CLUSTERS',
            payload: { clusters: [], unclustered: sortedUnclustered },
          });
          return;
        }

        const { clusters, noise } = agglomerativeClustering(currentEmbeddings, state.settings.clusterThreshold);

        // 5. Build cluster objects
        const storyClusters: StoryCluster[] = [];
        const unclustered: Article[] = noise.map(idx => state.articles[idx]);

        clusters.forEach((indices, i) => {
          const clusterArticles = indices.map(idx => state.articles[idx]);
          const sourceIds = new Set(clusterArticles.map(a => a.sourceId));

          if (sourceIds.size >= 2) {
            clusterArticles.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());

            const biasSet = new Set(clusterArticles.map(a => a.sourceBias));
            const biasCategories = Array.from(biasSet);
            const biasSpread = biasCategories.length / 5;
            const breakingSource = clusterArticles[0].sourceName;
            const earliest = clusterArticles[0].publishedAt;
            const latest = clusterArticles[clusterArticles.length - 1].publishedAt;

            let repTitle = clusterArticles[0].title;
            try {
              const tier1Match = clusterArticles.find(a =>
                ['nytimes.com', 'wsj.com', 'reuters.com', 'bbc.com'].includes(new URL(a.url).hostname)
              );
              if (tier1Match) repTitle = tier1Match.title;
            } catch { /* invalid URL, keep default title */ }

            storyClusters.push({
              id: `cluster-${i}-${clusterArticles[0].id}`,
              title: repTitle,
              articles: clusterArticles,
              sourceCount: sourceIds.size,
              biasCategories,
              biasSpread,
              avgPublishedAt: averageDate(clusterArticles.map(a => a.publishedAt)),
              earliestPublishedAt: earliest,
              latestPublishedAt: latest,
              breakingSource,
            });
          } else {
            unclustered.push(...clusterArticles);
          }
        });

        // 6. Rank clusters
        storyClusters.sort((a, b) => {
          if (b.sourceCount !== a.sourceCount) return b.sourceCount - a.sourceCount;
          return b.latestPublishedAt.getTime() - a.latestPublishedAt.getTime();
        });

        unclustered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

        if (isMounted) {
          dispatch({
            type: 'SET_CLUSTERS',
            payload: { clusters: storyClusters, unclustered },
          });
        }

      } catch (err) {
        console.error('Clustering pipeline error (falling back to keyword matching):', err);
        dispatch({ type: 'SET_MODEL_STATUS', payload: 'error' });

        // Fallback: keyword-based clustering
        if (isMounted) {
          const fallback = keywordFallbackClustering(state.articles);
          dispatch({ type: 'SET_CLUSTERS', payload: fallback });
        }
      } finally {
        isClusteringRef.current = false;
        if (isMounted) setIsClustering(false);
      }
    }

    processClusters();

    return () => { isMounted = false; };
  }, [
    state.articles,
    state.settings.clusterThreshold,
    state.isRefreshing,
    dispatch,
  ]);

  return { isClustering };
}

/**
 * Simple keyword-overlap fallback when AI model fails.
 * Uses Jaccard similarity on significant words in titles.
 */
function keywordFallbackClustering(articles: Article[]) {
  const fallbackClusters: StoryCluster[] = [];
  const fallbackUnclustered: Article[] = [];
  const usedIds = new Set<string>();

  for (let i = 0; i < articles.length; i++) {
    if (usedIds.has(articles[i].id)) continue;

    const a1 = articles[i];
    const clusterMatches = [a1];
    usedIds.add(a1.id);

    const words1 = new Set(a1.title.toLowerCase().split(/\W+/).filter(w => w.length > 4));

    for (let j = i + 1; j < articles.length; j++) {
      if (usedIds.has(articles[j].id)) continue;
      const a2 = articles[j];
      const words2 = new Set(a2.title.toLowerCase().split(/\W+/).filter(w => w.length > 4));

      const intersection = new Set([...words1].filter(x => words2.has(x)));
      const union = new Set([...words1, ...words2]);
      const similarity = intersection.size / (union.size || 1);

      if (similarity > 0.3) {
        clusterMatches.push(a2);
        usedIds.add(a2.id);
      }
    }

    if (clusterMatches.length >= 2) {
      clusterMatches.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
      const sourceIds = new Set(clusterMatches.map(a => a.sourceId));

      if (sourceIds.size >= 2) {
        const biasSet = new Set(clusterMatches.map(a => a.sourceBias));
        fallbackClusters.push({
          id: `fallback-${i}-${a1.id}`,
          title: a1.title,
          articles: clusterMatches,
          sourceCount: sourceIds.size,
          biasCategories: Array.from(biasSet),
          biasSpread: biasSet.size / 5,
          avgPublishedAt: clusterMatches[Math.floor(clusterMatches.length / 2)].publishedAt,
          earliestPublishedAt: clusterMatches[0].publishedAt,
          latestPublishedAt: clusterMatches[clusterMatches.length - 1].publishedAt,
          breakingSource: clusterMatches[0].sourceName,
        });
      } else {
        fallbackUnclustered.push(...clusterMatches);
      }
    } else {
      fallbackUnclustered.push(a1);
    }
  }

  return { clusters: fallbackClusters, unclustered: fallbackUnclustered };
}
