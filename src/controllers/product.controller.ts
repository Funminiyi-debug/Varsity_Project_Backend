import { inject, injectable } from "inversify";
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
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import Types from "../types";
import express from "express";
import { IProductService } from "../services/interfaces";
import { IProduct } from "../interfaces/entities";

@Route("/products")
@Tags("Product")
// @controller("/categories")
class ProductsController extends Controller {
  constructor(@inject(Types.IProductService) private ps: IProductService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getProducts(): Promise<DataResponse> {
    const results = await this.ps.getProducts();

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
  public async getProduct(id: string): Promise<DataResponse> {
    try {
      const results = await this.ps.getProduct(id);

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
      if (error.message.search("Cast") != -1) {
        return {
          statusCode: 404,
          message: "Not Found",
        };
      }
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("409", "product already exists")
  public async createProduct(
    @Body() product: IProduct,
    @Request() res
  ): Promise<DataResponse> {
    if (!product.title || !product.price || product.images.length == 0) {
      return {
        statusCode: 400,
        message: "Ensure all required fields are filled",
      };
    }

    try {
      const results = await this.ps.createProduct(product, res.locals.email);
      if (results == null) {
        return {
          statusCode: 409,
          message: "product already exists",
        };
      }

      return {
        statusCode: 201,
        data: results,
      };
    } catch (error) {
      console.log(error);
      return {
        statusCode: 500,
        message: error.message,
      };
    }
  }

  @Put("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateProduct(
    @Path() id: string,
    @Body() product: IProduct,
    @Request() req: express.Request
  ): Promise<DataResponse> {
    const email = "";
    try {
      const results = await this.ps.updateProduct(id, product, email);

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Product not found",
        };
      }

      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      if (error.message.search("Cast") != -1) {
        return {
          statusCode: 404,
          message: "Not Found",
        };
      }

      return {
        statusCode: 500,
        message: "Something happened",
      };
    }
  }
}

export default ProductsController;
