import { inject, injectable } from "inversify";
import {
  Controller,
  Route,
  Tags,
  Get,
  SuccessResponse,
  Response,
  Post,
  Body,
  Path,
  Put,
  Delete,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import { IDashboardService } from "../services/interfaces";
import Types from "../types";
import express, { response } from "express";
import ICategory from "../interfaces/entities/ICategory";
import { Params } from "@decorators/express";

@Route("/api/metrics")
@Tags("Dashboard")
class DashboardController extends Controller {
  constructor(@inject(Types.IDashboardService) private ds: IDashboardService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  /**
   * Get all categories
   *
   */
  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getMetrics(): Promise<DataResponse> {
    const results = await this.ds.getDashboardMetrics();

    this.response = {
      statusCode: 200,
      data: results,
    };

    return this.response;
  }
}

export default DashboardController;
