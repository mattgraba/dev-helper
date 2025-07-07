const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora').default;
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');

async function handleTerminalBasic({ goal }) {
  const spinner = ora('Sending request to /terminal...').start();
  try {
    const res = await axios.post('http://localhost:3001/terminal', { goal });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);
    spinner.succeed('Terminal command generation complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate terminal commands ❌');
  }
}

async function handleTerminalWithContext({ goal }) {
  const spinner = ora('Sending contextual request to /terminal...').start();
  try {
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const res = await axios.post('http://localhost:3001/terminal', {
      goal,
      contextFiles,
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    console.log(chalk.green('\n💻 Suggested terminal commands with project context:\n'));
    console.log(commands);
    spinner.succeed('Contextual terminal command generation complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate terminal commands with context ❌');
  }
}

module.exports = {
  handleTerminalBasic,
  handleTerminalWithContext,
};
