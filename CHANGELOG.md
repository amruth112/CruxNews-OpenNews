# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.1.0]: https://github.com/cruxnews/opennews/releases/tag/v0.1.0
