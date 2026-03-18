/**
 * Strip HTML tags from a string.
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

/**
 * Truncate text to a maximum length, adding ellipsis.
 */
export function truncate(text: string, maxLength: number = 200): string {
  const cleaned = stripHtml(text);
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

/**
 * Generate a simple hash for a URL to use as an ID.
 */
export function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Extract first N sentences from text.
 */
export function extractSentences(text: string, count: number = 2): string {
  const cleaned = stripHtml(text);
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g);
  if (!sentences) return cleaned;
  return sentences.slice(0, count).join(' ').trim();
}

/**
 * Clean article text for embedding.
 * Combines title + description and normalizes whitespace.
 */
export function prepareForEmbedding(title: string, description: string): string {
  const cleanTitle = stripHtml(title).trim();
  const cleanDesc = stripHtml(description).trim();
  const combined = cleanDesc ? `${cleanTitle}. ${cleanDesc}` : cleanTitle;
  return combined.replace(/\s+/g, ' ').substring(0, 512);
}
