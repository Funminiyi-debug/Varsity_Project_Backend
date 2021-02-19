import redisClient from "../config/redis";
import { DataResponse } from "../interfaces/DataResponse";
const cacheData = (key, data: DataResponse) => {
  const TIME_TO_LIVE = 3600;
  if (data.data != undefined) {
    redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(data));
  }
};

export default cacheData;
