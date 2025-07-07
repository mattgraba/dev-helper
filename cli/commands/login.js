// cli/commands/loginCommand.js
const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');
const axios = require('axios');
const ora = require('ora');
const handleCliError = require('../utils/errorHandler');

const CONFIG_DIR = path.join(os.homedir(), '.dev-helper');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

async function login() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const ask = (q) => new Promise((res) => rl.question(q, res));

  try {
    const userId = await ask('Enter your user ID: ');
    rl.close();

    const spinner = ora('Logging in...').start();

    const response = await axios.post('http://localhost:3000/auth/login', {
      userId,
    });

    const { token } = response.data;

    // Make sure config directory exists
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR);
    }

    // Save the token
    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ token }, null, 2));
    spinner.succeed('Login successful. Token saved.');
  } catch (err) {
    handleCliError(spinner, err, 'Login failed ❌');
    rl.close();
  }
}

module.exports = login;
