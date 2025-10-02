# ADR-001: Database Choice (MongoDB → Postgres Migration Path)

## Status
Accepted

## Context
Dev Helper needs a database for:
- Storing users
- Persisting prompts, responses, and metadata (history)
- Supporting CLI + web frontend features like filtering, pagination, and search

For the MVP:
- **Speed of iteration** is critical
- Schema flexibility is useful (storing varied AI responses)
- Simplicity of integration with Node/Express is a priority

For the future SaaS vision:
- Dev Helper will require **multi-tenant architecture**, **RBAC**, **analytics dashboards**, and **audit logs**
- These are best supported by a **relational database** with strong guarantees and query power

## Decision
- Use **MongoDB** for the MVP to maximize development velocity
- Plan to **migrate to Postgres** when:
  1. Multi-tenant SaaS features are introduced
  2. Complex relational queries (e.g. team usage analytics, permissions) are required
  3. Data integrity and ACID guarantees become non-negotiable

## Alternatives Considered
- **MongoDB only (no migration):** Simple, but limits SaaS scalability and relational features.
- **Postgres from Day 1:** Industry-standard, but slows MVP iteration and adds upfront schema design complexity.
- **Hybrid (Mongo for unstructured, Postgres for relational):** Too complex for MVP, potential option later.

## Consequences
- Short-term: Faster MVP delivery, simpler JSON-based persistence.
- Long-term: Migration effort required (schema redesign, data migration scripts).
- Maintains flexibility while avoiding premature optimization.

## Notes
- Migration path will likely involve introducing **Prisma ORM** to ease transition.
- Future ADRs should define:
  - Multi-tenant schema design (tenantId scoping)
  - Audit log requirements
  - RBAC structure
