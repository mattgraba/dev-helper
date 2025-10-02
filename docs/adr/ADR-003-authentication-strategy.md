# ADR-003: Authentication Strategy (JWT vs. Sessions)

## Status
Accepted

## Context
Dev Helper requires authentication for:
- CLI usage (persisted across sessions)
- Web frontend (login + protected routes)
- API calls (backend violation)

Options include:
- **Session-based auth** (server-side storage of session IDs)
- **JWT (JSON Web Tokens)** stored on client and passed in headers

## Decision
Use **JWT authentication** for both CLI and web frontend.

## Rationale
- **Stateless**: Scales easily across backend instances.
- **Unified**: Works consistently for both CLI config and web localStorage.
- **Lightweight**: No session store or server memory required.
- **Portable**: Fits SaaS scaling + cloud deployments.

## Alternatives Considered
- **Sessions with cookies**: Secure and familiar, but not suited for CLI usage.
- **OAuth provider integration**: Valuable later, but overkill for MVP.

## Consequences
- Simpler MVP implementation.
- Security depends on careful JWT handling (expiration, refresh strategy).
- Migration to OAuth or external identity provider possible in future ADR.