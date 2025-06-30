const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const handleWithContext = require('../utils/contextHandlerWrapper');
const { scanFiles } = require('../utils/fileScanner');

module.exports = (program) => {
  program
    .command('scaffold')
    .description('Scaffold a new component using AI')
    .requiredOption('-n, --name <ComponentName>', 'Name of the component to scaffold')
    .option('-o, --output <path>', 'Output path (e.g. client/components/AgentCard.jsx)')
    .option('--context', 'Include project context')
    .action((options) => {
      handleWithContext({
        options,
        handleBasic: handleScaffoldBasic,
        handleWithContext: handleScaffoldWithContext,
      });
    });
};

async function handleScaffoldBasic({ name, output }) {
  try {
    console.log(chalk.cyan(`🚀 Sending request to /scaffold for ${name}...`));

    const res = await axios.post('http://localhost:3001/scaffold', {
      goal: `Create a ${name} component`,
    });

    let { componentCode } = res.data;
    if (!componentCode) throw new Error('No component code returned from /scaffold.');

    componentCode = componentCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output || `client/components/${name}.jsx`;
    const resolvedPath = path.resolve(outPath);

    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    fs.writeFileSync(resolvedPath, componentCode);

    console.log(chalk.green(`✅ Scaffolded component saved to ${outPath}`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to scaffold component.'));
    console.error(err.response?.data || err.message);
  }
}

async function handleScaffoldWithContext({ name, output }) {
  try {
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

    console.log(chalk.cyan(`🚀 Sending contextual request to /scaffold for ${name}...`));

    const res = await axios.post('http://localhost:3001/scaffold', {
      goal: `Create a ${name} component`,
      contextFiles,
    });

    let { componentCode } = res.data;
    if (!componentCode) throw new Error('No component code returned from /scaffold.');

    componentCode = componentCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

    const outPath = output || `client/components/${name}.jsx`;
    const resolvedPath = path.resolve(outPath);

    fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
    fs.writeFileSync(resolvedPath, componentCode);

    console.log(chalk.green(`✅ Scaffolded component with context saved to ${outPath}`));
  } catch (err) {
    console.error(chalk.red('❌ Failed to scaffold component with context.'));
    console.error(err.response?.data || err.message);
  }
}