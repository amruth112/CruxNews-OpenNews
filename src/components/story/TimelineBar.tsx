import { useMemo } from 'react';
import { differenceInMinutes } from 'date-fns';
import { Tooltip } from '../shared/Tooltip';
import { formatTimelineTime } from '../../utils/time';
import type { Article } from '../../types';

interface TimelineBarProps {
  articles: Article[];
}

export function TimelineBar({ articles }: TimelineBarProps) {
  // Sort from oldest to newest
  const sorted = useMemo(() => {
    return [...articles].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
  }, [articles]);

  // Group very close events (within 2% of timeline)
  const groupedDots = useMemo(() => {
    if (sorted.length < 2) return [];
    const first = sorted[0].publishedAt.getTime();
    const last = sorted[sorted.length - 1].publishedAt.getTime();
    const range = Math.max(last - first, 60000);
    const groups: { x: number; articles: Article[] }[] = [];
    const thresholdPercentage = 2;

    sorted.forEach((article) => {
      const time = article.publishedAt.getTime();
      const rawX = ((time - first) / range) * 100;
      const x = Math.max(0, Math.min(100, rawX));

      const existingGroup = groups.find(g => Math.abs(g.x - x) < thresholdPercentage);

      if (existingGroup) {
        existingGroup.articles.push(article);
      } else {
        groups.push({ x, articles: [article] });
      }
    });

    return groups;
  }, [sorted]);

  if (sorted.length < 2) return null;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Publication Timeline
        </h3>
        <span className="text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-1 rounded">
          {differenceInMinutes(sorted[sorted.length - 1].publishedAt, sorted[0].publishedAt)} mins spread
        </span>
      </div>
      
      <div className="relative h-12 w-full px-4">
        {/* The line */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-[var(--border)]" />
        
        {/* First/Last Labels */}
        <div className="absolute -bottom-6 left-0 text-[10px] text-[var(--text-tertiary)] hidden sm:block">
          {formatTimelineTime(sorted[0].publishedAt)}
        </div>
        <div className="absolute -bottom-6 right-0 text-[10px] text-[var(--text-tertiary)] hidden sm:block">
          {formatTimelineTime(sorted[sorted.length - 1].publishedAt)}
        </div>

        {/* Nodes */}
        {groupedDots.map((group, i) => (
          <div 
            key={i}
            className="absolute top-1/2 -translate-y-1/2 -ml-2"
            style={{ left: `${group.x}%` }}
          >
            <Tooltip
              content={
                <div className="px-1 py-0.5 text-center">
                  <div className="font-medium text-xs mb-1">
                    {formatTimelineTime(group.articles[0].publishedAt)}
                  </div>
                  {group.articles.map((a, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[var(--bias-${a.sourceBias.replace('-center', '')})]`} />
                      {a.sourceName}
                    </div>
                  ))}
                </div>
              }
            >
              <div 
                className={`relative flex items-center justify-center rounded-full bg-[var(--bg-primary)] border-2 border-[var(--text-secondary)] shadow-sm cursor-help transition-transform hover:scale-125 hover:z-10
                  ${group.articles.length > 1 ? 'w-5 h-5' : 'w-4 h-4'}
                `}
              >
                {/* Break out the primary bias color of the group */}
                <div className={`w-full h-full rounded-full bg-[var(--bias-${group.articles[0].sourceBias.replace('-center', '')})] opacity-80`} />
                
                {group.articles.length > 1 && (
                  <span className="absolute text-[8px] font-bold text-white z-10">
                    +{group.articles.length}
                  </span>
                )}
                
                {group.x === 0 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[var(--accent)] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                    First
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[4px] border-l-transparent border-r-transparent border-t-[var(--accent)]" />
                  </div>
                )}
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
