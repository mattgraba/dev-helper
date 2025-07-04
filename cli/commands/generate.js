const handleWithContext = require('../utils/contextHandlerWrapper');
const generateCommand = require('./generateCommand');

module.exports = (program) => {
  program
    .command('generate')
    .description('Generate code using your AI assistant')
    .requiredOption('-d, --description <text>', 'What you want to generate')
    .option('-l, --language <lang>', 'Language (default: JavaScript)', 'JavaScript')
    .option('-t, --fileType <type>', 'Type of file (e.g. React component)')
    .option('-o, --output <path>', 'Where to save the file (e.g. client/components/AgentCard.jsx)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: generateCommand.handleGenerateBasic,
        handleWithContext: generateCommand.handleGenerateWithContext,
      });
    });
};
