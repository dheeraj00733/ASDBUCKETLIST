const { clearCache } = require('./cache');

/**
 * Cache invalidation middleware for write operations.
 * Listens for the 'finish' event on the response and clears the entire cache
 * only when the request method is POST, PUT, PATCH, or DELETE and the
 * response status code is in the 2xx range (i.e. data was actually changed).
 * Failed requests (4xx/5xx) do NOT invalidate the cache.
 */
const invalidateCache = (req, res, next) => {
  res.on('finish', () => {
    const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

    if (isWriteMethod && isSuccess) {
      clearCache();
    }
  });

  next();
};

module.exports = invalidateCache;
