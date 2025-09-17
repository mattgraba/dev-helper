import { z } from "zod"

export const ComplianceIssueSchema = z.object({
    id: z.string().uuid().optional(),       // optional if AI doesn't always assign
    message: z.string(),                    // description of the compliance issue
    severity: z.enum(["low", "medium", "high", "critical"]),
    regulation: z.string().optional(),      // e.g., "OSHA 1910.1200" or "METRC"
    suggestion: z.string().optional(),      // AI-generated recommendation
})

export const ComplianceAnalysisResponseSchema = z.object({
    auditId: z.string(),                    // unique audit log ID
    timestamp: z.string().datetime(),       // ISO 8601 timestamp
    analyzedBy: z.string().default("AI"),   // "AI", "System", or user id
    summary: z.string(),                    // high-level summary of the analysis
    issues: z.array(ComplianceIssueSchema).nonempty(), // at least one issue
    mappedGates: z.array(z.string()).default([]),   // which compliance gate it maps to
    metadata: z
        .object({
            sourceFile: z.string().optional(),  // file or log analyzed
            tokensUsed: z.number().optional(),  // optional tracking
        })
        .optional(),
})

// Type inference (for TS users)
export type ComplianceAnalysisResponse = z.infer<typeof ComplianceAnalysisResponseSchema>
export type ComplianceIssue = z.infer<typeof ComplianceIssueSchema>