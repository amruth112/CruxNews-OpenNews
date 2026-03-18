// ──────────────────────────────────────────────
// OpenNews — TypeScript Interfaces
// ──────────────────────────────────────────────

export interface FeedSource {
  id: string;
  name: string;
  url: string;
  category: BiasCategory;
  region: Region;
  language: 'en';
  icon: string;
  color: string;
  enabled: boolean;
  tier: 1 | 2 | 3;
}

export type BiasCategory = 'left' | 'left-center' | 'center' | 'right-center' | 'right' | 'independent';
export type Region = 'us' | 'uk' | 'eu' | 'middle-east' | 'asia' | 'africa' | 'oceania' | 'global';
export type Factuality = 'very-high' | 'high' | 'mostly-factual' | 'mixed' | 'low';
export type FeedStatus = 'active' | 'slow' | 'error' | 'disabled';
export type SortBy = 'coverage' | 'recency' | 'diversity';
export type Theme = 'dark' | 'light' | 'system';
export type AIProvider = 'none' | 'ollama' | 'groq' | 'openai' | 'gemini';
export type ModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

export interface Article {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: Date;
  sourceId: string;
  sourceName: string;
  sourceBias: BiasCategory;
  sourceFactuality: Factuality;
  sourceRegion: Region;
  sourceColor: string;
  imageUrl?: string;
}

export interface StoryCluster {
  id: string;
  title: string;
  summary?: string;
  articles: Article[];
  sourceCount: number;
  biasCategories: BiasCategory[];
  biasSpread: number;
  avgPublishedAt: Date;
  earliestPublishedAt: Date;
  latestPublishedAt: Date;
  breakingSource?: string;
}

export interface SourceBias {
  domain: string;
  name: string;
  bias: BiasCategory;
  factualReporting: Factuality;
  country: string;
}

export interface AIApiKeys {
  groq: string | null;
  openai: string | null;
  gemini: string | null;
}

export interface AppSettings {
  aiApiKeys: AIApiKeys;
  aiProvider: AIProvider;
  clusterThreshold: number;
  refreshInterval: number;
  maxArticleAge: number;
  enabledFeeds: Record<string, boolean>;
  onboardingComplete?: boolean;
  /** @deprecated Use aiApiKeys.groq instead. Kept for migration. */
  groqApiKey?: string | null;
}

export interface AppState {
  articles: Article[];
  clusters: StoryCluster[];
  unclusteredArticles: Article[];
  feedStatuses: Record<string, FeedStatus>;
  currentView: 'feed' | 'story';
  selectedClusterId: string | null;
  regionFilter: Region | null;
  sortBy: SortBy;
  theme: Theme;
  modelStatus: ModelStatus;
  modelProgress: number;
  ollamaAvailable: boolean;
  ollamaModel: string | null;
  aiProvider: AIProvider;
  settings: AppSettings;
  lastUpdated: Date | null;
  isRefreshing: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_CLUSTERS'; payload: { clusters: StoryCluster[]; unclustered: Article[] } }
  | { type: 'SET_FEED_STATUS'; payload: { feedId: string; status: FeedStatus } }
  | { type: 'SET_FEED_STATUSES'; payload: Record<string, FeedStatus> }
  | { type: 'SET_VIEW'; payload: 'feed' | 'story' }
  | { type: 'SELECT_CLUSTER'; payload: string | null }
  | { type: 'SET_REGION_FILTER'; payload: Region | null }
  | { type: 'SET_SORT_BY'; payload: SortBy }
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_MODEL_STATUS'; payload: ModelStatus }
  | { type: 'SET_MODEL_PROGRESS'; payload: number }
  | { type: 'SET_OLLAMA'; payload: { available: boolean; model: string | null } }
  | { type: 'SET_AI_PROVIDER'; payload: AIProvider }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_REFRESHING'; payload: boolean }
  | { type: 'SET_LAST_UPDATED'; payload: Date }
  | { type: 'SET_ERROR'; payload: string | null };
