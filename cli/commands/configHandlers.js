import chalk from 'chalk';
import {
  getConfig,
  setConfigValue,
  removeConfigValue,
  getOpenAIKey,
  maskKey,
  CONFIG_FILE,
} from '../utils/configManager.js';

function handleSetKey(apiKey) {
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.trim()) {
    console.error(chalk.red('Please provide a valid API key.'));
    process.exit(1);
  }

  const trimmedKey = apiKey.trim();

  if (!trimmedKey.startsWith('sk-')) {
    console.warn(chalk.yellow('Warning: OpenAI API keys typically start with "sk-".'));
  }

  setConfigValue('openaiApiKey', trimmedKey);
  console.log(chalk.green('OpenAI API key saved successfully.'));
  console.log(chalk.dim(`Key: ${maskKey(trimmedKey)}`));
  console.log(chalk.dim(`Location: ${CONFIG_FILE}`));
  console.log(chalk.cyan('\nYou can now use dev-helper commands without logging in.'));
}

function handleRemoveKey() {
  const config = getConfig();
  if (!config.openaiApiKey) {
    console.log(chalk.yellow('No API key configured.'));
    return;
  }

  removeConfigValue('openaiApiKey');
  console.log(chalk.green('OpenAI API key removed.'));
  console.log(chalk.dim('You will need to login or set a new key to use AI commands.'));
}

function handleShowConfig() {
  const config = getConfig();
  const envKey = process.env.OPENAI_API_KEY;

  console.log(chalk.cyan('\ndev-helper Configuration\n'));

  // Token status
  if (config.token) {
    console.log(chalk.green('  Auth token: ') + chalk.dim('configured'));
  } else {
    console.log(chalk.yellow('  Auth token: ') + chalk.dim('not set'));
  }

  // API URL
  if (config.apiUrl) {
    console.log(chalk.green('  API URL: ') + config.apiUrl);
  } else {
    console.log(chalk.dim('  API URL: ') + chalk.dim('default (hosted service)'));
  }

  // OpenAI key status
  console.log('');
  if (envKey) {
    console.log(chalk.green('  OpenAI key: ') + maskKey(envKey) + chalk.dim(' (from OPENAI_API_KEY env var)'));
  } else if (config.openaiApiKey) {
    console.log(chalk.green('  OpenAI key: ') + maskKey(config.openaiApiKey) + chalk.dim(' (from config file)'));
  } else {
    console.log(chalk.yellow('  OpenAI key: ') + chalk.dim('not set'));
  }

  // Mode explanation
  console.log('');
  const localKey = getOpenAIKey();
  if (localKey) {
    console.log(chalk.green('  Mode: ') + 'BYOK (using your own OpenAI key)');
    console.log(chalk.dim('  AI commands will call OpenAI directly - no login required.'));
  } else if (config.token) {
    console.log(chalk.green('  Mode: ') + 'Hosted service (logged in)');
    console.log(chalk.dim('  AI commands will use the hosted server.'));
  } else {
    console.log(chalk.yellow('  Mode: ') + 'Not configured');
    console.log(chalk.dim('  Run "dev-helper config set-key <key>" or "dev-helper login" to get started.'));
  }

  console.log('');
  console.log(chalk.dim(`Config file: ${CONFIG_FILE}`));
}

export {
  handleSetKey,
  handleRemoveKey,
  handleShowConfig,
};
