import { normalizeComplianceResponse } from "../commands/compliance/utils/normalizeComplianceResponse"
import { ComplianceAnalysisResponseSchema } from "../commands/compliance/schemas/complianceAnalysisResponse"

describe("normalizeComplianceResponse", () => {
  it("fills in missing optional fields with safe defaults", () => {
    const raw = {
      auditId: "12345",
      timestamp: "2025-09-17T12:00:00.000Z",
      analyzedBy: "AI",
      summary: "Sample summary",
      // ⚠️ missing issues, mappedGates, metadata
    }

    const normalized = normalizeComplianceResponse(raw)

    expect(normalized.issues).toEqual([])
    expect(normalized.mappedGates).toEqual([])
    expect(normalized.metadata).toEqual({})
  })

  it("preserves existing values", () => {
    const raw = {
      auditId: "12345",
      timestamp: "2025-09-17T12:00:00.000Z",
      analyzedBy: "AI",
      summary: "Sample summary",
      issues: [{ message: "Deviation detected", severity: "high" }],
      mappedGates: ["QA/QC"],
      metadata: { sourceFile: "audit.json" },
    }

    const normalized = normalizeComplianceResponse(raw)

    expect(normalized.issues).toHaveLength(1)
    expect(normalized.mappedGates).toContain("QA/QC")
    expect(normalized.metadata.sourceFile).toBe("audit.json")
  })

  it("produces valid schema output after normalization", () => {
    const raw = {
      auditId: "12345",
      timestamp: "2025-09-17T12:00:00.000Z",
      analyzedBy: "AI",
      summary: "Sample summary",
      // missing issues & mappedGates intentionally
    }

    const normalized = normalizeComplianceResponse(raw)
    const result = ComplianceAnalysisResponseSchema.safeParse(normalized)

    expect(result.success).toBe(true)
    expect(result.data.issues).toEqual([])
    expect(result.data.mappedGates).toEqual([])
  })
})
