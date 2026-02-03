import { handleSetKey, handleRemoveKey, handleShowConfig } from './configHandlers.js';

export default (program) => {
  const config = program
    .command('config')
    .description('Manage dev-helper configuration');

  config
    .command('set-key <api-key>')
    .description('Set your OpenAI API key for BYOK (Bring Your Own Key) mode')
    .action((apiKey) => {
      handleSetKey(apiKey);
    });

  config
    .command('remove-key')
    .description('Remove your stored OpenAI API key')
    .action(() => {
      handleRemoveKey();
    });

  config
    .command('show')
    .description('Show current configuration')
    .action(() => {
      handleShowConfig();
    });

  // Default action when just running `dev-helper config`
  config.action(() => {
    handleShowConfig();
  });
};
