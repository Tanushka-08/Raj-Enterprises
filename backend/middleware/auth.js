const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const FALLBACK_SECRET = 'fallback_secret_if_not_set';

// Lazy per-process secret for development when JWT_SECRET is not configured
let devSecret = null;

// Refuse to authenticate with a hard-coded/weak secret. In production this
// would let anyone who has read the source mint a valid admin token.
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret === FALLBACK_SECRET) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET must be set to a strong random value in production');
    }
    // In development use a random per-process secret rather than a value that is
    // published in the source: anyone who read this file could otherwise sign
    // their own admin token. The only cost is that logins reset on restart.
    if (!devSecret) {
      devSecret = crypto.randomBytes(48).toString('hex');
      console.warn('[auth] JWT_SECRET is not set - using a temporary random secret. Sessions will end when the server restarts.');
    }
    return devSecret;
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 24) {
    throw new Error('JWT_SECRET must be at least 24 characters in production');
  }
  return secret;
};

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

    const decoded = jwt.verify(token, getSecret());
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
      req.admin = jwt.verify(authHeader.split(' ')[1], getSecret());
    } catch (err) {
      // ignore invalid/expired token for public routes
    }
  }
  next();
};

module.exports = auth;
module.exports.optionalAuth = optionalAuth;
module.exports.getSecret = getSecret;
