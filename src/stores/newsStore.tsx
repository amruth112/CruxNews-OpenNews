import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type {
  AppState, AppAction, Article, StoryCluster,
  FeedStatus, Region, SortBy, Theme, ModelStatus, AIProvider, AppSettings, AIApiKeys
} from '../types';
import { FEED_SOURCES } from '../config/feeds';

const defaultApiKeys: AIApiKeys = {
  groq: null,
  openai: null,
  gemini: null,
};

const defaultSettings: AppSettings = {
  aiApiKeys: { ...defaultApiKeys },
  aiProvider: 'none',
  clusterThreshold: 0.55,
  refreshInterval: 10,
  maxArticleAge: 48,
  enabledFeeds: FEED_SOURCES.reduce((acc, feed) => {
    acc[feed.id] = feed.enabled;
    return acc;
  }, {} as Record<string, boolean>),
};

const initialState: AppState = {
  articles: [],
  clusters: [],
  unclusteredArticles: [],
  feedStatuses: {},
  currentView: 'feed',
  selectedClusterId: null,
  regionFilter: null,
  sortBy: 'coverage',
  theme: 'dark',
  modelStatus: 'idle',
  modelProgress: 0,
  ollamaAvailable: false,
  ollamaModel: null,
  aiProvider: 'none',
  settings: defaultSettings,
  lastUpdated: null,
  isRefreshing: false,
  error: null,
};

/**
 * Determine which provider to use based on available keys/services.
 */
function resolveProvider(settings: AppSettings, ollamaAvailable: boolean): AIProvider {
  const explicit = settings.aiProvider;
  if (explicit !== 'none') {
    // Validate the explicit choice still has a key
    if (explicit === 'ollama') return ollamaAvailable ? 'ollama' : 'none';
    if (explicit === 'groq') return settings.aiApiKeys.groq ? 'groq' : 'none';
    if (explicit === 'openai') return settings.aiApiKeys.openai ? 'openai' : 'none';
    if (explicit === 'gemini') return settings.aiApiKeys.gemini ? 'gemini' : 'none';
  }
  return 'none';
}

// State Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    case 'SET_CLUSTERS':
      return {
        ...state,
        clusters: action.payload.clusters,
        unclusteredArticles: action.payload.unclustered
      };
    case 'SET_FEED_STATUS':
      return {
        ...state,
        feedStatuses: {
          ...state.feedStatuses,
          [action.payload.feedId]: action.payload.status
        }
      };
    case 'SET_FEED_STATUSES':
      return { ...state, feedStatuses: { ...state.feedStatuses, ...action.payload } };
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SELECT_CLUSTER':
      return {
        ...state,
        selectedClusterId: action.payload,
        currentView: action.payload ? 'story' : 'feed'
      };
    case 'SET_REGION_FILTER':
      return { ...state, regionFilter: action.payload };
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_MODEL_STATUS':
      return { ...state, modelStatus: action.payload };
    case 'SET_MODEL_PROGRESS':
      return { ...state, modelProgress: action.payload };
    case 'SET_OLLAMA':
      return {
        ...state,
        ollamaAvailable: action.payload.available,
        ollamaModel: action.payload.model,
        // Auto-select Ollama if no provider is set and Ollama is detected
        aiProvider: state.settings.aiProvider === 'none' && action.payload.available
          ? 'ollama'
          : state.aiProvider
      };
    case 'SET_AI_PROVIDER': {
      const newSettings = { ...state.settings, aiProvider: action.payload };
      return { ...state, aiProvider: action.payload, settings: newSettings };
    }
    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      const newProvider = resolveProvider(newSettings, state.ollamaAvailable);
      return {
        ...state,
        settings: newSettings,
        aiProvider: newProvider,
      };
    }
    case 'SET_REFRESHING':
      return { ...state, isRefreshing: action.payload };
    case 'SET_LAST_UPDATED':
      return { ...state, lastUpdated: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// React Context
interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Persistence Helpers
const SETTINGS_KEY = 'opennews-settings';
const THEME_KEY = 'opennews-theme';

/**
 * Migrate old settings format (groqApiKey) to new format (aiApiKeys).
 */
function migrateSettings(raw: Record<string, unknown>): Partial<AppSettings> {
  const settings = { ...raw } as Partial<AppSettings> & { groqApiKey?: string | null };

  // Migrate old groqApiKey to aiApiKeys.groq
  if (settings.groqApiKey && !settings.aiApiKeys) {
    settings.aiApiKeys = {
      groq: settings.groqApiKey,
      openai: null,
      gemini: null,
    };
    // If they had a groq key, auto-select groq as provider
    if (!settings.aiProvider || settings.aiProvider === 'none') {
      settings.aiProvider = 'groq';
    }
    delete settings.groqApiKey;
  }

  // Ensure aiApiKeys has all fields
  if (settings.aiApiKeys) {
    settings.aiApiKeys = {
      groq: settings.aiApiKeys.groq ?? null,
      openai: settings.aiApiKeys.openai ?? null,
      gemini: settings.aiApiKeys.gemini ?? null,
    };
  }

  return settings as Partial<AppSettings>;
}

export function loadSettings(): Partial<AppSettings> {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return migrateSettings(parsed);
  } catch {
    return {};
  }
}

