# Architecture Decision Records (ADR) Index

This folder tracks important decisions made during the development of **Dev Helper**.  
Each ADR documents the context, decision, alternatives, and consequences.  
Statuses may be **Accepted**, **Proposed**, or **Superseded**.

---

## 📋 ADR List

| ADR # | Title                               | Status    | Notes |
|-------|-------------------------------------|-----------|-------|
| 001   | Database Choice (MongoDB → Postgres Migration Path) | Accepted | Use MongoDB for MVP, plan Postgres migration for SaaS. |
| 002   | Interface Choice (CLI-First vs IDE Plugin) | Accepted | CLI-first to align with four pillars, avoid vibe-coding. |
| 003   | Authentication Strategy (JWT vs Sessions) | Accepted | JWT across CLI + web, unified and stateless. |
| 004   | Database ORM / Query Layer          | Proposed  | Start with Mongoose, plan Prisma for Postgres. |
| 005   | Deployment Strategy                 | Proposed  | MVP: Vercel + Render + Mongo Atlas; SaaS: Docker + orchestration. |
| 006   | Error Handling Strategy             | Proposed  | Shared utilities across CLI, backend, frontend. |
| 007   | Testing Approach                    | Proposed  | Jest + Supertest + React Testing Library; add E2E later. |
| 008   | Logging & Observability             | Proposed  | Structured logs (Pino/Winston); expand to Sentry, OpenTelemetry. |

---

## 🔑 Usage
- New ADRs should follow incremental numbering (e.g., `009`, `010`).
- Each ADR file is stored in `docs/adrs/ADR-###-title.md`.
- Updates should **not delete old ADRs** — instead, mark them as **Superseded** if a decision is replaced.

---

## 🧭 Philosophy Reminder
All ADRs must align with Dev Helper’s **four pillars**:  
1. Empowering intentional usage  
2. Promoting critical thinking  
3. Augmenting fundamentals  
4. Resisting vibe-coding  
