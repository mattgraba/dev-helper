const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');

async function handleFixBasic({ file: filePath, language, output }) {
  try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const spinner = ora(`Sending ${filePath} to /fix...`).start();

    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: code,
      language,
    });

    let { fixedCode } = res.data;
    if (!fixedCode) throw new Error('No code returned from /fix.');

    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : path.resolve(filePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
    spinner.succeed('Fix complete ✅');
  } catch (err) {
    if (err.response && err.response.data) {
      console.error(chalk.red('Error from server:'), err.response.data.message);
    } else {
      console.error(chalk.red('Unexpected error:'), err.message);
    }
    spinner.fail('Failed to fix code ❌');
  }
}

async function handleFixWithContext({ file: filePath, language, output }) {
  const spinner = ora(`Sending ${filePath} with context to /fix...`).start();
  try {
    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: mainCode,
      language,
      contextFiles,
    });

    let { fixedCode } = res.data;
    if (!fixedCode) throw new Error('No code returned from /fix.');

    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : path.resolve(filePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
    spinner.succeed('Contextual fix complete ✅');
  } catch (err) {
    if (err.response && err.response.data) {
      console.error(chalk.red('Error from server:'), err.response.data.message);
    } else {
      console.error(chalk.red('Unexpected error:'), err.message);
    }
    spinner.fail('Failed to fix code with context ❌');
  }
}

module.exports = {
  handleFixBasic,
  handleFixWithContext,
};
