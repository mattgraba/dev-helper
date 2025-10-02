# ADR-002: Interface Choice (CLI-First vs IDE Plugin)

## Status
Accepted

## Context
AI coding assistants like **Cursor** and **Copilot** integrate directly into IDEs, providing inline auto-completion and code suggestions. While this is convenient, it often enables "vibe-coding" — developers copy/paste suggestions without understanding, eroding critical thinking and fundamentals.

Dev Helper’s mission is different:
- **Empower intentional usage**
- **Promote critical thinking**
- **Augment fundamentals**
- **Resist vibe-coding**

The interface design should reinforce these principles rather than work against them.

## Decision
- Dev Helper will be **CLI-first**, with a complementary **web dashboard**.
- No IDE plugin integration will be prioritized during MVP or early SaaS stages.
- AI interactions will remain **explicit and intentional** via commands (`analyze`, `fix`, `generate`, etc.).

## Rationale
- **Explicit Engagement:** CLI commands require conscious invocation, preventing passive dependency on AI auto-complete.
- **Transparency:** Outputs are returned as structured responses, explanations, or history logs — not hidden inline changes.
- **Learning-Oriented:** Developers are encouraged to *understand* fixes and explanations, reinforcing fundamentals.
- **Portability:** CLI works across environments (local dev, servers, containers, CI/CD pipelines), not bound to a single IDE.

## Alternatives Considered
- **IDE Plugin (VSCode, JetBrains):**  
  Pros: Familiar UX, fast adoption.  
  Cons: Contradicts philosophy (auto-complete driven), increases risk of vibe-coding, harder to enforce intentional usage.

- **Hybrid Approach (CLI + IDE plugin):**  
  Possible in future, but risks diluting the core philosophy unless the IDE integration is designed with strict intentionality.

## Consequences
- **Short-term:** Differentiation from Cursor/Copilot; slower adoption among developers seeking auto-complete "shortcuts."  
- **Long-term:** Stronger brand identity as the *anti-vibe-coding assistant*. Builds credibility with serious engineers and teams who value fundamentals.  
- **Future Expansion:** IDE plugins are not ruled out, but if introduced, they must preserve the four pillars (intentional usage, critical thinking, fundamentals, anti-vibe-coding).

## Notes
This decision is a **philosophy lock-in**: Dev Helper is not "just another AI auto-complete tool."  
It’s a conscious engineering assistant designed to **grow engineers, not replace them**.
