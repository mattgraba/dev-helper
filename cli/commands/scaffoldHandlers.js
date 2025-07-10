const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');

const getToken = require('../utils/getToken');
const { checkFileExists } = require('../utils/fsUtils');
const handleCliError = require('../utils/errorHandler');
const saveToHistory = require('../utils/historySaver');

async function handleScaffoldBasic({ name, outputPath }) {
  try {
    const token = getToken();
    if (!token) {
      console.error(chalk.red('❌ You must be logged in to use this command.'));
      process.exit(1);
    }

    const spinner = ora(`Sending request to /scaffold for ${name}...`).start();

    const res = await axios.post('http://localhost:3001/scaffold', {
      name,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    spinner.succeed('Scaffold complete ✅');

    const { scaffoldCode } = res.data;

    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, scaffoldCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${fullPath}`));
    } else {
      console.log(chalk.green('\n🧱 Scaffolded Code:\n'), scaffoldCode);
    }

    await saveToHistory({
      command: 'scaffold',
      input: name,
      output: scaffoldCode,
    });

  } catch (err) {
    handleCliError('scaffold', err);
  }
}

module.exports = {
  handleScaffoldBasic,
};

