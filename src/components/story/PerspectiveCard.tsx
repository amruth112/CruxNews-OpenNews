import { ExternalLink } from 'lucide-react';
import { SourceLogo } from '../shared/SourceLogo';
import { BiasIndicator } from '../shared/BiasIndicator';
import { Badge } from '../shared/Badge';
import { relativeTime } from '../../utils/time';
import type { Article } from '../../types';

interface PerspectiveCardProps {
  article: Article;
}

export function PerspectiveCard({ article }: PerspectiveCardProps) {
  // Map factuality logic to badge variant
  const getFactualityProps = () => {
    switch(article.sourceFactuality) {
      case 'very-high': return { label: 'Highly Factual', variant: 'success' as const };
      case 'high': return { label: 'Factual', variant: 'success' as const };
      case 'mostly-factual': return { label: 'Mostly Factual', variant: 'neutral' as const };
      case 'mixed': return { label: 'Mixed Factuality', variant: 'warning' as const };
      case 'low': return { label: 'Low Factuality', variant: 'error' as const };
      default: return { label: 'Unrated', variant: 'neutral' as const };
    }
  };

  const fact = getFactualityProps();

  return (
    <div className="flex-none w-[320px] snap-center shrink-0 flex flex-col h-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--text-secondary)] transition-colors group relative">
      
      {/* Left thick margin matching bias color */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-[var(--bias-${article.sourceBias === 'independent' ? 'independent' : article.sourceBias.replace('-center', '')})] opacity-80`} />
      
      <div className="p-5 pl-6 flex flex-col h-full"> {/* pl-6 to accommodate the colored border */}
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <SourceLogo sourceId={article.sourceId} size="md" />
            <div>
              <h4 className="text-sm font-bold text-[var(--text-primary)] leading-tight">{article.sourceName}</h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <BiasIndicator bias={article.sourceBias} size="sm" showText />
              </div>
            </div>
          </div>
          
          <Badge variant={fact.variant} className="text-[10px] scale-90 origin-top-right">
            {fact.label}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1">
          {article.imageUrl && (
            <div className="w-full h-32 mb-4 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden border border-[var(--border)]">
              <img src={article.imageUrl} alt="" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
            </div>
          )}
          
          <h2 className="text-xl font-serif font-medium text-[var(--text-primary)] mb-3 line-clamp-4 group-hover:text-[var(--accent)] transition-colors">
            {article.title}
          </h2>
          
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
            {article.description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between">
          <span className="text-xs font-mono text-[var(--text-tertiary)]">
            {relativeTime(article.publishedAt)}
          </span>
          
          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
          >
            Read original
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        
      </div>
    </div>
  );
}
