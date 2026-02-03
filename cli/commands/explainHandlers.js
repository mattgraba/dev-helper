import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import { scanFiles } from '../utils/fileScanner.js';
import { checkFileExists } from '../utils/fsUtils.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';
import { apiEndpoint } from '../utils/apiConfig.js';
import { hasLocalKey } from '../utils/configManager.js';
import { explainCode } from '../services/localOpenAI.js';

async function handleExplainBasic({ filePath, language }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    let explanation;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Explaining ${filePath}...`).start();
      const result = await explainCode({ codeSnippet: mainCode, language });
      explanation = result.explanation;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Explaining ${filePath}...`).start();
      const res = await axios.post(apiEndpoint('/explain'), {
        codeSnippet: mainCode,
        language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      explanation = res.data.explanation;
    }

    spinner.succeed('Explanation complete ✅');

    console.log(chalk.green('\n📖 Explanation:\n'), explanation);

    await saveToHistory({
      command: 'explain',
      input: mainCode,
      output: explanation,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Explanation failed');
  }
}

async function handleExplainWithContext({ filePath, language }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles({ directory: path.dirname(filePath) });
    let explanation;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Explaining ${filePath} with context...`).start();
      const result = await explainCode({ codeSnippet: mainCode, language, contextFiles });
      explanation = result.explanation;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Explaining ${filePath} with context...`).start();
      const res = await axios.post(apiEndpoint('/explain'), {
        codeSnippet: mainCode,
        language,
        contextFiles,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      explanation = res.data.explanation;
    }

    spinner.succeed('Contextual explanation complete ✅');

    console.log(chalk.green('\n📖 Explanation:\n'), explanation);

    await saveToHistory({
      command: 'explain',
      input: mainCode,
      output: explanation,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Explanation failed');
  }
}

export {
  handleExplainBasic,
  handleExplainWithContext,
};
