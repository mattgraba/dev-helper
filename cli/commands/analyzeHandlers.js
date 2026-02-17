import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import { checkFileExists } from '../utils/fsUtils.js';
import { scanFiles } from '../utils/fileScanner.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';
import { apiEndpoint } from '../utils/apiConfig.js';
import { hasLocalKey } from '../utils/configManager.js';
import { analyzeCode } from '../services/localOpenAI.js';
import { renderAnalysisBox, parseAnalysisJSON } from '../utils/formatBox.js';

/**
 * Runs the analyze flow: read file, call AI, render boxed result.
 */
async function runAnalyze({ filePath, language, contextFiles = null }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    spinner = ora(`Reading ${filePath}...`).start();
    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');
    spinner.succeed(`Reading ${filePath}...`);

    let rawResponse;

    if (hasLocalKey()) {
      spinner = ora('Processing with OpenAI...').start();
      const result = await analyzeCode({ errorText, language, contextFiles: contextFiles || [] });
      rawResponse = result.raw;
      spinner.succeed('Processing with OpenAI...');
    } else {
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora('Sending to /api/analyze...').start();
      const res = await axios.post(apiEndpoint('/analyze'), {
        errorText,
        language,
        contextFiles: contextFiles || [],
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      spinner.succeed('Sending to /api/analyze...');

      // Server may return structured or legacy format
      if (res.data.issues) {
        rawResponse = JSON.stringify(res.data);
      } else {
        rawResponse = JSON.stringify({
          issues: [{ line: null, title: 'Analysis', detail: res.data.explanation || '' }],
          suggestion: res.data.fix || '',
        });
      }
    }

    console.log('');

    const parsed = parseAnalysisJSON(rawResponse);
    renderAnalysisBox({ filePath, ...parsed });

    console.log('');

    await saveToHistory({
      command: 'analyze',
      input: errorText,
      output: rawResponse,
    });
    console.log(chalk.green('  ✓ Response saved to history'));
    console.log(chalk.green('  ✓ Analysis complete'));

  } catch (err) {
    handleCliError(spinner, err, 'Analysis failed');
  }
}

async function handleAnalyzeBasic({ filePath, language }) {
  await runAnalyze({ filePath, language });
}

async function handleAnalyzeWithContext({ filePath, language }) {
  const contextFiles = await scanFiles({ directory: path.dirname(path.resolve(filePath)) });
  await runAnalyze({ filePath, language, contextFiles });
}

export {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