export function saveSettings(settings: AppSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadTheme(): Theme {
  try {
    const theme = localStorage.getItem(THEME_KEY);
    if (theme === 'dark' || theme === 'light' || theme === 'system') return theme;
    return 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage');
  }
}

// Store Provider Component
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, () => {
    const savedSettings = loadSettings();
    const savedTheme = loadTheme();

    // Attempt to hydrate from sessionStorage for fast reload
    let cachedArticles: Article[] = [];
    let cachedClusters: StoryCluster[] = [];
    let unclustered: Article[] = [];
    let lastUpdated: Date | null = null;

    try {
      const sessionCache = sessionStorage.getItem('opennews-cache');
      if (sessionCache) {
        const parsed = JSON.parse(sessionCache);
        const reviveDates = (obj: any): any => {
          if (Array.isArray(obj)) return obj.map(reviveDates);
          if (obj !== null && typeof obj === 'object') {
            const newObj: any = {};
            for (const key in obj) {
              if (key === 'publishedAt' || key === 'avgPublishedAt' || key === 'earliestPublishedAt' || key === 'latestPublishedAt') {
                newObj[key] = new Date(obj[key]);
              } else {
                newObj[key] = reviveDates(obj[key]);
              }
            }
            return newObj;
          }
          return obj;
        };

        cachedArticles = reviveDates(parsed.articles) || [];
        cachedClusters = reviveDates(parsed.clusters) || [];
        unclustered = reviveDates(parsed.unclusteredArticles) || [];
        if (parsed.lastUpdated) {
          lastUpdated = new Date(parsed.lastUpdated);
        }
      }
    } catch (e) {
      console.warn('Failed to parse session cache', e);
    }

    const mergedSettings = { ...initialState.settings, ...savedSettings };
    // Restore the provider from persisted settings
    const restoredProvider = mergedSettings.aiProvider || 'none';

    return {
      ...initialState,
      theme: savedTheme,
      settings: mergedSettings,
      aiProvider: restoredProvider,
      articles: cachedArticles,
      clusters: cachedClusters,
      unclusteredArticles: unclustered,
      lastUpdated,
    };
  });

  // Persist settings changes
  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  // Persist theme changes
  useEffect(() => {
    saveTheme(state.theme);

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (state.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(state.theme);
    }
  }, [state.theme]);

  // Persist articles/clusters to session storage for smooth refresh
  useEffect(() => {
    if (state.articles.length > 0) {
      try {
        sessionStorage.setItem('opennews-cache', JSON.stringify({
          articles: state.articles.slice(0, 500),
          clusters: state.clusters.slice(0, 50),
          unclusteredArticles: state.unclusteredArticles.slice(0, 100),
          lastUpdated: state.lastUpdated,
        }));
      } catch {
        // Silently fail session storage writes
      }
    }
  }, [state.articles, state.clusters, state.lastUpdated, state.unclusteredArticles]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

// Hook for consuming state
export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
