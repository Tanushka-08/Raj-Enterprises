/**
 * Tiny in-memory rate limiter (no extra dependency).
 *
 * Purpose: blunt brute-force / spam on the public write endpoints
 * (admin login, service booking, enquiries, reviews, customers).
 * Counters live in this process only, which is the right scope for a
 * single-instance Node deployment. Keys are bucketed per IP.
 */
const buckets = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}, 60 * 1000).unref?.();

const clientKey = (req) => {
  // Use Express' resolved client IP. It already honours the app's
  // `trust proxy` setting, so it reflects the real client behind the load
  // balancer. Reading x-forwarded-for by hand here would let any caller
  // spoof a fresh bucket per request and bypass the limiter entirely.
  return req.ip || req.socket?.remoteAddress || 'unknown';
};

/**
 * @param {object}   options
 * @param {number}   options.windowMs  Time window in ms
 * @param {number}   options.max       Max requests allowed per window
 * @param {string}   options.message   JSON message returned when blocked
 * @param {boolean}  options.skipSuccessful  Only count failed requests (login brute force)
 */
const rateLimit = ({ windowMs = 60_000, max = 20, message = 'Too many requests. Please try again later.', skipSuccessful = false } = {}) => (req, res, next) => {
  const key = `${req.baseUrl}${req.path}|${req.method}|${clientKey(req)}`;
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    res.setHeader('X-RateLimit-Limit', String(max));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - 1)));
    return next();
  }

  entry.count += 1;

  const remaining = Math.max(0, max - entry.count);
  res.setHeader('X-RateLimit-Limit', String(max));
  res.setHeader('X-RateLimit-Remaining', String(remaining));

  if (entry.count > max) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ message, retryAfter });
  }

  // For failed-login protection, hand the outcome to the controller via a flag
  // and roll the counter back once the response has been flushed.
  if (skipSuccessful) {
    res.on('finish', () => {
      if (res.statusCode < 400) {
        entry.count = Math.max(0, entry.count - 1);
      }
    });
  }

  next();
};

module.exports = rateLimit;
