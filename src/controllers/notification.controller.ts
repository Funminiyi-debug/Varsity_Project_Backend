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
  Delete,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import Types from "../types";
import express from "express";
import { IFeedbackService, INotificationService } from "../services/interfaces";
import { IFeed, INotification } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";

@Route("/notifications")
@Tags("Notification")
class NotificationController extends Controller {
  constructor(
    @inject(Types.INotificationService)
    private notificationService: INotificationService
  ) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getNotifications(
    @Request() res: express.Response
  ): Promise<DataResponse> {
    const results = await this.notificationService.getNotifications(
      res.locals.userid
    );
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
  public async getNotification(
    id: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.notificationService.getNotification(
        id,
        res.locals.userid
      );

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: results,
        };
      } else {
        return {
          statusCode: 404,
          message: "Notification not found",
        };
      }
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  //   @Post("/")
  //   @SuccessResponse("201", "Created")
  //   @Response<ErrorResponseModel>("400", "Bad Data")
  //   @Response<ErrorResponseModel>("409", "Notification already exists")
  //   public async createNotification(
  //     @Body() notification: INotification,
  //     @Request() res: express.Response
  //   ): Promise<DataResponse> {
  //     // await this.handleFile(req);
  //     try {
  //       const results = await this.notificationService.createNotification(notification, res.locals);

  //       return {
  //         statusCode: 201,
  //         data: results,
  //       };
  //     } catch (error) {
  //       return handleAppExceptions(error);
  //     }
  //   }

  //   @Put("{notificationid}")
  //   @SuccessResponse("204", "Updated")
  //   @Response<ErrorResponseModel>("400", "Bad Data")
  //   @Response<ErrorResponseModel>("404", "Not Found")
  //   public async updateNotification(
  //     @Path() notificationid: string,
  //     @Body() Notification: IFeed,
  //     @Request() res: express.Response
  //   ): Promise<DataResponse> {
  //     try {
  //       const results = await this.notificationService.updateNotification(
  //         notificationid,
  //         Notification,
  //         res.locals.userid
  //       );

  //       if (results == null) {
  //         this.response = {
  //           statusCode: 404,
  //           message: "Notification not found",
  //         };

  //         return this.response;
  //       }

  //       this.response = {
  //         statusCode: 204,
  //       };
  //       return this.response;
  //     } catch (error) {
  //       if (error.message.search("Cast") != -1) {
  //         return {
  //           statusCode: 404,
  //           message: "Not Found",
  //         };
  //       }

  //       return {
  //         statusCode: 500,
  //         message: "Something happened",
  //       };
  //     }
  //   }

  @Delete("{notificationid}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteFeedback(
    @Path() notificationid: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.notificationService.deleteNotification(
        notificationid,
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

export default NotificationController;
