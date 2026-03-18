import { motion } from 'framer-motion';
import { useStore } from '../../stores/newsStore';
import { relativeTime } from '../../utils/time';
import { SourceLogo } from '../shared/SourceLogo';
import { BiasSpectrumBar } from './BiasSpectrumBar';
import type { StoryCluster } from '../../types';

interface StoryCardProps {
  cluster: StoryCluster;
  onClick: () => void;
  index: number;
}

export function StoryCard({ cluster, onClick, index }: StoryCardProps) {
  const { theme } = useStore().state;
  
  // Get up to 5 unique logos
  const uniqueSources = Array.from(new Set(cluster.articles.map(a => a.sourceId)))
    .slice(0, 5);

  return (
    <motion.button
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      onClick={onClick}
      className="w-full text-left group flex flex-col p-5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--text-secondary)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        
        {/* Logos & Metadata */}
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
          <div className="flex -space-x-2">
            {uniqueSources.map((sourceId, i) => (
              <div key={`${sourceId}-${i}`} className="relative z-10 border-2 border-[var(--bg-secondary)] rounded-full shadow-sm">
                <SourceLogo sourceId={sourceId} size="md" />
              </div>
            ))}
            {cluster.sourceCount > 5 && (
              <div className="relative z-0 w-5 h-5 rounded-full bg-[var(--bg-tertiary)] border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[8px] font-bold text-[var(--text-secondary)]">
                +{cluster.sourceCount - 5}
              </div>
            )}
          </div>
          
          <div className="h-4 w-px bg-[var(--border)]" />
          
          <span className="text-xs font-medium text-[var(--text-secondary)] whitespace-nowrap">
            {cluster.sourceCount} outlets
          </span>
          
          <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap hidden sm:inline-block">
            {relativeTime(cluster.avgPublishedAt)}
          </span>
        </div>

        {/* Bias Spectrum */}
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider hidden sm:block">
            Coverage Spectrum
          </span>
          <BiasSpectrumBar categories={cluster.biasCategories} />
        </div>
      </div>

      {/* Headline */}
      <h2 className="text-xl sm:text-2xl font-serif font-medium text-[var(--text-primary)] leading-tight group-hover:text-[var(--accent)] transition-colors line-clamp-2">
        {cluster.title}
      </h2>

      {/* Breaking Badge Optional */}
      <div className="mt-4 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
        {cluster.breakingSource && (
          <span className="flex items-center gap-1">
            <span className="text-[10px]">⚡</span> Broke first by <span className="font-semibold text-[var(--text-primary)]">{cluster.breakingSource}</span>
          </span>
        )}
        <span className="sm:hidden text-[var(--text-tertiary)]">• {relativeTime(cluster.avgPublishedAt)}</span>
      </div>
    </motion.button>
  );
}
