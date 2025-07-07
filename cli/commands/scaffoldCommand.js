const handleWithContext = require('../utils/contextHandlerWrapper');
const scaffoldCommand = require('./scaffoldCommand');

module.exports = (program) => {
  program
    .command('scaffold')
    .description('Scaffold a new component using AI')
    .requiredOption('-n, --name <ComponentName>', 'Name of the component to scaffold')
    .option('-o, --output <path>', 'Output path (e.g. client/components/AgentCard.jsx)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: scaffoldCommand.handleScaffoldBasic,
        handleWithContext: scaffoldCommand.handleScaffoldWithContext,
      });
    });
};
