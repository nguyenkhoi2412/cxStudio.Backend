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
};

export default cacheInstance;
