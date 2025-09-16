import { handleAnalyzeBasic, handleAnalyzeWithContext } from './analyzeHandlers.js';
import handleWithContext from '../utils/contextHandlerWrapper.js';

export default (program) => {
  program
    .command('analyze')
    .alias('a')
    .description('Analyze code errors and receive an AI explanation and fix')
    .usage('-f <file> -l <language> [--context]')
    .requiredOption('-f, --file <path>', 'Path to code file with an error')
    .requiredOption('-l, --language <name>', 'Programming language')
    .option('--context', 'Include context from surrounding project files')
    .showHelpAfterError(true)
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleAnalyzeBasic,
        handleWithContext: handleAnalyzeWithContext,
      });
    });
};
