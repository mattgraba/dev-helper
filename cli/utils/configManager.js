import fs from 'fs';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.dev-helper');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

function getConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveConfig(config) {
  ensureConfigDir();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
}

function setConfigValue(key, value) {
  const config = getConfig();
  config[key] = value;
  saveConfig(config);
}

function removeConfigValue(key) {
  const config = getConfig();
  delete config[key];
  saveConfig(config);
}

function getOpenAIKey() {
  // Environment variable takes precedence
  if (process.env.OPENAI_API_KEY) {
    return process.env.OPENAI_API_KEY;
  }
  // Fall back to config file
  const config = getConfig();
  return config.openaiApiKey || null;
}

function hasLocalKey() {
  return !!getOpenAIKey();
}

function maskKey(key) {
  if (!key || key.length < 8) return '****';
  return key.slice(0, 7) + '...' + key.slice(-4);
}

export {
  CONFIG_DIR,
  CONFIG_FILE,
  getConfig,
  saveConfig,
  setConfigValue,
  removeConfigValue,
  getOpenAIKey,
  hasLocalKey,
  maskKey,
};
