import redisClient from "../config/redis";
import { DataResponse } from "../interfaces/DataResponse";

const cacheData = (key, data: DataResponse) => {
  const TIME_TO_LIVE: number = parseInt(process.env.CACHE_EXPIRY_TIME);
  if (data.data != undefined) {
    redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(data.data));
  }
};

const refreshCache = (key) => {
  redisClient.del(key);
};

const flushCache = () => {
  redisClient.flushall();
};

export { cacheData, refreshCache, flushCache };
