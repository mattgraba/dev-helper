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

async function handleAnalyzeBasic({ filePath, language }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');
    let explanation, fix;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Analyzing ${filePath}...`).start();
      const result = await analyzeCode({ errorText, language });
      explanation = result.explanation;
      fix = result.fix;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Analyzing ${filePath}...`).start();
      const res = await axios.post(apiEndpoint('/analyze'), {
        errorText,
        language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      explanation = res.data.explanation;
      fix = res.data.fix;
    }

    spinner.succeed('Analysis complete ✅');

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.blue('\n🔧 Suggested Fix:\n'), fix);

    await saveToHistory({
      command: 'analyze',
      input: errorText,
      output: `${explanation}\n\n${fix}`,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Analysis failed');
  }
}

async function handleAnalyzeWithContext({ filePath, language }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles({ directory: path.dirname(filePath) });
    let explanation, fix;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Analyzing ${filePath} with context...`).start();
      const result = await analyzeCode({ errorText, language, contextFiles });
      explanation = result.explanation;
      fix = result.fix;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Analyzing ${filePath} with context...`).start();
      const res = await axios.post(apiEndpoint('/analyze'), {
        errorText,
        language,
        contextFiles,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      explanation = res.data.explanation;
      fix = res.data.fix;
    }

    spinner.succeed('Contextual analysis complete ✅');

    console.log(chalk.green('\n🧠 Explanation:\n'), explanation);
    console.log(chalk.blue('\n🔧 Suggested Fix:\n'), fix);

    await saveToHistory({
      command: 'analyze',
      input: errorText,
      output: `${explanation}\n\n${fix}`,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Analysis failed');
  }
}

export {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
