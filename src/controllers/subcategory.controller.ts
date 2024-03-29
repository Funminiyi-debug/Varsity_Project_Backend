import { inject, injectable } from "inversify";
import multer from "multer";
import {
  Controller,
  Route,
  Tags,
  Get,
  SuccessResponse,
  Response,
  Request,
  Post,
  Body,
  Path,
  Put,
  Hidden,
  Query,
  Delete,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import Types from "../types";
import { ISubcategoryService } from "../services/interfaces";
import { ISubcategory } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";

@Route("/api/subcategories")
@Tags("Subcategory")
class SubcategoryController extends Controller {
  constructor(
    @inject(Types.ISubcategoryService)
    private subcategoryService: ISubcategoryService
  ) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  @SuccessResponse("200", "OK")
  public async getSubcategories(): Promise<DataResponse> {
    const results = await this.subcategoryService.getSubcategories();
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
  public async getSubcategory(id: string): Promise<DataResponse> {
    try {
      const results = await this.subcategoryService.getSubcategory(id);

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: results,
        };
      } else {
        return {
          statusCode: 404,
          message: "Product not found",
        };
      }
    } catch (error) {
      console.log(error.message);
      return handleAppExceptions(error);
    }
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("409", "product already exists")
  public async createSubcategory(
    @Body() subcategory: ISubcategory
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    console.log(subcategory);
    try {
      const results = await this.subcategoryService.createSubcategory(
        subcategory
      );

      return {
        statusCode: 201,
        data: results,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Put("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateSubcategory(
    @Path() id: string,
    @Body() subcategory: ISubcategory
  ): Promise<DataResponse> {
    try {
      const results = await this.subcategoryService.updateSubcategory(
        id,
        subcategory
      );

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Product not found",
        };
        //added by dami
        return this.response;
      }

      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Delete("{id}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteSubCategory(@Path() id: string): Promise<DataResponse> {
    try {
      const result = await this.subcategoryService.deleteSubcategory(id);
      this.response = {
        statusCode: 204,
      };
      if (result == null) {
        this.response = {
          statusCode: 404,
          message: "Subcategory not found",
        };
      }
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
}

export default SubcategoryController;
