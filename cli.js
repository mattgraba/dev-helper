#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const program = new Command();

program
  .name('dev-helper')
  .description('AI-powered developer assistant CLI')
  .version('1.0.0');

  
  program
  .command('analyze')
  .description('Analyze a buggy code file and receive an explanation and suggested fix')
  .requiredOption('-f, --file <path>', 'Path to the code file to analyze')
  .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
  .action(async (options) => {
    const { file, language } = options;

    try {
      const code = fs.readFileSync(path.resolve(file), 'utf-8');

      console.log(chalk.cyan(`📤 Sending ${file} to /analyze...`));

      const res = await axios.post('http://localhost:3001/analyze', {
        errorText: code,
        language,
      });

      const { explanation, fix } = res.data;

      console.log(chalk.green('\n🧠 Explanation:\n'));
      console.log(explanation);

      console.log(chalk.green('\n🛠 Suggested Fix:\n'));
      console.log(fix);
    } catch (err) {
      console.error(chalk.red('❌ Failed to analyze code.'));
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err.message || err);
      }
    }
  });

  program
  .command('explain')
  .description('Explain a code file line-by-line')
  .requiredOption('-f, --file <path>', 'Path to the code file')
  .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
  .action(async (options) => {
    const { file, language } = options;

    try {
      const code = fs.readFileSync(path.resolve(file), 'utf-8');

      console.log(chalk.cyan(`📤 Sending ${file} to /explain...`));

      const res = await axios.post('http://localhost:3001/explain', {
        codeSnippet: code,
        language,
      });

      console.log(chalk.green('\n🧠 Explanation:\n'));
      console.log(res.data.explanation);
    } catch (err) {
      console.error(chalk.red('❌ Failed to explain code.'));
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err.message || err);
      }
    }
  });

  program
  .command('fix')
  .description('Fix or clean up a buggy code file')
  .requiredOption('-f, --file <path>', 'Path to the code file')
  .option('-l, --language <lang>', 'Language of the code (default: JavaScript)', 'JavaScript')
  .option('-o, --output <path>', 'Where to save the fixed code (defaults to overwrite)')
  .action(async (options) => {
    const { file, language, output } = options;

    try {
      const code = fs.readFileSync(path.resolve(file), 'utf-8');
      const res = await axios.post('http://localhost:3001/fix', {
        codeSnippet: code,
        language,
      });

      let { fixedCode } = res.data;
      if (!fixedCode) throw new Error('No code returned from /fix.');

      // Clean code block syntax
      fixedCode = fixedCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

      const outPath = output ? path.resolve(output) : path.resolve(file);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, fixedCode);

      console.log(chalk.green(`✅ Fixed code written to ${output || file}`));
    } catch (err) {
      console.error(chalk.red('❌ Failed to fix code.'));
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err.message || err);
      }
    }
  });

  program
  .command('generate')
  .description('Generate code using your AI assistant')
  .requiredOption('-d, --description <text>', 'What you want to generate')
  .option('-l, --language <lang>', 'Language (default: JavaScript)', 'JavaScript')
  .option('-t, --fileType <type>', 'Type of file (e.g. React component)')
  .option('-o, --output <path>', 'Where to save the file (e.g. client/components/AgentCard.jsx)')
  .action(async (options) => {
    const { description, language, fileType, output } = options;

    console.log(chalk.cyan('🚀 Sending request to /generate...'));

    try {
      const res = await axios.post('http://localhost:3001/generate', {
        description,
        language,
        fileType,
      });

      let { result } = res.data;
      if (!result) throw new Error('No result from AI.');

      // Clean up: remove markdown code block (```js\n ... \n```)
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
        if (err.response) {
          console.error('Status:', err.response.status);
          console.error('Data:', err.response.data);
        } else {
          console.error(err.message || err);
        }
    }
  });

  program
  .command('scaffold')
  .description('Scaffold a new component using AI')
  .requiredOption('-n, --name <ComponentName>', 'Name of the component to scaffold')
  .option('-o, --output <path>', 'Output path (e.g. client/components/AgentCard.jsx)')
  .action(async (options) => {
    const { name, output } = options;

    try {
      console.log(chalk.cyan(`🚀 Sending request to /scaffold for ${name}...`));

      const res = await axios.post('http://localhost:3001/scaffold', {
        goal: `Create a ${name} component`,
      });

      let { componentCode } = res.data;
      if (!componentCode) throw new Error('No component code returned from /scaffold.');

      // Clean markdown/code formatting
      componentCode = componentCode.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

      const outPath = output || `client/components/${name}.jsx`;
      const resolvedPath = path.resolve(outPath);

      fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
      fs.writeFileSync(resolvedPath, componentCode);

      console.log(chalk.green(`✅ Scaffolded component saved to ${outPath}`));
    } catch (err) {
      console.error(chalk.red('❌ Failed to scaffold component.'));
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err.message || err);
      }
    }
  });


  program
  .command('terminal')
  .description('Generate terminal setup commands based on a goal')
  .requiredOption('-g, --goal <text>', 'Project goal or setup intention')
  .option('-c, --context <text>', 'Optional context like dependencies installed')
  .action(async (options) => {
    const { goal, context } = options;

    try {
      const res = await axios.post('http://localhost:3001/terminal', {
        goal,
        context,
      });

      let { commands } = res.data;
      if (!commands) throw new Error('No terminal commands returned from /terminal');

      // Clean markdown/code block formatting
      commands = commands.replace(/```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();

      console.log(chalk.green('\n💻 Suggested terminal commands:\n'));
      console.log(commands);
    } catch (err) {
      console.error(chalk.red('❌ Failed to generate terminal commands.'));
      if (err.response) {
        console.error('Status:', err.response.status);
        console.error('Data:', err.response.data);
      } else {
        console.error(err.message || err);
      }
    }
  });




program.parse();
