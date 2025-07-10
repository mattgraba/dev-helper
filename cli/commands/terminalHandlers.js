const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const getToken = require('../utils/getToken');

async function handleTerminalBasic({ goal, context }) {
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const spinner = ora('Sending request to /terminal...').start();

    const res = await axios.post('http://localhost:3001/terminal', {
      goal,
      context,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    let { commands } = res.data;
    if (!commands) throw new Error('No terminal commands returned from /terminal');

    commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    spinner.succeed('Terminal generation complete ✅');
    console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
    console.log(commands);

  } catch (err) {
    console.error('❌ Server error:\n', err.response?.data || err.message);
  }
}

module.exports = {
  handleTerminalBasic,
};
