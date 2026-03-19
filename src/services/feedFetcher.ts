// @ts-expect-error rss-parser minified bundle lacks TS definitions
import Parser from 'rss-parser/dist/rss-parser.min.js';
import { isWithinHours } from '../utils/time';
import { hashString } from '../utils/text';
import { getSourceBias } from '../config/sources';
import type { Article, FeedSource, FeedStatus } from '../types';

// Extend rss-parser items with content tags
type CustomItem = { content?: string; 'content:encoded'?: string; description?: string };
const parser = new Parser<CustomItem, CustomItem>({
  customFields: {
    item: ['content', 'content:encoded', 'description'],
  },
});

export interface FetchResult {
  articles: Article[];
  statuses: Record<string, FeedStatus>;
}

// Circuit breaker state
const failureCounts: Record<string, number> = {};
const circuitOpenUntil: Record<string, number> = {};

export async function fetchAllFeeds(
  feeds: FeedSource[],
  maxAgeHours: number = 48
): Promise<FetchResult> {
  const articles: Article[] = [];
  const statuses: Record<string, FeedStatus> = {};
  
  // Initialize statuses
  feeds.forEach(f => {
    statuses[f.id] = f.enabled ? 'active' : 'disabled';
  });

  const activeFeeds = feeds.filter(f => f.enabled);

  // Filter out circuit-broken feeds
  const now = Date.now();
  const feedsToFetch = activeFeeds.filter(f => {
    if (circuitOpenUntil[f.id] && now < circuitOpenUntil[f.id]) {
      statuses[f.id] = 'error'; // Still in timeout
      return false;
    }
    return true;
  });

  // Group by tier
  const tier1 = feedsToFetch.filter(f => f.tier === 1);
  const tier2 = feedsToFetch.filter(f => f.tier === 2);
  const tier3 = feedsToFetch.filter(f => f.tier === 3);

  // Fetch tiers sequentially, but items within tier in parallel
  for (const tierFeeds of [tier1, tier2, tier3]) {
    if (tierFeeds.length === 0) continue;

    const promises = tierFeeds.map(async (feed) => {
      try {
        const start = Date.now();
        // Proxy URL for CORS bypass
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(feed.url)}`;
        
        const feedData = await parser.parseURL(proxyUrl);
        const duration = Date.now() - start;
        
        if (duration > 5000) {
          statuses[feed.id] = 'slow';
        }

        // Reset failure count on success
        failureCounts[feed.id] = 0;

        const biasData = getSourceBias(new URL(feed.url).hostname);

        const newArticles = (feedData.items || [])
          .filter((item: any) => item.title && item.link && item.pubDate)
          .map((item: any): Article | null => {
            const pubDate = new Date(item.pubDate!);
            // Skip invalid dates or articles older than maxAgeHours
            if (isNaN(pubDate.getTime()) || !isWithinHours(pubDate, maxAgeHours)) {
              return null;
            }

            const desc = item.description || item.contentSnippet || item['content:encoded'] || '';
            
            // Try to extract image (basic regex for first img src)
            let imageUrl: string | undefined;
            const imgMatch = (item['content:encoded'] || item.content || desc).match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
              try {
                const imgUrl = new URL(imgMatch[1]);
                // Only allow http/https images — blocks javascript:, data:, etc.
                if (imgUrl.protocol === 'https:' || imgUrl.protocol === 'http:') {
                  imageUrl = imgMatch[1];
                }
              } catch { /* invalid URL, skip */ }
            }

            return {
              id: hashString(item.link!),
              title: item.title!.trim(),
              description: desc,
              url: item.link!,
              publishedAt: pubDate,
              sourceId: feed.id,
              sourceName: feed.name,
              sourceBias: biasData ? biasData.bias : feed.category,
              sourceFactuality: biasData ? biasData.factualReporting : 'mixed',
              sourceRegion: feed.region,
              sourceColor: feed.color,
              imageUrl,
            };
          })
          .filter((a: Article | null): a is Article => a !== null);

        articles.push(...newArticles);
      } catch (err) {
        console.warn(`Failed to fetch feed ${feed.name}:`, err);
        statuses[feed.id] = 'error';
        
        // Circuit breaker logic: 3 failures = 10 min timeout
        failureCounts[feed.id] = (failureCounts[feed.id] || 0) + 1;
        if (failureCounts[feed.id] >= 3) {
          circuitOpenUntil[feed.id] = Date.now() + 10 * 60 * 1000;
          console.warn(`Circuit broken for ${feed.name} - disabling for 10 minutes`);
        }
      }
    });

    await Promise.allSettled(promises);
  }

  // Deduplicate articles by ID (hash of URL)
  const uniqueArticles = Array.from(
    new Map(articles.map(a => [a.id, a])).values()
  );

  // Sort by newest first
  uniqueArticles.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  return { articles: uniqueArticles, statuses };
}
