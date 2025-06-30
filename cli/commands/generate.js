const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const handleWithContext = require('../utils/contextHandlerWrapper');
const { scanFiles } = require('../utils/fileScanner');

module.exports = (program) => {
  program
    .command('generate')
    .description('Generate code using your AI assistant')
    .requiredOption('-d, --description <text>', 'What you want to generate')
    .option('-l, --language <lang>', 'Language (default: JavaScript)', 'JavaScript')
    .option('-t, --fileType <type>', 'Type of file (e.g. React component)')
    .option('-o, --output <path>', 'Where to save the file (e.g. client/components/AgentCard.jsx)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleGenerateBasic,
        handleWithContext: handleGenerateWithContext,
      });
    });
};

async function handleGenerateBasic({ description, language, fileType, output }) {
  try {
    console.log(chalk.cyan('🚀 Sending request to /generate...'));

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
  } catch (err) {
    console.error(chalk.red('❌ Failed to generate code.'));
    console.error(err.response?.data || err.message);
  }
}

async function handleGenerateWithContext({ description, language, fileType, output }) {
  try {
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

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
  } catch (err) {
    console.error(chalk.red('❌ Failed to generate code with context.'));
    console.error(err.response?.data || err.message);
  }
}
