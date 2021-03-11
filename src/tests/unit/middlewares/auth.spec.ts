import { NextFunction, Request, Response } from "express";
import authMiddleware from "../../../middlewares/auth";
import "jest";

describe("user authorization", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  //fake ensureAuth
  let ensureAuth = authMiddleware.ensureAuth;

  it("user authorization should be successfull", () => {
    let mockRequest: any = {
      session: {
        user: {
          phoneCode: "5674",
          verifyCode: "5674",
          verificationStatus: "Verified",
        },
      },
    };

    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });

  it("authorization fails - Not yet Created by Google or Facebook", () => {
    let mockRequest: any = {
      session: {
        user: "",
      },
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(mockResponse.status).toBeCalledWith(401);
    expect(mockResponse.json).toBeCalledWith({
      success: false,
      message: "User Not yet Created by Google or Facebook",
    });
  });
});
