import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Trash2, CheckCircle2, Save, Loader2, Zap, Brain, Sparkles, Server } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { testApiKey } from '../../services/aiEnhancer';
import { Badge } from '../shared/Badge';
import type { AIProvider } from '../../types';

interface ProviderConfig {
  id: 'groq' | 'openai' | 'gemini';
  name: string;
  description: string;
  model: string;
  cost: string;
  placeholder: string;
  signupUrl: string;
  icon: typeof Zap;
  color: string;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast inference, generous free tier',
    model: 'llama-3.1-8b-instant',
    cost: 'Free tier available',
    placeholder: 'gsk_...',
    signupUrl: 'https://console.groq.com',
    icon: Zap,
    color: '#F55036',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4o-mini — very cheap, high quality',
    model: 'gpt-4o-mini',
    cost: '~$0.15 / 1M tokens',
    placeholder: 'sk-...',
    signupUrl: 'https://platform.openai.com/api-keys',
    icon: Brain,
    color: '#10A37F',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Gemini Flash Lite — free tier available',
    model: 'gemini-2.0-flash-lite',
    cost: 'Free tier available',
    placeholder: 'AIza...',
    signupUrl: 'https://aistudio.google.com/apikey',
    icon: Sparkles,
    color: '#4285F4',
  },
];

