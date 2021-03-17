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
  Patch,
} from "tsoa";
import { DataResponse } from "../interfaces/DataResponse";
import ErrorResponseModel from "../interfaces/ErrorResponseModel";
import Types from "../types";
import express from "express";
import { ICommentService } from "../services/interfaces";
import { IComment } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";

@Route("/comments")
@Tags("Comment")
class CommentController extends Controller {
  constructor(
    @inject(Types.ICommentService) private commentService: ICommentService
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
  public async getComments(): Promise<DataResponse> {
    try {
      const results = await this.commentService.getComments();
      this.response = {
        statusCode: 200,
        data: results,
      };

      return this.response;
    } catch (error) {
      return handleAppExceptions(error);
    }
  }

  @Get("{id}")
  // @httpGet("{id}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async getComment(id: string): Promise<DataResponse> {
    try {
      const results = await this.commentService.getComment(id);

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: results,
        };
      } else {
        return {
          statusCode: 404,
          message: "Comment not found",
        };
      }
    } catch (error) {
      console.log(error.message);
      if (error.message.search("Cast") != -1) {
        return {
          statusCode: 404,
          message: "Comment Found",
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
  public async createComment(
    @Body() comment: IComment,
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    try {
      console.log("Dd");
      const results = await this.commentService.createComment(
        comment,
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

  @Put("{commentid}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updateComment(
    @Path() commentid: string,
    @Body() comment: IComment,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.commentService.updateComment(
        commentid,
        comment,
        res.locals.userid
      );

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Comment not found",
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

  @Delete("{id}")
  @SuccessResponse("204", "Deleted")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async deleteComment(
    @Path() id: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    const email = "";
    try {
      const results = await this.commentService.deleteComment(
        id,
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

  @Patch("/like-comment/{commentid}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Comment not found")
  public async likeComment(
    @Path("commentid") commentid: string,
    @Request() userid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.commentService.likeComment(commentid, userid);

      return {
        statusCode: 200,
        data: results,
        message: "Comment has been liked",
      };
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Patch("/share-comment/{commentid}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Comment not found")
  public async shareComment(
    @Path("commentid") commentid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.commentService.shareComment(commentid);

      return { statusCode: 200, data: results };
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  private async handleFile(request: express.Request): Promise<void> {
    const multerSingle = multer().single("images");
    return new Promise((resolve, reject) => {
      multerSingle(request, undefined, async (error) => {
        if (error) {
          reject(error);
        }
        resolve();
      });
    });
  }
}

export default CommentController;
