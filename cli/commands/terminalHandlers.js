import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import getToken from '../utils/getToken.js';
import { scanFiles } from '../utils/fileScanner.js';
import handleCliError from '../utils/errorHandler.js';
import { apiEndpoint } from '../utils/apiConfig.js';
import { hasLocalKey } from '../utils/configManager.js';
import { getTerminalCommands } from '../services/localOpenAI.js';

async function handleTerminalBasic({ goal, context }) {
  let spinner;
  try {
    let commands;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora('Getting terminal commands...').start();
      const result = await getTerminalCommands({ goal, context });
      commands = result.commands;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora('Getting terminal commands...').start();
      const res = await axios.post(apiEndpoint('/terminal'), {
        goal,
        context,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      commands = res.data.commands;
    }

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
    const contextFiles = await scanFiles({ directory: '.' });
    let commands;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora('Getting terminal commands with context...').start();
      const result = await getTerminalCommands({ goal, context: contextText, contextFiles });
      commands = result.commands;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora('Getting terminal commands with context...').start();
      const res = await axios.post(apiEndpoint('/terminal'), {
        goal,
        context: contextText,
        contextFiles,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      commands = res.data.commands;
    }

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
