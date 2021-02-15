import redisClient from "../config/redis";
import express from "express";
const cache = (req: express.Request, res, next) => {
  const key = req.path;
  redisClient.get(key, (error, cachedData) => {
    if (error) throw error;
    console.log("from cache before condition", cachedData);
    console.log("KEY gotten when we obtain the data", key);
    if (cachedData != null) {
      console.log("from cache", cachedData);
      res.json({ success: true, payload: JSON.parse(cachedData) });
    } else {
      next();
    }
  });
};
export default cache;
