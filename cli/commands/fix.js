const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const handleWithContext = require('../utils/contextHandlerWrapper');
const { scanFiles } = require('../utils/fileScanner');

module.exports = (program) => {
  program
    .command('fix')
    .description('Fix or clean up a buggy code file')
    .requiredOption('-f, --file <filePath>', 'Path to the code file')
    .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
    .option('-o, --output <path>', 'Where to save the fixed code (defaults to overwrite)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleFixBasic,
        handleWithContext: handleFixWithContext,
      });
    });
};

async function handleFixBasic({ file: filePath, language, output }) {
  try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const res = await axios.post('http://localhost:3001/fix', {
      codeSnippet: code,
      language,
    });

    let { fixedCode } = res.data;
    if (!fixedCode) throw new Error('No code returned from /fix.');

    // Clean markdown code block
    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : path.resolve(filePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to fix code.'));
    console.error(err.response?.data || err.message);
  }
}

async function handleFixWithContext({ file: filePath, language, output }) {
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

    // Clean markdown code block
    fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output ? path.resolve(output) : path.resolve(filePath);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, fixedCode);

    console.log(chalk.green(`✅ Fixed code written to ${output || filePath}`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to fix code with context.'));
    console.error(err.response?.data || err.message);
  }
}
