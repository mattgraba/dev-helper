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

async function handleFixBasic({ filePath, language, outputPath }) {
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

    const originalCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    spinner = ora(`Fixing ${filePath}...`).start();
    const res = await axios.post(apiEndpoint('/fix'), {
      codeSnippet: originalCode,
      language,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Fix complete ✅');

    const { fixedCode } = res.data;

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: originalCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Fix failed');
  }
}

async function handleFixWithContext({ filePath, language, outputPath }) {
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

    spinner = ora(`Fixing ${filePath} with context...`).start();
    const res = await axios.post(apiEndpoint('/fix'), {
      codeSnippet: mainCode,
      language,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Fix with context complete ✅');

    const { fixedCode } = res.data;

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: mainCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Fix failed');
  }
}

export {
  handleFixBasic,
  handleFixWithContext,
};
