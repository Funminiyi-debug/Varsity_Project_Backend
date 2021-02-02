/**import UserController from "../controllers/user.controller";
import { Request, Response } from "express";

const allUsers = new UserController().getAllUsers(Request, Response);

describe("Get all users request", async () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject = {};

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      statusCode: 0,
      send: jest.fn().mockImplementation((result) => {
        responseObject = result;
      }),
    };
  });

  test("200 - users", () => {
    const expectedStatusCode = 200;
    const expectedResponse = {
      data: [
        {
          userId: 123,
          email: "xxx.gmail.com",
          password: "xxx",
          phone: "09090909090",
        },
        {
          userId: 124,
          email: "yyy.gmail.com",
          password: "yyy",
          phone: "07090909090",
        },
        {
          userId: 125,
          email: "zzz.gmail.com",
          password: "zzz",
          phone: "08090909090",
        },
      ],
      statusCode: 200,
    };
    allUsers(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.statusCode).toBe(expectedStatusCode);
    expect(responseObject).toStrictEqual(expectedResponse);
  });
});*/
