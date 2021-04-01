// import redisClient from "../config/redis";
import express from "express";
const cache = (req: express.Request, res, next) => {
  // let key = req.originalUrl;
  // if (req.method == "GET") {
  //   const pageNo = req.header["X-Paging-PageNo"];
  //   const takeCount = req.header["X-Paging-PageCount"];

  //   const containsOtherData = pageNo != undefined || takeCount != takeCount;

  //   if (containsOtherData) {
  //     key = `${key}?pageNo=${pageNo}&takeCount=${takeCount}`;
  //     req.query.pageNo = pageNo;
  //     req.query.takeCount = takeCount;
  //   }

  //   //  response.Headers.Add("X-Paging-PageNo", pageNo.ToString());
  //   //  response.Headers.Add("X-Paging-PageSize", pageSize.ToString());
  //   //  response.Headers.Add("X-Paging-PageCount", pageCount.ToString());
  //   //  response.Headers.Add("X-Paging-TotalRecordCount", total.ToString());

  //   redisClient.get(key, (error, cachedData) => {
  //     if (error) throw error;
  //     if (cachedData != null) {
  //       return res.json({ success: true, payload: JSON.parse(cachedData) });
  //     } else {
  //       return next();
  //     }
  //   });
  // } else {
  return next();
  // }
};
export default cache;
