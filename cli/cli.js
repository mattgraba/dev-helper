#!/usr/bin/env node

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

program.parse();
