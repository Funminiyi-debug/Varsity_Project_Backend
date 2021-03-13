import { NextFunction, Request, Response } from "express";
import cache from "../../../src/middlewares/redis";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe("Redis Middleware", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("should throw an error message", () => {
    let mockRequest: any = {
      path: "localhost:3000/",
    };

    // cache(
    //   mockRequest as Request,
    //   mockResponse as Response,
    //   nextFunction as NextFunction
    // );

    // expect(() => {
    //   throw Error;
    // }).toThrow();
  });
});
