# Dev Helper Documentation

Welcome to the Dev Helper documentation. This guide covers the system architecture, technical implementation, API reference, and design decisions for the AI-powered developer assistant.

## Quick Links

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System architecture overview and component diagrams |
| [Technical Layers](./TECHNICAL-LAYERS.md) | Detailed breakdown of CLI, server, and client layers |
| [API Reference](./API-REFERENCE.md) | Complete REST API endpoint documentation |
| [Design Decisions](./DESIGN-DECISIONS.md) | Rationale behind key architectural choices |
| [Configuration](./CONFIGURATION.md) | Environment setup and configuration options |

## Project Overview

Dev Helper is a full-stack AI-powered developer assistant that provides:

- **Code Analysis** - Debug code with explanations and suggested fixes
- **Code Explanation** - Get detailed explanations of how code works
- **Code Fixing** - Automatically fix broken code
- **Code Generation** - Generate code from natural language descriptions
- **Component Scaffolding** - Generate React component boilerplate
- **Terminal Commands** - Get terminal commands from plain English descriptions
- **Query History** - Track and review past interactions

## Usage Modes

### BYOK Mode (Bring Your Own Key)
Direct CLI-to-OpenAI communication without requiring an account. Your API key never leaves your machine.

```bash
dev-helper config --set-key sk-your-openai-key
dev-helper analyze -f ./buggy-code.js -l javascript
```

### Hosted Service Mode
Full-featured mode with user accounts, history persistence, and managed API access.

```bash
dev-helper login
dev-helper analyze -f ./buggy-code.js -l javascript
```

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| CLI | Node.js, Commander.js, OpenAI SDK, Chalk, Ora |
| Frontend | React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Express.js, MongoDB Atlas, JWT, bcrypt |
| Hosting | Vercel (frontend), Render (backend) |

## Getting Started

```bash
# Install globally
npm install -g @mattgraba/dev-helper

# BYOK setup
dev-helper config --set-key YOUR_OPENAI_API_KEY

# Or use hosted service
dev-helper login
```

## Live Demo

- **Web UI**: [dev-helper-zeta.vercel.app](https://dev-helper-zeta.vercel.app)
- **API**: [dev-helper-0uhn.onrender.com](https://dev-helper-0uhn.onrender.com)

## License

MIT License - See [LICENSE](../LICENSE) for details.
