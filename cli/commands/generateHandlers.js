import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import { checkFileExists } from '../utils/fsUtils.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';

async function handleGenerateBasic({ description, outputPath }) {
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const spinner = ora('Sending request to /generate...').start();
    const res = await axios.post('http://localhost:3001/generate', {
      description,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Generation complete ✅');

    const { generatedCode } = res.data;

    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, generatedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${fullPath}`));
    } else {
      console.log(chalk.green('\n🧠 Generated Code:\n'), generatedCode);
    }

    await saveToHistory({
      command: 'generate',
      input: description,
      output: generatedCode,
    });

  } catch (err) {
    handleCliError('generate', err);
  }
}

export {
  handleGenerateBasic,
};

