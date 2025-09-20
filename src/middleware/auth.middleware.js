const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET; 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return null
  return authHeader.split(' ')[1] 
}

function authenticateToken(req, res, next) {
  const token = getTokenFromHeader(req);
  console.log('=== AUTH DEBUG ===');
  console.log('Authorization Header:', req.headers['authorization']);
  console.log('Extracted Token:', token);
  console.log('==================');

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.error('JWT Verify Error:', err.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

function authorizeRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: 'Forbidden' })
    }
    next()
  }
}

module.exports = {
  authenticateToken,
  authorizeRole
}