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
  Delete,
} from "tsoa";
import { DataResponse, UserCreationRequest } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import { inject, injectable } from "inversify";
import Types from "../types";
import { IUserService } from "../services/interfaces";
import VStatus from "../enums/VerificationStatus";
import handleAppExceptions from "../utils/handleAppExceptions";
<<<<<<< HEAD
import { IUser } from "../interfaces/entities";
import SavedAds from "../models/SavedAds";
=======
import { IUser, IVerify } from "../interfaces/entities";
>>>>>>> 6b3e2cb04c91352c60583c8109674fbaa360ecfa

// interface VerifyStatusRequest {
//   id: string;
//   status: VStatus;
// }

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
      data: await this.user.getUsers(), //await this.user.getUsers(),
    };
  }

  @Get("{id}")
  @Response<ErrorResponseModel>("400", "Bad Data")
  public async getUser(id: string): Promise<DataResponse> {
    try {
      const user = dummydata.filter((result: any) => result.userId == id);
      return {
        statusCode: 200,
        data: await this.user.getUser(id), //await this.user.getUser(id),
      };
    } catch (error) {
      return { statusCode: 500 };
    }
  }

  @Put("/verify-status/{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateVerificationStatus(
    @Path() id: string,
    @Body() request: IVerify
  ): Promise<any> {
    const results = await this.user.updateVerificationStatus(
      id,
      request.status
    );

    this.setStatus(201);
    if (results == null) {
      this.response = {
        statusCode: 404,
        message: "User not found",
      };

      return this.response;
    }

    if (results == undefined) {
      this.response = {
        statusCode: 500,
        message: "Something happened",
      };

      return this.response;
    }

    this.response = {
      statusCode: 204,
    };
    return this.response;
  }

  @Put("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateUser(
    @Path() id: string,
    @Body() request: IUser
  ): Promise<any> {
    const results = await this.user.updateUser(id, request);

    this.setStatus(201);
    if (results == null) {
      this.response = {
        statusCode: 404,
        message: "User not found",
      };
      return this.response;
    }

    if (results == undefined) {
      this.response = {
        statusCode: 500,
        message: "Something happened",
      };
      return this.response;
    }

    this.response = {
      statusCode: 204,
    };
    return this.response;
  }

  @Delete("{id}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteUser(@Path() id: string) {
    try {
      await this.user.deleteUser(id);
      return {
        statusCode: 204,
      } as DataResponse;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Post("save-ad")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("422", "Bad Data")
  public async savedAd(@Request() userid: string, @Body() item) {
    try {
      const data = await this.user.saveAd(item.productid, userid);

      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
}
