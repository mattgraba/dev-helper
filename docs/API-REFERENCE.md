# API Reference

This document provides complete documentation for the Dev Helper REST API.

## Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://dev-helper-0uhn.onrender.com` |
| Development | `http://localhost:3001` |

## Authentication

All AI endpoints require JWT authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User

Creates a new user account.

```http
POST /auth/register
```

**Rate Limit:** 10 requests per 15 minutes

**Request Body:**

```json
{
  "username": "string (3-30 chars, required)",
  "email": "string (valid email, required)",
  "password": "string (min 6 chars, required)"
}
```

**Response (201 Created):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Validation error (missing/invalid fields) |
| 409 | Username or email already exists |
| 429 | Too many registration attempts |

---

### Login

Authenticates a user and returns a JWT token.

```http
POST /auth/login
```

**Rate Limit:** 10 requests per 15 minutes

**Request Body:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe"
  }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Missing username or password |
| 401 | Invalid credentials |
| 429 | Too many login attempts |

---

## AI Endpoints

All AI endpoints require authentication and are subject to rate limiting (20 requests/minute).

### Analyze Code

Analyzes code for bugs, issues, and provides explanations with suggested fixes.

```http
POST /analyze
```

**Request Body:**

```json
{
  "code": "string (required) - The code to analyze",
  "language": "string (required) - Programming language",
  "context": "string (optional) - Additional project context"
}
```

**Response (200 OK):**

```json
{
  "explanation": "The code has a potential null reference issue on line 5...",
  "fix": "function getData(obj) {\n  if (!obj) return null;\n  return obj.data;\n}"
}
```

**Example Request:**

```bash
curl -X POST https://dev-helper-0uhn.onrender.com/analyze \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "function add(a, b) { return a + b }",
    "language": "javascript"
  }'
```

---

### Explain Code

Provides a detailed explanation of how code works.

```http
POST /explain
```

**Request Body:**

```json
{
  "code": "string (required) - The code to explain",
  "language": "string (required) - Programming language"
}
```

**Response (200 OK):**

```json
{
  "explanation": "This function takes two parameters `a` and `b`, and returns their sum using the `+` operator..."
}
```

---

### Fix Code

Automatically fixes broken or buggy code.

```http
POST /fix
```

**Request Body:**

```json
{
  "code": "string (required) - The broken code",
  "language": "string (required) - Programming language",
  "error": "string (optional) - Error message or description of the issue"
}
```

**Response (200 OK):**

```json
{
  "fix": "function add(a, b) {\n  return a + b;\n}",
  "explanation": "Added missing semicolon and fixed syntax error"
}
```

---

### Generate Code

Generates code from a natural language description.

```http
POST /generate
```

**Request Body:**

```json
{
  "description": "string (required) - What the code should do",
  "language": "string (required) - Target programming language"
}
```

**Response (200 OK):**

```json
{
  "code": "function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}",
  "explanation": "This is a recursive implementation of the Fibonacci sequence..."
}
```

**Example Request:**

```bash
curl -X POST https://dev-helper-0uhn.onrender.com/generate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "A function that calculates the factorial of a number",
    "language": "python"
  }'
```

---

### Scaffold Component

Generates React component boilerplate.

```http
POST /scaffold
```

**Request Body:**

```json
{
  "name": "string (required) - Component name",
  "type": "string (optional) - 'functional' or 'class', default: 'functional'",
  "props": "array (optional) - List of prop names",
  "typescript": "boolean (optional) - Generate TypeScript, default: false"
}
```

**Response (200 OK):**

```json
{
  "code": "import React from 'react';\n\nfunction UserCard({ name, email }) {\n  return (\n    <div className=\"user-card\">\n      {/* Component content */}\n    </div>\n  );\n}\n\nexport default UserCard;",
  "filename": "UserCard.jsx"
}
```

---

### Terminal Command

Generates terminal/shell commands from plain English descriptions.

```http
POST /terminal
```

**Request Body:**

```json
{
  "description": "string (required) - What you want to do",
  "os": "string (optional) - 'linux', 'macos', 'windows', default: auto-detect"
}
```

**Response (200 OK):**

```json
{
  "command": "find . -name \"*.log\" -mtime +7 -delete",
  "explanation": "This command finds all .log files older than 7 days and deletes them"
}
```

---

### Get History

Retrieves the user's query history.

```http
GET /history
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| limit | number | 20 | Maximum results to return |
| offset | number | 0 | Number of results to skip |
| command | string | all | Filter by command type |

**Response (200 OK):**

```json
{
  "history": [
    {
      "id": "507f1f77bcf86cd799439011",
      "command": "analyze",
      "input": "function buggy() { ... }",
      "output": "The code has an issue...",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0
}
```

**Example Request:**

```bash
curl -X GET "https://dev-helper-0uhn.onrender.com/history?limit=10&command=analyze" \
  -H "Authorization: Bearer <token>"
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Error Codes

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Rate Limit Response

When rate limited, the response includes headers:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705312800
Retry-After: 45
```

---

## Supported Languages

The API supports the following programming languages:

- JavaScript / TypeScript
- Python
- Java
- C / C++
- C#
- Go
- Rust
- Ruby
- PHP
- Swift
- Kotlin
- SQL
- HTML / CSS
- Shell / Bash
- And more...

---

## SDK Examples

### JavaScript/Node.js

```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://dev-helper-0uhn.onrender.com',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

// Analyze code
const response = await api.post('/analyze', {
  code: 'function test() { return undefined }',
  language: 'javascript'
});

console.log(response.data.explanation);
```

### Python

```python
import requests

BASE_URL = 'https://dev-helper-0uhn.onrender.com'
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Generate code
response = requests.post(
    f'{BASE_URL}/generate',
    headers=headers,
    json={
        'description': 'A function to reverse a string',
        'language': 'python'
    }
)

print(response.json()['code'])
```

### cURL

```bash
# Login
TOKEN=$(curl -s -X POST https://dev-helper-0uhn.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"pass"}' | jq -r '.token')

# Use token for API calls
curl -X POST https://dev-helper-0uhn.onrender.com/explain \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code":"const x = [1,2,3].map(n => n * 2)","language":"javascript"}'
```

---

## Webhooks (Future)

Webhook support for async operations is planned for a future release.

---

## Security Considerations

### Authentication
- All AI endpoints require valid JWT tokens
- Tokens expire after 7 days; re-authenticate when expired
- Store tokens securely; never expose in URLs or logs

### Rate Limiting
- Rate limits are enforced per user (authenticated) or per IP (anonymous)
- Exceeding limits returns `429 Too Many Requests`
- Back off exponentially when rate limited

### Input Validation
- Code inputs are limited to prevent token overflow
- All inputs are sanitized before processing
- Large payloads may be rejected with `400 Bad Request`

### Best Practices
- Use HTTPS exclusively in production
- Rotate API keys periodically
- Monitor for unusual request patterns
- Never include tokens in client-side code that gets bundled

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-01 | Initial API release |
| 1.1.0 | 2024-02 | Added BYOK support, scaffold endpoint |
