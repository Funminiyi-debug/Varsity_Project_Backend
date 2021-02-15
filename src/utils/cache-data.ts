import redisClient from "../config/redis";
import { DataResponse } from "../interfaces/DataResponse";
const cacheData = (key, data: DataResponse) => {
  const TIME_TO_LIVE = 3600;
  if (data.data != undefined) {
    console.log("cached", data.data);
    console.log("Key from the caching operation", key);
    const item = redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(data));
    console.log("cache operation reponded with", item);
  }
};

export default cacheData;
