const dummydata = require("../../dummydata")();

import {
  Get,
  Put,
  Post,
  Route,
  Request,
  Body,
  Query,
  Header,
  Path,
  Tags,
  SuccessResponse,
  Controller,
  Response,
} from "tsoa";
import { DataResponse, UserCreationRequest } from "../interfaces/DataResponse";
import { IUserService } from "../services/interfaces";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import IUser from "../interfaces/IUser";
import { inject, injectable } from "inversify";
import Types from "../types";

@Route("users")
@Tags("User")
export default class UsersController extends Controller {
  constructor(@inject(Types.IUserService) private user: IUserService) {
    super();
  }

  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // to put other responses
  @Response<ErrorResponseModel>("400", "Bad Data")
  public async getAllUsers(): Promise<DataResponse> {
    return {
      statusCode: 200,
      data: dummydata, //await this.user.getUsers(),
    };
  }

  @Get("{id}")
  @Response<ErrorResponseModel>("400", "Bad Data")
  public async getUser(id: string): Promise<DataResponse> {
    const user = dummydata.filter((result: any) => result.userId == id);
    return {
      statusCode: 200,
      data: user, //await this.user.getUser(id),
    };
  }

  @Put("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async createUser(
    @Path() id: string,
    @Body() status: any
  ): Promise<any> {
    //const results = await this.user.updateUser(id, status);
    const results = [];
    this.setStatus(201);
    if (results == null) {
      this.response = {
        statusCode: 404,
        message: "User not found",
      };
    }

    if (results == undefined) {
      this.response = {
        statusCode: 500,
        message: "Something happened",
      };
    }

    this.response = {
      statusCode: 204,
    };
    return this.response;
  }
}
