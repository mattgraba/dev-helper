import { handleAnalyzeAudit } from "./analyzeAuditHandlers.js";

export default (compliance) => {
    compliance
    .command('analyze-audit')
    .alias('aa')
    .description('Analyze audit log files for compliance')
    .argument('<filePath>', 'Path to the audit log JSON file')
    .action(async (filePath) => {
      try {
        const result = await handleAnalyzeAudit(filePath);
        console.log("✅ Compliance Summary:");
        console.log(JSON.stringify(result, null, 2));
      } catch (err) {
        console.error("❌ Failed to analyze audit log:", err.message);
      }
    });
};