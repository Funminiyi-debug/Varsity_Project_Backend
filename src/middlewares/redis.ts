import redisClient from "../config/redis";
import express from "express";
const cache = (req: express.Request, res, next) => {
  const key = req.originalUrl;
  if (req.method == "GET") {
    redisClient.get(key, (error, cachedData) => {
      if (error) throw error;
      if (cachedData != null) {
        return res.json({ success: true, payload: JSON.parse(cachedData) });
      } else {
        return next();
      }
    });
  } else {
    return next();
  }
};
export default cache;
