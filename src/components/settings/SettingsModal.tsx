import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiKeyManager } from './ApiKeyManager';
import { FeedManager } from './FeedManager';
import { ThemeToggle } from './ThemeToggle';
import { useSettings } from '../../hooks/useSettings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'appearance' | 'ai' | 'sources' | 'advanced';

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('appearance');
  const { settings, updateSetting } = useSettings();
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus trap & Escape closing
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'ai', label: 'AI Enhancements' },
    { id: 'sources', label: 'News Sources' },
    { id: 'advanced', label: 'Advanced' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Settings</h2>
              <button 
                onClick={onClose}
                className="p-2 -mr-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
              {/* Sidebar Tabs */}
              <div className="w-full sm:w-48 sm:shrink-0 border-b sm:border-b-0 sm:border-r border-[var(--border)] bg-[var(--bg-secondary)] overflow-x-auto sm:overflow-y-auto">
                <nav className="flex sm:flex-col p-2 space-x-1 sm:space-x-0 sm:space-y-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg text-left whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-[var(--bg-primary)]">
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Theme</h3>
                      <ThemeToggle />
                    </div>
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Optional AI Integration</h3>
                    <ApiKeyManager />
                  </div>
                )}

                {activeTab === 'sources' && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Manage Feeds</h3>
                    <FeedManager />
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-6 max-w-md">
                    <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Advanced Configuration</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                          Clustering Threshold ({settings.clusterThreshold})
                        </label>
                        <p className="text-xs text-[var(--text-secondary)] mb-2">
                          Lower = more aggressive grouping. Higher = stricter matching. Range: 0.1 - 0.9. Default: 0.55.
                        </p>
                        <input 
                          type="range" 
                          min="0.1" max="0.9" step="0.05"
                          value={settings.clusterThreshold}
                          onChange={e => updateSetting('clusterThreshold', parseFloat(e.target.value))}
                          className="w-full h-2 bg-[var(--bg-tertiary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent)]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                          Auto-Refresh Interval (minutes)
                        </label>
                        <select 
                          value={settings.refreshInterval}
                          onChange={e => updateSetting('refreshInterval', parseInt(e.target.value))}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes (Default)</option>
                          <option value="15">15 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="0">Disabled (Manual only)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                          Max Article Age (hours)
                        </label>
                        <select 
                          value={settings.maxArticleAge}
                          onChange={e => updateSetting('maxArticleAge', parseInt(e.target.value))}
                          className="w-full bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg p-2 text-sm text-[var(--text-primary)]"
                        >
                          <option value="24">24 hours</option>
                          <option value="48">48 hours (Default)</option>
                          <option value="72">72 hours</option>
                          <option value="168">1 week</option>
                        </select>
                      </div>

                      <div className="pt-6 mt-6 border-t border-[var(--border)]">
                        <button
                          onClick={() => {
                            // Clear localStorage basically
                            localStorage.removeItem('opennews-settings');
                            window.location.reload();
                          }}
                          className="w-full py-2 px-4 bg-[var(--bg-primary)] border border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger)]/10 text-sm font-medium rounded-lg transition-colors"
                        >
                          Reset All Settings to Defaults
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Disclaimer Footer */}
            <div className="px-6 py-3 border-t border-[var(--border)] bg-[var(--bg-secondary)] text-xs text-[var(--text-tertiary)] flex justify-between">
              <span>All settings are saved locally.</span>
              <span>OpenNews v1.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
