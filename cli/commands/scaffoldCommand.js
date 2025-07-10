const { handleScaffoldBasic } = require('./scaffoldHandlers');

module.exports = (program) => {
  program
    .command('scaffold')
    .alias('s')
    .description('Scaffold a basic project component or template')
    .usage('-n <name> [--output <path>]')
    .requiredOption('-n, --name <text>', 'Name of the component or feature')
    .option('--output <path>', 'Optional file path to save scaffolded output')
    .showHelpAfterError(true)
    .action((options) => {
      handleScaffoldBasic(options);
    });
};

