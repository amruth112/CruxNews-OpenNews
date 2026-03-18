/**
 * Compute cosine similarity between two vectors.
 */
export function cosineSimilarity(a: number[] | Float32Array, b: number[] | Float32Array): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dotProduct / denom;
}

/**
 * Compute cosine similarity matrix for a list of embeddings.
 * Returns a flat Float32Array of size n*n.
 */
export function computeSimilarityMatrix(embeddings: Float32Array[]): Float32Array {
  const n = embeddings.length;
  const matrix = new Float32Array(n * n);

  for (let i = 0; i < n; i++) {
    matrix[i * n + i] = 1;
    for (let j = i + 1; j < n; j++) {
      const sim = cosineSimilarity(embeddings[i], embeddings[j]);
      matrix[i * n + j] = sim;
      matrix[j * n + i] = sim;
    }
  }

  return matrix;
}
