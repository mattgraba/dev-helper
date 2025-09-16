// utils/errorHandler.js
import chalk from 'chalk';

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

export default handleCliError;
