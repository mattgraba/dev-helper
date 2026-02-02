import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import handleCliError from '../utils/errorHandler.js';
import { apiEndpoint } from '../utils/apiConfig.js';

async function handleHistory() {
  let spinner;
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to view history.'));
      process.exit(1);
    }

    spinner = ora('Fetching your history...').start();

    const res = await axios.get(apiEndpoint('/history'), {
      headers: { Authorization: `Bearer ${token}` },
    });

    spinner.succeed('History retrieved ✅');

    const entries = res.data;

    if (!entries.length) {
      console.log(chalk.yellow('\n📭 No saved history found.\n'));
      return;
    }

    entries.forEach((entry, i) => {
      console.log(chalk.cyan(`\n📌 Entry ${i + 1}: [${entry.command}]`));
      console.log(chalk.gray(`> Input:\n${entry.input}`));
      console.log(chalk.green(`> Output:\n${entry.output}`));
    });

  } catch (err) {
    handleCliError(spinner, err, 'Failed to fetch history');
  }
}

export default handleHistory;
