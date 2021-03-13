import { NextFunction, Request, Response } from "express";
import cachedData from "../../../src/utils/cache-data";
import redisClient from "../../../src/config/redis";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe("Redis Setting to be cached", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("should setup data on the path specified for 15seconds", () => {
    let mockRequest: any = {
      path: "localhost:3000/api/testing",
    };
    const data = { data: "keep this alive" };

    /*===================================================================
     *=== Mocking cacheData function to reduce time of live and add a ===
     *=== Next function as a pointer to know if data was really saved ===
     *===================================================================*/

    // let setData = cachedData;
    // setData = (key, data: any) => {
    //   const TIME_TO_LIVE = 15;
    //   if (data.data != undefined) {
    //     redisClient.setex(key, TIME_TO_LIVE, JSON.stringify(data));
    //     nextFunction();
    //   }
    // };
    // setData(mockRequest.path, data as any);

    // expect(data).toBeDefined();
    // expect(nextFunction).toBeCalled();
  });
});
