const handleHistory = require('./historyHandlers');

module.exports = (program) => {
  program
    .command('history')
    .alias('h')
    .description('View your saved command output history')
    .usage('[--userId <id>]')
    .option('--userId <id>', 'Optional user ID filter for history')
    .showHelpAfterError(true)
    .action((options) => {
      handleHistory(options);
    });
};
