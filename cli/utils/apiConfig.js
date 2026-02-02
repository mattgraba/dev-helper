// cli/utils/apiConfig.js
import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_FILE = path.join(os.homedir(), '.dev-helper', 'config.json');

// Default to production API, fallback to localhost for development
const DEFAULT_API_URL = 'https://dev-helper-api.onrender.com';

/**
 * Get the API base URL from config or environment
 */
function getApiUrl() {
  // Environment variable takes precedence
  if (process.env.DEV_HELPER_API_URL) {
    return process.env.DEV_HELPER_API_URL;
  }

  // Check config file for custom API URL
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
      if (config.apiUrl) {
        return config.apiUrl;
      }
    }
  } catch {
    // Ignore config read errors
  }

  return DEFAULT_API_URL;
}

/**
 * Build full API endpoint URL
 */
function apiEndpoint(path) {
  const baseUrl = getApiUrl().replace(/\/$/, ''); // Remove trailing slash
  return `${baseUrl}${path}`;
}

export { getApiUrl, apiEndpoint };
