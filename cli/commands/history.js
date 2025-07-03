// cli/commands/history.js
const axios = require('axios');
const getToken = require('../utils/getToken');
const historyCommand = require('./historyCommand');

module.exports = (program) => {
  program
    .command('history')
    .description('Show saved AI response history')
    .action(historyCommand);
};

async function showHistory() {
  const token = getToken();

  if (!token) {
    console.error('❌ You are not logged in. Please run `dev-helper login`.');
    return;
  }

  try {
    const response = await axios.get('http://localhost:3000/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const history = response.data.history;

    if (!history.length) {
      console.log('📭 No history found.');
      return;
    }

    console.log(`📜 Showing ${history.length} saved responses:\n`);
    history.forEach((entry, index) => {
      console.log(`--- Entry ${index + 1} ---`);
      console.log(`🕒 ${entry.createdAt}`);
      console.log(`🧠 Prompt: ${entry.prompt}`);
      console.log(`🤖 Response: ${entry.response}`);
      console.log();
    });
  } catch (err) {
    console.error('❌ Failed to fetch history:', err.response?.data || err.message);
  }
}

module.exports = showHistory;
