import { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, Info } from 'lucide-react';
import { useStore } from '../../stores/newsStore';
import { useSettings } from '../../hooks/useSettings';
import { summarizeCluster } from '../../services/aiEnhancer';
import { PerspectiveCard } from './PerspectiveCard';
import { TimelineBar } from './TimelineBar';
import { SentimentRange } from './SentimentRange';
import { CoverageMap } from './CoverageMap';
import { BiasSpectrumBar } from '../home/BiasSpectrumBar';
import { Tooltip } from '../shared/Tooltip';
import type { StoryCluster } from '../../types';

interface StoryRoomProps {
  cluster: StoryCluster;
}

export function StoryRoom({ cluster }: StoryRoomProps) {
  const { dispatch } = useStore();
  const { aiProvider, settings, ollamaAvailable } = useSettings();
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState(false);

  // Generate AI Summary on mount (if available)
  useEffect(() => {
    let isMounted = true;

    async function getSummary() {
      if (aiProvider === 'none') {
        setSummary(null);
        return;
      }
      
      setIsSummarizing(true);
      setSummaryError(false);
      
      try {
        // Find best local model if using Ollama
        let ollamaModel = null;
        if (aiProvider === 'ollama' && ollamaAvailable) {
          const models = await import('../../services/aiEnhancer').then(m => m.checkOllama());
          if (models) {
            ollamaModel = await import('../../services/aiEnhancer').then(m => m.selectBestOllamaModel(models));
          }
        }
        
        const result = await summarizeCluster(
          cluster,
          aiProvider,
          ollamaModel,
          settings.aiApiKeys
        );
        
        if (isMounted) {
          if (result && result.summary) {
            setSummary(result.summary);
          } else {
            setSummaryError(true);
          }
        }
      } catch (err) {
        console.error('Failed to generate summary:', err);
        if (isMounted) setSummaryError(true);
      } finally {
        if (isMounted) setIsSummarizing(false);
      }
    }

    getSummary();
    
    return () => { isMounted = false; };
  }, [cluster.id, aiProvider, settings.aiApiKeys, ollamaAvailable]); // Re-run if provider/keys change

  const goBack = () => {
    dispatch({ type: 'SELECT_CLUSTER', payload: null });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      
      {/* Back Navigation */}
      <button 
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2 px-1 -ml-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Feed
      </button>

      {/* Main Header Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-semibold text-[var(--text-primary)] leading-tight mb-3">
              {cluster.title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Covered by {cluster.sourceCount} outlets across {cluster.biasCategories.length} bias categories.
              {cluster.breakingSource && ` First reported by ${cluster.breakingSource}.`}
            </p>
          </div>

          <div className="shrink-0 space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-tertiary)] block">
              Bias Spectrum
            </span>
            <BiasSpectrumBar categories={cluster.biasCategories} fullWidth />
          </div>
        </div>

        {/* AI Summary Section */}
        {aiProvider !== 'none' && (
          <div className="bg-[var(--bg-tertiary)]/50 border border-[var(--border)] rounded-xl p-5 mt-6 border-l-4 border-l-[var(--accent)]">
            <div className="flex items-center gap-2 mb-2 text-[var(--accent)] font-semibold text-sm">
              <Sparkles className="w-4 h-4" />
              AI Executive Summary
            </div>
            
            {isSummarizing ? (
              <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing {cluster.sourceCount} perspectives...
              </div>
            ) : summary ? (
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">
                {summary}
              </p>
            ) : summaryError ? (
              <p className="text-sm text-[var(--danger)]">Failed to generate summary. Verify your API keys or Ollama connection in Settings.</p>
            ) : null}
          </div>
        )}

        {aiProvider === 'none' && (
          <div className="bg-[var(--bg-primary)] border border-dashed border-[var(--border)] rounded-xl p-4 mt-6 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[var(--text-tertiary)] group-hover:text-[var(--accent)] transition-colors" />
              <p className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                Want automatic neutral summaries of every story? Enable local AI (Ollama) or add a free Groq key in Settings.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimelineBar articles={cluster.articles} />
        <SentimentRange articles={cluster.articles} />
      </div>

      <CoverageMap articles={cluster.articles} />

      {/* Perspectives Carousel */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Perspectives
          </h2>
          <Tooltip content="Side-by-side comparison of how different outlets covered this story. Sorted from Left to Right bias." position="right">
            <Info className="w-4 h-4 text-[var(--text-tertiary)] cursor-help" />
          </Tooltip>
        </div>
        
        {/* Horizontal scrollable container for Perspective Cards */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-4 snap-x snap-mandatory">
          {(() => {
            // Sort from left to right for display
            const biasOrder: Record<string, number> = {
              'left': 1,
              'left-center': 2,
              'center': 3,
              'independent': 4,
              'right-center': 5,
              'right': 6
            };
            
            const ordered = [...cluster.articles].sort((a, b) => 
              (biasOrder[a.sourceBias] || 9) - (biasOrder[b.sourceBias] || 9)
            );
            
            return ordered.map((article) => (
              <PerspectiveCard key={article.id} article={article} />
            ));
          })()}
        </div>
      </div>
      
    </div>
  );
}
