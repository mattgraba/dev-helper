const handleWithContext = require('../utils/contextHandlerWrapper');
const explainCommand = require('./explainCommand');

module.exports = (program) => {
  program
    .command('explain')
    .description('Explain a code file line-by-line')
    .requiredOption('-f, --file <filePath>', 'Path to the code file')
    .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: explainCommand.handleExplainBasic,
        handleWithContext: explainCommand.handleExplainWithContext,
      });
    });
};
