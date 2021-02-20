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
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import ICategoryService from "../services/interfaces/icategory.service";
import Types from "../types";
import express, { response } from "express";
import ICategory from "../interfaces/ICategory";
import { Params } from "@decorators/express";

@Route("/categories")
@Tags("Category")
// @controller("/categories")
class CategoriesController extends Controller {
  constructor(@inject(Types.ICategoryService) private cs: ICategoryService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getCategories(): Promise<DataResponse> {
    const results = await this.cs.getCategories();

    this.response = {
      statusCode: 200,
      data: results,
    };

    return this.response;
  }

  @Get("{id}")
  // @httpGet("{id}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async getCategory(id: string): Promise<DataResponse> {
    const results = await this.cs.getCategory(id);

    if (results.length > 0) {
      this.response.statusCode = 200;
      this.response.data = results;
    } else {
      this.response.statusCode = 404;
      this.response.message = "Category not found";
    }

    return this.response;
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("409", "Category already exists")
  public async createCategory(
    @Body() category: ICategory
  ): Promise<DataResponse> {
    console.log("from user", category);

    try {
      if (!category.name || !category.categoryType) {
        return {
          statusCode: 400,
          message: "Please fill all fields",
        };
      }
      const results = await this.cs.createCategory(category);
      if (results == null) {
        this.response = {
          statusCode: 409,
          message: "Category already exists",
        };

        return this.response;
      }
      this.response = {
        statusCode: 201,
        data: results,
      };
    } catch (error) {
      console.log(error);
      this.response = {
        statusCode: 500,
        message: error.message,
      };
    }
    return this.response;
  }

  @Put("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateCategory(
    @Path() id: string,
    @Body() category: ICategory
  ): Promise<DataResponse> {
    try {
      const results = await this.cs.updateCategory(id, category);

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Category not found",
        };
        return this.response;
      }
      this.response = {
        statusCode: 204,
      };
    } catch (error) {
      console.log(error);
      this.response = {
        statusCode: 500,
        message: error.message,
      };
    }
    return this.response;
  }
}

export default CategoriesController;
