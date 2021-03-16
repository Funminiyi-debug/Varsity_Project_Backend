import { Response } from "express";
import { Status } from "tslint/lib/runner";
import { DataResponse } from "../interfaces/DataResponse";
enum StatusCode {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  CONFLICT = 409,
  BAD_DATA = 400,
  CREATED = 201,
  OK = 200,
  NO_CONTENT = 204,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  UNPROCESSED = 422,
}

export function handleResponse(res: Response, response: DataResponse) {
  switch (response.statusCode) {
    case StatusCode.OK:
      return res.status(response.statusCode).json({
        success: true,
        payload: response.data,
        message: response.message,
      });
    case StatusCode.NO_CONTENT:
      return res.status(response.statusCode).json({
        success: true,
        payload: response.data,
        message: response.message,
      });

    case StatusCode.CREATED:
      return res
        .header("Location", `${res.locals.url}/${response.data._id}`)
        .status(response.statusCode)
        .json({
          success: true,
          payload: response.data,
          message: response.message,
        });

    default:
      return res.status(response.statusCode).json({
        success: false,
        payload: response.data,
        message: response.message,
      });
  }
  // if (response.message == undefined) {
  //   res
  //     .status(response.statusCode)
  //     .json({ success: true, payload: response.data });
  // } else {
  //   res
  //     .status(response.statusCode)
  //     .json({ success: false, message: response.message });
  // }
}
