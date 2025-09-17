import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { parseComplianceResponse } from "./utils/parseComplianceResponse.js";
import { normalizeComplianceResponse } from "./utils/normalizeComplianceResponse.js";

// lazy initialization of OpenAI client
let client = null;
function getOpenAIClient() {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return client;
}

/**
 * Reads an audit log file and sends it to OpenAI for analysis.
 * @param {string} filePath - Path to the audit log JSON file.
 * @returns {Promise<object>} structured compliance summary
 */
export async function handleAnalyzeAudit(filePath) {
  try {
    // 1. Load audit log JSON
    const absPath = path.resolve(process.cwd(), filePath);
    const fileContent = fs.readFileSync(absPath, "utf-8");
    const auditLog = JSON.parse(fileContent);

    // 2. Build the prompt
    const prompt = `
    You are an AI compliance assistant. Review the following audit log entry 
    and produce a structured compliance analysis. 

    ⚠️ Respond ONLY in strict JSON, matching this schema exactly:
    {
      "auditId": string,                        // unique audit log ID
      "timestamp": string,                      // ISO 8601 timestamp
      "analyzedBy": "AI",                       // literal value "AI"
      "summary": string,                        // plain-language overview
      "issues": [                               // detected deviations/issues
        {
          "id": string (uuid, optional),
          "message": string,                    // description of the issue
          "severity": "low"|"medium"|"high"|"critical" (optional),
          "regulation": string (optional),      // e.g. OSHA, METRC, etc.
          "suggestion": string (optional)       // AI-generated recommendation
        }
      ],
      "mappedGates": [string],                  // compliance gates like "QA/QC", "OSHA"
      "metadata": {                             // optional info
        "sourceFile": string (optional),
        "tokensUsed": number (optional)
      }
    }

    Audit Log Data:
    ${JSON.stringify(auditLog, null, 2)}
    `;

    // 3. Call OpenAI API
    const openaiClient = getOpenAIClient();
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content;

    // 4. Parse JSON safely
    let structured;
    try {
      structured = JSON.parse(raw);
    } catch (err) {
      throw new Error(`Failed to parse OpenAI response as JSON: ${raw}`);
    }

    // ✅ Normalize before validation (optional in prod)
    // ✅ Strict/resilient behavior depends on env flag
    const normalized = normalizeComplianceResponse(structured);

    // 5. Validate against schema
    const validated = parseComplianceResponse(structured);
    console.log("✅ Valid compliance response:", normalized )

    // 6. Return validated result (never expose raw response)
    return validated;

  } catch (err) {
    console.error("❌ Error in handleAnalyzeAudit:", err.message);
    throw err;
  }
}
