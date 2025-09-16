# 🧩 Compliance Commands in Dev Helper

This document explains **why** compliance commands exist inside Dev Helper’s CLI and **how** they are used to test compliance automation before migrating into the Cannabis-Compliance SaaS.

---

## 📂 Purpose of the `compliance/` Folder
The `commands/compliance/` folder exists to **prototype and test compliance-specific AI workflows** inside the Dev Helper CLI before fully implementing them in the Cannabis Compliance SaaS platform.

- Keeps compliance logic separate from developer-focused commands (`analyze`, `explain`, `fix`, etc.)
- Allows rapid prototyping of prompts and handlers without spinning up the full SaaS
- Provides a consistent architecture so tested logic can be migrated later

---

## 🛠️ What’s Inside
- **`analyzeAuditCommand`**  
  CLI entrypoint for audit log analysis.  
  Accepts audit log data → builds a prompt → calls OpenAI → parses structured response.

- **`analyzeAuditHandlers`**  
  Request/response handlers for `analyzeAuditCommand`.  
  Handles:
  - Wrapping audit log data into prompts
  - Calling the OpenAI API
  - Parsing and validating AI responses into structured compliance outputs

---

## 🧪 Why Test Compliance Logic in Dev Helper First?

**Dev Helper already has the plumbing:**
- CLI command system (`commands/`)
- Prompt construction pattern (`analyze`, `explain`, etc.)
- OpenAI API integration + error handling
- History/logging layer with MongoDB

Because of this, we don’t need to reinvent a runner/test harness inside the cannabis-compliance repo just to validate `aiAutomationService`.

Instead, we **simulate the service call inside Dev Helper**, using compliance-specific commands.  

---

## 🔗 Workflow in Practice

### 1. Prototype in Dev Helper
Example command:

```bash
dev-helper compliance analyze-audit ./logs/sample.json
