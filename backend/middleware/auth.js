const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_if_not_set');
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Attaches req.admin when a valid token is present, but never blocks the request.
const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      req.admin = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'fallback_secret_if_not_set');
    } catch (err) {
      // ignore invalid/expired token for public routes
    }
  }
  next();
};

module.exports = auth;
module.exports.optionalAuth = optionalAuth;
