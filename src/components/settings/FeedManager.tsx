import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useStore } from '../../stores/newsStore';
import { FEED_SOURCES } from '../../config/feeds';
import { SourceLogo } from '../shared/SourceLogo';
import { BiasIndicator } from '../shared/BiasIndicator';
import type { BiasCategory } from '../../types';

export function FeedManager() {
  const { settings, toggleFeed } = useSettings();
  const { state } = useStore();
  const [search, setSearch] = useState('');

  // Group feeds by bias for logical display
  const groupedFeeds = useMemo(() => {
    const groups: Record<string, typeof FEED_SOURCES> = {
      'The Left': FEED_SOURCES.filter(f => f.category === 'left'),
      'Left-Center': FEED_SOURCES.filter(f => f.category === 'left-center'),
      'Center': FEED_SOURCES.filter(f => f.category === 'center'),
      'Right-Center': FEED_SOURCES.filter(f => f.category === 'right-center'),
      'The Right': FEED_SOURCES.filter(f => f.category === 'right'),
      'Independent / Global': FEED_SOURCES.filter(f => f.category === 'independent')
    };

    if (!search) return groups;

    const lowerSearch = search.toLowerCase();
    const filteredGroups: typeof groups = {};
    
    for (const [key, feeds] of Object.entries(groups)) {
      const filtered = feeds.filter(f => 
        f.name.toLowerCase().includes(lowerSearch) || 
        f.region.toLowerCase().includes(lowerSearch)
      );
      if (filtered.length > 0) {
        filteredGroups[key] = filtered;
      }
    }
    
    return filteredGroups;
  }, [search]);

  // Helper to map bias category to our string grouping
  const getBiasCategory = (groupKey: string): BiasCategory => {
    switch(groupKey) {
      case 'The Left': return 'left';
      case 'Left-Center': return 'left-center';
      case 'Center': return 'center';
      case 'Right-Center': return 'right-center';
      case 'The Right': return 'right';
      default: return 'independent';
    }
  };

  const getStatusDisplay = (feedId: string) => {
    const status = state.feedStatuses[feedId];
    if (!settings.enabledFeeds[feedId]) return <span className="text-gray-500 text-xs">Disabled</span>;
    
    switch (status) {
      case 'active': return <span className="text-[var(--success)] text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--success)]" /> Active</span>;
      case 'slow': return <span className="text-yellow-500 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Slow</span>;
      case 'error': return <span className="text-[var(--danger)] text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)]" /> Error</span>;
      default: return <span className="text-[var(--text-tertiary)] text-xs">Waiting...</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
        <input
          type="text"
          placeholder="Search news sources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(groupedFeeds).map(([groupName, feeds]) => (
          <div key={groupName}>
            <div className="flex items-center gap-2 mb-3 px-1">
              <BiasIndicator bias={getBiasCategory(groupName)} size="sm" />
              <h4 className="text-xs font-bold tracking-wider text-[var(--text-secondary)] uppercase">
                {groupName}
              </h4>
              <div className="h-px flex-1 bg-[var(--border)] ml-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {feeds.map(feed => {
                const isEnabled = settings.enabledFeeds[feed.id];
                return (
                  <label 
                    key={feed.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                      isEnabled 
                        ? 'bg-[var(--bg-tertiary)]/50 border-[var(--border)] hover:border-[var(--text-secondary)]' 
                        : 'bg-transparent border-transparent hover:bg-[var(--bg-tertiary)] opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => toggleFeed(feed.id)}
                        className="w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)] bg-[var(--bg-primary)]"
                      />
                      <SourceLogo sourceId={feed.id} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-[var(--text-primary)] leading-tight">{feed.name}</span>
                        <span className="text-[10px] text-[var(--text-tertiary)] uppercase">{feed.region}</span>
                      </div>
                    </div>
                    <div>
                      {getStatusDisplay(feed.id)}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(groupedFeeds).length === 0 && (
          <div className="text-center py-8 text-[var(--text-secondary)] text-sm">
            No sources found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
