import { describe, it, expect } from 'vitest';
import { agglomerativeClustering } from '../src/utils/clustering';

// Helper: create a normalized embedding vector
function makeEmbedding(values: number[]): Float32Array {
  return new Float32Array(values);
}

describe('agglomerativeClustering', () => {
  it('returns empty results for empty input', () => {
    const result = agglomerativeClustering([]);
    expect(result.clusters).toEqual([]);
    expect(result.noise).toEqual([]);
  });

  it('puts a single item into noise', () => {
    const result = agglomerativeClustering([makeEmbedding([1, 0, 0])]);
    expect(result.clusters).toEqual([]);
    expect(result.noise).toEqual([0]);
  });

  it('clusters identical embeddings together', () => {
    const emb = makeEmbedding([1, 0, 0]);
    const result = agglomerativeClustering([emb, emb, emb], 0.5);
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].sort()).toEqual([0, 1, 2]);
    expect(result.noise).toEqual([]);
  });

  it('separates orthogonal embeddings', () => {
    const result = agglomerativeClustering(
      [
        makeEmbedding([1, 0, 0]),
        makeEmbedding([0, 1, 0]),
        makeEmbedding([0, 0, 1]),
      ],
      0.5,
    );
    // All should be noise since they're orthogonal (sim = 0)
    expect(result.clusters).toEqual([]);
    expect(result.noise.sort()).toEqual([0, 1, 2]);
  });

  it('clusters similar embeddings and separates dissimilar ones', () => {
    const result = agglomerativeClustering(
      [
        makeEmbedding([1, 1, 0]),    // 0: similar to 1
        makeEmbedding([1, 1, 0.1]),  // 1: similar to 0
        makeEmbedding([0, 0, 1]),    // 2: dissimilar
      ],
      0.5,
    );
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].sort()).toEqual([0, 1]);
    expect(result.noise).toEqual([2]);
  });

  it('respects threshold — lower threshold creates larger clusters', () => {
    const embeddings = [
      makeEmbedding([1, 0.5, 0]),
      makeEmbedding([1, 0.3, 0]),
      makeEmbedding([0, 0.5, 1]),
    ];

    const strict = agglomerativeClustering(embeddings, 0.99);
    const loose = agglomerativeClustering(embeddings, 0.3);

    // Stricter threshold = fewer/smaller clusters
    const strictClusteredCount = strict.clusters.reduce((sum, c) => sum + c.length, 0);
    const looseClusteredCount = loose.clusters.reduce((sum, c) => sum + c.length, 0);
    expect(looseClusteredCount).toBeGreaterThanOrEqual(strictClusteredCount);
  });

  it('handles two clearly separable groups', () => {
    const result = agglomerativeClustering(
      [
        // Group A
        makeEmbedding([1, 1, 0, 0]),
        makeEmbedding([1, 0.9, 0, 0]),
        // Group B
        makeEmbedding([0, 0, 1, 1]),
        makeEmbedding([0, 0, 0.9, 1]),
      ],
      0.5,
    );
    expect(result.clusters.length).toBe(2);
    const sorted = result.clusters.map(c => c.sort()).sort((a, b) => a[0] - b[0]);
    expect(sorted[0]).toEqual([0, 1]);
    expect(sorted[1]).toEqual([2, 3]);
  });
});
