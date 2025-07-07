// utils/errorHandler.js
const chalk = require('chalk');

function handleCliError(spinner, err, fallbackMessage) {
  if (spinner && spinner.isSpinning) spinner.fail(fallbackMessage);

  if (err.response && err.response.data) {
    const serverMsg = err.response.data.message || JSON.stringify(err.response.data, null, 2);
    console.error(chalk.red('❌ Server error:\n'), serverMsg);
  } else if (err.message) {
    console.error(chalk.red('❌ Error:\n'), err.message);
  } else {
    console.error(chalk.red('❌ Unknown failure occurred.'));
  }
}

module.exports = handleCliError;
