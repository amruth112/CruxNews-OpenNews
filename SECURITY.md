# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of OpenNews seriously. If you discover a security
vulnerability, please report it responsibly.

**Please do NOT open a public GitHub issue for security vulnerabilities.**

### How to Report

Send an email to **amruthjithraj11@gmail.com** with:

1. A description of the vulnerability
2. Steps to reproduce the issue
3. Potential impact assessment
4. Any suggested fix (optional but appreciated)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within 48 hours.
- **Assessment**: We will assess the vulnerability and determine its severity within 5 business days.
- **Resolution**: We will work on a fix and coordinate a release timeline with you.
- **Credit**: We will credit you in the release notes (unless you prefer to remain anonymous).

### Scope

The following are in scope for security reports:

- The CORS proxy (`api/proxy.ts`) — domain allowlist bypasses, SSRF, etc.
- Client-side data handling — XSS via RSS content, injection attacks
- Dependency vulnerabilities — known CVEs in production dependencies
- API key exposure — any path where user secrets could leak

### Out of Scope

- RSS feed content itself (we display third-party content as-is)
- Browser-specific vulnerabilities not related to our code
- Social engineering attacks
- Denial of service via excessive feed requests (rate limiting is handled by Vercel)

## Security Design

OpenNews is designed with a privacy-first architecture:

- **No backend database** — no user data is stored server-side
- **No authentication** — no credentials to compromise
- **Client-side AI** — ML models run in-browser, no data sent to our servers
- **API keys in localStorage** — Groq keys never touch our infrastructure
- **Domain allowlist** — the CORS proxy only forwards requests to pre-approved news domains
