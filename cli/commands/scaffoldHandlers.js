import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import { checkFileExists } from '../utils/fsUtils.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';

async function handleScaffoldBasic({ name, outputPath }) {
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const spinner = ora(`Sending request to /scaffold for ${name}...`).start();

    const res = await axios.post('http://localhost:3001/scaffold', {
      name,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Scaffold complete ✅');

    const { scaffoldCode } = res.data;

    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, scaffoldCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${fullPath}`));
    } else {
      console.log(chalk.green('\n🧱 Scaffolded Code:\n'), scaffoldCode);
    }

    await saveToHistory({
      command: 'scaffold',
      input: name,
      output: scaffoldCode,
    });

  } catch (err) {
    handleCliError('scaffold', err);
  }
}

export {
  handleScaffoldBasic,
};

