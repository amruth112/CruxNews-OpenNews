# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-03-19

### Added

- Multi-provider AI summaries: OpenAI (gpt-4o-mini), Google Gemini (gemini-2.0-flash-lite), in addition to Groq and Ollama
- Save API Key button with explicit save/test/remove per provider
- AI provider selection persists across browser restarts
- Error Boundary — app shows a recovery screen instead of blank page on crash
- Dependabot configuration for automated dependency updates
- GitHub Sponsors / FUNDING.yml
- CLAUDE.md for contributor project context
- 81 new RSS feeds (35 → 116 total) covering all regions globally

### Fixed

- **Security: Proxy URL bypass** — `hostname.includes()` allowed `theguardian.com.evil.com` to pass allowlist. Now uses exact + subdomain matching
- **Security: Proxy Content-Type injection** — upstream Content-Type was forwarded verbatim, now hardcoded to `application/xml`
- **Security: Gemini API key leaked in URL** — moved to `x-goog-api-key` header
- **Security: Image URL XSS** — RSS `<img src="javascript:...">` now blocked; only http/https allowed
- **Bug: API keys didn't persist** — `aiProvider` was not part of persisted `AppSettings`; now saved to localStorage with migration from old format
- **Bug: Feed didn't auto-refresh on page reload** — session cache prevented initial fetch; now always fetches fresh data on mount
- **Bug: StoryRoom re-summarized on every render** — object reference in useEffect deps; now uses primitive string deps
- **Bug: Duplicate clustering runs** — stale closure race condition; now uses useRef guard
- **Memory leak: Embeddings cache grew forever** — now prunes stale entries on each clustering run
- **Memory leak: Transformers.js tensors not disposed** — now calls `output.dispose()` after extraction
- **Memory leak: Model init timeout race** — timeout and resolve could both fire; now uses settled flag
- **Proxy error info leak** — internal hostnames no longer exposed in error messages

### Changed

- All 116 feeds enabled by default (previously only 35 of 87)
- CNN and Xinhua feed URLs fixed from http to https
- Settings migration: old `groqApiKey` field auto-migrates to new `aiApiKeys` structure
- Updated all GitHub URLs to point to actual repository

## [0.1.0] - 2026-03-18

### Added

- Multi-perspective news aggregation from 35+ RSS sources across the political spectrum
- Client-side AI clustering using Transformers.js (Xenova/all-MiniLM-L6-v2)
- Agglomerative clustering with cosine similarity and configurable threshold
- Keyword-based fallback clustering when AI model is unavailable
- Bias spectrum visualization based on Media Bias/Fact Check (MBFC) data
- Chronological timeline showing which outlet broke each story first
- Lexicon-based sentiment analysis (client-side, no API required)
- Optional AI summarization via Ollama (local) or Groq (cloud)
- Tiered feed fetching with circuit breaker pattern for resilience
- Dark/light/system theme support
- Session caching for instant page reloads
- Settings modal with configurable cluster threshold, refresh interval, and feed toggles
- Vercel Edge Function CORS proxy with domain allowlist
- Keyboard shortcuts: `,` for settings, `r` for refresh
- Responsive design for mobile and desktop
- Full TypeScript strict mode
- CI pipeline with GitHub Actions (lint, typecheck, test, build)
- Comprehensive test suite for core utilities and business logic

[0.2.0]: https://github.com/amruth112/CruxNews-OpenNews/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/amruth112/CruxNews-OpenNews/releases/tag/v0.1.0
