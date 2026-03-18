import { useMemo } from 'react';
import { analyzeArticleSentiment } from '../../services/sentimentAnalyzer';
import { Tooltip } from '../shared/Tooltip';
import type { Article } from '../../types';

interface SentimentRangeProps {
  articles: Article[];
}

export function SentimentRange({ articles }: SentimentRangeProps) {
  const scoredData = useMemo(() => {
    return articles.map(a => ({
      article: a,
      score: analyzeArticleSentiment(a)
    })).sort((a, b) => a.score - b.score);
  }, [articles]);

  const min = scoredData[0]?.score || 0;
  const max = scoredData[scoredData.length - 1]?.score || 0;
  const spread = Math.abs(max - min);

  // Group points that map to exact same score to avoid stacking invisibly
  const groupedDots = useMemo(() => {
    const map = new Map<number, typeof scoredData>();
    scoredData.forEach(item => {
      // Quantize to 2 decimals for grouping
      const rounded = Math.round(item.score * 100) / 100;
      if (!map.has(rounded)) map.set(rounded, []);
      map.get(rounded)!.push(item);
    });
    return Array.from(map.entries());
  }, [scoredData]);

  if (spread < 0.05 && scoredData.length > 0) {
    return (
      <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg text-sm text-[var(--text-secondary)] text-center border border-[var(--border)]">
        Sentiment analysis shows uniform tone across all {articles.length} outlets.
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl p-6">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
          Sentiment Analysis
        </h3>
        <span className="text-xs text-[var(--text-tertiary)]">Lexicon-based algorithm</span>
      </div>

      <div className="relative pt-6 pb-2 px-4 w-full">
        {/* Scale labels */}
        <div className="absolute top-0 left-0 text-xs font-semibold text-[var(--danger)]">Negative</div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 text-xs font-semibold text-[var(--text-tertiary)]">Neutral</div>
        <div className="absolute top-0 right-0 text-xs font-semibold text-[var(--success)]">Positive</div>

        {/* The bar track */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[var(--danger)] via-[var(--bg-tertiary)] to-[var(--success)] rounded-full mb-4 opacity-50" />
        
        {/* Center line */}
        <div className="absolute top-5 left-1/2 w-[1px] h-6 bg-[var(--text-tertiary)] opacity-30" />

        <div className="relative w-full h-8">
          {groupedDots.map(([roundedScore, items], i) => {
            // Map -1..1 to 0..100%
            const leftPercent = ((roundedScore + 1) / 2) * 100;
            
            return (
              <div 
                key={i}
                className="absolute top-0 -ml-2"
                style={{ left: `${leftPercent}%` }}
              >
                <Tooltip
                  content={
                    <div className="px-2 py-1 max-w-[200px]">
                      <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-gray-300">
                        Score: {roundedScore > 0 ? '+' : ''}{roundedScore.toFixed(2)}
                      </div>
                      <div className="space-y-1">
                        {items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs truncate">
                            <span className={`w-1.5 h-1.5 rounded-full bg-[var(--bias-${item.article.sourceBias.replace('-center', '')})]`} />
                            {item.article.sourceName}
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                >
                  <div className={`
                    w-4 h-4 rounded-full border border-[var(--bg-secondary)] shadow-sm cursor-help hover:scale-150 hover:z-10 transition-transform relative
                    bg-[var(--bias-${items[0].article.sourceBias.replace('-center', '')})]
                  `}>
                    {items.length > 1 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[var(--bg-primary)] rounded-full text-[6px] flex items-center justify-center font-bold">
                        {items.length}
                      </span>
                    )}
                  </div>
                </Tooltip>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
