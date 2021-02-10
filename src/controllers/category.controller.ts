import { inject, injectable } from "inversify";
import {
  Controller,
  Route,
  Tags,
  Get,
  SuccessResponse,
  Response,
  Post,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import { ICategoryService } from "../services/ICategoryService";
import Types from "../types";
import express, { response } from "express";
import ICategory from "../interfaces/ICategory";

@Route("/categories")
@Tags("Category")
// @controller("/categories")
class CategoriesController extends Controller {
  constructor(@inject(Types.ICategoryService) private cs: ICategoryService) {
    super();
  }
  @Get("/")
  // @httpGet("/")
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
  // @httpGet("{id}")
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

  /**@Post("/")
  @SuccessResponse("201", "Created")
  public async createCategory(category: ICategory): Promise<DataResponse> {
    console.log("from user", category);
    const response: DataResponse = {
      statusCode: 500,
      data: [],
    };
    try {
      const results = await this.cs.createCategory(category);
      console.log("from db");
      response.statusCode = 201;
      response.data = results;
      return response;
    } catch (error) {
      console.log(error);
      return response;
    }
  }*/
}

export default CategoriesController;
