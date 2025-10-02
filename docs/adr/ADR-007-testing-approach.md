# ADR-007: Testing Approach

## Status
Proposed

## Context
Dev Helper spans CLI, backend, and frontend. To ensure stability:
- CLI commands must be tested for input/output correctness.
- Backend API must be tested for route validation and auth flows.
- Frontend must be tested for UI behavior and API integration.

Testing options:
- Unit tests, integration tests, manual testing
- Frameworks: Jest, Mocha, Vitest, Playwright

## Decision
Adopt a **multi-layered testing strategy**:
1. **CLI:** Use Jest for unit testing commands and utilities.
2. **Backend:** Use Supertest + Jest for API route integration tests.
3. **Frontend:** Use Vitest + React Testing Library for components.
4. **E2E (later):** Consider Playwright or Cypress for full-stack flows.

## Rationale
- Jest is widely supported for JS/TS → consistent across CLI + backend.
- React Testing Library promotes testing behavior, not implementation.
- Incremental adoption: start with unit + integration, expand to E2E.

## Alternatives Considered
- **Skip tests initially:** Faster MVP, but risks regressions.
- **Full E2E from start:** Strong, but slows iteration.

## Consequences
- Slightly slower MVP development.
- Long-term gains in stability and maintainability.
- Easier onboarding for contributors (tests document expected behavior).
