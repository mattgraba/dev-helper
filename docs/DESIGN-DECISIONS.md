# Design Decisions

This document explains the key architectural and technical decisions made during the development of Dev Helper, along with the rationale behind each choice.

## 1. Dual-Mode Architecture (BYOK vs Hosted)

### Decision
Implement two distinct operating modes: Bring Your Own Key (BYOK) for direct OpenAI API access, and Hosted Service mode for managed API access with user accounts.

### Rationale
- **Privacy Concerns**: Many developers prefer not to send their code through third-party servers. BYOK mode ensures API keys and code never leave the user's machine.
- **Zero Friction Entry**: BYOK allows immediate use without account creation, reducing barrier to adoption.
- **Enterprise Use Cases**: Organizations with existing OpenAI contracts can use their own keys while still benefiting from Dev Helper's features.
- **Cost Flexibility**: Users can choose between using their own API credits or a managed service.

### Trade-offs
- Increased code complexity (two code paths)
- CLI needs to handle both authentication and direct API calls
- Some features (history) require hosted mode

### Implementation
```
Priority Chain:
1. Environment variable (OPENAI_API_KEY)
2. Config file (~/.dev-helper/config.json openaiApiKey)
3. Hosted service (JWT authentication)
```

---

## 2. Context-Aware Code Analysis

### Decision
Allow the CLI to scan surrounding project files and include them as context in AI prompts.

### Rationale
- **Better Analysis**: AI can understand how code fits into the larger project
- **Accurate Suggestions**: Fixes can reference actual project patterns and conventions
- **Type Awareness**: In TypeScript projects, type definitions inform better responses

### Safeguards
- **File Size Limit**: 20KB per file to prevent token explosion
- **File Count Limit**: Maximum files to scan
- **Gitignore Respect**: Excludes files listed in `.gitignore`
- **Default Exclusions**: Always excludes `node_modules`, `.git`, build artifacts

### Trade-offs
- Increased token usage (higher API costs)
- Slower response times with large contexts
- Privacy implications (more code sent to API)

---

## 3. Token Estimation Strategy

### Decision
Use a simple character-based heuristic (1 token ≈ 4 characters) rather than exact tokenization.

### Rationale
- **Performance**: Exact tokenization requires loading large model files
- **Sufficient Accuracy**: Heuristic is accurate enough to prevent API errors
- **Memory Efficiency**: No need to load tokenizer libraries

### Implementation
```javascript
function estimateTokens(text) {
  return Math.ceil(text.length / 4);
}
```

### Trade-offs
- May reject valid requests that would fit
- May accept requests that are slightly over limit
- Acceptable margin of error for this use case

---

## 4. Graceful MongoDB Failure Handling

### Decision
Allow the server to start and operate even when MongoDB is unavailable.

### Rationale
- **Core Functionality First**: AI features don't require database
- **Development Convenience**: Easier local development without MongoDB
- **Resilience**: Partial functionality better than complete outage

### Implementation
```javascript
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.warn('MongoDB unavailable - history features disabled');
    // Server continues without database
  });
```

### Trade-offs
- Users may not immediately notice history is unavailable
- Requires null checks throughout codebase
- Some features silently degrade

---

## 5. JWT Token Expiration (7 Days)

### Decision
Set JWT tokens to expire after 7 days.

### Rationale
- **Balance**: Long enough for convenience, short enough for security
- **CLI Use Case**: Users shouldn't need to re-authenticate daily
- **Stateless**: No server-side session storage required

### Alternatives Considered
- **1 Hour**: Too short for CLI tool, frustrating UX
- **30 Days**: Too long, security risk if token leaked
- **Refresh Tokens**: Added complexity not justified for this use case

---

## 6. Rate Limiting Strategy

### Decision
Implement tiered rate limiting: 20 requests/minute for AI endpoints, 10 requests/15 minutes for auth endpoints.

### Rationale
- **API Cost Protection**: Prevents accidental or malicious API abuse
- **Brute Force Prevention**: Auth rate limit stops password guessing
- **Fair Usage**: Ensures service availability for all users

### Key Generation
```javascript
keyGenerator: (req) => req.user?.id || req.ip
```

- Authenticated users: rate limit by user ID (allows multiple devices)
- Anonymous users: rate limit by IP address

---

## 7. Response Format Parsing

### Decision
Use regex-based extraction to parse code blocks from GPT responses.

### Rationale
- **Consistent Output**: GPT responses vary in format
- **Clean Display**: Users see just the code, not markdown formatting
- **Fallback Handling**: If parsing fails, return full response

