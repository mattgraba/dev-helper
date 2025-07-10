#!/usr/bin/env node
// ^ shebang line allows the script to be run directly from the terminal
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();

// Import per-command handlers
const handleAnalyze = require('./commands/analyzeCommand');
const handleExplain = require('./commands/explainCommand');
const handleFix = require('./commands/fixCommand');
const handleGenerate = require('./commands/generateCommand');
const handleScaffold = require('./commands/scaffoldCommand');
const handleTerminal = require('./commands/terminalCommand');
const handleLogin = require('./commands/loginCommand');
const handleHistory = require('./commands/historyCommand');

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

// Triggers the CLI to interpret the command-line arguments passed by the user (e.g., `dev-helper analyze`)
program.parse(process.argv);
