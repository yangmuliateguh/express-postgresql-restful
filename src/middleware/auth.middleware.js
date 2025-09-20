const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken')
const tokenBlacklist = require('../utils/tokenBlacklist')

const JWT_SECRET = process.env.JWT_SECRET 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function getTokenFromHeader(req) {
  const authHeader = req.headers['authorization']
  if (!authHeader) return null
  return authHeader.split(' ')[1] 
}

function authenticateToken(req, res, next) {
  const token = getTokenFromHeader(req)
  console.log('=== AUTH DEBUG ===')
  console.log('Authorization Header:', req.headers['authorization'])
  console.log('Extracted Token:', token)
  console.log('==================')

  if (!token) {
    return res.status(401).json({ error: 'Token required' });
  }

  if (tokenBlacklist.has(token)) {
     return res.status(401).json({ error: 'Token has been revoked' })
  }

  try {
    const user = jwt.verify(token, JWT_SECRET)
    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    res.status(403).json({ error: 'Invalid token' })
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