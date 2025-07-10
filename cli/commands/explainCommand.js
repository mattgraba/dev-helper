const { handleExplainBasic, handleExplainWithContext } = require('./explainHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('explain')
    .alias('e')
    .description('Explain a code file line by line using AI')
    .usage('-f <file> -l <language> [--context]')
    .requiredOption('-f, --file <path>', 'Path to the code file to explain')
    .requiredOption('-l, --language <name>', 'Programming language')
    .option('--context', 'Include context from surrounding project files')
    .showHelpAfterError(true)
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleExplainBasic,
        handleWithContext: handleExplainWithContext,
      });
    });
};
