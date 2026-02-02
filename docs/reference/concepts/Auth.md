# JWT Authentication Reference
## What is JWT?
**JSON Web Token (JWT)** is a compact, URL-safe way of representing claims between two parties. It's used for **stateless authentication** in modern applications.

A JWT is a string with three parts separated by dots:
```css
header.payload.signature
```
#### Header
- Metadata about the token: algorithm + type.
- Example:
```json
{
 "alg": "HS256",
 "typ": "JWT"
}
```
#### Payload (Claims)
- Contains the actual data ("claims") being transmitted.
- Standard claims:
    - `sub` → subject (user ID)
    - `iat` → issued at (timestamp)
    - `exp` → expiration (timestamp)
- Example:
```json
{
 "userId": "12345",
 "role": "developer",
 "iat": 1698765000,
 "exp": 1698765000
}
```
#### Signature
- Prevents tampering.
- Created by signing `base64(header) + "." + base64(payload)` with a secret or private key.
- Two common algorithms:
    - **HS256** → HMAC + shared secret (simple, fast, used in MVPs).
    - **RS256** → RSA public/private key pair (enterprise, secure, used in SaaS).
---
### Flow: Login → Token → Auth Request → Verify
#### 1. Login
- User authenticates (via CLI `dev-helper login` or fronted `/login`).
- Backend verifies credentials.
- Backend signs a JWT containing `{ userId, role, exp }`.

**Node.js (Express + jsonwebtoken):**
```js
import jwt from "jsonwebtoken";
