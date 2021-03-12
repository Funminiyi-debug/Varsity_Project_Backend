import { NextFunction, Request, Response } from "express";
import { formatProductSchema } from "../../../src/middlewares/product.middleware";
import mongoose from "mongoose";
import "jest";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe("Formating product", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  it("Should return next function", () => {
    let mockRequest: any = {
      body: {
        title: "Phones and Tablets",
        subcategoryId: "23266574098786544",
        adStatus: "pull",
        school: "futa",
        price: "$200",
        delivery: "true",
        id: "6656666",
      },
    };

    formatProductSchema(mockRequest, mockResponse, nextFunction);
    expect(nextFunction).toBeCalled();
  });
});
