# Technical Layers

This document provides detailed technical information about each layer of the Dev Helper application.

## CLI Layer

### Entry Point

The CLI is registered as a global npm binary via `bin/dev-helper.js`:

```javascript
#!/usr/bin/env node
require('../cli/cli.js');
```

### Commander.js Setup

The main CLI file (`cli/cli.js`) configures Commander.js with all available commands:

```javascript
const { program } = require('commander');

program
  .name('dev-helper')
  .description('AI-powered developer assistant')
  .version('1.0.0');

// Register commands
registerAnalyzeCommand(program);
registerExplainCommand(program);
// ... etc
```

### Command Structure

Each command follows a consistent pattern:

```
commands/
├── {name}Command.js    # Command definition (options, description)
└── {name}Handlers.js   # Business logic implementation
```

**Example: Analyze Command**

```javascript
// analyzeCommand.js
module.exports = function registerAnalyzeCommand(program) {
  program
    .command('analyze')
    .description('Analyze code for bugs and issues')
    .requiredOption('-f, --file <path>', 'Path to code file')
    .requiredOption('-l, --language <lang>', 'Programming language')
    .option('--context', 'Include project context')
    .action(handleAnalyzeBasic);
};
```

### BYOK Mode Implementation

The `localOpenAI.js` service provides direct OpenAI SDK integration:

```javascript
const OpenAI = require('openai');

async function analyzeCode(code, language, context = null) {
  const client = new OpenAI({ apiKey: getApiKey() });

  const messages = [
    { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
    { role: 'user', content: buildPrompt(code, language, context) }
  ];

  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages,
    temperature: 0.3
  });

  return parseResponse(response.choices[0].message.content);
}
```

### File Scanner

The context-aware feature uses `fileScanner.js` to gather project context:

```javascript
async function scanFiles(directory) {
  const patterns = ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx', '**/*.json'];
  const ignore = await loadGitignore(directory);

  const files = await glob(patterns, {
    cwd: directory,
    ignore: [...ignore, 'node_modules/**', '.git/**']
  });

  return files
    .filter(file => getFileSize(file) < MAX_FILE_SIZE) // 20KB limit
    .slice(0, MAX_FILES) // Limit file count
    .map(file => ({
      path: file,
      content: readFileSync(file, 'utf-8')
    }));
}
```

### Configuration Management

Local configuration stored at `~/.dev-helper/config.json`:

```javascript
// config.js
const CONFIG_PATH = path.join(os.homedir(), '.dev-helper', 'config.json');

function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) return {};
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function setConfig(key, value) {
  const config = getConfig();
  config[key] = value;
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}
```

## Server Layer

### Express.js Setup

```javascript
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://dev-helper-zeta.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/analyze', authMiddleware, aiRateLimiter, analyzeRoutes);
// ... etc
```

### Authentication Middleware

```javascript
// authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Rate Limiting

```javascript
// rateLimiter.js
const rateLimit = require('express-rate-limit');

const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  keyGenerator: (req) => req.user?.id || req.ip,
  message: { error: 'Too many requests, please try again later' }
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many login attempts' }
});
```

### OpenAI Service

```javascript
// openaiService.js
const OpenAI = require('openai');
const { estimateTokens } = require('../utils/tokenEstimator');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function sendPrompt(systemPrompt, userPrompt, options = {}) {
  const totalTokens = estimateTokens(systemPrompt + userPrompt);

  if (totalTokens > 8000) {
    throw new Error('Input exceeds token limit');
  }

  const response = await client.chat.completions.create({
    model: options.model || 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: options.temperature || 0.3
  });

  return response.choices[0].message.content;
}
```

### Data Models

**User Model**

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

**Response Model**

```javascript
// models/Response.js
const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  command: {
    type: String,
    enum: ['analyze', 'explain', 'fix', 'generate', 'scaffold', 'terminal'],
    required: true
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});
```

### Token Estimation

```javascript
// utils/tokenEstimator.js
function estimateTokens(text) {
  // Rough heuristic: ~4 characters per token
  return Math.ceil(text.length / 4);
}

function truncateToTokenLimit(text, maxTokens = 6000) {
  const currentTokens = estimateTokens(text);
  if (currentTokens <= maxTokens) return text;

  const charLimit = maxTokens * 4;
  return text.substring(0, charLimit) + '\n... [truncated]';
}
```

## Client Layer

### React Router Configuration

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analyze" element={
          <PrivateRoute><Analyze /></PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute><History /></PrivateRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### API Client

```javascript
// utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('dev-helper-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dev-helper-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Protected Routes

```jsx
// utils/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('dev-helper-token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

### File Upload Component

```jsx
// Analyze.jsx (excerpt)
function Analyze() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file.size > 100 * 1024) {
      alert('File too large (max 100KB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result);
      setLanguage(detectLanguage(file.name));
    };
    reader.readAsText(file);
  };

  const detectLanguage = (filename) => {
    const ext = filename.split('.').pop();
    const langMap = {
      js: 'javascript',
      ts: 'typescript',
      py: 'python',
      // ... etc
    };
    return langMap[ext] || 'plaintext';
  };
}
```

## Cross-Layer Communication

### CLI to Server

```javascript
// CLI making authenticated request
const axios = require('axios');
const { getToken, getApiUrl } = require('./utils/config');

async function analyzeViaServer(code, language) {
  const response = await axios.post(
    `${getApiUrl()}/analyze`,
    { code, language },
    {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
}
```

### Response Parsing

Both CLI and server extract code blocks from GPT responses:

```javascript
function extractCodeBlock(response) {
  const codeBlockRegex = /```[\w-]*\n([\s\S]*?)```/g;
  const matches = [...response.matchAll(codeBlockRegex)];

  if (matches.length > 0) {
    return matches.map(m => m[1].trim());
  }

  return [response]; // Fallback to full response
}
```

## Error Handling

### Server Error Handler

```javascript
// utils/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid token' });
  }

  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
}
```

### CLI Error Display

```javascript
const chalk = require('chalk');
const ora = require('ora');

async function handleCommand(fn) {
  const spinner = ora('Processing...').start();

  try {
    const result = await fn();
    spinner.succeed('Done!');
    return result;
  } catch (error) {
    spinner.fail(chalk.red('Error: ' + error.message));

    if (error.response?.status === 401) {
      console.log(chalk.yellow('Please run: dev-helper login'));
    }

    process.exit(1);
  }
}
```
