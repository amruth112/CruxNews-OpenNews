import { useMemo, useState } from 'react';
import { useStore } from '../../stores/newsStore';
import { StoryCard } from './StoryCard';
import { LoadingState, EmptyState } from './LoadingState';
import { StoryRoom } from '../story/StoryRoom';
import type { SortBy, Region } from '../../types';

export function StoryFeed() {
  const { state, dispatch } = useStore();
  const [localSearch, setLocalSearch] = useState('');
  const isBuildingInitialFeed =
    state.articles.length > 0 &&
    state.clusters.length === 0 &&
    state.unclusteredArticles.length === 0;

  // Derived filtered & sorted stories
  const filteredClusters = useMemo(() => {
    let result = state.clusters;

    // Search filter
    if (localSearch) {
      const q = localSearch.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q));
    }

    // Region filter
    if (state.regionFilter) {
      result = result.filter(c => c.articles.some(a => a.sourceRegion === state.regionFilter));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      switch (state.sortBy) {
        case 'coverage':
          return b.sourceCount - a.sourceCount || b.latestPublishedAt.getTime() - a.latestPublishedAt.getTime();
        case 'recency':
          return b.avgPublishedAt.getTime() - a.avgPublishedAt.getTime();
        case 'diversity':
          return b.biasSpread - a.biasSpread || b.sourceCount - a.sourceCount;
        default:
          return 0;
      }
    });

    return result;
  }, [state.clusters, localSearch, state.regionFilter, state.sortBy]);

  // Handle Loading State
  if (
    state.articles.length === 0 ||
    state.modelStatus === 'loading' ||
    state.modelStatus === 'downloading' ||
    isBuildingInitialFeed
  ) {
    return <LoadingState />;
  }

  // Handle Story View Routing
  if (state.currentView === 'story' && state.selectedClusterId) {
    const cluster = state.clusters.find(c => c.id === state.selectedClusterId);
    if (cluster) return <StoryRoom cluster={cluster} />;
  }

  const regions: { id: Region | null; label: string }[] = [
    { id: null, label: 'All Regions' },
    { id: 'us', label: 'US' },
    { id: 'uk', label: 'UK' },
    { id: 'eu', label: 'Europe' },
    { id: 'middle-east', label: 'Mid East' },
    { id: 'asia', label: 'Asia' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Oceania' },
    { id: 'global', label: 'Global' },
  ];

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 sticky top-16 z-30 bg-[var(--bg-primary)]/80 backdrop-blur-md py-4 border-b border-[var(--border)]">
        
        {/* Regions Scrollable Row */}
        <div className="flex overflow-x-auto pb-2 lg:pb-0 hide-scrollbar gap-2 shrink-0 max-w-full lg:max-w-2xl">
          {regions.map(r => (
            <button
              key={r.id || 'all'}
              onClick={() => dispatch({ type: 'SET_REGION_FILTER', payload: r.id })}
              className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                state.regionFilter === r.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Sort & Search */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search stories..."
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            className="flex-1 lg:w-48 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
          />
          
          <div className="flex bg-[var(--bg-tertiary)] rounded-lg p-0.5 shrink-0">
            {(['coverage', 'recency', 'diversity'] as SortBy[]).map(sort => (
              <button
                key={sort}
                onClick={() => dispatch({ type: 'SET_SORT_BY', payload: sort })}
                className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                  state.sortBy === sort
                    ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>
        </div>
        
      </div>

      {/* Main Feed */}
      <div className="space-y-4">
        {filteredClusters.length > 0 ? (
          filteredClusters.map((cluster, idx) => (
            <StoryCard 
              key={cluster.id} 
              cluster={cluster} 
              index={idx}
              onClick={() => dispatch({ type: 'SELECT_CLUSTER', payload: cluster.id })}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Unclustered News (Single Source) */}
      {state.unclusteredArticles.length > 0 && (
        <div className="pt-12 mt-12 border-t border-[var(--border)]">
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6">Other News (Single Source)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {state.unclusteredArticles.slice(0, 12).map(article => (
              <a 
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col p-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg hover:border-[var(--text-secondary)] transition-colors"
                title={`${article.sourceName} - Bias: ${article.sourceBias}`}
              >
                <div className="flex gap-2 items-center mb-2">
                  <div className={`w-2 h-2 rounded-full bg-[var(--bias-${article.sourceBias === 'independent' ? 'independent' : article.sourceBias.replace('-center', '')})]`} />
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{article.sourceName}</span>
                </div>
                <h4 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent)] line-clamp-2">
                  {article.title}
                </h4>
              </a>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
