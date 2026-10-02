const { getEntry, setEntry, getCacheAge } = require('./cache');

/**
 * Cache middleware for GET requests.
 * - On cache HIT: sets X-Cache: HIT and X-Cache-Age headers, returns cached data.
 * - On cache MISS/EXPIRED: sets X-Cache: MISS, wraps res.json to capture the
 *   response data and store it in the cache (only for status 200), then calls next().
 */
const cacheMiddleware = (req, res, next) => {
  // Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl;
  const entry = getEntry(key);

  // Cache HIT
  if (entry) {
    res.set('X-Cache', 'HIT');
    res.set('X-Cache-Age', String(getCacheAge(entry)));
    return res.json(entry.data);
  }

  // Cache MISS — intercept res.json to store the response
  res.set('X-Cache', 'MISS');

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    // Only cache successful responses
    if (res.statusCode === 200) {
      setEntry(key, body);
    }
    return originalJson(body);
  };

  next();
};

module.exports = cacheMiddleware;
