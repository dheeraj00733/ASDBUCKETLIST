const TTL_MS = 60 * 1000; // 1 minute

// In-memory cache store
const cache = new Map();

/**
 * Get a cache entry by key.
 * Returns the stored data if the entry exists and is not expired.
 * Returns null if the entry does not exist or is expired.
 */
const getEntry = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;

  if (isExpired(entry)) {
    console.log(`[CACHE] EXPIRED: ${key}`);
    cache.delete(key);
    return null;
  }

  return entry;
};

/**
 * Store data in the cache with a createdAt timestamp.
 */
const setEntry = (key, data) => {
  cache.set(key, { data, createdAt: Date.now() });
};

/**
 * Delete a single cache entry.
 */
const deleteEntry = (key) => {
  cache.delete(key);
};

/**
 * Clear all cache entries.
 */
const clearCache = () => {
  console.log(`[CACHE] CLEARED: all ${cache.size} entries removed`);
  cache.clear();
};

/**
 * Check if a cache entry has exceeded the 1-minute TTL.
 * Compares Date.now() - entry.createdAt against TTL_MS (60000 ms).
 * Expired entries should be deleted and treated as a cache MISS.
 */
const isExpired = (entry) => {
  return Date.now() - entry.createdAt > TTL_MS;
};

/**
 * Get the age of a cache entry in seconds.
 * Used to set the X-Cache-Age response header on cache HITs.
 */
const getCacheAge = (entry) => {
  return Math.floor((Date.now() - entry.createdAt) / 1000);
};

module.exports = {
  TTL_MS,
  getEntry,
  setEntry,
  deleteEntry,
  clearCache,
  isExpired,
  getCacheAge,
};
