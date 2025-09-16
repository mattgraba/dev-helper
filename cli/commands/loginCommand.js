import handleLogin from './loginHandlers.js';

export default (program) => {
  program
    .command('login')
    .alias('l')
    .description('Authenticate with your user ID to enable secured commands')
    .usage('')
    .showHelpAfterError(true)
    .action(() => {
      handleLogin();
    });
};
