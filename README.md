<div align="center">

<br/>

<img src="./public/favicon.svg" width="64" height="64" alt="OpenNews logo" />

# OpenNews

### See Every Side of the Story.

Open-source, multi-perspective news aggregator powered by **client-side AI**.
Clusters 116 sources across the political spectrum — entirely in your browser.

**Zero tracking. Zero cost. Zero backend.**

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-opennewsapp.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://opennewsapp.vercel.app/)

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![CI](https://github.com/amruth112/CruxNews-OpenNews/actions/workflows/ci.yml/badge.svg)](https://github.com/amruth112/CruxNews-OpenNews/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Transformers.js](https://img.shields.io/badge/AI-Transformers.js-FFD21E.svg?style=flat-square&logo=huggingface&logoColor=black)](https://huggingface.co/docs/transformers.js)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](CONTRIBUTING.md)

[Live Demo](https://opennewsapp.vercel.app/) | [Report Bug](https://github.com/amruth112/CruxNews-OpenNews/issues/new?template=bug_report.md) | [Request Feature](https://github.com/amruth112/CruxNews-OpenNews/issues/new?template=feature_request.md) | [Request Feed](https://github.com/amruth112/CruxNews-OpenNews/issues/new?template=add_feed.md)

</div>

<br/>

## The Feed — Multi-perspective story clusters

![OpenNews Feed View](./public/og-image.png)

## The Story Room — Deep dive into any story

![OpenNews Story Room](./public/og-image-inside.png)

<br/>

---

## Why OpenNews?

Every news app shows you **one** perspective. OpenNews shows you **all of them**.

Most aggregators pick a side, rank by engagement, or trap you in a filter bubble. OpenNews is different:

- It pulls from **116 RSS feeds** across Left, Center, and Right
- **AI running in your browser** (not a server) clusters identical stories together
- You see the **same event** through every lens — side by side
- Your data **never leaves your machine** — no accounts, no tracking, no analytics

> **The result:** You stop reading *a* story. You start reading *the* story.

---

## Features

| | Feature | Details |
|---|---------|---------|
| **AI** | Client-Side Clustering | Transformers.js (all-MiniLM-L6-v2) generates embeddings & clusters — entirely in-browser |
| **FREE** | Zero API Keys Required | Core experience uses free RSS + in-browser ML. No paid services needed |
| **BIAS** | Bias Spectrum Analysis | See how Left, Center, and Right cover (or ignore) each story (MBFC data) |
| **TIME** | Publication Timelines | Who broke it first? Watch coverage spread across outlets in real-time |
| **AI+** | Multi-Provider Summaries | Optional AI summaries via Ollama (local), Groq (free), OpenAI, or Google Gemini |
| **GLOBE** | 116 Sources, 8 Regions | US, UK, Europe, Middle East, Asia, Africa, Oceania, Latin America |
| **SHIELD** | Circuit Breaker Resilience | Failing feeds auto-disable and retry. The app stays fast no matter what |
| **LOCK** | Privacy by Architecture | No backend database. No user accounts. Settings live in your browser's localStorage |

---

## Quick Start

```bash
git clone https://github.com/amruth112/CruxNews-OpenNews.git
cd CruxNews-OpenNews
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:5173`. On first visit, the app downloads ~23MB of AI models to your browser's IndexedDB cache. Subsequent loads are instant.

> **Note:** `--legacy-peer-deps` is needed due to Vite 8 + Tailwind v4 peer dependency resolution.

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/amruth112/CruxNews-OpenNews)

---

## Architecture

```
                         YOUR BROWSER
  ┌──────────────────────────────────────────────────────┐
  │                                                      │
  │  [1. FETCH]   116 RSS feeds via CORS proxy           │
  │       │        Circuit breaker: 3 fails = 10min off  │
  │       v                                              │
  │  [2. PARSE]   rss-parser: XML → JavaScript objects   │
  │       │        Dedup by URL hash, filter by age      │
  │       v                                              │
  │  [3. EMBED]   Transformers.js: 384-dim vectors       │
  │       │        Batched (10/batch), cached per article │
  │       v                                              │
  │  [4. CLUSTER] Agglomerative clustering (cosine sim)  │
  │       │        Fallback: keyword Jaccard matching     │
  │       v                                              │
  │  [5. RENDER]  Stories ranked by coverage + recency   │
  │                Bias spectrum, timeline, sentiment     │
  │                                                      │
  └──────────────────────────────────────────────────────┘
                         │
              Only network call:
              GET /api/proxy?url=<rss-feed>
                         │
                         v
                  ┌─────────────┐
                  │ Vercel Edge  │   A dumb pipe.
                  │ (CORS Proxy) │   Validates domain → fetches XML → returns it.
                  └─────────────┘   No processing. No storage. No logging.
```

**Everything smart happens in your browser. The server is just a pipe for RSS XML.**

---

## Optional AI Summaries

OpenNews works out-of-the-box with zero API keys. For AI-generated story summaries, pick any provider:

| Provider | Model | Cost | Setup |
|----------|-------|------|-------|
| **Ollama** | Auto-detected | Free (local) | [Install Ollama](https://ollama.com/) → `ollama run llama3.2` → auto-detected |
| **Groq** | llama-3.1-8b-instant | Free tier | Get key at [console.groq.com](https://console.groq.com/) |
| **OpenAI** | gpt-4o-mini | ~$0.15/1M tokens | Get key at [platform.openai.com](https://platform.openai.com/api-keys) |
| **Google Gemini** | gemini-2.0-flash-lite | Free tier | Get key at [aistudio.google.com](https://aistudio.google.com/apikey) |

All keys are stored in `localStorage` — they persist across sessions and **never touch our servers**.

---

## News Sources — 116 Outlets Across the Spectrum

| Spectrum | Example Sources |
|----------|----------------|
| **Left** | The Guardian, NPR, HuffPost, Vox, Al Jazeera, The Intercept, Salon |
| **Left-Center** | BBC, CNN, NYT, Washington Post, ABC, CBS, NBC, PBS, ProPublica |
| **Center** | Reuters, AP News, The Hill, The Economist, Forbes, Axios, UN News |
| **Right-Center** | Fox News, WSJ, The Telegraph, NY Post, Daily Mail, Reason |
| **Right** | Breitbart, Daily Wire, National Review, The Federalist, Epoch Times |
| **International** | DW, France24, Sky News, NHK, SCMP, Times of India, Dawn, ABC AU, RTE, and 40+ more |

All sources rated using [Media Bias/Fact Check (MBFC)](https://mediabiasfactcheck.com/) data.
Want to add a source? [Open a feed request](https://github.com/amruth112/CruxNews-OpenNews/issues/new?template=add_feed.md).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) (strict mode) |
| Build | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| AI/ML | [Transformers.js](https://huggingface.co/docs/transformers.js) (Xenova/all-MiniLM-L6-v2) |
| State | React Context + useReducer → localStorage / sessionStorage |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Vercel](https://vercel.com/) (Static + Edge Functions) |
| Testing | [Vitest](https://vitest.dev/) (75 tests) |
| Linting | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Project Structure

```
CruxNews-OpenNews/
├── src/
│   ├── components/        # React UI components
│   │   ├── home/          # Feed listing & story cards
│   │   ├── layout/        # Header, footer, main layout
│   │   ├── settings/      # Settings modal & AI key manager
│   │   ├── shared/        # Reusable (badges, tooltips, error boundary)
│   │   └── story/         # Story Room detail view
│   ├── config/            # Feed definitions & source bias data
│   ├── services/          # Core logic (fetching, clustering, AI)
│   ├── stores/            # React Context state management
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Utilities (text, time, cosine, clustering)
├── api/
│   └── proxy.ts           # Vercel Edge Function (CORS proxy)
├── tests/                 # Unit tests (Vitest)
├── .github/               # CI, issue templates, PR template, Dependabot
└── package.json
```

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run 75 unit tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | Lint with ESLint |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | TypeScript strict mode check |

---

## Roadmap

- [ ] Custom RSS feed support (add your own sources in the UI)
- [ ] Shareable story URLs (link to a multi-perspective view)
- [ ] Service worker for offline reading
- [ ] Full accessibility audit (WCAG 2.1 AA)
- [ ] i18n / multi-language support
- [ ] Browser extension
- [ ] Advanced search with fuzzy matching
- [ ] Topic-based filtering (politics, tech, science, sports)
- [ ] Web Workers for clustering (eliminate UI freezes at scale)

See the [open issues](https://github.com/amruth112/CruxNews-OpenNews/issues) for a full list.

---

## Contributing

We'd love your help. See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- Setting up your dev environment
- Adding new RSS feeds (the most impactful contribution)
- Code style and commit conventions
- The pull request process

## Security

Found a vulnerability? Please read our [Security Policy](SECURITY.md) and report it via email. **Do not open a public issue.**

## License

MIT License. See [LICENSE](LICENSE).

Built by [CruxNews](https://github.com/amruth112).

---

<div align="center">

<br/>

**If OpenNews helps you see the bigger picture, give it a star.**

**[Star this repo](https://github.com/amruth112/CruxNews-OpenNews)**

<br/>

</div>
