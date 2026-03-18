import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '../stores/newsStore';
import { fetchAllFeeds } from '../services/feedFetcher';
import { getEnabledFeeds } from '../config/feeds';

export function useFeeds() {
  const { state, dispatch } = useStore();
  const fetchTimeoutRef = useRef<number | null>(null);

  const fetchFeeds = useCallback(async (isManualRefresh = false) => {
    if (state.isRefreshing) return;
    
    dispatch({ type: 'SET_REFRESHING', payload: true });
    
    if (isManualRefresh) {
      dispatch({ type: 'SET_ERROR', payload: null });
    }

    try {
      const activeFeeds = getEnabledFeeds(state.settings.enabledFeeds);
      
      const { articles, statuses } = await fetchAllFeeds(
        activeFeeds, 
        state.settings.maxArticleAge
      );

      dispatch({ type: 'SET_ARTICLES', payload: articles });
      dispatch({ type: 'SET_FEED_STATUSES', payload: statuses });
      dispatch({ type: 'SET_LAST_UPDATED', payload: new Date() });
      
    } catch (err: any) {
      console.error('Master feed fetch error:', err);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to complete feed refresh. Some sources may be unavailable.' 
      });
    } finally {
      dispatch({ type: 'SET_REFRESHING', payload: false });
    }
  }, [state.settings.enabledFeeds, state.settings.maxArticleAge, state.isRefreshing, dispatch]);

  // Initial fetch
  useEffect(() => {
    if (state.lastUpdated === null && !state.isRefreshing && state.articles.length === 0) {
      fetchFeeds();
    }
  }, [state.lastUpdated, state.isRefreshing, state.articles.length, fetchFeeds]);

  // Setup polling based on settings
  useEffect(() => {
    if (fetchTimeoutRef.current) {
      window.clearInterval(fetchTimeoutRef.current);
    }

    const intervalMs = state.settings.refreshInterval * 60 * 1000;
    
    if (intervalMs > 0) {
      fetchTimeoutRef.current = window.setInterval(() => {
        fetchFeeds();
      }, intervalMs);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        window.clearInterval(fetchTimeoutRef.current);
      }
    };
  }, [state.settings.refreshInterval, fetchFeeds]);

  return { fetchFeeds };
}
