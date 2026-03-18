import { type ReactNode, useEffect } from 'react';
import { useStore } from '../../stores/newsStore';
import { useFeeds } from '../../hooks/useFeeds';
import { useClustering } from '../../hooks/useClustering';
import { Header } from './Header';
import { Footer } from './Footer';
import { OnboardingModal } from '../settings/OnboardingModal';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { state, dispatch } = useStore();
  
  // Initialize core application services
  useFeeds();
  useClustering();

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'Escape':
          if (state.currentView === 'story') {
            dispatch({ type: 'SELECT_CLUSTER', payload: null });
          }
          break;
        case 'r':
          // The useFeeds hook handles the refresh logic via UI button, 
          // manually triggering here requires accessing the function.
          // In a real app we'd dispatch a refresh action.
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.currentView, dispatch]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-200 selection:bg-[var(--accent)] selection:text-white">
      <Header />
      
      {/* Dynamic Background subtle gradient */}
      <div className="fixed inset-0 pointer-events-none z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--bg-secondary)_0%,_var(--bg-primary)_100%)] opacity-50" />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col">
        {state.error && (
          <div className="mb-6 p-4 bg-[var(--danger)]/10 border border-[var(--danger)] rounded-lg text-[var(--danger)] text-sm font-medium flex items-center justify-between">
            {state.error}
            <button 
              onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              className="text-[var(--danger)] hover:opacity-70"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {children}
      </main>
      
      <Footer />
      <OnboardingModal />
    </div>
  );
}
