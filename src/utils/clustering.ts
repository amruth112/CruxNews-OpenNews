import { computeSimilarityMatrix } from './cosine';

interface ClusterResult {
  clusters: number[][];
  noise: number[];
}

/**
 * Agglomerative clustering with average linkage.
 * Returns groups of indices where items within each group have
 * average pairwise similarity >= threshold.
 */
export function agglomerativeClustering(
  embeddings: Float32Array[],
  threshold: number = 0.55
): ClusterResult {
  const n = embeddings.length;
  if (n === 0) return { clusters: [], noise: [] };

  const simMatrix = computeSimilarityMatrix(embeddings);
  // Each item starts in its own cluster
  const clusters: Set<number>[] = [];
  for (let i = 0; i < n; i++) {
    clusters.push(new Set([i]));
  }

  // Track which clusters are still active
  const active = new Set<number>(clusters.map((_, i) => i));

  while (active.size > 1) {
    let bestSim = -Infinity;
    let bestI = -1;
    let bestJ = -1;

    const activeArr = Array.from(active);

    for (let ai = 0; ai < activeArr.length; ai++) {
      for (let aj = ai + 1; aj < activeArr.length; aj++) {
        const ci = activeArr[ai];
        const cj = activeArr[aj];
        const sim = averageLinkage(clusters[ci], clusters[cj], simMatrix, n);
        if (sim > bestSim) {
          bestSim = sim;
          bestI = ci;
          bestJ = cj;
        }
      }
    }

    if (bestSim < threshold || bestI === -1) break;

    // Merge cj into ci
    for (const idx of clusters[bestJ]) {
      clusters[bestI].add(idx);
    }
    active.delete(bestJ);
  }

  const result: number[][] = [];
  const noise: number[] = [];

  for (const ci of active) {
    const items = Array.from(clusters[ci]);
    if (items.length >= 2) {
      result.push(items);
    } else {
      noise.push(...items);
    }
  }

  return { clusters: result, noise };
}

function averageLinkage(
  a: Set<number>,
  b: Set<number>,
  simMatrix: Float32Array,
  n: number
): number {
  let total = 0;
  let count = 0;
  for (const i of a) {
    for (const j of b) {
      total += simMatrix[i * n + j];
      count++;
    }
  }
  return count === 0 ? 0 : total / count;
}
