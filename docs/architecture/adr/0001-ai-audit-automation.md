# ADR 0003 — AI Audit Automation in Dev Helper

## Status
Accepted

## Context
We are introducing an AI-powered audit log analysis feature as part of the Cannabis Compliance SaaS.  
Before wiring this into the SaaS backend, we want a **sandbox** for prototyping prompts, schema validation, and OpenAI integration.  

Our existing **Dev Helper CLI** is already integrated with OpenAI, supports history logging, and has a clean command/handler structure. It is therefore the ideal place to experiment with compliance automation before migration.

During initial implementation, two important issues were identified:
- OpenAI client initialization at **module load** caused failures when environment variables weren’t loaded yet.
- `.env` was stored in `server/`, but the CLI also needed it.  

These were resolved by:
- Moving `.env` to the **project root** so both server and CLI share configuration.  
- Implementing **lazy initialization** for the OpenAI client (first call creates client, not module import).  

## Decision
- Compliance commands (`analyze-audit`) will be registered in **Dev Helper CLI** under `commands/compliance/`.  
- These commands will **call OpenAI directly** during prototyping (Option A).  
- A shared `.env` file at project root will store sensitive credentials (`OPENAI_API_KEY`, `MONGO_URI`, etc.).  
- OpenAI client will always be initialized lazily via `getOpenAIClient()` to prevent load-time failures.  
- Dev Helper = **sandbox** for compliance AI workflows.  
- Cannabis-Compliance SaaS = **production deployment** once handlers are validated.  

## Consequences
- ✅ Faster iteration on prompt building, schema validation, and response parsing.  
- ✅ Avoids duplicating test harness code in Cannabis-Compliance repo.  
- ✅ Single `.env` source of truth for both CLI and server.  
- ✅ Fail-fast error handling if `OPENAI_API_KEY` is missing.  
- 🔄 Future migration path: Move `handleAnalyzeAudit` into `auditAutomationService` in server, add `/compliance/analyzeAudit` route.  
- ⚠️ Requires ongoing discipline to keep sandbox code and SaaS code in sync.  

## Next Steps
- Add schema validation (e.g., Zod) to enforce response structure.  
- Extend support for batch log analysis.  
- Integrate audit analysis results into history database for querying.  
- Add backend endpoint to Cannabis-Compliance for production use.
