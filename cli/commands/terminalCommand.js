const handleWithContext = require('../utils/contextHandlerWrapper');
const terminalCommand = require('./terminalCommand');

module.exports = (program) => {
  program
    .command('terminal')
    .description('Generate terminal setup commands based on a goal')
    .requiredOption('-g, --goal <text>', 'Project goal or setup intention')
    .option('--context-text <text>', 'Optional string context like installed dependencies')
    .option('--context', 'Include full project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: terminalCommand.handleTerminalBasic,
        handleWithContext: terminalCommand.handleTerminalWithContext,
      });
    });
};
