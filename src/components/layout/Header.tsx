import { useState, useEffect } from 'react';
import { Settings, RefreshCw, Activity } from 'lucide-react';
import { useStore } from '../../stores/newsStore';
import { useFeeds } from '../../hooks/useFeeds';
import { relativeTime } from '../../utils/time';
import { SettingsModal } from '../settings/SettingsModal';

export function Header() {
  const { state } = useStore();
  const { fetchFeeds } = useFeeds();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [now, setNow] = useState(new Date());

  // Update relative time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const totalFeeds = Object.keys(state.settings.enabledFeeds).filter(k => state.settings.enabledFeeds[k]).length;
  const activeFeeds = Object.values(state.feedStatuses).filter(status => status === 'active' || status === 'slow').length;
  const isAllGood = activeFeeds === totalFeeds && totalFeeds > 0;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <svg width="32" height="32" viewBox="0 0 64 64" className="shrink-0">
                <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
                <path d="M33 20 C38 20,43 24,43 30 C43 37,37 43,30 43 C22 43,16 36,16 28 C16 19,23 12,33 12 C44 12,52 20,52 32 C52 44,43 52,31 52" fill="none" stroke="#f5f0eb" strokeWidth="4.5" strokeLinecap="round"/>
              </svg>
              
              <h1 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                OpenNews
              </h1>
            </div>
            {state.clusters.length > 0 && (
              <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold tracking-wider ml-10 -mt-1 hidden sm:block">
                {state.clusters.length} Stories Tracked
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Status Indicator */}
            <div className="hidden sm:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <span className={`w-2 h-2 rounded-full ${isAllGood ? 'bg-[var(--success)]' : state.isRefreshing ? 'bg-yellow-500 animate-pulse' : 'bg-[var(--danger)]'}`} />
                <span>{activeFeeds}/{totalFeeds} feeds active</span>
              </div>
              <span className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                {state.lastUpdated ? `Updated ${relativeTime(state.lastUpdated)}` : 'Waiting for feeds...'}
              </span>
            </div>

            <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchFeeds(true)}
                disabled={state.isRefreshing}
                className={`p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all ${
                  state.isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Refresh feeds manually (r)"
              >
                <RefreshCw className={`w-5 h-5 ${state.isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors relative"
                title="Settings (,)"
              >
                <Settings className="w-5 h-5" />
                {state.ollamaAvailable && state.aiProvider === 'ollama' && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--success)] shadow-sm" />
                )}
              </button>
            </div>
          </div>

        </div>
        
        {/* Model Download Progress Bar */}
        {state.modelStatus === 'loading' || state.modelStatus === 'downloading' ? (
          <div className="h-1 w-full bg-[var(--bg-tertiary)] relative overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-[var(--accent)] transition-all duration-300 ease-out flex items-center justify-end pr-1"
              style={{ width: `${Math.max(5, state.modelProgress)}%` }}
            >
              <Activity className="w-3 h-3 text-white animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="h-px w-full bg-[var(--border)]" />
        )}
      </header>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
}
