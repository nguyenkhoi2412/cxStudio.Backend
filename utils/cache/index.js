let instance = null;
const Cache = {
  start: async (useRedis) => {
    if (useRedis) {
      await import("./redis.instance.js").then((cache) => {
        cache.default.start();
        instance = cache.default;
      });
    } else {
      // if not, we use node-cache replace for redis cache
      await import("./cache.instance.js").then((cache) => {
        cache.default.start((err) => {
          if (err) console.error(err);
        });
        instance = cache.default;
      });
    }
  },
  has: async (key) => {
    return await instance.has(key);
  },
  get: async (key) => {
    return await instance.get(key);
  },
  set: async (key, value) => {
    await instance.set(key, value);
  },
  take: async (key) => {
    return await instance.take(key);
  },
  put: async (key, value) => {
    await instance.put(key, value);
  },
  del: async (key) => {
    await instance.del(key);
  },
  clearCache: async () => {
    await instance.clearCache();
  },
};

export default Cache;
