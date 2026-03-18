import { pipeline, env } from '@huggingface/transformers';

// Setup environment for browser execution
// Use bundled WASM instead of fetching from CDN when possible
env.allowLocalModels = false;
env.useBrowserCache = true;

// The Xenova quantized model is specifically engineered for fast browser execution
const MODEL_ID = 'Xenova/all-MiniLM-L6-v2';

export type ProgressCallback = (progress: number, status: 'downloading' | 'loading' | 'ready' | 'error') => void;

// Singleton instance to prevent multiple model loads
let extractorInstance: any = null;
let isInitializing = false;
let initPromise: Promise<any> | null = null;

export async function initModel(onProgress?: ProgressCallback): Promise<any> {
  if (extractorInstance) {
    if (onProgress) onProgress(100, 'ready');
    return extractorInstance;
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  
  // Set explicit CDN paths for WASM to prevent dev-server hangs
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.3.2/dist/';
  }

  initPromise = new Promise((resolve, reject) => {
    const run = async () => {
      try {
        if (onProgress) onProgress(0, 'loading');

        // Add a 30s timeout to model loading to prevent permanent hangs
        const timeout = setTimeout(() => {
           reject(new Error("Transformers model init timeout"));
        }, 30000);

        const extractor = await pipeline('feature-extraction', MODEL_ID, {
          progress_callback: (info: any) => {
            if (info.status === 'download' || info.status === 'progress' || info.status === 'init' || info.status === 'downloading') {
              const pct = typeof info.progress === 'number' ? Math.round(info.progress) :
                          (info.loaded && info.total ? Math.round((info.loaded / info.total) * 100) : 10);
              if (onProgress) onProgress(pct, 'downloading');
            } else if (info.status === 'ready' && onProgress) {
              onProgress(100, 'ready');
            } else if (info.status === 'done' && onProgress) {
              onProgress(100, 'ready');
            }
          }
        });

        clearTimeout(timeout);
        extractorInstance = extractor;
        isInitializing = false;

        if (onProgress) onProgress(100, 'ready');
        resolve(extractor);
      } catch (error) {
        console.error('Failed to initialize Transformers.js:', error);
        isInitializing = false;
        if (onProgress) onProgress(0, 'error');
        reject(error);
      }
    };
    run();
  });

  return initPromise;
}

export async function generateEmbeddings(
  texts: string[],
  onProgress?: (index: number, total: number) => void
): Promise<Float32Array[]> {
  const extractor = await initModel();
  const embeddings: Float32Array[] = [];
  
  // Process in batches to avoid freezing UI thread
  const batchSize = 10;
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    // Extractor returns a Tensor.
    // Ensure we handle pooling and normalization correctly for cosine similarity.
    const output = await extractor(batch, { pooling: 'mean', normalize: true });
    
    // The output tensor shape is [batch_size, sequence_length, embedding_dim]
    // or [batch_size, embedding_dim] depending on the model and options.
    // For all-MiniLM, pooling: 'mean' gives [batch_size, 384]
    
    // We need to slice the flat Float32Array into individual arrays per text
    const dims = output.dims;
    const batchData = output.data as Float32Array;
    const embeddingDim = dims[dims.length - 1];
    
    for (let j = 0; j < batch.length; j++) {
      const start = j * embeddingDim;
      const end = start + embeddingDim;
      embeddings.push(batchData.slice(start, end));
    }
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, texts.length), texts.length);
    }
    
    // Yield to main thread briefly
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return embeddings;
}
