# ADR-006: Error Handling Strategy

## Status
Proposed

## Context
Dev Helper must handle errors consistently across:
- CLI commands (user input, file paths, invalid flags)
- Backend API (bad requests, server errors, OpenAI failures)
- Frontend (login errors, fetch failures, UI crashes)

Without a strategy, errors risk being inconsistent, unclear, or leaking sensitive details.

## Decision
Adopt a **layered error handling strategy**:
1. **CLI:** Use a shared error utility (`handleCliError.js`) for consistent messaging.
2. **Backend API:**
    - Centralized error middleware for Express.
    - Return structured JSON errors with status codes.
    - Mask sensitive errors (stack traces not exposed to users).
3. **Frontend:**
    - Display friendly error messages (toast/alert components).
    - Log technical details to console/devtools for debugging.

## Rationale
- Improves UX for developers and end-users.
- Simplifies debugging for maintainers.
- Prevents leaking sensitive stack traces or keys.

## Alternatives Considered
- **Ad-hoc handling:** Quick but inconsistent.
- **Error codes only (no messages):** Secure but unfriendly.

## Consequences
- Requires discipline to use shared error utilities.
- Slight overhead in defining error types and codes.
- Stronger consistency across system → easier scaling to SaaS.