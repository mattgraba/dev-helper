import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import { scanFiles } from '../utils/fileScanner.js';
import { checkFileExists } from '../utils/fsUtils.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';
import { apiEndpoint } from '../utils/apiConfig.js';
import { hasLocalKey } from '../utils/configManager.js';
import { fixCode } from '../services/localOpenAI.js';

async function handleFixBasic({ filePath, language, outputPath }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const originalCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    let fixedCode;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Fixing ${filePath}...`).start();
      const result = await fixCode({ codeSnippet: originalCode, language });
      fixedCode = result.fixedCode;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Fixing ${filePath}...`).start();
      const res = await axios.post(apiEndpoint('/fix'), {
        codeSnippet: originalCode,
        language,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fixedCode = res.data.fixedCode;
    }

    spinner.succeed('Fix complete ✅');

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: originalCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Fix failed');
  }
}

async function handleFixWithContext({ filePath, language, outputPath }) {
  let spinner;
  try {
    if (!checkFileExists(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const mainCode = fs.readFileSync(path.resolve(filePath), 'utf-8');
    const contextFiles = await scanFiles({ directory: path.dirname(filePath) });
    let fixedCode;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Fixing ${filePath} with context...`).start();
      const result = await fixCode({ codeSnippet: mainCode, language, contextFiles });
      fixedCode = result.fixedCode;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Fixing ${filePath} with context...`).start();
      const res = await axios.post(apiEndpoint('/fix'), {
        codeSnippet: mainCode,
        language,
        contextFiles,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fixedCode = res.data.fixedCode;
    }

    spinner.succeed('Fix with context complete ✅');

    if (outputPath) {
      fs.writeFileSync(outputPath, fixedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${outputPath}`));
    } else {
      console.log(chalk.green('\n🔧 Fixed Code:\n'), fixedCode);
    }

    await saveToHistory({
      command: 'fix',
      input: mainCode,
      output: fixedCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Fix failed');
  }
}

export {
  handleFixBasic,
  handleFixWithContext,
};
