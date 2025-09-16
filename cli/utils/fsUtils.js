// utils/fsUtils.js
import fs from 'fs';
import chalk from 'chalk';

function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(chalk.red(`❌ File not found: ${filePath}`));
    return false;
  }
  return true;
}

export { checkFileExists };