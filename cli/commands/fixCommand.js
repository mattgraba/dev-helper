const { handleFixBasic, handleFixWithContext } = require('./fixHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('fix')
    .alias('f')
    .description('Fix buggy code using AI-generated improvements')
    .usage('-f <file> -l <language> [--context] [--output <path>]')
    .requiredOption('-f, --file <path>', 'Path to the file containing the buggy code')
    .requiredOption('-l, --language <name>', 'Programming language (e.g., javascript, python)')
    .option('--context', 'Include surrounding project files for more accurate fixes')
    .option('--output <path>', 'Optional path to save the fixed output file')
    .showHelpAfterError(true)
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleFixBasic,
        handleWithContext: handleFixWithContext,
      });
    });
};
