const chalk = require('chalk');

function handleCliError(spinner, err, fallbackMessage) {
  if (err.response && err.response.data) {
    console.error(chalk.red('Error from server:'), err.response.data.message);
  } else {
    console.error(chalk.red('Unexpected error:'), err.message);
  }

  spinner.fail(fallbackMessage);
}

module.exports = handleCliError;