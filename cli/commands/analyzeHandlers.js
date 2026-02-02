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

async function handleAnalyzeBasic({ filePath, language }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');

    spinner = ora(`Analyzing ${filePath}...`).start();
    const res = await axios.post(apiEndpoint('/analyze'), {
      errorText,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Analysis complete ✅');

    const { explanation, fix } = res.data;
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

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const errorText = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles({ directory: path.dirname(filePath) });

    spinner = ora(`Analyzing ${filePath} with context...`).start();
    const res = await axios.post(apiEndpoint('/analyze'), {
      errorText,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Contextual analysis complete ✅');

    const { explanation, fix } = res.data;
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
