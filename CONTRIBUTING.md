# Contributing to OpenNews

First off, thank you for considering contributing to OpenNews! Our goal is to create the best open-source, unbiased, multi-perspective news consumption tool.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Philosophy](#philosophy)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Adding or Modifying RSS Feeds](#adding-or-modifying-rss-feeds)
- [Code Style](#code-style)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Philosophy

Every contribution must align with these core principles:

- **Zero Server Dependency** — The core app must always be able to run statically with client-side AI. No backend databases, no server-side processing for core features.
- **Privacy First** — No tracking, no mandatory cloud APIs. Users' data stays in their browser.
- **Performance** — Keep the initial bundle light; load AI models asynchronously. Never block the main thread.
- **Neutrality** — The app must remain a neutral vessel. We do not editorialize; we display what the sources say.

## Getting Started

1. **Fork the repository** on GitHub.

2. **Clone your fork:**
   ```bash
   git clone https://github.com/<your-username>/opennews.git
   cd opennews
   ```

3. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```
   > `--legacy-peer-deps` is required due to Vite 8 + Tailwind v4 peer dependency resolution.

4. **Start the dev server:**
   ```bash
   npm run dev
   ```

5. **Verify your setup** by running the full quality check:
   ```bash
   npm run lint && npm run typecheck && npm run test && npm run build
   ```

## Development Workflow

1. Create a new branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes. Write tests for new logic.

3. Run the quality checks before committing:
   ```bash
   npm run lint        # ESLint
   npm run typecheck   # TypeScript strict mode
   npm run test        # Vitest
   npm run build       # Vite production build
   ```

4. Commit your changes following the [commit message conventions](#commit-messages).

5. Push to your fork and open a Pull Request.

## Adding or Modifying RSS Feeds

Feed configuration lives in two files:

- **`src/config/feeds.ts`** — Feed definitions (URL, name, tier, category, region)
- **`src/config/sources.ts`** — Source bias/factuality data from MBFC

To add a new feed:

1. Verify the outlet has a reliable, publicly accessible RSS feed.
2. Check [Media Bias/Fact Check (MBFC)](https://mediabiasfactcheck.com/) for their bias rating and factual reporting score.
3. Add the source to `sources.ts` with the accurate MBFC rating.
4. Add the feed definition to `feeds.ts`:
   - **Tier 1** — Major international outlets with very reliable RSS (reserved for maintainers)
   - **Tier 2** — Well-known outlets, good RSS quality (default for new additions)
   - **Tier 3** — Niche, regional, or less reliable feeds (disabled by default)
5. Add the feed's domain to the `ALLOWED_DOMAINS` array in both `vite.config.ts` and `api/proxy.ts`.
6. Write a test or verify the feed parses correctly via the dev server.

You can also use the **"Add News Feed"** issue template on GitHub to request new feeds.

## Code Style

- **TypeScript** — Strict mode enabled. Fix all type errors before submitting.
- **React** — Functional components and hooks only. No class components.
- **Styling** — Tailwind CSS for all styling. No inline styles or CSS modules.
- **Naming** — camelCase for variables/functions, PascalCase for components/types.
- **Components** — Keep them small and focused. One component per file.
- **Imports** — Use the `@/` path alias for src-relative imports.

Formatting is handled by Prettier and enforced by ESLint:

```bash
npm run format      # Auto-format all files
npm run lint:fix    # Auto-fix lint issues
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]
```

**Types:**
- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `style` — Code style changes (formatting, not CSS)
- `refactor` — Code refactoring
- `test` — Adding or updating tests
- `chore` — Maintenance tasks (deps, CI, config)

**Examples:**
```
feat(feeds): add France24 as tier 2 international source
fix(clustering): handle empty embedding arrays gracefully
docs(readme): add self-hosting guide
test(utils): add tests for cosine similarity edge cases
chore(ci): add Node 22 to CI matrix
```

## Pull Request Process

1. Fill out the PR template completely.
2. Ensure all CI checks pass (lint, typecheck, test, build).
3. Keep PRs focused — one feature or bug fix per PR.
4. Link related issues in the PR description.
5. A maintainer will review your PR. Be responsive to feedback.
6. Once approved, a maintainer will merge your PR.

## Reporting Bugs

Use the **"Bug Report"** issue template. Include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and OS information
- Console errors (DevTools > Console)

## Suggesting Features

Use the **"Feature Request"** issue template. Please check existing issues first to avoid duplicates.

---

We look forward to your contributions!
