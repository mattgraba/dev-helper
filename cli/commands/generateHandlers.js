import fs from 'fs';
import path from 'path';
import axios from 'axios';
import chalk from 'chalk';
import ora from 'ora';

import getToken from '../utils/getToken.js';
import handleCliError from '../utils/errorHandler.js';
import saveToHistory from '../utils/historySaver.js';
import { apiEndpoint } from '../utils/apiConfig.js';
import { hasLocalKey } from '../utils/configManager.js';
import { generateCode } from '../services/localOpenAI.js';

async function handleGenerateBasic({ description, outputPath }) {
  let spinner;
  try {
    let generatedCode;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora('Generating code...').start();
      const result = await generateCode({ description });
      generatedCode = result.generatedCode;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora('Generating code...').start();
      const res = await axios.post(apiEndpoint('/generate'), {
        description,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      generatedCode = res.data.generatedCode;
    }

    spinner.succeed('Generation complete ✅');

    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, generatedCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${fullPath}`));
    } else {
      console.log(chalk.green('\n🧠 Generated Code:\n'), generatedCode);
    }

    await saveToHistory({
      command: 'generate',
      input: description,
      output: generatedCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Generation failed');
  }
}

export {
  handleGenerateBasic,
};
