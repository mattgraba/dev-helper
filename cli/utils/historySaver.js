const axios = require('axios');
const getToken = require('./getToken');
const jwtDecode = require('jwt-decode');

async function saveToHistory({ command, input, output }) {
  try {
    const token = getToken();
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    await axios.post('http://localhost:3001/history', {
      userId,
      command,
      input,
      output,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('⚠️ Failed to save to history:', err.message);
  }
}

module.exports = saveToHistory;

