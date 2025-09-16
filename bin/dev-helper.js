#!/usr/bin/env node

// ^ shebang tells the system to run file with Node.js
// 'npm link' uses this file to register 'dev-helper' as a global command

import '../cli/cli.js';   // points to the actual CLI implementation
