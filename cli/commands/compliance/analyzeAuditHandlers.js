import fs from "fs";
import path from "path";
import OpenAI from "openai";

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
      You are an AI compliance assistant. Summarize the following audit log entry 
      for a regulator. Include:
      - A plain-language summary
      - Any detected deviations
      - Which compliance gates it maps to
      
      Respond in strict JSON with keys: summary, deviations, mappedGates.

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

    // 5. Return structured response
    return structured;
  } catch (err) {
    console.error("❌ Error in handleAnalyzeAudit:", err.message);
    throw err;
  }
}
