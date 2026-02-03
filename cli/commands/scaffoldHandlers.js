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
import { scaffoldCode as scaffoldCodeLocal } from '../services/localOpenAI.js';

async function handleScaffoldBasic({ name, outputPath }) {
  let spinner;
  try {
    let scaffoldCode;

    if (hasLocalKey()) {
      // BYOK mode: call OpenAI directly
      spinner = ora(`Scaffolding ${name}...`).start();
      const result = await scaffoldCodeLocal({ name });
      scaffoldCode = result.scaffoldCode;
    } else {
      // Server mode: requires authentication
      const token = getToken();
      if (!token) {
        console.error(chalk.red('❌ No API key or login found.'));
        console.log(chalk.dim('Run "dev-helper config set-key <your-openai-key>" to use your own key.'));
        console.log(chalk.dim('Or run "dev-helper login" to use the hosted service.'));
        process.exit(1);
      }

      spinner = ora(`Scaffolding ${name}...`).start();
      const res = await axios.post(apiEndpoint('/scaffold'), {
        name,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      scaffoldCode = res.data.scaffoldCode;
    }

    spinner.succeed('Scaffold complete ✅');

    if (outputPath) {
      const fullPath = path.resolve(outputPath);
      fs.writeFileSync(fullPath, scaffoldCode, 'utf-8');
      console.log(chalk.blue(`\n✅ Saved to ${fullPath}`));
    } else {
      console.log(chalk.green('\n🧱 Scaffolded Code:\n'), scaffoldCode);
    }

    await saveToHistory({
      command: 'scaffold',
      input: name,
      output: scaffoldCode,
    });

  } catch (err) {
    handleCliError(spinner, err, 'Scaffold failed');
  }
}

export {
  handleScaffoldBasic,
};
