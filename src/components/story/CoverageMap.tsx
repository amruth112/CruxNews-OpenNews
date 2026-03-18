import { useMemo } from 'react';
import { format } from 'date-fns';
import { useStore } from '../../stores/newsStore';
import { BiasIndicator } from '../shared/BiasIndicator';
import { Badge } from '../shared/Badge';
import { Tooltip } from '../shared/Tooltip';
import type { Article } from '../../types';

interface CoverageMapProps {
  articles: Article[];
}

export function CoverageMap({ articles }: CoverageMapProps) {
  const { theme } = useStore().state;
  
  // Group articles by bias category
  const distribution = useMemo(() => {
    const map = new Map<string, Article[]>();
    ['left', 'left-center', 'center', 'right-center', 'right', 'independent'].forEach(c => map.set(c, []));
    
    articles.forEach(a => {
      if (map.has(a.sourceBias)) {
        map.get(a.sourceBias)!.push(a);
      } else {
        map.get('independent')!.push(a); // Fallback
      }
    });
    
    return map;
  }, [articles]);

  const total = articles.length;

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-6">
        Coverage Distribution
      </h3>
      
      <div className="space-y-4">
        {Array.from(distribution.entries()).map(([bias, arts]) => {
          if (arts.length === 0) return null;
          
          const percentage = Math.round((arts.length / total) * 100);
          
          return (
            <div key={bias} className="flex items-center gap-4">
              <div className="w-24 shrink-0">
                <BiasIndicator bias={bias as any} showText size="sm" />
              </div>
              
              <div className="flex-1 h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-[var(--bias-${bias === 'independent' ? 'independent' : bias.replace('-center', '')})] transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              
              <div className="w-12 text-right">
                <span className="text-sm font-medium text-[var(--text-primary)]">{percentage}%</span>
              </div>
              
              <Tooltip 
                content={
                  <div className="max-w-xs p-2">
                    <p className="font-semibold mb-1 border-b border-gray-700 pb-1">{arts.length} Sources</p>
                    <ul className="text-xs space-y-1 max-h-32 overflow-y-auto pr-2">
                      {arts.map(a => (
                        <li key={a.id} className="truncate">
                          {a.sourceName} <span className="text-gray-400">({format(a.publishedAt, 'MMM d, h:mm a')})</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                }
                position="left"
              >
                <Badge variant="neutral" className="w-8 justify-center cursor-help">
                  {arts.length}
                </Badge>
              </Tooltip>
            </div>
          );
        })}
      </div>
    </div>
  );
}
