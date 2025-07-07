const fs = require('fs');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const { scanFiles } = require('../utils/fileScanner');
const handleCliError = require('../utils/errorHandler');
const ora = require('ora').default;

async function handleScaffoldBasic({ name, output }) {
  const spinner = ora(`Sending request to /scaffold for ${name}...`).start();
  try {
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

    spinner.succeed('Scaffold complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to scaffold component ❌');
  }
}

async function handleScaffoldWithContext({ name, output }) {
  const spinner = ora(`Sending contextual request to /scaffold for ${name}...`).start();
  try {
    const contextFiles = await scanFiles({
      directory: process.cwd(),
      extensions: ['js', 'ts', 'json'],
      maxFileSizeKB: 100,
    });

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

    spinner.succeed('Contextual scaffold complete ✅');
  } catch (err) {
    handleCliError(spinner, err, 'Failed to scaffold component with context ❌');
  }
}

module.exports = {
  handleScaffoldBasic,
  handleScaffoldWithContext,
};

