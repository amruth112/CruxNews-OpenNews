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
    let settled = false;

    const run = async () => {
      try {
        if (onProgress) onProgress(0, 'loading');

        const timeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            isInitializing = false;
            initPromise = null;
            if (onProgress) onProgress(0, 'error');
            reject(new Error('Transformers model init timeout'));
          }
        }, 30000);

        const extractor = await pipeline('feature-extraction', MODEL_ID, {
          progress_callback: (info: any) => {
            if (settled) return;
            if (info.status === 'download' || info.status === 'progress' || info.status === 'init' || info.status === 'downloading') {
              const pct = typeof info.progress === 'number' ? Math.round(info.progress) :
                          (info.loaded && info.total ? Math.round((info.loaded / info.total) * 100) : 10);
              if (onProgress) onProgress(pct, 'downloading');
            } else if ((info.status === 'ready' || info.status === 'done') && onProgress) {
              onProgress(100, 'ready');
            }
          },
        });

        clearTimeout(timeout);
        if (!settled) {
          settled = true;
          extractorInstance = extractor;
          isInitializing = false;
          if (onProgress) onProgress(100, 'ready');
          resolve(extractor);
        }
      } catch (error) {
        if (!settled) {
          settled = true;
          console.error('Failed to initialize Transformers.js:', error);
          isInitializing = false;
          initPromise = null;
          if (onProgress) onProgress(0, 'error');
          reject(error);
        }
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

    // output is a Tensor: [batch_size, 384] for all-MiniLM
    const dims = output.dims;
    const batchData = output.data as Float32Array;
    const embeddingDim = dims[dims.length - 1];

    for (let j = 0; j < batch.length; j++) {
      const start = j * embeddingDim;
      const end = start + embeddingDim;
      // .slice() copies the data so we can safely dispose the tensor
      embeddings.push(batchData.slice(start, end));
    }

    // Free WASM memory held by the Tensor
    if (typeof output.dispose === 'function') {
      output.dispose();
    }
    
    if (onProgress) {
      onProgress(Math.min(i + batchSize, texts.length), texts.length);
    }
    
    // Yield to main thread briefly
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  
  return embeddings;
}
