import { inject, injectable } from "inversify";
import multer from "multer";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import Types from "../types";
import express from "express";
import { IAppFileService, IServiceService } from "../services/interfaces";
import { IService } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";
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
  Delete,
} from "tsoa";

@Route("/services")
@Tags("Service")
class ServicesController extends Controller {
  constructor(@inject(Types.IServiceService) private ps: IServiceService) {
    super();
  }

  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getServices(): Promise<DataResponse> {
    const results = await this.ps.getServices();
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
  public async getService(id: string): Promise<DataResponse> {
    try {
      const results = await this.ps.getService(id);

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
  public async createService(
    @Body() service: IService,
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    try {
      const results = await this.ps.createService(
        service,
        req.files,
        res.locals.userid
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
  public async updateService(
    @Path() id: string,
    @Body() product: IService,
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.updateService(
        id,
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

  @Delete("{id}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteService(
    @Path() id: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    const email = "";
    try {
      const results = await this.ps.deleteService(id, res.locals.userid);

      this.response = {
        statusCode: 204,
      };
      return this.response;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
}

export default ServicesController;
