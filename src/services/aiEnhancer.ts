import type { StoryCluster, AIProvider, AIApiKeys } from '../types';

interface SummaryResult {
  summary: string;
  source: AIProvider | 'error';
}

// ─── Model configuration (cheapest that works) ──────────────────────────
const MODELS = {
  groq: 'llama-3.1-8b-instant',         // Free tier
  openai: 'gpt-4o-mini',                // ~$0.15/1M input tokens
  gemini: 'gemini-2.0-flash-lite',      // Free tier available
} as const;

const SYSTEM_PROMPT = 'You are a neutral, objective journalist. Summarize the provided news headlines and descriptions into exactly 2 concise sentences that capture the main facts and how coverage varies (if it does). Do not add your own opinion.';

// ─── Ollama helpers ─────────────────────────────────────────────────────

export async function checkOllama(baseUrl: string = 'http://localhost:11434'): Promise<string[] | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`${baseUrl}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.models || !Array.isArray(data.models)) return null;

    return data.models.map((m: any) => m.name);
  } catch {
    return null;
  }
}

export function selectBestOllamaModel(models: string[]): string | null {
  if (!models || models.length === 0) return null;

  const preferences = [
    'llama3.2:3b',
    'llama3.1:8b',
    'mistral:7b',
    'mistral:latest',
    'llama3:8b',
    'phi3:mini',
    'gemma:2b',
    'gemma2:9b',
  ];

  for (const pref of preferences) {
    const match = models.find(m => m.includes(pref) || m === pref);
    if (match) return match;
  }

  return models[0];
}

// ─── Provider generators ────────────────────────────────────────────────

async function generateWithOllama(
  prompt: string,
  model: string,
  baseUrl: string = 'http://localhost:11434'
): Promise<string> {
  const res = await fetch(`${baseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.1, num_predict: 150 },
    }),
  });

  if (!res.ok) throw new Error(`Ollama error: ${res.statusText}`);

  const data = await res.json();
  return data.response.trim();
}

async function generateWithGroq(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELS.groq,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 150,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Groq error: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function generateWithOpenAI(prompt: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODELS.openai,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 150,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`OpenAI error: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.choices[0].message.content.trim();
}

async function generateWithGemini(prompt: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELS.gemini}:generateContent`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: `${SYSTEM_PROMPT}\n\n${prompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 150,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Gemini error: ${err.error?.message || res.statusText}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
}

// ─── Prompt builder ─────────────────────────────────────────────────────

function buildClusterPrompt(cluster: StoryCluster): string {
  const leftArticles = cluster.articles.filter(a => ['left', 'left-center'].includes(a.sourceBias));
  const centerArticles = cluster.articles.filter(a => ['center', 'independent'].includes(a.sourceBias));
  const rightArticles = cluster.articles.filter(a => ['right', 'right-center'].includes(a.sourceBias));

  const reps = [
    ...leftArticles.slice(0, 2),
    ...centerArticles.slice(0, 2),
    ...rightArticles.slice(0, 2),
  ].filter(Boolean);

  if (reps.length < 3) {
    const ids = new Set(reps.map(r => r.id));
    for (const a of cluster.articles) {
      if (!ids.has(a.id) && reps.length < 5) {
        reps.push(a);
        ids.add(a.id);
      }
    }
  }

  let prompt = `Summarize this news story in exactly 2 sentences. The summary must be neutral and objective. Mention if different outlets are emphasizing different aspects of the story.\n\nInput Coverage:\n`;

  for (const article of reps) {
    prompt += `- ${article.sourceName} (${article.sourceBias}): "${article.title}". ${article.description.substring(0, 200)}...\n`;
  }

  prompt += `\nOutput Summary (2 sentences max):`;
  return prompt;
}

// ─── Main entry point ───────────────────────────────────────────────────

/**
 * Generate a summary for a cluster using the selected AI provider.
 * Falls back to alternative providers if the primary fails.
 */
export async function summarizeCluster(
  cluster: StoryCluster,
  provider: AIProvider,
  ollamaModel: string | null = null,
  apiKeys: AIApiKeys = { groq: null, openai: null, gemini: null }
): Promise<SummaryResult | null> {
  if (provider === 'none' || cluster.articles.length < 2) return null;

  const prompt = buildClusterPrompt(cluster);

  // Try the primary provider first
  try {
    if (provider === 'ollama' && ollamaModel) {
      const summary = await generateWithOllama(prompt, ollamaModel);
      return { summary, source: 'ollama' };
    }

    if (provider === 'groq' && apiKeys.groq) {
      const summary = await generateWithGroq(prompt, apiKeys.groq);
      return { summary, source: 'groq' };
    }

    if (provider === 'openai' && apiKeys.openai) {
      const summary = await generateWithOpenAI(prompt, apiKeys.openai);
      return { summary, source: 'openai' };
    }

    if (provider === 'gemini' && apiKeys.gemini) {
      const summary = await generateWithGemini(prompt, apiKeys.gemini);
      return { summary, source: 'gemini' };
    }
  } catch (err) {
    console.warn(`Primary provider (${provider}) failed, trying fallbacks...`, err);
  }

  // Fallback chain: try any provider that has a key
  const fallbacks: Array<{ key: keyof AIApiKeys; provider: AIProvider; fn: (p: string, k: string) => Promise<string> }> = [
    { key: 'groq', provider: 'groq', fn: generateWithGroq },
    { key: 'openai', provider: 'openai', fn: generateWithOpenAI },
    { key: 'gemini', provider: 'gemini', fn: generateWithGemini },
  ];

  for (const fb of fallbacks) {
    if (fb.provider === provider) continue; // already tried
    const key = apiKeys[fb.key];
    if (!key) continue;

    try {
      const summary = await fb.fn(prompt, key);
      return { summary, source: fb.provider };
    } catch (err) {
      console.warn(`Fallback provider (${fb.provider}) also failed:`, err);
    }
  }

  return { summary: '', source: 'error' };
}

// ─── API key testers ────────────────────────────────────────────────────

export async function testApiKey(
  provider: 'groq' | 'openai' | 'gemini',
  apiKey: string
): Promise<{ ok: boolean; message: string }> {
  try {
    if (provider === 'groq') {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      return res.ok
        ? { ok: true, message: 'Connected to Groq ✓' }
        : { ok: false, message: 'Invalid Groq API key' };
    }

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
      });
      return res.ok
        ? { ok: true, message: 'Connected to OpenAI ✓' }
        : { ok: false, message: 'Invalid OpenAI API key' };
    }

    if (provider === 'gemini') {
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models',
        { headers: { 'x-goog-api-key': apiKey } }
      );
      return res.ok
        ? { ok: true, message: 'Connected to Gemini ✓' }
        : { ok: false, message: 'Invalid Gemini API key' };
    }

    return { ok: false, message: 'Unknown provider' };
  } catch {
    return { ok: false, message: 'Network error — check your connection' };
  }
}
