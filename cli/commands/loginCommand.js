const login = require('./loginHandlers');

module.exports = (program) => {
  program
    .command('login')
    .description('Log in to dev-helper and store JWT token')
    .action(login);
};