const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');

async function handleGenerateBasic({ description, language, fileType, output }) {
  try {

    const spinner = ora('Sending request to /generate...').start();

    const res = await axios.post('http://localhost:3001/generate', {
      description,
      language,
      fileType,
    });

    let { result } = res.data;
    if (!result) throw new Error('No result from AI.');

    result = result.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    if (output) {
      const outPath = path.resolve(output);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, result);
      console.log(chalk.green(`✅ Code saved to ${output}`));
    } else {
      console.log(chalk.yellow('\nNo output path provided. Here is the code:\n'));
      console.log(result);
    }
    spinner.succeed('Generation complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate code ❌');
  }
}

async function handleGenerateWithContext({ description, language, fileType, output }) {
  try {
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`❌ File not found: ${filePath}`));
      return;
    }
    
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const spinner = ora('Sending contextual request to /generate...').start();

    const res = await axios.post('http://localhost:3001/generate', {
      description,
      language,
      fileType,
      contextFiles,
    });

    let { result } = res.data;
    if (!result) throw new Error('No result from AI.');

    result = result.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    if (output) {
      const outPath = path.resolve(output);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, result);
      console.log(chalk.green(`✅ Code saved to ${output}`));
    } else {
      console.log(chalk.yellow('\nNo output path provided. Here is the code:\n'));
      console.log(result);
    }
    spinner.succeed('Contextual generation complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to generate code with context ❌');
  }
}

module.exports = {
  handleGenerateBasic,
  handleGenerateWithContext,
};
