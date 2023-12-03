import redis from "redis";
let cache = null;

const redisInstance = {
  start: async () => {
    cache = await redis
      .createClient({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.CACHE_PORT || 6379,
      })
      .on("error", (err) => console.log("Redis connection error: ", err))
      .on("connect", (err) => console.log("Connected to Redis Server!"))
      .connect();

    setInterval(function () {
      console.log("Keeping alive with Redis.");
      cache.set("ping", "pong");
    }, 1000 * 4 * 60);
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
    // expire default is 60 * 5 => 5min
    await cache.set(
      key,
      JSON.stringify(value),
      process.env.CACHE_DURATION || 600
    );
  },
  take: async (key) => {
    const value = await cache.get(key);
    if (value !== null && value !== undefined) {
      await cache.del(key);
      return JSON.parse(value);
    }

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
    cache.keys("*", function (err, keys) {
      keys.forEach(function (key, pos) {
        cache.del(key);
      });
    });
  },
};

export default redisInstance;
