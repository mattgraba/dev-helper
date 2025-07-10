const { handleTerminalBasic, handleTerminalWithContext } = require('./terminalHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('terminal')
    .alias('t')
    .description('Get terminal commands to set up or debug your project')
    .usage('--goal <text> [--context-text <text>] [--context]')
    .requiredOption('-g, --goal <text>', 'Project goal or setup intention')
    .option('--context-text <text>', 'Optional plain text context (e.g. dependencies)')
    .option('--context', 'Include full file context from the project')
    .showHelpAfterError(true)
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleTerminalBasic,
        handleWithContext: handleTerminalWithContext,
      });
    });
};
