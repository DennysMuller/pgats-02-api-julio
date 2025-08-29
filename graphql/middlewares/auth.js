const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'segredo';

function getUserFromToken(token) {
  try {
    if (!token) return null;
    return jwt.verify(token.replace('Bearer ', ''), SECRET);
  } catch {
    return null;
  }
}

module.exports = { getUserFromToken };
