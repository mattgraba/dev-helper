import { ComplianceAnalysisResponseSchema, ComplianceAnalysisResponse } from "../schemas/complianceAnalysisResponse"

export function parseComplianceResponse(raw: unknown): ComplianceAnalysisResponse {
    const result = ComplianceAnalysisResponseSchema.safeParse(raw)

    if (!result.success) {
        console.error("❌ Invalid compliance response:", result.error.format())
        throw new Error("Compliance analysis response failed schema validation")
    }

    return result.data
}