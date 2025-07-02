const jwt = require('jsonwebtoken');

// Load secret from env or fallback
const JWT_SECRET = process.env.JWT_SECRET || 'dev-helper-secret';   // Ensures only valid, signed tokens are accepted

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Reads the client's token from the Authorization header

  if (!authHeader || !authHeader.startsWith('Bearer ')) { // Ensures the token is in the correct format (Bearer <token>)
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1]; // Extracts the token from the header

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Confirms authenticity & integrity of token
    req.user = { id: decoded.id }; // Passes user context to later handlers
    next(); // Allows valid requests to proceed
  } catch (err) {
    console.error('Invalid token:', err.message); // Logs any errors
    res.status(401).json({ error: 'Invalid or expired token' }); // Denies access if token is bad or missing
  }
}

module.exports = authMiddleware;    // Exports the function so it can be used in other files
