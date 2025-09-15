import { analyzeAuditCommand } from "./commands/analyzeAudit.js";

module.exports = (program) => {
    program
    .command("analyze-audit <logFile>")
    .description("Analyze a single audit log entry with AI enrichment")
    .action((logFile) => {
        analyzeAuditCommand(logFile);
    });
};
