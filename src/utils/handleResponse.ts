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
  if (response.message == undefined) {
    res
      .status(response.statusCode)
      .json({ success: true, payload: response.data });
  } else {
    res
      .status(response.statusCode)
      .json({ success: false, message: response.message });
  }
}
