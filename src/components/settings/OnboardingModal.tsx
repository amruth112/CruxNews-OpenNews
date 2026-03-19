import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { ApiKeyManager } from './ApiKeyManager';

export function OnboardingModal() {
  const { settings, updateSetting } = useSettings();
  const [isOpen, setIsOpen] = useState(() => settings.onboardingComplete !== true);

  const completeOnboarding = () => {
    updateSetting('onboardingComplete', true);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 pb-6 border-b border-[var(--border)] bg-[var(--bg-secondary)] text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center">
              <svg width="48" height="48" viewBox="0 0 64 64" className="mb-4">
                <rect width="64" height="64" rx="14" fill="#0a0a0a"/>
                <path d="M33 20 C38 20,43 24,43 30 C43 37,37 43,30 43 C22 43,16 36,16 28 C16 19,23 12,33 12 C44 12,52 20,52 32 C52 44,43 52,31 52" fill="none" stroke="#f5f0eb" strokeWidth="4.5" strokeLinecap="round"/>
              </svg>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Welcome to OpenNews</h2>
              <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
                See every side of the story. OpenNews clusters identical stories from across the political spectrum natively in your browser.
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto">
            <div className="space-y-6">
              <div className="p-4 bg-[var(--bg-tertiary)] rounded-xl border border-[var(--border)]">
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
                  Privacy First
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  All clustering AI models run locally on your device. Zero stories are sent to any external server. 
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                  Optional AI Summaries
                </h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  For the ultimate experience, enable AI executive summaries that compare how different outlets frame the same story. Use local Ollama (free), Groq (free tier), Google Gemini (free tier), or OpenAI (very cheap).
                </p>
                
                <div className="bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)]">
                   <ApiKeyManager />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[var(--border)] bg-[var(--bg-secondary)] flex justify-end">
            <button
              onClick={completeOnboarding}
              className="flex items-center gap-2 px-6 py-2.5 bg-[var(--text-primary)] hover:bg-[var(--text-secondary)] text-[var(--bg-primary)] font-semibold rounded-lg transition-colors shadow-sm"
            >
              Start Reading News
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