### Implementation
```javascript
const codeBlockRegex = /```[\w-]*\n([\s\S]*?)```/g;
```

### Trade-offs
- May miss unconventional response formats
- Language tags in code blocks are discarded
- Multiple code blocks returned as array

---

## 8. Technology Choices

### Frontend: React 19 + Vite

**Why React 19:**
- Industry standard with large ecosystem
- Team familiarity
- Component reusability
- Strong TypeScript support

**Why Vite:**
- Significantly faster than Create React App
- Native ES modules for development
- Optimized production builds
- Modern tooling

### Backend: Express.js

**Why Express:**
- Minimal and flexible
- Large middleware ecosystem
- Easy to understand and maintain
- Sufficient for current scale

**Alternatives Considered:**
- Fastify: Faster but less ecosystem support
- NestJS: Too heavyweight for this project
- Hono: Newer, less mature ecosystem

### Database: MongoDB Atlas

**Why MongoDB:**
- Schema flexibility (varying response structures)
- JSON-native (matches API response format)
- Easy cloud deployment (Atlas)
- Good Node.js driver

**Alternatives Considered:**
- PostgreSQL: Better for relational data, but overkill here
- SQLite: Local only, doesn't support multi-instance deployment
- Redis: No persistence guarantees needed

---

## 9. CLI Framework: Commander.js

### Decision
Use Commander.js for CLI argument parsing.

### Rationale
- **Mature**: Battle-tested in thousands of projects
- **Full-Featured**: Built-in help, options, subcommands
- **TypeScript Support**: Good type definitions
- **Documentation**: Extensive examples and docs

### Alternatives Considered
- **yargs**: More complex API, similar features
- **oclif**: Too heavyweight, better for larger CLIs
- **cac**: Lighter but fewer features

---

## 10. UI Component Library: shadcn/ui

### Decision
Use shadcn/ui (Radix UI + Tailwind) for the web interface.

### Rationale
- **Copy-Paste Components**: Own the code, no npm dependency
- **Accessibility**: Built on Radix UI primitives
- **Customizable**: Easy to modify to match design needs
- **Tailwind Integration**: Consistent with existing styling approach

### Alternatives Considered
- **Material UI**: Too opinionated, larger bundle
- **Chakra UI**: Good but heavier runtime
- **Headless UI**: Fewer components out of the box

---

## 11. Error Messages Over Error Codes

### Decision
Return human-readable error messages rather than error codes.

### Rationale
- **Developer Experience**: Errors should be self-explanatory
- **Debugging Speed**: No need to look up error codes
- **CLI Context**: Messages display directly to users

### Implementation
```json
{
  "error": "Invalid credentials. Please check your username and password."
}
```

Rather than:
```json
{
  "code": "AUTH_001",
  "message": "Authentication failed"
}
```

---

## 12. Local-First Configuration

### Decision
Store configuration in user's home directory (`~/.dev-helper/config.json`).

### Rationale
- **Persistence**: Config survives reinstalls
- **User Ownership**: Clear where settings are stored
- **Unix Convention**: Follows `.config` pattern
- **Multi-Project**: Same config works across all projects

### Structure
```json
{
  "token": "jwt-token-here",
  "openaiApiKey": "sk-...",
  "apiUrl": "https://custom-api.example.com"
}
```

---

## 13. File Size Limits

### Decision
Limit uploaded files to 100KB in web UI, 20KB per file in context scanning.

### Rationale
- **Token Budget**: Large files consume expensive API tokens
- **Response Quality**: Too much context degrades AI response quality
- **Performance**: Large payloads slow down requests
- **Memory**: Prevents browser/server memory issues

---

## 14. No WebSocket for Real-Time

### Decision
Use standard REST API rather than WebSockets for AI responses.

### Rationale
- **Simplicity**: REST is sufficient for request/response pattern
- **Caching**: REST responses can be cached
- **Infrastructure**: Simpler deployment without WebSocket support
- **Streaming**: Future enhancement can add SSE for streaming responses

### Future Consideration
Server-Sent Events (SSE) could be added for streaming responses without full WebSocket complexity.

---

## 15. Monorepo Structure

### Decision
Keep CLI, server, and client in single repository.

### Rationale
- **Simplified Development**: One clone, one setup
- **Atomic Changes**: Changes across layers in single PR
- **Shared Types**: Potential for shared type definitions
- **Deployment Coordination**: Version changes stay synchronized

### Trade-offs
- Larger repository size
- CI/CD needs to detect which packages changed
- Not suitable for teams with strict separation of concerns
