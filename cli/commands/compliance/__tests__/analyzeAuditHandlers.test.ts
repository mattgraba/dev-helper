import { vi, describe, it, expect } from "vitest"
import * as handler from "../commands/compliance/analyzeAuditHandlers"
import { normalizeComplianceResponse } from "../commands/compliance/utils/normalizeComplianceResponse"
import { ComplianceAnalysisResponseSchema } from "../commands/compliance/schemas/complianceAnalysisResponse"

// Mock OpenAI client to avoid real API calls
vi.mock("openai", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  // ⚠️ Malformed response: missing mappedGates, metadata
                  content: JSON.stringify({
                    auditId: "12345",
                    timestamp: "2025-09-17T12:00:00.000Z",
                    analyzedBy: "AI",
                    summary: "Audit log reviewed",
                    issues: [{ message: "Deviation detected", severity: "high" }]
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  }
})

describe("handleAnalyzeAudit", () => {
  it("returns normalized + validated response even with missing fields", async () => {
    // Stub file reading
    vi.spyOn(handler, "handleAnalyzeAudit")

    const result = await handler.handleAnalyzeAudit("./fake.json")

    // Should include required fields
    expect(result.auditId).toBe("12345")
    expect(result.summary).toBe("Audit log reviewed")

    // Should normalize missing fields
    expect(result.mappedGates).toEqual([])
    expect(result.metadata).toEqual({})

    // Should validate with schema
    const validation = ComplianceAnalysisResponseSchema.safeParse(result)
    expect(validation.success).toBe(true)
  })
})
