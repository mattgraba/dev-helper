# ADR-008: Logging & Observability

## Status
Proposed

## Context
As Dev Helper grows, visibility into runtime behavior is essential for:
- Debugging user-reported issues
- Monitoring API performance
- Auditing usage (especially for SaaS multi-tenant mode)

Options:
- Console logs only
- Structured logging (JSON, Winston, Pino)
- Observability tools (Datadog, Sentry, OpenTelemetry)

## Decision
For MVP:
- Use **structured logging** with Winston or Pino in the backend.
- Standardize log levels (info, warn, error, debug).
- Write CLI logs to stdout with color-coded feedback.
- Minimal frontend logging (console + error boundary).

For SaaS:
- Add centralized logging pipeline (ELK stack, Datadog, or equivalent).
- Integrate error monitoring (Sentry) and tracing (OpenTelemetry).

## Rationale
- Structured logs are machine-readable and easier to analyze.
- Scales naturally into production monitoring tools.
- Keeps MVP lightweight while setting a clear upgrade path.

## Alternatives Considered
- **Console logs only:** Quick, but unstructured and not scalable.
- **Full observability stack now:** Too heavy for MVP.

## Consequences
- Requires developer discipline (always log consistently).
- Some overhead in setting up logging library.
- Long-term benefit: observability enables SaaS reliability.
