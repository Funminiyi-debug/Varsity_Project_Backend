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
  Query,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import { ICategoryService } from "../services/interfaces";
import Types from "../types";
import express, { response } from "express";
import ICategory from "../interfaces/entities/ICategory";
import { Params } from "@decorators/express";
import IStaticService from "../services/interfaces/istatic.service";
import StaticPageStatus from "../enums/StaticPageStatus";
import IStaticPage from "../interfaces/entities/StaticPage";

@Route("/api/static-pages")
@Tags("Static Pages")
// @controller("/categories")
class StaticController extends Controller {
  constructor(
    @inject(Types.IStaticService) private staticService: IStaticService
  ) {
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
  public async getStaticPages(
    @Query() status: StaticPageStatus
  ): Promise<DataResponse> {
    const results = await this.staticService.getStaticPages(status);

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
  public async getStaticPage(@Path() id: string): Promise<DataResponse> {
    const results = await this.staticService.getStaticPage(id);

    return this.response;
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("409", "Category already exists")
  public async createStaticPage(
    @Body() page: IStaticPage
  ): Promise<DataResponse> {
    console.log("from user", page);

    try {
      if (!page.name || !page.content) {
        return {
          statusCode: 400,
          message: "Please fill all fields",
        };
      }
      const results = await this.staticService.createStaticPage(page);

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
  public async updateStaticPage(
    @Path() id: string,
    @Body() page: IStaticPage
  ): Promise<DataResponse> {
    try {
      const results = await this.staticService.updateStaticPage(id, page);

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "page not found",
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

  @Delete("{id}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteStaticPage(@Path() id: string): Promise<DataResponse> {
    try {
      await this.staticService.deleteStaticPage(id);
      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      return {
        statusCode: 500,
        message: "Cannot delete Caategory",
      };
    }
  }
  //   @Put("change-status/{id}")
  //   @SuccessResponse("204", "Deleted")
  //   @Response<ErrorResponseModel>("400", "Bad Data")
  //   @Response<ErrorResponseModel>("404", "Not Found")
  //   public async changeStatus(@Path() id: string, @Body() Ad): Promise<DataResponse> {
  //     try {
  //       await this.staticService.changeStatus(id);
  //       this.response = {
  //         statusCode: 204,
  //       };
  //       return this.response;
  //     } catch (error) {
  //       return {
  //         statusCode: 500,
  //         message: "Cannot delete Caategory",
  //       };
  //     }
  //   }
}

export default StaticController;
