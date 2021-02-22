import { Response } from "express";
import { Status } from "tslint/lib/runner";
import { DataResponse } from "../interfaces/DataResponse";
enum StatusCode {
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
  CONFLICT = 409,
  BAD_DATA = 400,
}

export function handleResponse(res: Response, response: DataResponse) {
  // switch (response.statusCode) {
  //   case StatusCode.BAD_DATA:

  //     return res
  //       .status(response.statusCode)
  //       .json({ success: false, payload: response.data });

  //   default:
  //     break;
  // }
  if (response.message == undefined) {
    return res
      .status(response.statusCode)
      .json({ success: true, payload: response.data });
  }
  return res
    .status(response.statusCode)
    .json({ success: false, message: response.message });
}
