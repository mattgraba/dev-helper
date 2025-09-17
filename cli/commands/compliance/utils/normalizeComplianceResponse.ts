/**
 * Normalize raw AI JSON output before schema validation.
 * This ensures missing optional fields are filled with safe defaults,
 * reducing spurious validation failures in production.
 * 
 * Behavior depends on STRICT_VALIDATION env flag:
 * - STRICT_VALIDATION=true → returns raw untouched (fail fast)
 * - STRICT_VALIDATION=false → injects safe defaults (resilient)
 *
 * @param {any} raw - Raw object parsed from OpenAI response
 * @returns {any} normalized object ready for schema validation
 */
export function normalizeComplianceResponse(raw) {
    const strict = process.env.STRICT_VALIDATION === "true";

    if (strict) {
        // 🚨 Fail fast mode — don’t patch anything
        return raw;
    }

    // 🛡️ Resilient mode — fill gaps with safe defaults
    const normalized = { ...raw };
  
    // Default empty array for gates
    if (!Array.isArray(normalized.mappedGates)) {
      normalized.mappedGates = [];
    }
  
    // Default empty array for issues
    if (!Array.isArray(normalized.issues)) {
      normalized.issues = [];
    }
  
    // Metadata object with safe defaults
    if (!normalized.metadata || typeof normalized.metadata !== "object") {
      normalized.metadata = {};
    }
  
    return normalized;
  }
  