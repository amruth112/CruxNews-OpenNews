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
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center shadow-inner mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--bias-left)] absolute -translate-x-1.5" />
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--bias-right)] absolute translate-x-1.5" />
                  <div className="w-5 h-5 rounded-full border-2 border-[var(--accent)]" />
                </div>
              </div>
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
