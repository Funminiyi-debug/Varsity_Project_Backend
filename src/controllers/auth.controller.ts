import express from "express";
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
  Hidden,
} from "tsoa";
import VerificationStatus from "../enums/VerificationStatus";
import {
  AuthResponse,
  DataResponse,
  SmsCodeRequest,
  SmsRequest,
  Username,
} from "../interfaces/DataResponse";

import ErrorResponseModel from "../interfaces/ErrorResponseModel";

@Route("/auth")
@Tags("Authentication")
export default class AuthController extends Controller {
  @Get("/{method}")
  @Response<AuthResponse>("200 response", "Logged In")
  @Response<AuthResponse>(201, "User Created")
  @Response<ErrorResponseModel>("403", "Account is Restricted")
  @Response<ErrorResponseModel>("500", "Server Error")
  public async login(@Path("method") method): Promise<DataResponse> {
    const { verificationStatus, token, email } = method;
    if (!email)
      return {
        statusCode: 400,
        message: "Verify your email account on facebook",
      };

    if (verificationStatus == VerificationStatus.Verified) {
      return {
        statusCode: 200,
        data: { token },
      };
    } else if (verificationStatus == VerificationStatus.NotVerified) {
      return {
        statusCode: 201,
        data: { token },
      };
    } else {
      return {
        statusCode: 403,
        message: "User is restricted",
      };
    }
  }

  @Post("/sendsms")
  @SuccessResponse<DataResponse>("200 response", "SMS sent")
  @Response<ErrorResponseModel>("400", "Check Number and Try Again")
  public async sendSms(@Body() request: SmsRequest): Promise<DataResponse> {
    return {
      statusCode: 0,
      message: "string",
    };
  }

  @Post("/validatesmscode")
  @SuccessResponse<DataResponse>("200 response", "Invalid code entered...")
  @Response<ErrorResponseModel>("400", "Code verified,  username next")
  public async sendSmsCode(
    @Body() request: SmsCodeRequest
  ): Promise<DataResponse> {
    return {
      statusCode: 0,
      message: "string",
    };
  }

  @SuccessResponse<DataResponse>("200 response", "Registration Completed")
  @Response<ErrorResponseModel>("400", "Username Unavailable")
  @Post("/username")
  public async changeUsername(
    @Body() request: Username
  ): Promise<DataResponse> {
    return {
      statusCode: 0,
      message: "string",
    };
  }
}
