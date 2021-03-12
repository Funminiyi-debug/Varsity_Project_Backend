import { NextFunction, Request, Response } from "express";
import { ProductServiceFilter } from "../../../src/middlewares/filter.middleware";
import mongoose from "mongoose";
import "jest";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe("Product filter", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("Should return next function", () => {
    let mockRequest: any = {
      query: {
        name: "taiwo",
        school: "futa",
        priceMin: "$200",
        priceMax: "$1000",
        sortBy: "Newest",
      },
    };

    ProductServiceFilter(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toBeCalled();
  });
});
