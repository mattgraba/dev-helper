# ADR-005: Deployment Strategy

## Status
Proposed

## Context
Dev Helper requires deployment for:
- **Frontend** (React web app)
- **Backend API** (Express server)
- **Database** (Mongo Atlas, future Postgres)

Deployment options:
- Monolithic deployment (all-in-one)
- Separate deployments per service
- Containerized deployment (Docker + orchestration)

## Decision
For MVP:
- **Frontend** → Deploy via Vercel (fast CI/CD, great for React)
- **Backend** → Deploy via Render/Heroku (simplicity for Express apps)
- **Database** → Use MongoDB Atlas (cloud-hosted)

For SaaS:
- **Containerize** with Docker for environment parity
- Future orchestration (Kubernetes / ECS) as team/org usage grows

## Rationale
- MVP deployment must be quick + low overhead
- SaaS needs flexibility, reproducibility, and scaling → Docker
- Vercel/Render/Atlas provide fastest path to live product

## Alternatives Considered
- **Self-host everything:** Too much ops overhead.
- **AWS/GCP full-stack:** Enterprise ready, but overkill for MVP.

## Consequences
- MVP: Easy deployments, fast iteration.
- SaaS: Will require migration to containerized/cloud-native architecture.
