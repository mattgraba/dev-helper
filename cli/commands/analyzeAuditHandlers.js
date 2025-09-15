import axios from "axios";
import ora from "ora";
import { handleCliError } from "../utils/handleCliError.js";

export async function analyzeAuditCommand(logFile) {
  const spinner = ora("Analyzing audit log with AI...").start();

  try {
    // Read log JSON from file or stdin
    let log;
    if (logFile) {
      log = JSON.parse(await fs.promises.readFile(logFile, "utf-8"));
    } else {
      throw new Error("Missing path to audit log JSON file.");
    }

    const res = await axios.post("http://localhost:3001/audit-automation/analyze", { log });

    spinner.succeed("Analysis complete!");
    console.log(JSON.stringify(res.data.enriched, null, 2));
  } catch (err) {
    spinner.fail("Failed to analyze audit log");
    handleCliError(err);
  }
}
