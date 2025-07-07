// cli/commands/history.js
const axios = require('axios');
const getToken = require('../utils/getToken');
const ora = require('ora');
const handleCliError = require('../utils/errorHandler');

module.exports = async function showHistory() {
  const token = getToken();

  if (!token) {
    console.error('❌ You are not logged in. Please run `dev-helper login`.');
    return;
  }

  const spinner = ora('Fetching history from /history...').start();

  try {
    const response = await axios.get('http://localhost:3001/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const history = response.data.history;

    if (!history.length) {
      spinner.stop();
      console.log('📭 No history found.');
      return;
    }

    spinner.succeed(`📜 Showing ${history.length} saved responses:\n`);
    history.forEach((entry, index) => {
      console.log(`--- Entry ${index + 1} ---`);
      console.log(`🕒 ${entry.createdAt}`);
      console.log(`🧠 Prompt: ${entry.prompt}`);
      console.log(`🤖 Response: ${entry.response}`);
      console.log();
    });
  } catch (err) {
    handleCliError(spinner, err, 'Failed to fetch history ❌');
  }
};

