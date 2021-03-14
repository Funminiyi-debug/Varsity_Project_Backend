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
import express from "express";
import { IAppFileService, IProductService } from "../services/interfaces";
import { IProduct, IFilter } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";
import formatProduct_Service from "../utils/formatProduct_Service";

@Route("/products")
@Tags("Product")
class ProductsController extends Controller {
  constructor(@inject(Types.IProductService) private ps: IProductService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  @SuccessResponse("200", "OK")
  public async getProducts(@Request() query: IFilter): Promise<DataResponse> {
    // @Query() const searchTerm = query.searchTerm;
    try {
      let results: any = {};

      if (query.searchTerm != undefined) {
        results = await this.ps.searchProduct(query.searchTerm);
      } else if (Object.keys(query).length !== 0) {
        console.log("this also ran");
        results = await this.ps.getProductsByCondition(query);
      } else {
        results = await this.ps.getProducts();
        console.log(results);
      }

      this.response = {
        statusCode: 200,
        data: formatProduct_Service(results),
      };

      return this.response;
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Get("{id}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async getProduct(id: string): Promise<DataResponse> {
    try {
      const results = await this.ps.getProduct(id);

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: formatProduct_Service(results),
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
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    try {
      const results = await this.ps.createProduct(
        product,
        req.files,
        res.locals.userid
      );

      return {
        statusCode: 201,
        data: formatProduct_Service(results),
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Put("{productid}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateProduct(
    @Path() productid: string,
    @Body() product: IProduct,
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    console.log("controller ran");
    try {
      const results = await this.ps.updateProduct(
        productid,
        req.files,
        product as any,
        res.locals.userid
      );

      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Delete("{productid}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteProduct(
    @Path() productid: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.deleteProduct(productid, res.locals.userid);

      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
}

export default ProductsController;
