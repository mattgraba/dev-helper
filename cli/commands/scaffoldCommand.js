const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { scanFiles } = require('../utils/fileScanner');

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

module.exports = {
  handleScaffoldBasic,
  handleScaffoldWithContext,
};
