# OpenNews — Project Context

## What This Is

A client-side news aggregator that clusters articles from 116 RSS feeds across the political spectrum using browser-based AI (Transformers.js). The entire intelligence layer runs in the user's browser — the only server component is a CORS proxy that pipes raw XML.

## Architecture

```
Browser: React 19 + TypeScript (strict) + Tailwind 4
  ├── RSS fetching → via /api/proxy (CORS bypass)
  ├── Parsing → rss-parser library
  ├── Embeddings → Transformers.js (all-MiniLM-L6-v2, 23MB, cached in IndexedDB)
  ├── Clustering → Agglomerative clustering with cosine similarity
  ├── Bias labels → Static MBFC lookup table (src/config/sources.ts)
  ├── Sentiment → Lexicon-based (no ML)
  ├── AI summaries → Optional: Groq / OpenAI / Gemini / Ollama
  └── State → React Context + useReducer, persisted to localStorage/sessionStorage

Server: Single Vercel Edge Function (api/proxy.ts)
  └── Validates URL against domain allowlist → fetches RSS XML → returns with CORS headers
```

## Key Commands

```bash
npm run dev          # Start dev server (Vite + local proxy)
npm run build        # Production build
npm run test         # Run vitest
npm run typecheck    # TypeScript strict check
npm run lint         # ESLint
npm run format       # Prettier
```

## Important Patterns

- **Three proxy allowlists must stay in sync**: `api/proxy.ts`, `vite.config.ts`, and `src/config/feeds.ts` all contain domain lists. When adding a feed, update all three.
- **Feed tiers** (1/2/3) control fetch order, not importance. Tier 1 fetches first for fast initial load.
- **Circuit breaker**: 3 failures → 10 min cooldown per feed. State is in-memory (module-level variables in feedFetcher.ts).
- **Embeddings cache** lives in a `useRef<Map>` in useClustering.ts. Pruned on each clustering run to prevent memory leaks.
- **Settings persistence**: All user settings (API keys, feed toggles, theme, provider choice) are stored in `localStorage` under `opennews-settings`. Articles/clusters are cached in `sessionStorage` for instant reload.
- **AI provider fallback chain**: If primary provider fails, automatically tries others that have keys configured.

## Security Boundaries

- Proxy validates: protocol (http/https only), domain (exact match or subdomain), and forces Content-Type to application/xml
- API keys never leave the browser (stored in localStorage, sent directly to provider APIs)
- Image URLs from RSS are validated for http/https protocol before rendering
- No `dangerouslySetInnerHTML` anywhere in the codebase
