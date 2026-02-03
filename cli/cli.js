#!/usr/bin/env node
// ^ shebang line allows the script to be run directly from the terminal
import { Command } from 'commander';
import 'dotenv/config';
const program = new Command();

// Import per-command handlers
import handleAnalyze from './commands/analyzeCommand.js';
import handleExplain from './commands/explainCommand.js';
import handleFix from './commands/fixCommand.js';
import handleGenerate from './commands/generateCommand.js';
import handleScaffold from './commands/scaffoldCommand.js';
import handleTerminal from './commands/terminalCommand.js';
import handleLogin from './commands/loginCommand.js';
import handleHistory from './commands/historyCommand.js';
import handleConfig from './commands/configCommand.js';

// CLI Metadata: defines basic information when a user runs `dev-helper --help`
program
  .name('dev-helper')
  .description('A developer CLI assistant powered by AI')
  .version('1.0.0');

// Register commands
handleAnalyze(program);
handleExplain(program);
handleFix(program);
handleGenerate(program);
handleHistory(program);
handleLogin(program);
handleScaffold(program);
handleTerminal(program);
handleConfig(program);

// Triggers the CLI to interpret the command-line arguments passed by the user (e.g., `dev-helper analyze`)
program.parse(process.argv);
