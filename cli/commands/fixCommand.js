const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const ora = require('ora');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');

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
    handleCliError(spinner, err, 'Failed to fix code ❌');
  }
}

async function handleFixWithContext({ file: filePath, language, output }) {
  const spinner = ora(`Sending ${filePath} with context to /fix...`).start();
  try {
    if (!fs.existsSync(filePath)) {
      console.error(chalk.red(`❌ File not found: ${filePath}`));
      return;
    }
    
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
    handleCliError(spinner, err, 'Failed to fix code with context ❌');
  }
}

module.exports = {
  handleFixBasic,
  handleFixWithContext,
};
