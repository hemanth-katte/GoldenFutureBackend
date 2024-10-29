const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT secret key is missing in the environment variables.');
  process.exit(1); 
}

function verifyToken(req, res, next) {
  var token = req.header('Authorization');
  const parts = token.split(" ");
  token = parts[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
