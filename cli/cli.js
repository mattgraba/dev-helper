#!/usr/bin/env node
// ^ shebang line allows the script to be run directly from the terminal
const { Command } = require('commander');
const chalk = require('chalk');
const program = new Command();

// Import per-command handlers
const handleAnalyze = require('./commands/analyze');
const handleExplain = require('./commands/explain');
const handleFix = require('./commands/fix');
const handleGenerate = require('./commands/generate');
const handleScaffold = require('./commands/scaffold');
const handleTerminal = require('./commands/terminal');
const handleLogin = require('./commands/login');
const handleHistory = require('./commands/history');

// CLI Metadata: defines basic information when a user runs `dev-helper --help`
program
  .name('dev-helper')
  .description('AI-powered developer assistant CLI')
  .version('1.0.0');

// Register commands
handleAnalyze(program);
handleExplain(program);
handleFix(program);
handleGenerate(program);
handleScaffold(program);
handleTerminal(program);
handleLogin(program);
handleHistory(program);

// Triggers the CLI to interpret the command-line arguments passed by the user (e.g., `dev-helper analyze`)
program.parse();
