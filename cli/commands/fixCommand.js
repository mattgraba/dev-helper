const { handleFixBasic, handleFixWithContext } = require('./fixHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('fix')
    .description('Fix or clean up a buggy code file')
    .requiredOption('-f, --filePath <filePath>', 'Path to the code file')
    .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
    .option('-o, --output <path>', 'Where to save the fixed code (defaults to overwrite)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleFixBasic,
        handleWithContext: handleFixWithContext,
      });
    });
};
