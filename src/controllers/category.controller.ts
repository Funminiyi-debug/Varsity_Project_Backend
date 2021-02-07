import { inject, injectable } from "inversify";
import { Controller, Route, Tags, Get, SuccessResponse, Response } from "tsoa";
import { DataResponse } from "../Interfaces/DataResponse";
import ErrorResponseModel from "../Interfaces/ErrorResponseModel";
import { ICategoryService } from "../services/ICategoryService";
import {
  BaseHttpController,
  controller,
  httpGet,
  HttpResponseMessage,
  interfaces,
} from "inversify-express-utils";
import Types from "../types";
import express from "express";

@Route("/categories")
@Tags("Category")
@controller("/categories")
class CategoriesController {
  /**
   *
   */

  constructor(@inject(Types.ICategoryService) private cs: ICategoryService) {
    // super();
  }
  @Get("/")
  @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getCategories(): Promise<DataResponse> {
    const results = await this.cs.getCategories();
    const response: DataResponse = {
      statusCode: 200,
      data: results,
    };
    // return res.status(200).json({ response });
    // return this.ok<DataResponse>(response);
    return response;
  }

  @Get("{id}")
  @httpGet("{id}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async getCategory(id: string): Promise<DataResponse> {
    const results = await this.cs.getCategory(id);
    const response: DataResponse = {
      statusCode: 500,
      data: [],
    };
    if (results.length > 0) {
      response.statusCode = 200;
      response.data = results;
    } else {
      response.statusCode = 404;
      response.data = null;
    }

    return response;
  }
}

export default CategoriesController;
