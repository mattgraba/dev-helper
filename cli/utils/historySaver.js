import axios from 'axios';
import getToken from './getToken.js';
import { jwtDecode } from 'jwt-decode';

async function saveToHistory({ command, input, output }) {
  try {
    const token = getToken();
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    if (!command) {
        console.warn('⚠️ Warning: No command passed to saveToHistory');
      }

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

export default saveToHistory;

