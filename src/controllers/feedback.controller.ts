import { inject, injectable } from 'inversify'
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
} from 'tsoa'
import { DataResponse } from '../interfaces/DataResponse'
import ErrorResponseModel from '../interfaces/ErrorResponseModel'
import Types from '../types'
import express from 'express'
import { IFeedbackService } from '../services/interfaces'
import { IFeed } from '../interfaces/entities'
import handleAppExceptions from '../utils/handleAppExceptions'

@Route("/api/feedbacks")
@Tags("Feedback")
class FeedbackController extends Controller {
  constructor(@inject(Types.IFeedbackService) private fb: IFeedbackService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getFeedbacks(): Promise<DataResponse> {
    const results = await this.fb.getFeedbacks();
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
  public async getFeedback(id: string): Promise<DataResponse> {
    try {
      const results = await this.fb.getFeedback(id);

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: results,
        };
      } else {
        return {
          statusCode: 404,
          message: "Feedback not found",
        };
      }
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Post("/")
  @SuccessResponse("201", "Created")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("409", "feedback already exists")
  public async createFeedback(
    @Body() feedback: IFeed,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    try {
      const results = await this.fb.createFeedback(feedback, res.locals);

      return {
        statusCode: 201,
        data: results,
      };
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Put("{feedbackid}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateFeedback(
    @Path() feedbackid: string,
    @Body() feedback: IFeed,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.fb.updateFeedback(
        feedbackid,
        feedback,
        res.locals.userid
      );

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Feedback not found",
        };

        return this.response;
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

  @Put("/like-feedback/{feedbackid}")
  @SuccessResponse("200", "Success")
  @Response<ErrorResponseModel>("404", "Not found")
  public async likeFeedback(
    @Path() feedbackid: string,
    @Request() userid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.fb.likeFeedback(feedbackid, userid);

      return {
        statusCode: 200,
        data: results,
      };
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Delete("{feedbackid}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteFeedback(
    @Path() feedbackid: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.fb.deleteFeedback(
        feedbackid,
        res.locals.userid
      );

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

export default FeedbackController
