import { NextFunction, Request, Response } from "express";
import authMiddleware from "../../../src/middlewares/auth";
import mongoose from "mongoose";
import * as helper from "../../../src/utils/helperFunction";
import mockedAuthMiddleware from "./mocks/fakeAuthMiddleware";
import "jest";

let mockRequest: Partial<Request>;
let mockResponse: Partial<Response>;
let nextFunction: NextFunction = jest.fn();

describe("User Login Authorization", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });

  //fake ensureAuth
  let ensureAuth = mockedAuthMiddleware.ensureAuth;

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

  it("authorization fails - Phone Registration Stage", () => {
    let mockRequest: any = {
      session: {
        user: {},
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
      message: "Please go back to phone registration Stage",
    });
  });

  it("authorization fails - User hasn't verified code yet", () => {
    let mockRequest: any = {
      session: {
        user: {
          phoneCode: "testing",
        },
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
      message: "User hasn't verified code yet",
    });
  });

  it("authorization fails - User with NonVerified Status", () => {
    let mockRequest: any = {
      session: {
        user: {
          phoneCode: "testing",
          verifyCode: "testing",
          verificationStatus: "NotVerified",
        },
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
      message: "Registration Not Completed",
    });
  });

  it("authorization fails - User with NonVerified Status", () => {
    let mockRequest: any = {
      session: {
        user: {
          phoneCode: "testing",
          verifyCode: "testing",
          verificationStatus: "Restricted",
        },
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
      message: "User Restricted from using App",
    });
  });
});

describe("Google & Facebook Authentication Middlewares", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });
  let ensureAuth = authMiddleware.authMiddleware;
  it("Should automatically allow access through google routes", () => {
    let mockRequest: any = {
      originalUrl: "/api/auth/google",
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });

  it("Should automatically allow access through facebook routes", () => {
    let mockRequest: any = {
      originalUrl: "/api/auth/facebook",
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });

  it("Should automatically allow access through google and its callback routes", () => {
    let mockRequest: any = {
      originalUrl: "/api/auth/google/callback",
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });

  it("Should automatically allow access through facebook and its callback routes", () => {
    let mockRequest: any = {
      originalUrl: "/api/auth/facebook/callback",
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });
});

describe("JWT Middleware", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn(),
    };
  });
  let ensureAuth = authMiddleware.authMiddleware;
  it("JWT - User authorization should be succcessfull, because of a valid token ", () => {
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      email: "adewalejosh@gmail.com",
      displayName: "adeneye adewale",
    };

    const token = helper.generateJwtToken(payload);

    let mockRequest: any = {
      originalUrl: "/api/auth/facebook/callback",
      authorization: `Bearer ${token}`,
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });

  it("JWT - User authorization should fail, because of an invalid token ", () => {
    const token = undefined;

    let mockRequest: any = {
      originalUrl: "/api/auth/facebook/callback",
      authorization: `Bearer ${token}`,
    };
    ensureAuth(
      mockRequest as any,
      mockResponse as Response,
      nextFunction as NextFunction
    );

    expect(nextFunction).toBeCalled();
  });
});
