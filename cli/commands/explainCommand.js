const { handleExplainBasic, handleExplainWithContext } = require('./explainHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('explain')
    .description('Explain a code file with optional project context')
    .option('--context', 'Include project context')
    .requiredOption('--filePath <filePath>', 'Path to the main file')
    .option('--language <language>', 'Programming language')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleExplainBasic,
        handleWithContext: handleExplainWithContext,
      });
    });
};
