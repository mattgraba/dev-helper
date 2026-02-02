import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import getToken from '../utils/getToken.js';
import { scanFiles } from '../utils/fileScanner.js';
import handleCliError from '../utils/errorHandler.js';
import { apiEndpoint } from '../utils/apiConfig.js';

async function handleTerminalBasic({ goal, context }) {
  let spinner;
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    spinner = ora('Getting terminal commands...').start();

    const res = await axios.post(apiEndpoint('/terminal'), {
      goal,
      context,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    spinner.succeed('Terminal generation complete ✅');
    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);

  } catch (err) {
    handleCliError(spinner, err, 'Terminal command generation failed');
  }
}

async function handleTerminalWithContext({ goal, contextText }) {
  let spinner;
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const contextFiles = await scanFiles({ directory: '.' });

    spinner = ora('Getting terminal commands with context...').start();

    const res = await axios.post(apiEndpoint('/terminal'), {
      goal,
      context: contextText,
      contextFiles,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    spinner.succeed('Terminal generation with context complete ✅');
    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);

  } catch (err) {
    handleCliError(spinner, err, 'Terminal command generation failed');
  }
}

export {
  handleTerminalBasic,
  handleTerminalWithContext,
};
