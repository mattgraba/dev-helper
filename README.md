# Dev Helper 🚀  
*A full-stack AI-powered developer assistant CLI + Web App*  

[![npm version](https://img.shields.io/npm/v/@mattgraba/dev-helper)](https://www.npmjs.com/package/@mattgraba/dev-helper)  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)  
[![Portfolio](https://img.shields.io/badge/Portfolio-mattgraba.com-blue?style=flat&logo=vercel)](https://mattgraba.com)
[![GitHub](https://img.shields.io/badge/GitHub-mattgraba-black?style=flat&logo=github)](https://github.com/mattgraba)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mattgraba-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/mattgraba)  

Dev Helper is a modular, token-authenticated developer assistant that lets you **analyze, explain, fix, generate, and scaffold code directly from your terminal**. It also ships with a polished web app frontend for login, error submission, and history tracking — a true full-stack MVP.  

---

## ✨ Features
- 🔑 **JWT Authentication** (stored in `~/.dev-helper/config.json`)  
- ⚡ **Project-Aware Analysis** with `--context` file scanning  
- 🛠 **Full AI Toolkit**: analyze, explain, fix, generate, scaffold, terminal setup  
- 💾 **History Storage** in MongoDB (query via CLI or web UI)  
- 🖥 **Web Frontend**: login + error submission + history browsing  
- 🌐 **Express API Backend** with OpenAI integration  

---

## 📦 Installation

```bash
npm install -g @mattgraba/dev-helper
```
Verify install:
```bash
dev-helper --help
```

---

## 🚀 Quick Start
Authenticate (stores JWT in `~/.dev-helper/config.json`):
```bash
dev-helper login --userId myUser123
```
Analyze a file:
```bash
dev-helper analyze --filePath index.js --context
```
Generate a new component:
```bash
dev-helper generate -d "React form component" -o client/components/Form.jsx
```
Fix buggy code:
```bash
dev-helper fix -f broken.js -o fixed.js
```
View history:
```bash
dev-helper history
```

---

## 🧩 CLI Usage & Architecture
The Dev Helper CLI is structured with clean separation of concerns:
```bash
cli/
├── cli.js                   # Main CLI entry (Commander)
├── commands/                # Each CLI command
│   ├── <command>.js         # Command registration
│   ├── <command>Command.js  # Command logic & API interaction
├── utils/
│   ├── getToken.js
│   ├── contextHandlerWrapper.js
│   ├── fileScanner.js
```

---

### Available Commands

| Command    | Description                                                       |
| ---------- | ----------------------------------------------------------------- |
| `login`    | Authenticate and store JWT locally in `~/.dev-helper/config.json` |
| `history`  | View previously saved AI responses from MongoDB                   |
| `analyze`  | Send buggy code to AI and receive explanation + fix               |
| `explain`  | Get a line-by-line explanation of a code file                     |
| `fix`      | Clean buggy code and optionally overwrite/save output             |
| `generate` | Generate new code from a description (e.g. “Express server”)      |
| `scaffold` | Scaffold a component by name and save to a target location        |
| `terminal` | Generate terminal setup commands based on a project goal          |

> All commands (except `login`) require authentication and support `--context` for project-aware results.

---

### Context-Aware Mode
Use the `--context` flag with major commands to include nearby project files:
```js
scanFiles({
  directory: process.cwd(),
  extensions: ['js', 'ts', 'json'],
  maxFileSizeKB: 100
})
```
Example:
```bash
dev-helper analyze --filePath index.js --context
```

---

### Architecture Overview
```bash
CLI Command
   │
   ├──> Handles input (commander)
   │
   ├──> Sends API request via axios to:
   │     http://localhost:3001/<route>
   │
   ├──> Response printed or written to file
   │
   └──> Token read from ~/.dev-helper/config.json
```
**Backend (Express)**
- Receives CLI requests (`/analyze`, `/fix`, `/generate`, etc.)
- Authenticates via JWT
- Calls OpenAI API
- Optionally saves results in MongoDB
- Returns structured response to CLI

---

### Auth File Location
JWT token stored at:
```arduino
~/.dev-helper/config.json
```
Delete the file to reset authentication.

---

### History Storage
The backend saves past prompt/response pairs in MongoDB.

View them with:
```bash
dev-helper history
```

---


## 🧭 Core Philosophy

Dev Helper is built to accelerate engineers without replacing their thinking.
It empowers intentional usage, promotes critical reasoning, augments fundamentals, and resists the “vibe-coding” shortcuts common in IDE auto-complete tools.

---

## 🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss proposed changes.

---

## 📜 License
MIT © [Matt Graba](https://mattgraba.com)

[![Portfolio](https://img.shields.io/badge/Portfolio-mattgraba.com-blue?style=flat&logo=vercel)](https://mattgraba.com)
[![GitHub](https://img.shields.io/badge/GitHub-mattgraba-black?style=flat&logo=github)](https://github.com/mattgraba)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mattgraba-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/mattgraba)