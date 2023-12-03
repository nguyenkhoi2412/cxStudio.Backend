// import redis from "redis";
// let cache = null;

// const redisInstance = {
//   start: async () => {
//     cache = await redis
//       .createClient(process.env.CACHE_PORT || 6379)
//       .on("error", (err) => console.log("Redis Client Error", err))
//       .on("connect", (err) => console.log("Redis Client Started"))
//       .connect();
//   },
//   instance: () => {
//     return cache;
//   },
//   get: async (key) => {
//     const value = await cache.get(key);
//     return JSON.parse(value);
//   },
//   set: async (key, value) => {
//     // expire default is 60 * 5 => 300min
//     await cache.set(key, JSON.stringify(value), process.env.CACHE_DURATION || 600);
//   },
//   del: async (key) => {
//     cache.del(key);
//   },
//   clearAll: async () => {},
// };

// export default redisInstance;
