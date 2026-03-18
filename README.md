<div align="center">

# OpenNews

**See Every Side of the Story.**

Open-source, multi-perspective news aggregator powered by client-side AI.
Zero tracking. Zero cost. Zero backend.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/cruxnews/opennews/actions/workflows/ci.yml/badge.svg)](https://github.com/cruxnews/opennews/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](#) | [Report Bug](https://github.com/cruxnews/opennews/issues/new?template=bug_report.md) | [Request Feature](https://github.com/cruxnews/opennews/issues/new?template=feature_request.md) | [Request Feed](https://github.com/cruxnews/opennews/issues/new?template=add_feed.md)

</div>

---

![OpenNews Interface](./public/og-image.png)

## What is OpenNews?

OpenNews combats echo chambers and media bias by pulling live RSS feeds from **35+ news outlets** across the political spectrum and using **100% client-side AI** to cluster articles about the same underlying story. It presents these perspectives side-by-side — analyzing coverage density, publication timelines, and sentiment — with no backend server required.

### Key Features

- **Client-Side AI Clustering** — Transformers.js (all-MiniLM-L6-v2) runs entirely in your browser. No data leaves your machine.
- **Zero API Keys Required** — Core experience uses free RSS feeds and in-browser ML. No OpenAI, no Anthropic, no paid services.
- **Bias Spectrum Analysis** — Visualizes how Left, Center, and Right outlets cover (or ignore) each story, based on MBFC data.
- **Chronological Timelines** — See who broke the story first and how coverage spread.
- **Optional AI Summaries** — Free summaries via [Ollama](https://ollama.com/) (local) or [Groq](https://groq.com/) (cloud).
- **Circuit Breaker Resilience** — Failing feeds are automatically disabled and retried, keeping the app fast.

## Quick Start

```bash
git clone https://github.com/cruxnews/opennews.git
cd opennews
npm install --legacy-peer-deps
npm run dev
```

Open `http://localhost:5173`. On first visit, the app downloads ~23MB of AI models to your browser's IndexedDB cache. Subsequent loads are instant.

> **Note:** `--legacy-peer-deps` is required due to Vite 8 + Tailwind v4 peer dependency resolution.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cruxnews/opennews)

Or build manually:

```bash
npm run build          # TypeScript check + Vite production build
npm run preview        # Preview locally
```

### Prerequisites

- Node.js >= 18
- npm

## How It Works

```
RSS Feeds (35+ sources)
    |
    v
[1. FETCH] ──> Browser requests via CORS proxy (Vercel Edge Function)
    |           Circuit breaker: 3 failures = 10-min cooldown
    v
[2. NORMALIZE] ──> Strip HTML, deduplicate, assign bias/factuality ratings
    |               Filter by age (default: last 48 hours)
    v
[3. EMBED] ──> Transformers.js generates 384-dim embeddings in-browser
    |           Batched (10/batch) to avoid UI freeze. Cached per article.
    v
[4. CLUSTER] ──> Agglomerative clustering (cosine similarity, threshold: 0.55)
    |             Fallback: keyword Jaccard matching if AI model fails
    v
[5. RENDER] ──> Stories ranked by source count + recency
                Bias spectrum, timeline, sentiment displayed per story
```

## Optional AI Summaries

OpenNews works out-of-the-box without any API keys. For AI-generated story summaries:

### Local AI (Maximum Privacy)
```bash
# Install Ollama: https://ollama.com
ollama run llama3.2
# OpenNews auto-detects Ollama at localhost:11434
```

### Groq Cloud (Maximum Speed)
1. Get a free key at [console.groq.com](https://console.groq.com/)
2. Open Settings (`,` key) in the app and paste your key
3. Your key stays in `localStorage` — it never touches our servers

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) (strict mode) |
| Build | [Vite 8](https://vite.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) |
| AI/ML | [Transformers.js](https://huggingface.co/docs/transformers.js) (Xenova/all-MiniLM-L6-v2) |
| State | React Context + useReducer, synced to localStorage/sessionStorage |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Vercel](https://vercel.com/) (Static + Edge Functions) |
| Testing | [Vitest](https://vitest.dev/) |
| Linting | [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) |

## Project Structure

```
opennews/
├── src/
│   ├── components/        # React UI components
│   │   ├── home/          # Feed listing & story cards
│   │   ├── layout/        # Header, footer, main layout
│   │   ├── settings/      # Modal settings & configuration
│   │   ├── shared/        # Reusable components (badges, tooltips)
│   │   └── story/         # Story room detail view
│   ├── config/            # Feed definitions & source bias data
│   ├── services/          # Core logic (fetching, clustering, AI)
│   ├── stores/            # React Context state management
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript interfaces
│   └── utils/             # Utilities (text, time, cosine, clustering)
├── api/
│   └── proxy.ts           # Vercel Edge Function (CORS proxy)
├── tests/                 # Unit tests (Vitest)
├── .github/               # CI, issue templates, PR template
├── public/                # Static assets
└── package.json
```

## Scripts

| Command | Description |
|---------|------------|
| `npm run dev` | Start dev server at localhost:5173 |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Lint source code |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | TypeScript type checking |

## News Sources

OpenNews aggregates from a balanced spectrum of 35+ outlets:

| Spectrum | Sources |
|----------|---------|
| **Left** | The Guardian, NPR, HuffPost, Vox, Al Jazeera, The Intercept |
| **Left-Center** | BBC, CNN, NYT, Washington Post, ABC, CBS, NBC, PBS |
| **Center** | Reuters, AP News, The Hill, The Economist |
| **Right-Center** | Fox News, WSJ, The Telegraph, NY Post, Daily Mail |
| **Right** | Breitbart, The Daily Wire |
| **International** | DW, France24, Sky News, ABC Australia, Times of India, SCMP, NHK, RTE, Irish Times, The Conversation |

Sources are rated using [Media Bias/Fact Check (MBFC)](https://mediabiasfactcheck.com/) data. Want to add a source? [Open a feed request](https://github.com/cruxnews/opennews/issues/new?template=add_feed.md).

## Roadmap

- [ ] Custom RSS feed support (add your own sources)
- [ ] Shareable story URLs (link to a multi-perspective view)
- [ ] Service worker for offline reading
- [ ] Full accessibility audit (WCAG 2.1 AA)
- [ ] i18n / multi-language support
- [ ] Browser extension
- [ ] Advanced search with fuzzy matching
- [ ] Topic-based filtering (politics, tech, science, etc.)

See the [open issues](https://github.com/cruxnews/opennews/issues) for a full list of proposed features and known issues.

## Contributing

Contributions are what make the open-source community amazing. Any contributions you make are **greatly appreciated**.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Setting up your development environment
- Adding new RSS feeds
- Code style and commit conventions
- The pull request process

## Security

Found a vulnerability? Please read our [Security Policy](SECURITY.md) and report it responsibly via email. Do not open a public issue.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

Built by [CruxNews](https://cruxnews.io).

---

<div align="center">

If OpenNews helps you see the bigger picture, consider giving it a star.

</div>
