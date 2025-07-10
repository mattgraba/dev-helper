const axios = require('axios');
const getToken = require('./getToken');

async function saveToHistory({ command, input, output }) {
  const token = getToken();
  if (!token) {
    console.error('⚠️ No token found. Skipping history save.');
    return;
  }

  try {
    await axios.post('http://localhost:3001/history', {
      command,
      input,
      output,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (err) {
    console.error('⚠️ Failed to save to history:', err.message);
  }
}

module.exports = saveToHistory;
