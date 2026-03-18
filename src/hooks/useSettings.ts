import { useEffect } from 'react';
import { useStore } from '../stores/newsStore';
import { checkOllama, selectBestOllamaModel } from '../services/aiEnhancer';
import type { AIProvider } from '../types';

export function useSettings() {
  const { state, dispatch } = useStore();

  const updateSetting = <K extends keyof typeof state.settings>(
    key: K,
    value: typeof state.settings[K]
  ) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { [key]: value },
    });
  };

  const toggleFeed = (feedId: string) => {
    const current = { ...state.settings.enabledFeeds };
    current[feedId] = !current[feedId];
    updateSetting('enabledFeeds', current);
  };

  const setTheme = (theme: 'dark' | 'light' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setAiProvider = (p: AIProvider) => {
    dispatch({ type: 'SET_AI_PROVIDER', payload: p });
  };

  // Perform one-time check for Ollama on mount
  useEffect(() => {
    let isMounted = true;

    async function scanLocalAI() {
      const models = await checkOllama();
      if (isMounted && models) {
        const bestModel = selectBestOllamaModel(models);
        dispatch({
          type: 'SET_OLLAMA',
          payload: { available: true, model: bestModel },
        });
      }
    }

    scanLocalAI();

    return () => { isMounted = false; };
  }, [dispatch]);

  return {
    settings: state.settings,
    theme: state.theme,
    ollamaAvailable: state.ollamaAvailable,
    aiProvider: state.aiProvider,
    updateSetting,
    toggleFeed,
    setTheme,
    setAiProvider,
  };
}
