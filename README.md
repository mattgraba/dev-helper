# Dev Helper

A full-stack AI-powered developer assistant with CLI and web interfaces.

[![npm version](https://img.shields.io/npm/v/@mattgraba/dev-helper)](https://www.npmjs.com/package/@mattgraba/dev-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live Demo:** [dev-helper-zeta.vercel.app](https://dev-helper-zeta.vercel.app)

---

## Overview

Dev Helper is a modular, token-authenticated developer assistant that lets you analyze, explain, fix, generate, and scaffold code directly from your terminal. It also includes a web application for account management, code analysis, and history tracking.

### Features

- **JWT Authentication** — Secure login with credentials stored locally
- **Project-Aware Analysis** — Include surrounding files for better context
- **AI Toolkit** — Analyze, explain, fix, generate, scaffold, and get terminal commands
- **History Tracking** — All queries saved and accessible via CLI or web UI
- **Rate Limiting** — Built-in protection against API abuse
- **File Upload** — Drag-and-drop support in web interface

---

## Installation

```bash
npm install -g @mattgraba/dev-helper
```

Verify the installation:

```bash
dev-helper --help
```

---

## Quick Start

### 1. Create an Account

Register at [dev-helper-zeta.vercel.app](https://dev-helper-zeta.vercel.app) to create your account.

### 2. Authenticate

```bash
dev-helper login
```

Enter your username and password when prompted. Your token is stored securely at `~/.dev-helper/config.json`.

### 3. Start Using

Analyze a file:

```bash
dev-helper analyze -f ./src/buggy.js -l javascript
```

Explain code:

```bash
dev-helper explain -f ./utils/helper.py -l python
```

Fix broken code:

```bash
dev-helper fix -f ./broken.ts -l typescript
```

Generate new code:

```bash
dev-helper generate -d "Create a React button component with hover state"
```

Scaffold a component:

```bash
dev-helper scaffold -n UserProfile
```

Get terminal commands:

```bash
dev-helper terminal -g "Set up a Node.js project with TypeScript and ESLint"
```

View history:

```bash
dev-helper history
```

---

## CLI Reference

| Command    | Description                                      | Key Flags                    |
| ---------- | ------------------------------------------------ | ---------------------------- |
| `login`    | Authenticate with your Dev Helper account        | —                            |
| `analyze`  | Analyze buggy code and receive explanation + fix | `-f <file>` `-l <language>`  |
| `explain`  | Get a plain-English explanation of code          | `-f <file>` `-l <language>`  |
| `fix`      | Generate a corrected version of broken code      | `-f <file>` `-l <language>`  |
| `generate` | Generate code from a natural language prompt     | `-d <description>`           |
| `scaffold` | Scaffold a React component with best practices   | `-n <name>`                  |
| `terminal` | Get terminal commands for a specific goal        | `-g <goal>`                  |
| `history`  | View your past queries and responses             | —                            |

### Context-Aware Mode

Use the `--context` flag to include surrounding project files for better analysis:

```bash
dev-helper analyze -f ./src/index.js -l javascript --context
```

This scans nearby `.js`, `.ts`, and `.json` files (up to 100KB each) and includes them in the AI prompt.

### Help

Run `--help` on any command for detailed options:

```bash
dev-helper analyze --help
```

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   CLI Client    │────▶│  Express API    │────▶│   OpenAI API    │
│  (Commander)    │     │  (Render)       │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
┌─────────────────┐              │
│   Web Client    │──────────────┤
│  (Vercel)       │              │
└─────────────────┘              ▼
                        ┌─────────────────┐
                        │   MongoDB       │
                        │   Atlas         │
                        └─────────────────┘
```

### Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| CLI      | Node.js, Commander, Axios, Chalk    |
| Frontend | React, Vite, Tailwind CSS           |
| Backend  | Express, JWT, express-rate-limit    |
| Database | MongoDB Atlas                       |
| AI       | OpenAI GPT-4                        |
| Hosting  | Vercel (frontend), Render (backend) |

---

## Project Structure

```
dev-helper/
├── cli/                    # CLI application
│   ├── cli.js              # Main entry point (Commander)
│   ├── commands/           # Command handlers
│   └── utils/              # Token management, file scanning
├── client/                 # React web application
│   └── src/
│       ├── pages/          # Route pages
│       └── components/     # Reusable components
├── server/                 # Express API server
│   └── src/
│       ├── routes/         # API endpoints
│       ├── middleware/     # Auth, rate limiting
│       └── utils/          # Error handling
└── bin/                    # npm global binary
```

---

## Configuration

### Environment Variables

**Server** (`server/.env`):

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
OPENAI_API_KEY=<your-openai-api-key>
```

**Client** (`client/.env`):

```
VITE_API_URL=<your-api-url>
```

### Custom API URL

For development or self-hosting, set a custom API URL:

```bash
export DEV_HELPER_API_URL=http://localhost:3001
```

Or add it to `~/.dev-helper/config.json`:

```json
{
  "token": "...",
  "apiUrl": "http://localhost:3001"
}
```

---

## Philosophy

Dev Helper is built to accelerate engineers without replacing their thinking. It promotes intentional usage and critical reasoning rather than passive auto-complete reliance.

---

## Contributing

Pull requests are welcome. Please open an issue first to discuss proposed changes.

---

## License

MIT © [Matt Graba](https://mattgraba.com)

---

[![Portfolio](https://img.shields.io/badge/Portfolio-mattgraba.com-blue?style=flat&logo=vercel)](https://mattgraba.com)
[![GitHub](https://img.shields.io/badge/GitHub-mattgraba-black?style=flat&logo=github)](https://github.com/mattgraba)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-mattgraba-blue?style=flat&logo=linkedin)](https://www.linkedin.com/in/mattgraba)
