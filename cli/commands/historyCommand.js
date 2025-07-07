const { showHistory } = require('./historyHandlers');

module.exports = (program) => {
  program
    .command('history')
    .description('Show saved AI response history')
    .action(showHistory);
};
