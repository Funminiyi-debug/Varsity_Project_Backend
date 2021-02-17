import redisClient from "../config/redis";
import express from "express";
const cache = (req: express.Request, res, next) => {
  const key = req.path;
  redisClient.get(key, (error, cachedData) => {
    if (error) throw error;
    if (cachedData != null) {
      res.json({ success: true, payload: JSON.parse(cachedData) });
    } else {
      next();
    }
  });
};
export default cache;
