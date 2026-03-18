import { describe, it, expect } from 'vitest';
import { stripHtml, truncate, hashString, extractSentences, prepareForEmbedding } from '../src/utils/text';

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<p>Hello <b>world</b></p>')).toBe('Hello world');
  });

  it('replaces HTML entities with spaces', () => {
    expect(stripHtml('Hello&nbsp;world')).toBe('Hello world');
  });

  it('handles empty string', () => {
    expect(stripHtml('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(stripHtml('no tags here')).toBe('no tags here');
  });

  it('handles nested tags', () => {
    expect(stripHtml('<div><span><a href="#">Link</a></span></div>')).toBe('Link');
  });
});

describe('truncate', () => {
  it('returns short text unchanged', () => {
    expect(truncate('Short text', 200)).toBe('Short text');
  });

  it('truncates long text with ellipsis', () => {
    const longText = 'A'.repeat(300);
    const result = truncate(longText, 200);
    expect(result.length).toBeLessThanOrEqual(201); // 200 + ellipsis char
    expect(result.endsWith('…')).toBe(true);
  });

  it('strips HTML before truncating', () => {
    const html = '<p>' + 'A'.repeat(300) + '</p>';
    const result = truncate(html, 200);
    expect(result).not.toContain('<');
    expect(result.endsWith('…')).toBe(true);
  });

  it('uses default maxLength of 200', () => {
    const longText = 'word '.repeat(100);
    const result = truncate(longText);
    expect(result.length).toBeLessThanOrEqual(201);
  });
});

describe('hashString', () => {
  it('produces consistent hashes', () => {
    const hash1 = hashString('https://example.com/article');
    const hash2 = hashString('https://example.com/article');
    expect(hash1).toBe(hash2);
  });

  it('produces different hashes for different strings', () => {
    const hash1 = hashString('https://example.com/article-1');
    const hash2 = hashString('https://example.com/article-2');
    expect(hash1).not.toBe(hash2);
  });

  it('returns a base-36 string', () => {
    const hash = hashString('test');
    expect(hash).toMatch(/^[0-9a-z]+$/);
  });

  it('handles empty string', () => {
    const hash = hashString('');
    expect(hash).toBe('0');
  });
});

describe('extractSentences', () => {
  it('extracts the specified number of sentences', () => {
    const text = 'First sentence. Second sentence. Third sentence.';
    expect(extractSentences(text, 2)).toBe('First sentence.  Second sentence.');
  });

  it('returns all text if fewer sentences than requested', () => {
    const text = 'Only one sentence.';
    expect(extractSentences(text, 3)).toBe('Only one sentence.');
  });

  it('handles text without sentence endings', () => {
    const text = 'No sentence endings here';
    expect(extractSentences(text)).toBe('No sentence endings here');
  });

  it('strips HTML before extracting', () => {
    const html = '<p>First sentence.</p><p>Second sentence.</p>';
    expect(extractSentences(html, 1)).toBe('First sentence.');
  });

  it('defaults to 2 sentences', () => {
    const text = 'One. Two. Three.';
    expect(extractSentences(text)).toBe('One.  Two.');
  });
});

describe('prepareForEmbedding', () => {
  it('combines title and description', () => {
    const result = prepareForEmbedding('Title', 'Description text');
    expect(result).toBe('Title. Description text');
  });

  it('uses only title when description is empty', () => {
    const result = prepareForEmbedding('Title Only', '');
    expect(result).toBe('Title Only');
  });

  it('strips HTML from both fields', () => {
    const result = prepareForEmbedding('<b>Title</b>', '<p>Description</p>');
    expect(result).toBe('Title. Description');
  });

  it('normalizes whitespace', () => {
    const result = prepareForEmbedding('Title  with   spaces', 'Desc\n\nwith\nnewlines');
    expect(result).toBe('Title with spaces. Desc with newlines');
  });

  it('truncates to 512 characters', () => {
    const longTitle = 'T'.repeat(300);
    const longDesc = 'D'.repeat(300);
    const result = prepareForEmbedding(longTitle, longDesc);
    expect(result.length).toBe(512);
  });
});
