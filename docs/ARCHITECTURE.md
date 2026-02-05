# System Architecture

This document provides an overview of the Dev Helper system architecture, including component relationships, data flow, and deployment topology.

## High-Level Architecture

```
                                    +------------------+
                                    |    OpenAI API    |
                                    +--------+---------+
                                             ^
                    +------------------------+------------------------+
                    |                        |                        |
            +-------+-------+        +-------+-------+                |
            |  BYOK Mode    |        | Hosted Mode   |                |
            |  (Direct)     |        | (via Server)  |                |
            +-------+-------+        +-------+-------+                |
                    ^                        ^                        |
                    |                        |                        |
            +-------+-------+        +-------+-------+        +-------+-------+
            |     CLI       |        |     CLI       |        |   Web Client  |
            | (Local Key)   |        | (JWT Auth)    |        |   (React)     |
            +---------------+        +-------+-------+        +-------+-------+
                                             |                        |
                                             v                        v
                                     +-------+------------------------+-------+
                                     |           Express.js Server            |
                                     |  - Authentication (JWT)                |
                                     |  - Rate Limiting                       |
                                     |  - OpenAI Proxy                        |
                                     +------------------+---------------------+
                                                        |
                                                        v
                                              +---------+---------+
                                              |   MongoDB Atlas   |
                                              |  - Users          |
                                              |  - Response History|
                                              +-------------------+
```

## Component Overview

### CLI Layer (`/cli`)

The command-line interface provides direct access to all Dev Helper features.

```
cli/
├── cli.js                 # Main entry point (Commander.js setup)
├── commands/              # Command definitions and handlers
│   ├── analyzeCommand.js
│   ├── analyzeHandlers.js
│   ├── explainCommand.js
│   ├── explainHandlers.js
│   ├── fixCommand.js
│   ├── fixHandlers.js
│   ├── generateCommand.js
│   ├── generateHandlers.js
│   ├── scaffoldCommand.js
│   ├── scaffoldHandlers.js
│   ├── terminalCommand.js
│   ├── terminalHandlers.js
│   ├── historyCommand.js
│   ├── historyHandlers.js
│   ├── loginCommand.js
│   ├── loginHandlers.js
│   ├── configCommand.js
│   └── configHandlers.js
├── services/
│   └── localOpenAI.js     # BYOK mode - direct OpenAI SDK integration
└── utils/
    ├── apiConfig.js       # API URL configuration
    ├── authHelpers.js     # Token management
    ├── config.js          # Local config file management
    ├── fileScanner.js     # Project context scanning
    └── contextHandlerWrapper.js
```

### Server Layer (`/server`)

Express.js backend handling authentication, rate limiting, and OpenAI API proxying.

```
server/
└── src/
    ├── index.js           # Server entry point
    ├── controllers/
    │   └── authController.js
    ├── models/
    │   ├── User.js        # User schema (auth)
    │   └── Response.js    # History schema
    ├── routes/
    │   ├── auth.js
    │   ├── analyze.js
    │   ├── explain.js
    │   ├── fix.js
    │   ├── generate.js
    │   ├── scaffold.js
    │   ├── terminal.js
    │   └── history.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── rateLimiter.js
    ├── services/
    │   └── openaiService.js
    └── utils/
        ├── tokenEstimator.js
        └── errorHandler.js
```

### Client Layer (`/client`)

React-based web interface for browser-based access.

```
client/
└── src/
    ├── main.jsx           # React entry point
    ├── App.jsx            # Router configuration
    ├── pages/
    │   ├── Home.jsx       # Landing page
    │   ├── Analyze.jsx    # Code analysis interface
    │   ├── History.jsx    # Query history viewer
    │   ├── Login.jsx      # Authentication
    │   ├── Register.jsx   # User registration
    │   ├── ForgotPassword.jsx
    │   ├── About.jsx      # Documentation
    │   └── NotFound.jsx   # 404 handler
    ├── components/        # Reusable UI components
    └── utils/
        ├── api.js         # Axios API client
        └── PrivateRoute.jsx
```

## Data Flow Diagrams

### BYOK Mode Flow

```
User Input → CLI → localOpenAI.js → OpenAI API → Response → CLI Output
                                                      ↓
                                              (Optional) Save to
                                              hosted history via API
```

### Hosted Mode Flow

```
User Input → CLI/Web → Express Server → OpenAI API
                            ↓
                    JWT Validation
                            ↓
                    Rate Limit Check
                            ↓
                    Save to MongoDB
                            ↓
                    Response → User
```

### Authentication Flow

```
                    +-------------+
                    |   Client    |
                    +------+------+
                           |
                           | POST /auth/login
                           | {username, password}
                           v
                    +------+------+
                    |   Server    |
                    +------+------+
                           |
                           | 1. Find user by username
                           | 2. bcrypt.compare(password)
                           | 3. Sign JWT token
                           v
                    +------+------+
                    |  Response   |
                    | {token: JWT}|
                    +------+------+
                           |
                           | Store token
                           v
              +------------+------------+
              |                         |
       CLI: ~/.dev-helper/      Web: localStorage
            config.json
```

## Deployment Architecture

```
                        Internet
                            |
            +---------------+---------------+
            |                               |
            v                               v
    +-------+-------+               +-------+-------+
    |    Vercel     |               |    Render     |
    | (Frontend)    |               | (Backend)     |
    | React SPA     |               | Express.js    |
    +---------------+               +-------+-------+
                                            |
                                            v
                                    +-------+-------+
                                    | MongoDB Atlas |
                                    | (Database)    |
                                    +---------------+
```

### Production URLs

| Service | URL | Platform |
|---------|-----|----------|
| Frontend | dev-helper-zeta.vercel.app | Vercel |
| Backend | dev-helper-0uhn.onrender.com | Render |
| Database | MongoDB Atlas cluster | MongoDB |

## Security Architecture

### Authentication

- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Format**: JWT with 7-day expiration
- **Token Storage**:
  - CLI: `~/.dev-helper/config.json`
  - Web: `localStorage`

### Rate Limiting

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| AI Endpoints | 20 requests | 1 minute |
| Auth Endpoints | 10 attempts | 15 minutes |

### API Key Security

- **BYOK Mode**: Keys stored locally, never transmitted to server
- **Environment Priority**: `OPENAI_API_KEY` env var overrides config file
- **Display Masking**: Keys shown as `sk-...****` in CLI output

### CORS Policy

Allowed origins:
- `https://dev-helper-zeta.vercel.app` (production)
- `http://localhost:5173` (Vite dev)
- `http://localhost:3000` (React dev)
- No origin (CLI/mobile requests)

## Scalability Considerations

### Current Limitations

- Single server instance on Render
- MongoDB Atlas shared cluster
- Rate limiting per user/IP

### Scaling Options

1. **Horizontal Scaling**: Deploy multiple server instances behind load balancer
2. **Database Scaling**: Upgrade to dedicated MongoDB cluster
3. **Caching**: Add Redis for session/response caching
4. **CDN**: Already using Vercel's edge network for frontend
