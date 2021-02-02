const dummydata = require("../../dummydata")();

import {
  Get,
  Post,
  Route,
  Request,
  Body,
  Query,
  Header,
  Path,
  SuccessResponse,
  Controller,
} from "tsoa";

import { DataResponse, UserCreationRequest } from "../interfaces/DataResponse";

@Route("users")
export default class UserController extends Controller {
  @Get("/")
  public async getAllUsers(): Promise<DataResponse> {
    return {
      statusCode: 200,
      data: dummydata,
      message: null,
    };
  }

  @SuccessResponse("201", "Created")
  @Post("/")
  public async createUser(
    @Body() requestBody: UserCreationRequest
  ): Promise<void> {
    this.setStatus(201);
    return Promise.resolve();
  }

  @Get("{id}")
  public async getUser(id: number): Promise<DataResponse> {
    const user = dummydata.filter((result) => result.userId == id);
    return {
      statusCode: 200,
      data: user,
      message: null,
    };
  }
}
