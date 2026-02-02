import axios from 'axios';
import getToken from './getToken.js';
import { jwtDecode } from 'jwt-decode';
import { apiEndpoint } from './apiConfig.js';

async function saveToHistory({ command, input, output }) {
  try {
    const token = getToken();
    if (!token) return;

    const decoded = jwtDecode(token);
    const userId = decoded.id;

    if (!command) {
      console.warn('⚠️ Warning: No command passed to saveToHistory');
    }

    await axios.post(apiEndpoint('/history'), {
      userId,
      command,
      input,
      output,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch {
    // Silently fail - history saving shouldn't break the main command
  }
}

export default saveToHistory;
