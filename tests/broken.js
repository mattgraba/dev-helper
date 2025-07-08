const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const CLI = 'dev-helper';
const TEST_FILE = path.join(__dirname, 'sample-bug.js');
const CONFIG_FILE = path.join(require('os').homedir(), '.dev-helper', 'config.json');

// ANSI color helpers
const green = (txt) => `\x1b[32m${txt}\x1b[0m`;
const red = (txt) => `\x1b[31m${txt}\x1b[0m`;

function printResult(success, label) {
  console.log(success ? green(`✅ ${label} passed`) : red(`❌ ${label} failed`));
}

function run(command, args = [], label, options = {}) {
  const result = spawnSync(command, args, {
    encoding: 'utf-8',
    ...options,
  });

  const success = result.status !== 0; // These are intentionally broken tests → should fail
  printResult(success, label);
  if (!success) {
    console.log('--- STDOUT ---\n' + result.stdout);
    console.log('--- STDERR ---\n' + result.stderr);
  }
}

// ========== TESTS ==========

console.log('\n🚨 Running Broken Command Tests...\n');

// 🔐 Login with empty input
run(CLI, ['login'], 'login with empty userId');

// 🧹 Delete token file (simulate missing auth) and run history
if (fs.existsSync(CONFIG_FILE)) fs.unlinkSync(CONFIG_FILE);
run(CLI, ['history'], 'history with missing token');

// 🔎 Analyze with missing file
run(CLI, ['analyze', 'tests/does-not-exist.js'], 'analyze with nonexistent file');

// 🔧 Fix with invalid path
run(CLI, ['fix', 'tests/unknown.js'], 'fix with invalid path');

// ❓ Explain with invalid path
run(CLI, ['explain', 'fakefile.js'], 'explain with invalid path');

// 🚧 Generate with invalid type
run(CLI, ['generate', '--type', 'unknown'], 'generate with bad type');

// 🏗 Scaffold with unsupported project
run(CLI, ['scaffold', '--type', 'alien-stack'], 'scaffold with bad type');

// 🧪 Terminal with bogus log level
run(CLI, ['terminal', '--log-level', 'bananas'], 'terminal with bad log level');

// 💬 Help (should pass but print something)
run(CLI, ['--help'], 'global help output');

// 🧨 Unknown command
run(CLI, ['teleport'], 'unknown command');

// 💾 Corrupted config file
fs.writeFileSync(CONFIG_FILE, 'this is not json');
run(CLI, ['history'], 'history with corrupted config');

