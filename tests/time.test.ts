import { describe, it, expect } from 'vitest';
import { isWithinHours, formatTimelineTime, averageDate } from '../src/utils/time';

describe('isWithinHours', () => {
  it('returns true for dates within the window', () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    expect(isWithinHours(oneHourAgo, 2)).toBe(true);
  });

  it('returns false for dates outside the window', () => {
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
    expect(isWithinHours(threeDaysAgo, 48)).toBe(false);
  });

  it('returns true for the current time', () => {
    expect(isWithinHours(new Date(), 1)).toBe(true);
  });

  it('returns true for dates exactly at the boundary', () => {
    const exactly48h = new Date(Date.now() - 48 * 60 * 60 * 1000);
    expect(isWithinHours(exactly48h, 48)).toBe(true);
  });
});

describe('formatTimelineTime', () => {
  it('returns "Just now" for very recent dates', () => {
    const now = new Date();
    expect(formatTimelineTime(now)).toBe('Just now');
  });

  it('returns hours ago format for same-day dates', () => {
    const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60 * 1000);
    expect(formatTimelineTime(fiveHoursAgo)).toBe('5h ago');
  });

  it('returns formatted date for older dates', () => {
    const threeDaysAgo = new Date(Date.now() - 72 * 60 * 60 * 1000);
    const result = formatTimelineTime(threeDaysAgo);
    // Should be like "Mar 15" format
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}$/);
  });
});

describe('averageDate', () => {
  it('returns the average of multiple dates', () => {
    const d1 = new Date('2026-01-01T00:00:00Z');
    const d2 = new Date('2026-01-03T00:00:00Z');
    const avg = averageDate([d1, d2]);
    expect(avg.getTime()).toBe(new Date('2026-01-02T00:00:00Z').getTime());
  });

  it('returns the same date for a single-element array', () => {
    const d = new Date('2026-06-15T12:00:00Z');
    expect(averageDate([d]).getTime()).toBe(d.getTime());
  });

  it('returns current time for empty array', () => {
    const before = Date.now();
    const result = averageDate([]);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });
});
