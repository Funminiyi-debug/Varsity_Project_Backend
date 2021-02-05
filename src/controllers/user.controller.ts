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
  Tags,
  SuccessResponse,
  Controller,
  Response,
} from "tsoa";

import { DataResponse, UserCreationRequest } from "../Interfaces/DataResponse";
interface ErrorResponseModel {
  title: string;
  status: number;
}

@Route("users")
@Tags("User")
export default class UsersController extends Controller {
  @Get("/")
  // to put other responses
  @Response<ErrorResponseModel>("400", "Bad Data")
  public async getAllUsers(): Promise<DataResponse> {
    return {
      statusCode: 200,
      data: dummydata,
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
    const user = dummydata.filter((result: any) => result.userId == id);
    return {
      statusCode: 200,
      data: user,
    };
  }
}