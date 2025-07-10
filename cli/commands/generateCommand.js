const { handleGenerateBasic } = require('./generateHandlers');

module.exports = (program) => {
  program
    .command('generate')
    .alias('g')
    .description('Generate code from an AI-assisted text prompt')
    .usage('-d <description> [--output <path>] [--name <value>] [--template <value>]')
    .requiredOption('-d, --description <text>', 'Natural language description of the desired code')
    .option('--output <path>', 'Optional path to save generated code')
    .option('--name <value>', 'Optional name for generated component (if applicable)')
    .option('--template <value>', 'Optional template or structure type')
    .showHelpAfterError(true)
    .action((options) => {
      handleGenerateBasic(options);
    });
};
