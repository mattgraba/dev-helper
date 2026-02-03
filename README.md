# Dev Helper

A full-stack AI-powered developer assistant with CLI and web interfaces.

[![npm version](https://img.shields.io/npm/v/@mattgraba/dev-helper)](https://www.npmjs.com/package/@mattgraba/dev-helper)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Live Demo:** [dev-helper-zeta.vercel.app](https://dev-helper-zeta.vercel.app)

---

## Overview

Dev Helper is a modular developer assistant that lets you analyze, explain, fix, generate, and scaffold code directly from your terminal. It supports two usage modes:

- **BYOK (Bring Your Own Key)** — Use your own OpenAI API key, no account required
- **Hosted Service** — Create an account and use the hosted API

### Features

- **Flexible Authentication** — Use your own OpenAI key or the hosted service
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

Choose your preferred setup method:

### Option A: Use Your Own OpenAI Key (BYOK)

The fastest way to get started. No account required.

```bash
# Set your OpenAI API key
dev-helper config set-key sk-your-openai-api-key

# Start using immediately
dev-helper analyze -f ./src/buggy.js -l javascript
```

Your key is stored locally at `~/.dev-helper/config.json` and calls go directly to OpenAI.

### Option B: Use the Hosted Service

Use the managed service without managing your own API key.

**1. Create an Account**

Register at [dev-helper-zeta.vercel.app](https://dev-helper-zeta.vercel.app)

**2. Authenticate**

```bash
dev-helper login
```

Enter your username and password when prompted.

**3. Start Using**

```bash
dev-helper analyze -f ./src/buggy.js -l javascript
```

---

## Usage Examples

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
| `config`   | Manage configuration (API keys, settings)        | `set-key`, `remove-key`, `show` |
| `login`    | Authenticate with the hosted service             | —                            |
| `analyze`  | Analyze buggy code and receive explanation + fix | `-f <file>` `-l <language>`  |
| `explain`  | Get a plain-English explanation of code          | `-f <file>` `-l <language>`  |
| `fix`      | Generate a corrected version of broken code      | `-f <file>` `-l <language>`  |
| `generate` | Generate code from a natural language prompt     | `-d <description>`           |
| `scaffold` | Scaffold a React component with best practices   | `-n <name>`                  |
| `terminal` | Get terminal commands for a specific goal        | `-g <goal>`                  |
| `history`  | View your past queries and responses             | —                            |

### Config Command

Manage your dev-helper configuration:

```bash
# Show current configuration
dev-helper config

# Set your OpenAI API key (enables BYOK mode)
dev-helper config set-key <your-openai-api-key>

# Remove your stored API key
dev-helper config remove-key

# Show configuration details
dev-helper config show
```

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
dev-helper config --help
```

---

## Architecture

### BYOK Mode (Bring Your Own Key)

```
┌─────────────────┐                    ┌─────────────────┐
│   CLI Client    │───────────────────▶│   OpenAI API    │
│  (Commander)    │   Direct calls     │                 │
└─────────────────┘                    └─────────────────┘
```

No server, no account — your key, your costs, complete privacy.

### Hosted Service Mode

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
│   ├── services/           # Local OpenAI service (BYOK)
│   └── utils/              # Config management, file scanning
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

### API Key Priority

When running AI commands, dev-helper checks for an OpenAI key in this order:

1. **Environment variable** `OPENAI_API_KEY` (highest priority)
2. **Config file** `~/.dev-helper/config.json` → `openaiApiKey`
3. **Hosted service** (requires login, uses server's key)

### Config File

Located at `~/.dev-helper/config.json`:

```json
{
  "token": "jwt-token-for-hosted-service",
  "apiUrl": "https://custom-api-url.com",
  "openaiApiKey": "sk-your-openai-key"
}
```

| Field | Description |
|-------|-------------|
| `token` | JWT token from `dev-helper login` (hosted service) |
| `apiUrl` | Custom API URL (for self-hosting or development) |
| `openaiApiKey` | Your OpenAI API key (BYOK mode) |

### Environment Variables

**For BYOK users** — set your key as an environment variable:

```bash
export OPENAI_API_KEY=sk-your-openai-api-key
```

**For self-hosting** — server environment (`server/.env`):

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
  "apiUrl": "http://localhost:3001"
}
```

---

## Usage Modes Comparison

| Feature | BYOK Mode | Hosted Service |
|---------|-----------|----------------|
| Account required | No | Yes |
| OpenAI key required | Yes (yours) | No |
| API costs | You pay OpenAI directly | Included |
| History tracking | Local only | Server + Web UI |
| Privacy | Keys stay local | Keys on server |
| Setup time | Instant | Create account |

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
