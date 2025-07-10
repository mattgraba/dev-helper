const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const handleCliError = require('../utils/errorHandler');

const CONFIG_DIR = path.join(os.homedir(), '.dev-helper');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

async function handleLogin() {
  try {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const userId = await new Promise(resolve =>
      rl.question(chalk.cyan('Enter your user ID: '), answer => {
        rl.close();
        resolve(answer.trim());
      })
    );

    const spinner = ora('Logging in...').start();

    const res = await axios.post('http://localhost:3001/auth/login', { userId });
    const { token } = res.data;

    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR);
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ token }, null, 2), 'utf-8');
    spinner.succeed('Login successful. Token saved ✅');
  } catch (err) {
    handleCliError('login', err);
  }
}

module.exports = handleLogin;
