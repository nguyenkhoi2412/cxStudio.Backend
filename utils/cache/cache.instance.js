import nodeCache from "node-cache";
let cache = null;

const cacheInstance = {
  start: (done) => {
    if (cache) return done();
    cache = new nodeCache({ stdTTL: process.env.CACHE_DURATION });
  },
  instance: () => {
    return cache;
  },
  get: async (key) => {
    const value = await cache.get(key);
    if (value !== null && value !== undefined) return JSON.parse(value);

    return null;
  },
  set: async (key, value) => {
    await cache.set(key, JSON.stringify(value));
  },
  take: async (key) => {
    const value = await cache.take(key);
    if (value !== null && value !== undefined) return JSON.parse(value);

    return null;
  },
  put: async (key, value) => {
    // get data from cache
    let data = await cache.get(key);
    if (data !== null && data !== undefined) {
      // delete old
      await cache.del(key);
    }

    await cache.set(key, JSON.stringify(value));
  },
  del: async (key) => {
    cache.del(key);
  },
  clearCache: async () => {
    await cache.flushAll();
  },
};

export default cacheInstance;
