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
  del: async (key) => {
    cache.del(key);
  },
  clearAll: async () => {
    await cache.flushAll();
  },
};

export default cacheInstance;
