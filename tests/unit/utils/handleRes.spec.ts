import { Response } from "express";
import { handleResponse } from "../../../src/utils/handleResponse";

describe("handle response data to be sent to the client", () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn(),
      json: jest.fn(),
    };
  });

  //mocking handleResponse(fake)
  let newFunc = handleResponse;
  newFunc = function (res, data) {
    if (data.message == undefined) {
      res.status(data.statusCode);
      res.json({ success: true, payload: data.data });
    } else {
      res.status(data.statusCode);
      res.json({ success: false, message: data.message });
    }
  };

  it("should return success true since dataResponse obj has no message property", () => {
    const data = "...";
    const expectedStatusCode = 200;
    const dataResponse = { statusCode: 200, data: "..." };
    const expectedResponse = { success: true, payload: data };
    newFunc(mockResponse as Response, dataResponse);
    expect(mockResponse.status).toBeCalledWith(expectedStatusCode);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });

  it("should return success false since dataResponse obj has message property", () => {
    const data = "...";
    const expectedStatusCode = 200;
    const dataResponse = { statusCode: 200, data: "...", message: "..." };
    const expectedResponse = { success: false, message: data };
    newFunc(mockResponse as Response, dataResponse);
    expect(mockResponse.status).toBeCalledWith(expectedStatusCode);
    expect(mockResponse.json).toBeCalledWith(expectedResponse);
  });
});
