const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const handleWithContext = require('../utils/contextHandlerWrapper');
const { scanFiles } = require('../utils/fileScanner');

module.exports = (program) => {
  program
    .command('explain')
    .description('Explain a code file line-by-line')
    .requiredOption('-f, --file <filePath>', 'Path to the code file')
    .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleExplainBasic,
        handleWithContext: handleExplainWithContext,
      });
    });
};

async function handleExplainBasic({ file: filePath, language }) {
  try {
    const code = fs.readFileSync(path.resolve(filePath), 'utf-8');

    console.log(chalk.cyan(`📤 Sending ${filePath} to /explain...`));

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: code,
      language,
    });

    console.log(chalk.green('\n🧠 Explanation:\n'));
    console.log(res.data.explanation);
  } catch (err) {
    console.error(chalk.red('❌ Failed to explain code.'));
    console.error(err.response?.data || err.message);
  }
}

async function handleExplainWithContext({ file: filePath, language }) {
  try {
    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');

    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    console.log(chalk.cyan(`📤 Sending ${filePath} with context to /explain...`));

    const res = await axios.post('http://localhost:3001/explain', {
      codeSnippet: mainCode,
      language,
      contextFiles,
    });

    console.log(chalk.green('\n🧠 Explanation:\n'));
    console.log(res.data.explanation);
  } catch (err) {
    console.error(chalk.red('❌ Failed to explain code with context.'));
    console.error(err.response?.data || err.message);
  }
}
