# ADR-004: Database ORM / Query Layer

## Status
Proposed

## Context
Database access will be required across backend services (auth, history, responses). Options:
- **Mongoose** (ODM for MongoDB)
- **Prisma** (multi-DB ORM supporting both Mongo and Postgres)
- **Native queries** (driver-level)

## Decision
Start with **Mongoose** for MongoDB MVP.  
Plan to migrate to **Prisma ORM** when transitioning to Postgres for SaaS features.

## Rationale
- **Mongoose:** Fast iteration, well-integrated with Mongo.
- **Prisma:** Provides type safety, modern DX, and eases migration from Mongo → Postgres.
- **Native queries:** Too low-level, slows development.

## Alternatives Considered
- **Stick with Mongoose permanently:** Works for small apps, but not SaaS-scale.
- **Use Prisma now:** Possible, but Mongo support is less mature than Postgres.

## Consequences
- Short-term speed of iteration with Mongoose.
- Future migration effort, but Prisma adoption will smooth the transition.
