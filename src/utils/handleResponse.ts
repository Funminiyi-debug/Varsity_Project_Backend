import { Response } from "express";
import { DataResponse } from "../interfaces/DataResponse";

export function handleResponse(res: Response, response: DataResponse) {
  if (response.message == undefined) {
    return res
      .status(response.statusCode)
      .json({ success: true, payload: response.data });
  }
  return res
    .status(response.statusCode)
    .json({ success: false, message: response.message });
}
