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

async function handleExplainBasic({ filePath, language }) {
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

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    spinner = ora(`Explaining ${filePath}...`).start();
    const res = await axios.post(apiEndpoint('/explain'), {
      codeSnippet: mainCode,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Explanation complete ✅');

    const { explanation } = res.data;
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

    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles({ directory: path.dirname(filePath) });

    spinner = ora(`Explaining ${filePath} with context...`).start();
    const res = await axios.post(apiEndpoint('/explain'), {
      codeSnippet: mainCode,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Contextual explanation complete ✅');

    const { explanation } = res.data;
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
