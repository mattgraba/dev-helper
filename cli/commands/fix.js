const handleWithContext = require('../utils/contextHandlerWrapper');
const fixCommand = require('./fixCommand');

module.exports = (program) => {
  program
    .command('fix')
    .description('Fix or clean up a buggy code file')
    .requiredOption('-f, --file <filePath>', 'Path to the code file')
    .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
    .option('-o, --output <path>', 'Where to save the fixed code (defaults to overwrite)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: fixCommand.handleFixBasic,
        handleWithContext: fixCommand.handleFixWithContext,
      });
    });
};
