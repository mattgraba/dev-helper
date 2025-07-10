const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');

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

    spinner.succeed('Terminal setup complete ✅');

    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);
  } catch (err) {
    handleCliError('terminal', err);
  }
}

async function handleTerminalWithContext({ goal, contextText, filePath }) {
  try {
    const spinner = ora('Sending context to /terminal...').start();

    const contextFiles = await scanFiles(process.cwd(), filePath);

    const res = await axios.post('http://localhost:3001/terminal', {
      goal,
      context: contextText || contextFiles,
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    spinner.succeed('Terminal setup (with context) complete ✅');

    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);
  } catch (err) {
    handleCliError('terminal', err);
  }
}

module.exports = {
  handleTerminalBasic,
  handleTerminalWithContext,
};
