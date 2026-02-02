import fs from 'fs';
import path from 'path';
import os from 'os';
import readline from 'readline';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';
import handleCliError from '../utils/errorHandler.js';
import { apiEndpoint } from '../utils/apiConfig.js';

const CONFIG_DIR = path.join(os.homedir(), '.dev-helper');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

async function handleLogin() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let spinner;
  try {
    console.log(chalk.cyan('\n🔐 Dev Helper Login\n'));

    const username = await new Promise(resolve =>
      rl.question(chalk.white('Username: '), answer => resolve(answer.trim()))
    );

    const password = await new Promise(resolve =>
      rl.question(chalk.white('Password: '), answer => resolve(answer.trim()))
    );

    rl.close();

    if (!username || !password) {
      console.error(chalk.red('❌ Username and password are required.'));
      process.exit(1);
    }

    spinner = ora('Logging in...').start();

    const res = await axios.post(apiEndpoint('/auth/login'), { username, password });
    const { token } = res.data;

    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }

    // Save token (and preserve any existing apiUrl setting)
    let config = {};
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      }
    } catch {
      // Ignore parse errors
    }
    config.token = token;

    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    spinner.succeed(chalk.green('Login successful! Token saved.'));
  } catch (err) {
    if (spinner) {
      handleCliError(spinner, err, 'Login failed');
    } else {
      console.error(chalk.red('❌ Error:'), err.response?.data?.error || err.message);
    }
    rl.close();
  }
}

export default handleLogin;
