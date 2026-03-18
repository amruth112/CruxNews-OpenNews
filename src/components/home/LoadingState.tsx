import { Activity } from 'lucide-react';
import { useStore } from '../../stores/newsStore';

export function LoadingState() {
  const { state } = useStore();
  
  const isDownloading = state.modelStatus === 'downloading';
  const progress = state.modelProgress;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-500">
      
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-[var(--bg-tertiary)] rounded-full" />
        <div 
          className="absolute inset-0 border-4 border-[var(--accent)] rounded-full transition-all duration-300"
          style={{ 
            clipPath: `polygon(50% 50%, 50% 0, ${progress >= 25 ? '100% 0,' : ''} ${progress >= 50 ? '100% 100%,' : ''} ${progress >= 75 ? '0 100%,' : ''} ${progress === 100 ? '0 0,' : ''} ${
              progress < 25 ? `${50 + (progress*2)}% 0` : 
              progress < 50 ? `100% ${(progress-25)*4}%` : 
              progress < 75 ? `${100 - (progress-50)*4}% 100%` : 
              `0 ${100 - (progress-75)*4}%`
            })`
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Activity className="w-8 h-8 text-[var(--text-secondary)] animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-[var(--text-primary)]">
          {isDownloading ? 'Setting up OpenNews AI...' : 'Analyzing perspectives...'}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] max-w-sm">
          {isDownloading 
            ? 'Downloading standard language model (23MB). This only happens on your first visit.' 
            : 'Clustering news stories locally in your browser to build the multi-perspective feed.'}
        </p>
      </div>

    </div>
  );
}

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center mb-4">
        <span className="text-2xl">📰</span>
      </div>
      <h3 className="text-xl font-medium text-[var(--text-primary)]">No Multi-Source Stories Found</h3>
      <p className="text-[var(--text-secondary)] max-w-md">
        Try adjusting your filters, enabling more feeds in Settings, or lowering the clustering threshold in Advanced Settings to see more groupings.
      </p>
    </div>
  );
}
