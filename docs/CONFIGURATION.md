# Configuration Guide

This document covers all configuration options for Dev Helper across CLI, server, and client environments.

## CLI Configuration

### Configuration File Location

```
~/.dev-helper/config.json
```

On Windows: `C:\Users\<username>\.dev-helper\config.json`

### Configuration Options

| Key | Type | Description |
|-----|------|-------------|
| `token` | string | JWT token from hosted service login |
| `openaiApiKey` | string | OpenAI API key for BYOK mode |
| `apiUrl` | string | Custom API endpoint (for self-hosting) |

### Example Configuration

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "openaiApiKey": "sk-proj-abc123...",
  "apiUrl": "https://my-custom-server.com"
}
```

### Managing Configuration

**Set OpenAI API Key (BYOK Mode):**
```bash
dev-helper config --set-key sk-your-openai-api-key
```

**View Current Configuration:**
```bash
dev-helper config --show
```

**Clear Configuration:**
```bash
dev-helper config --clear
```

**Set Custom API URL:**
```bash
dev-helper config --set-url https://my-server.com
```

---

## Environment Variables

Environment variables take precedence over configuration file values.

### CLI Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (highest priority) | `sk-proj-abc123...` |
| `DEV_HELPER_API_URL` | Custom API server URL | `https://api.example.com` |

**Usage:**
```bash
# Single command with API key
OPENAI_API_KEY=sk-xxx dev-helper analyze -f code.js -l javascript

# Export for session
export OPENAI_API_KEY=sk-xxx
dev-helper analyze -f code.js -l javascript
```

### Server Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Required
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/devhelper
JWT_SECRET=<generate-with-command-below>
OPENAI_API_KEY=sk-proj-your-openai-api-key

# Optional
PORT=3001
NODE_ENV=production
```

> **Security Note:** Generate a strong JWT secret using:
> ```bash
> # Linux/macOS
> openssl rand -base64 32
>
> # Windows (PowerShell)
> [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
> ```
> Never use example secrets from documentation in production.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing JWT tokens (min 32 chars) |
| `OPENAI_API_KEY` | Yes | OpenAI API key for hosted mode |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment: `development` or `production` |

### Client Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=https://dev-helper-0uhn.onrender.com
```

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | Yes | Backend API URL |

---

## Priority Order

Configuration values are resolved in this order (highest priority first):

1. **Environment Variables** - `OPENAI_API_KEY`, `DEV_HELPER_API_URL`
2. **Config File** - `~/.dev-helper/config.json`
3. **Defaults** - Built-in fallback values

```
Environment Variable
        ↓ (if not set)
Config File (~/.dev-helper/config.json)
        ↓ (if not set)
Default Values (production API URL)
```

---

## CORS Configuration

The server allows requests from the following origins:

### Production
- `https://dev-helper-zeta.vercel.app`

### Development
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)

### CLI/Mobile
- Requests without `Origin` header are allowed (for CLI and mobile apps)

> **Note:** This is required for CLI tools but means CORS is not a security boundary for this API. Authentication via JWT tokens is the primary access control mechanism.

### Custom CORS (Self-Hosting)

To add custom origins, modify `server/src/index.js`:

```javascript
app.use(cors({
  origin: [
    'https://dev-helper-zeta.vercel.app',
    'http://localhost:5173',
    'https://your-custom-domain.com'  // Add your domain
  ],
  credentials: true
}));
```

---

## Rate Limiting Configuration

### Default Limits

| Endpoint Type | Requests | Window |
|---------------|----------|--------|
| AI Endpoints | 20 | 1 minute |
| Auth Endpoints | 10 | 15 minutes |

### Customizing Rate Limits

Modify `server/src/middleware/rateLimiter.js`:

```javascript
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000,     // Window in milliseconds
  max: 20,                  // Max requests per window
  message: { error: 'Rate limit exceeded' }
});
```

---

## MongoDB Configuration

### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Atlas Configuration

1. Create a cluster at [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a database user with read/write permissions
3. Whitelist your server's IP address in Network Access settings
4. Get the connection string from the "Connect" button

> **Security Warning:** Never use `0.0.0.0/0` (allow all IPs) in production. Always restrict database access to specific IP addresses or use VPC peering for cloud deployments.

### Local MongoDB

For local development:

```env
MONGO_URI=mongodb://localhost:27017/devhelper
```

---

## JWT Configuration

### Token Expiration

Tokens expire after **7 days**. To change this, modify `server/src/controllers/authController.js`:

```javascript
const token = jwt.sign(
  { id: user._id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }  // Change this value
);
```

### Token Format

Tokens are passed in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## File Scanning Configuration

### Context Scanning Limits

Located in `cli/utils/fileScanner.js`:

| Setting | Default | Description |
|---------|---------|-------------|
| Max File Size | 20KB | Skip files larger than this |
| Max Files | 50 | Maximum files to include |
| Patterns | `*.js, *.ts, *.jsx, *.tsx, *.json` | File types to scan |

### Default Exclusions

- `node_modules/**`
- `.git/**`
- `dist/**`
- `build/**`
- Files in `.gitignore`

### Customizing Exclusions

Modify `cli/utils/fileScanner.js`:

```javascript
const DEFAULT_IGNORE = [
  'node_modules/**',
  '.git/**',
  'dist/**',
  'build/**',
  'coverage/**',       // Add custom exclusions
  '*.test.js'
];
```

---

## Self-Hosting Configuration

To run your own Dev Helper server:

### 1. Clone and Install

```bash
git clone https://github.com/your-username/dev-helper.git
cd dev-helper/server
npm install
```

### 2. Configure Environment

```env
MONGO_URI=mongodb://localhost:27017/devhelper
JWT_SECRET=<run: openssl rand -base64 32>
OPENAI_API_KEY=sk-your-openai-key
PORT=3001
```

### 3. Start Server

```bash
npm start
```

### 4. Configure CLI to Use Custom Server

```bash
dev-helper config --set-url http://localhost:3001
```

Or via environment variable:

```bash
export DEV_HELPER_API_URL=http://localhost:3001
```

---

## Development Configuration

### Running All Services

**Terminal 1 - Server:**
```bash
cd server
npm run dev  # Uses nodemon for hot reload
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev  # Vite dev server on port 5173
```

**Terminal 3 - CLI (testing):**
```bash
npm link  # Link CLI globally
dev-helper --help
```

### Development Environment Variables

**Server (`server/.env`):**
```env
MONGO_URI=mongodb://localhost:27017/devhelper-dev
JWT_SECRET=<run: openssl rand -base64 32>
OPENAI_API_KEY=sk-your-dev-key
PORT=3001
NODE_ENV=development
```

> **Important:** Generate a unique secret even for development. Never commit `.env` files to version control.

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:3001
```

---

## Production Deployment Checklist

- [ ] Generate strong `JWT_SECRET` with `openssl rand -base64 32`
- [ ] Use production MongoDB Atlas cluster with IP whitelist (not `0.0.0.0/0`)
- [ ] Set `NODE_ENV=production`
- [ ] Configure CORS for production domain only
- [ ] Enable HTTPS (required for secure cookies/tokens)
- [ ] Set up monitoring/logging
- [ ] Review rate limits for your expected traffic
- [ ] Configure MongoDB backups
- [ ] Ensure `.env` files are in `.gitignore`
- [ ] Rotate secrets if they were ever exposed in commits
