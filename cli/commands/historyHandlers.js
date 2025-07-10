const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const getToken = require('../utils/getToken');
const handleCliError = require('../utils/errorHandler');

async function handleHistory({ userId }) {
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to view history.'));
      process.exit(1);
    }

    const spinner = ora('Fetching your history from /history...').start();

    const res = await axios.get('http://localhost:3001/history', {
      headers: { Authorization: `Bearer ${token}` },
      params: userId ? { userId } : {},
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
    handleCliError('history', err);
  }
}

module.exports = handleHistory;
