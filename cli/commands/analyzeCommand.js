const { handleAnalyzeBasic, handleAnalyzeWithContext } = require('./analyzeHandlers');
const handleWithContext = require('../utils/contextHandlerWrapper');

module.exports = (program) => {
  program
    .command('analyze')
    .description('Analyze a buggy code file and receive an explanation and suggested fix')
    .option('--context', 'Include project context')
    .requiredOption('--filePath <filePath>', 'Path to the main file to analyze')
    .option('--language <language>', 'Programming language')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleAnalyzeBasic,
        handleWithContext: handleAnalyzeWithContext,
      });
    });
};