export function ApiKeyManager() {
  const { settings, updateSetting, ollamaAvailable, aiProvider } = useSettings();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testStatuses, setTestStatuses] = useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({});
  const [testMessages, setTestMessages] = useState<Record<string, string>>({});
  const [pendingKeys, setPendingKeys] = useState<Record<string, string>>({});
  const [saveFlash, setSaveFlash] = useState<Record<string, boolean>>({});

  const getKeyValue = (providerId: 'groq' | 'openai' | 'gemini') => {
    return pendingKeys[providerId] ?? settings.aiApiKeys[providerId] ?? '';
  };

  const handleKeyInput = (providerId: string, value: string) => {
    setPendingKeys(prev => ({ ...prev, [providerId]: value }));
    setTestStatuses(prev => ({ ...prev, [providerId]: 'idle' }));
    setTestMessages(prev => ({ ...prev, [providerId]: '' }));
  };

  const saveKey = (providerId: 'groq' | 'openai' | 'gemini') => {
    const val = (pendingKeys[providerId] ?? '').trim() || null;
    const newKeys = { ...settings.aiApiKeys, [providerId]: val };
    updateSetting('aiApiKeys', newKeys);

    // Auto-select this provider if none is set
    if (val && (settings.aiProvider === 'none' || !settings.aiProvider)) {
      updateSetting('aiProvider', providerId);
    }

    // Clear pending state
    setPendingKeys(prev => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });

    // Flash the save indicator
    setSaveFlash(prev => ({ ...prev, [providerId]: true }));
    setTimeout(() => setSaveFlash(prev => ({ ...prev, [providerId]: false })), 2000);
  };

  const removeKey = (providerId: 'groq' | 'openai' | 'gemini') => {
    const newKeys = { ...settings.aiApiKeys, [providerId]: null };
    updateSetting('aiApiKeys', newKeys);
    setPendingKeys(prev => {
      const next = { ...prev };
      delete next[providerId];
      return next;
    });
    setTestStatuses(prev => ({ ...prev, [providerId]: 'idle' }));
    setTestMessages(prev => ({ ...prev, [providerId]: '' }));

    // If this was the active provider, reset
    if (settings.aiProvider === providerId) {
      // Find another provider with a key
      const otherKey = PROVIDERS.find(p => p.id !== providerId && newKeys[p.id]);
      updateSetting('aiProvider', otherKey ? otherKey.id : (ollamaAvailable ? 'ollama' : 'none'));
    }
  };

  const handleTest = async (providerId: 'groq' | 'openai' | 'gemini') => {
    const key = getKeyValue(providerId);
    if (!key) return;

    setTestStatuses(prev => ({ ...prev, [providerId]: 'testing' }));
    const result = await testApiKey(providerId, key);
    setTestStatuses(prev => ({ ...prev, [providerId]: result.ok ? 'success' : 'error' }));
    setTestMessages(prev => ({ ...prev, [providerId]: result.message }));
  };

  const selectProvider = (providerId: AIProvider) => {
    updateSetting('aiProvider', providerId);
  };

  const hasPendingChange = (providerId: string) => {
    return providerId in pendingKeys && pendingKeys[providerId] !== (settings.aiApiKeys[providerId as keyof typeof settings.aiApiKeys] ?? '');
  };

  return (
    <div className="space-y-6">
      {/* Privacy notice */}
      <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg border border-[var(--border)]">
        <div className="flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-yellow-500 mt-0.5 shrink-0" />
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="font-semibold text-[var(--text-primary)] mb-1">Your keys stay on your device</p>
            <p>API keys are stored in your browser's local storage only. They persist across sessions and are never sent to OpenNews servers. You can verify this — we're open source.</p>
          </div>
        </div>
      </div>

      {/* Active provider indicator */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-[var(--text-secondary)]">Active provider:</span>
        <span className="text-sm font-semibold text-[var(--text-primary)] capitalize">
          {aiProvider === 'none' ? 'None (summaries disabled)' : aiProvider}
        </span>
      </div>

      {/* Ollama (local) */}
      <div
        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
          aiProvider === 'ollama'
            ? 'bg-[var(--bg-tertiary)] border-[var(--accent)]'
            : 'bg-[var(--bg-tertiary)]/50 border-[var(--border)] hover:border-[var(--text-tertiary)]'
        }`}
        onClick={() => ollamaAvailable && selectProvider('ollama')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-purple-400" />
            <div>
              <h4 className="font-medium text-[var(--text-primary)]">Ollama (Local AI)</h4>
              <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                Free, private, runs on your machine — no API key needed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {aiProvider === 'ollama' && (
              <Badge variant="outline" className="px-2 py-0.5 text-xs">Active</Badge>
            )}
            {ollamaAvailable ? (
              <Badge variant="success" className="flex items-center gap-1.5 px-3 py-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Detected
              </Badge>
            ) : (
              <span className="text-xs text-[var(--text-tertiary)]">Not detected</span>
            )}
          </div>
        </div>
      </div>

      {/* Cloud providers */}
      {PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        const savedKey = settings.aiApiKeys[provider.id];
        const displayValue = getKeyValue(provider.id);
        const isActive = aiProvider === provider.id;
        const isPending = hasPendingChange(provider.id);
        const testStatus = testStatuses[provider.id] || 'idle';
        const testMsg = testMessages[provider.id] || '';
        const flashing = saveFlash[provider.id];

        return (
          <div
            key={provider.id}
            className={`p-4 rounded-lg border transition-colors ${
              isActive
                ? 'bg-[var(--bg-tertiary)] border-[var(--accent)]'
                : 'bg-[var(--bg-tertiary)]/50 border-[var(--border)]'
            }`}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => savedKey && selectProvider(provider.id)}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" style={{ color: provider.color }} />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-[var(--text-primary)]">{provider.name}</h4>
                    <span className="text-xs text-[var(--text-tertiary)]">({provider.model})</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                    {provider.description} · <span className="text-green-400">{provider.cost}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isActive && (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">Active</Badge>
                )}
                {savedKey && !isActive && (
                  <Badge variant="success" className="px-2 py-0.5 text-xs">Saved</Badge>
                )}
              </div>
            </div>

            {/* Key input */}
            <div className="mt-4 space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys[provider.id] ? 'text' : 'password'}
                    value={displayValue}
                    onChange={e => handleKeyInput(provider.id, e.target.value)}
                    placeholder={provider.placeholder}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg pl-3 pr-10 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button
                    onClick={() => setShowKeys(prev => ({ ...prev, [provider.id]: !prev[provider.id] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Save button */}
                <button
                  onClick={() => saveKey(provider.id)}
                  disabled={!isPending && !displayValue}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                    flashing
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : isPending
                        ? 'bg-[var(--accent)] text-white border border-transparent hover:opacity-90'
                        : 'bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]'
                  }`}
                >
                  {flashing ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Saved</>
                  ) : (
                    <><Save className="w-3.5 h-3.5" /> Save</>
                  )}
                </button>

                {/* Test button */}
                {savedKey && (
                  <button
                    onClick={() => handleTest(provider.id)}
                    disabled={testStatus === 'testing'}
                    className="px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {testStatus === 'testing' ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : 'Test'}
                  </button>
                )}

                {/* Remove button */}
                {savedKey && (
                  <button
                    onClick={() => removeKey(provider.id)}
                    className="p-2 text-[var(--danger)] bg-[var(--bg-primary)] border border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 rounded-lg transition-colors"
                    title="Remove Key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Test result message */}
              {testMsg && (
                <p className={`text-sm ${testStatus === 'success' ? 'text-[var(--success)]' : 'text-[var(--danger)]'}`}>
                  {testMsg}
                </p>
              )}

              {/* Get key link */}
              {!savedKey && (
                <p className="text-xs text-[var(--text-tertiary)]">
                  Get a key at{' '}
                  <a href={provider.signupUrl} target="_blank" rel="noreferrer" className="text-[var(--accent)] hover:underline">
                    {provider.signupUrl.replace('https://', '')}
                  </a>
                </p>
              )}
            </div>
          </div>
        );
      })}

      {/* Disable AI option */}
      <button
        onClick={() => selectProvider('none')}
        className={`w-full p-3 rounded-lg border text-sm text-left transition-colors ${
          aiProvider === 'none'
            ? 'bg-[var(--bg-tertiary)] border-[var(--accent)] text-[var(--text-primary)]'
            : 'bg-[var(--bg-tertiary)]/50 border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-tertiary)]'
        }`}
      >
        Disable AI summaries (clustering still works without AI)
      </button>
    </div>
  );
}
