import cache from "#utils/cache/index";

const CacheConfig = {
  connect: async () => {
    await cache.start(process.env.REDIS_CACHE === "true");
  },
};

export default CacheConfig;
