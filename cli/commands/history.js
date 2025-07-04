const historyCommand = require('./historyCommand');

module.exports = (program) => {
  program
    .command('history')
    .description('Show saved AI response history')
    .action(historyCommand);
};
