// utils/fileScanner.js

import fg from "fast-glob";
import fs from "fs";
import path from "path";
import ignore from "ignore";

/**
 * Reads and parses .gitignore from the provided directory
 */
function loadGitignore(directory) {
  const ig = ignore();
  const gitignorePath = path.join(directory, ".gitignore");

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    ig.add(gitignoreContent.split(/\r?\n/));
  }

  return ig;
}

/**
 * Scan project directory for relevant files
 * @param {Object} options
 * @param {string} options.directory - root directory to scan
 * @param {string[]} options.extensions - file extensions to include
 * @param {number} options.maxFileSizeKB - max file size to include
 * @param {string[]} options.exclude - folders to exclude
 * @returns {Promise<Array<{ path: string, content: string }>>}
 */
async function scanFiles({
  directory = ".",
  extensions = ["js", "ts", "json"],
  maxFileSizeKB = 20,
  exclude = ["node_modules", ".git", "dist", "build"]
}) {
  // Match all files with specified extensions
  const patterns = extensions.map((ext) => `**/*.${ext}`);
  const excludePatterns = exclude.map((dir) => `${dir}/**`);

  // Build ignore patterns like "node_modules/**"
  const gitignore = loadGitignore(directory);

  const entries = await fg(patterns, {
    cwd: directory,
    ignore: excludePatterns,
    dot: false,          // Ignore hidden files like .env, .vscode
    onlyFiles: true,
    absolute: true,      // Easier for fs.readFileSync
  });

  const results = [];

  for (const absolutePath of entries) {
    try {
      const relativePath = path.relative(directory, absolutePath);

      if (gitignore.ignores(relativePath)) continue;

      const stats = fs.statSync(absolutePath);
      const sizeKB = stats.size / 1024;

      if (sizeKB <= maxFileSizeKB) {
        const content = fs.readFileSync(absolutePath, "utf-8");
        results.push({ path: relativePath, content });
      }
    } catch (err) {
      console.warn(`Skipping file ${absolutePath}: ${err.message}`);
    }
  }

  return results;
}

export { scanFiles };
