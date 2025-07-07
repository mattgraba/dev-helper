const handleWithContext = require('../utils/contextHandlerWrapper');
const {
  handleTerminalBasic,
  handleTerminalWithContext,
} = require('./terminalHandlers');

module.exports = (program) => {
  program
    .command('terminal')
    .description('Generate terminal setup commands based on a goal')
    .requiredOption('-g, --goal <text>', 'Project goal or setup intention')
    .option('--context', 'Include full project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleTerminalBasic,
        handleWithContext: handleTerminalWithContext,
      });
    });
};