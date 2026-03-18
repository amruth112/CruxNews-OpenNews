import { describe, it, expect } from 'vitest';
import { FEED_SOURCES, getEnabledFeeds, getFeedsByTier } from '../src/config/feeds';

describe('FEED_SOURCES', () => {
  it('contains at least 30 feeds', () => {
    expect(FEED_SOURCES.length).toBeGreaterThanOrEqual(30);
  });

  it('has unique IDs for all feeds', () => {
    const ids = FEED_SOURCES.map(f => f.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('has valid tiers (1, 2, or 3)', () => {
    for (const feed of FEED_SOURCES) {
      expect([1, 2, 3]).toContain(feed.tier);
    }
  });

  it('has valid bias categories', () => {
    const validBias = ['left', 'left-center', 'center', 'right-center', 'right', 'independent'];
    for (const feed of FEED_SOURCES) {
      expect(validBias).toContain(feed.category);
    }
  });

  it('has valid URLs for all feeds', () => {
    for (const feed of FEED_SOURCES) {
      expect(() => new URL(feed.url)).not.toThrow();
    }
  });

  it('covers all bias categories', () => {
    const categories = new Set(FEED_SOURCES.map(f => f.category));
    expect(categories.has('left')).toBe(true);
    expect(categories.has('left-center')).toBe(true);
    expect(categories.has('center')).toBe(true);
    expect(categories.has('right-center')).toBe(true);
    expect(categories.has('right')).toBe(true);
    expect(categories.has('independent')).toBe(true);
  });

  it('has tier 1 feeds from multiple categories', () => {
    const tier1Categories = new Set(
      FEED_SOURCES.filter(f => f.tier === 1).map(f => f.category),
    );
    expect(tier1Categories.size).toBeGreaterThanOrEqual(3);
  });
});

describe('getEnabledFeeds', () => {
  it('returns only enabled feeds by default', () => {
    const enabled = getEnabledFeeds();
    for (const feed of enabled) {
      expect(feed.enabled).toBe(true);
    }
  });

  it('respects custom enabled overrides', () => {
    const disabledFeed = FEED_SOURCES.find(f => f.enabled)!;
    const customEnabled = { [disabledFeed.id]: false };
    const enabled = getEnabledFeeds(customEnabled);
    expect(enabled.find(f => f.id === disabledFeed.id)).toBeUndefined();
  });

  it('can enable a feed via custom override', () => {
    // Disable a feed first, then re-enable via override
    const anyFeed = FEED_SOURCES[0];
    const customDisable = { [anyFeed.id]: false };
    expect(getEnabledFeeds(customDisable).find(f => f.id === anyFeed.id)).toBeUndefined();

    const customEnable = { [anyFeed.id]: true };
    expect(getEnabledFeeds(customEnable).find(f => f.id === anyFeed.id)).toBeDefined();
  });
});

describe('getFeedsByTier', () => {
  it('separates feeds into three tiers', () => {
    const [t1, t2, t3] = getFeedsByTier(FEED_SOURCES);
    expect(t1.every(f => f.tier === 1)).toBe(true);
    expect(t2.every(f => f.tier === 2)).toBe(true);
    expect(t3.every(f => f.tier === 3)).toBe(true);
  });

  it('tier counts sum to total', () => {
    const [t1, t2, t3] = getFeedsByTier(FEED_SOURCES);
    expect(t1.length + t2.length + t3.length).toBe(FEED_SOURCES.length);
  });
});
