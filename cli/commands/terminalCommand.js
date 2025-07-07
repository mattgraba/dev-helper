const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');

async function handleTerminalBasic({ goal, context }) {
  try {

    const spinner = ora('Sending request to /terminal...').start();

    const res = await axios.post('http://localhost:3001/terminal', {
      goal,
      context,
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);
    spinner.succeed('Terminal command generation complete ✅');
  } catch (err) {
    if (err.response && err.response.data) {
      console.error(chalk.red('Error from server:'), err.response.data.message);
    } else {
      console.error(chalk.red('Unexpected error:'), err.message);
    }
    spinner.fail('Failed to generate terminal commands ❌');
  }
}

async function handleTerminalWithContext({ goal, context }) {
  try {
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const spinner = ora('Sending contextual request to /terminal...').start();

    const res = await axios.post('http://localhost:3001/terminal', {
      goal,
      context,
      contextFiles,
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    console.log(chalk.green('\n💻 Suggested terminal commands with project context:\n'));
    console.log(commands);
    spinner.succeed('Contextual terminal command generation complete ✅');
  } catch (err) {
    if (err.response && err.response.data) {
      console.error(chalk.red('Error from server:'), err.response.data.message);
    } else {
      console.error(chalk.red('Unexpected error:'), err.message);
    }
    spinner.fail('Failed to generate terminal commands with context ❌');
  }
}

module.exports = {
  handleTerminalBasic,
  handleTerminalWithContext,
};
