## CLI Usage & Architecture

The Dev Helper AI CLI is a modular, token-authenticated developer assistant that lets you analyze, fix, generate, and scaffold code directly from your terminal using AI. It communicates with a local Express server that proxies requests to OpenAI and stores responses in a MongoDB database.

---

### Command Structure

All CLI commands follow a clean separation of concerns:

```
cli/
├── cli.js # Main CLI entry (Commander)
├── commands/
│ ├── <command>.js # CLI command registration
│ ├── <command>Command.js # Command logic & API interaction
├── utils/
│ ├── getToken.js
│ ├── contextHandlerWrapper.js
│ ├── fileScanner.js
```

---

### Available Commands

| Command        | Description                                                                                  |
|----------------|----------------------------------------------------------------------------------------------|
| `login`        | Authenticate and store JWT locally in `~/.dev-helper/config.json`                            |
| `history`      | View previously saved AI responses from MongoDB                                              |
| `analyze`      | Send buggy code to AI and receive explanation and suggested fix                              |
| `explain`      | Get a line-by-line explanation of a code file                                                |
| `fix`          | Fix/clean buggy code and optionally overwrite or save the output                             |
| `generate`     | Generate new code from a description (e.g., "React form component")                          |
| `scaffold`     | Scaffold a component by name and save it to a target location                                |
| `terminal`     | Generate terminal setup commands based on a project goal                                     |

> All commands (except `login`) require authentication and support a `--context` flag for deeper project-aware results.

---

### Context-Aware Mode

Add the `--context` flag to any major command (e.g., `analyze`, `fix`, `generate`, `terminal`) to include nearby project files in the request. This is powered by:

```js
scanFiles({
  directory: process.cwd(),
  extensions: ['js', 'ts', 'json'],
  maxFileSizeKB: 100
})
```

---

### Example Usage

dev-helper login --userId myUser123

dev-helper analyze --filePath index.js --context

dev-helper generate -d "simple express server" -o server/index.js

dev-helper fix -f buggyCode.js -o fixedCode.js

dev-helper scaffold -n AgentCard -o client/components/AgentCard.jsx

---

### Architecture Overview

```
CLI Command
   │
   ├──> Handles input, options (commander)
   │
   ├──> Sends API request via axios to:
   │     http://localhost:3001/<route>
   │
   ├──> Response printed or written to file
   │
   └──> Token read from ~/.dev-helper/config.json
```

Backend (Express)

    Receives CLI requests (e.g., /analyze, /fix, /generate)

    Authenticates via JWT

    Calls OpenAI API

    Optionally saves results in MongoDB

    Returns structured response to CLI

---

### Auth File Location

The JWT token is stored securely in: 
```
~/.dev-helper/config.json
```
You can clear or reset it by deleting the file.

---

### History Storage

The backend optionally stores past prompt-response pairs in MongoDB. Use:
```
dev-helper history
```
To view saved interactions.