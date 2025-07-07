// utils/fsUtils.js
const fs = require('fs');
const chalk = require('chalk');

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`❌ File not found: ${filePath}`));
    return false;
  }
  return true;
}

module.exports = { checkFileExists };