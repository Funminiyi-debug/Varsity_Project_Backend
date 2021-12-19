import {
  Get,
  Put,
  Post,
  Route,
  Request,
  Body,
  Path,
  Tags,
  SuccessResponse,
  Controller,
  Response,
  Delete,
  Query,
} from "tsoa";

import { DataResponse, UserCreationRequest } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import { inject, injectable } from "inversify";
import Types from "../types";
import { IUserService } from "../services/interfaces";
import handleAppExceptions from "../utils/handleAppExceptions";
import { IUser, IVerify } from "../interfaces/entities";
import { BasicAuth } from "../interfaces/Auth";
import { UserService } from "../services";
import { generateJwtToken } from "../utils/helperFunction";
import VerificationStatus from "../enums/VerificationStatus";

// interface VerifyStatusRequest {
//   id: string;
//   status: VStatus;
// }

@Route("/api/users/")
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
      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Post("add-admin")
  @SuccessResponse("200", "Success")
  public async addAdmin(@Body() userid: string) {
    try {
      const data = await this.user.makeAdmin(userid);
      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
  @Post("remove-admin")
  @SuccessResponse("200", "Success")
  public async removeAdmin(@Body() userid: string) {
    try {
      const data = await this.user.removeAdmin(userid);
      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
  @Get("all-admin")
  @SuccessResponse("200", "Success")
  public async getAdmins() {
    try {
      const data = await this.user.getAdmin();
      return {
        statusCode: 200,
        data: data,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Post("admin-login")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("422", "Bad Data")
  public async AdminLogin(@Body() req: BasicAuth) {
    try {
      const data = await this.user.adminLogin(req.username, req.password);

      const user = await this.user.getUserByCondition({
        email: req.username,
      });

      const token = generateJwtToken(user);

      return { statusCode: 200, data: token };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }
  @Get("active")
  @SuccessResponse("200", "Success")
  public async activeUsers() {
    try {
      console.log("active posts was called");
      let data = await this.user.activeUsers();

      data = data.map((x) => {
        return {
          userRole: x.userRole,
          follower: x.follower,
          following: x.following,
          _id: x._id,
          firstName: x.firstName,
          lastName: x.lastName,
          profilePics: x.profilePics,
          email: x.email,
          userName: x.userName,
        };
      });
      return { statusCode: 200, data };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Get("suspended")
  @SuccessResponse("200", "Success")
  public async suspendedUsers() {
    try {
      let data = await this.user.suspendedUsers();

      data = data.map((x) => {
        return {
          userRole: x.userRole,
          follower: x.follower,
          following: x.following,
          _id: x._id,
          firstName: x.firstName,
          lastName: x.lastName,
          profilePics: x.profilePics,
          email: x.email,
          userName: x.userName,
        };
      });
      return { statusCode: 200, data };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  // @Post("reset-password")
  // @SuccessResponse("201", "Created")
  // @Response<ErrorResponseModel>("422", "Bad Data")
  // public async ResetAdminPassword(@Body() req: BasicAuth) {
  //   try {
  //     const data = await this.user.adminLogin(req.username, req.password);

  //     const user = await this.user.getUserByCondition({
  //       email: req.username,
  //     });

  //     const token = generateJwtToken(user);

  //     return { statusCode: 200, data: token };
  //   } catch (error) {
  //     return handleAppExceptions(error);
  //   }
  // }
}
