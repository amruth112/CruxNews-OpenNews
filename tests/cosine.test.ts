import { describe, it, expect } from 'vitest';
import { cosineSimilarity, computeSimilarityMatrix } from '../src/utils/cosine';

describe('cosineSimilarity', () => {
  it('returns 1 for identical vectors', () => {
    const v = [1, 2, 3];
    expect(cosineSimilarity(v, v)).toBeCloseTo(1.0);
  });

  it('returns 0 for orthogonal vectors', () => {
    const a = [1, 0, 0];
    const b = [0, 1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(0.0);
  });

  it('returns -1 for opposite vectors', () => {
    const a = [1, 0];
    const b = [-1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(-1.0);
  });

  it('handles Float32Array inputs', () => {
    const a = new Float32Array([0.5, 0.5, 0.5]);
    const b = new Float32Array([0.5, 0.5, 0.5]);
    expect(cosineSimilarity(a, b)).toBeCloseTo(1.0);
  });

  it('returns 0 for zero vectors', () => {
    const a = [0, 0, 0];
    const b = [1, 2, 3];
    expect(cosineSimilarity(a, b)).toBe(0);
  });

  it('computes correct similarity for known vectors', () => {
    const a = [1, 2, 3];
    const b = [4, 5, 6];
    // dot = 32, normA = sqrt(14), normB = sqrt(77)
    const expected = 32 / (Math.sqrt(14) * Math.sqrt(77));
    expect(cosineSimilarity(a, b)).toBeCloseTo(expected);
  });
});

describe('computeSimilarityMatrix', () => {
  it('returns diagonal of 1s', () => {
    const embeddings = [
      new Float32Array([1, 0]),
      new Float32Array([0, 1]),
      new Float32Array([1, 1]),
    ];
    const matrix = computeSimilarityMatrix(embeddings);
    const n = embeddings.length;

    for (let i = 0; i < n; i++) {
      expect(matrix[i * n + i]).toBeCloseTo(1.0);
    }
  });

  it('produces a symmetric matrix', () => {
    const embeddings = [
      new Float32Array([1, 2, 3]),
      new Float32Array([4, 5, 6]),
      new Float32Array([7, 8, 9]),
    ];
    const matrix = computeSimilarityMatrix(embeddings);
    const n = embeddings.length;

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        expect(matrix[i * n + j]).toBeCloseTo(matrix[j * n + i]);
      }
    }
  });

  it('returns empty array for no embeddings', () => {
    const matrix = computeSimilarityMatrix([]);
    expect(matrix.length).toBe(0);
  });

  it('returns [1] for single embedding', () => {
    const matrix = computeSimilarityMatrix([new Float32Array([1, 2])]);
    expect(matrix[0]).toBeCloseTo(1.0);
  });
});
