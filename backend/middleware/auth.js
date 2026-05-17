const jwt = require('jsonwebtoken');

// Custom middleware that verifies the JWT in the Authorization header
// (Middleware L12 + JWT L13)
function auth(req, res, next) {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Header format: "Bearer <token>"
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // attach the user info to the request
    next();              // pass control to the next handler
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;
