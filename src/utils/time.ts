import { formatDistanceToNow, differenceInHours, format } from 'date-fns';

/**
 * Format a date as a relative time string (e.g., "2 hours ago").
 */
export function relativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Check if a date is within the last N hours.
 */
export function isWithinHours(date: Date, hours: number): boolean {
  return differenceInHours(new Date(), date) <= hours;
}

/**
 * Format a date for the timeline display.
 */
export function formatTimelineTime(date: Date): string {
  const hoursAgo = differenceInHours(new Date(), date);
  if (hoursAgo < 1) return 'Just now';
  if (hoursAgo < 24) return `${hoursAgo}h ago`;
  return format(date, 'MMM d');
}

/**
 * Get the average of an array of dates.
 */
export function averageDate(dates: Date[]): Date {
  if (dates.length === 0) return new Date();
  const sum = dates.reduce((acc, d) => acc + d.getTime(), 0);
  return new Date(sum / dates.length);
}
