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

async function handleAnalyzeBasic({ filePath, language }) {
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

    const spinner = ora(`Sending ${filePath} to /analyze...`).start();
    const res = await axios.post('http://localhost:3001/analyze', {
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
    handleCliError('analyze', err);
  }
}

async function handleAnalyzeWithContext({ filePath, language }) {
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
    const contextFiles = await scanFiles(path.dirname(filePath), filePath);

    const spinner = ora(`Sending ${filePath} with context to /analyze...`).start();
    const res = await axios.post('http://localhost:3001/analyze', {
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
    handleCliError('analyze', err);
  }
}

export {
  handleAnalyzeBasic,
  handleAnalyzeWithContext,
};
