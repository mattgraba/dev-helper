// cli/commands/login.js
const loginCommand = require('./loginCommand');

module.exports = (program) => {
  program
    .command('login')
    .description('Log in to dev-helper and store JWT token')
    .action(loginCommand);
};
