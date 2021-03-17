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
import { IPostService } from "../services/interfaces";
import { IPost } from "../interfaces/entities";
import handleAppExceptions from "../utils/handleAppExceptions";
import IPostFilter from "../interfaces/entities/IPostFilter";

@Route("/posts")
@Tags("Post")
class PostController extends Controller {
  constructor(@inject(Types.IPostService) private ps: IPostService) {
    super();
  }
  response: DataResponse = {
    statusCode: 500,
    data: [],
  };

  @Get("/")
  // @httpGet("/")
  @SuccessResponse("200", "OK")
  public async getPosts(@Request() query: IPostFilter): Promise<DataResponse> {
    let results: any = {};
    if (query.searchTerm != undefined) {
      results = await this.ps.searchPost(query.searchTerm);
    } else if (Object.keys(query).length !== 0) {
      results = await this.ps.getPostByCondition(query);
    } else {
      results = await this.ps.getPosts();
    }
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
  public async getPost(id: string): Promise<DataResponse> {
    try {
      const results = await this.ps.getPost(id);

      if (results.length > 0) {
        return {
          statusCode: 200,
          data: results,
        };
      } else {
        return {
          statusCode: 404,
          message: "Post not found",
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
  public async createPost(
    @Body() post: IPost,
    @Request() req: express.Request,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    // await this.handleFile(req);
    try {
      const results = await this.ps.createPost(
        post,
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

  @Put("{postid}")
  @SuccessResponse("204", "Updated")
  @Response<ErrorResponseModel>("400", "Bad Data")
  @Response<ErrorResponseModel>("404", "Not Found")
  public async updatePost(
    @Path() postid: string,
    @Body() post: IPost,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.updatePost(postid, post, res.locals.userid);

      if (results == null) {
        this.response = {
          statusCode: 404,
          message: "Post not found",
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
  public async deletePost(
    @Path() id: string,
    @Request() res: express.Response
  ): Promise<DataResponse> {
    const email = "";
    try {
      const results = await this.ps.deletePost(id, res.locals.userid);

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

      return handleAppExceptions(error);
    }
  }

  @Patch("/vote-poll/{postid}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Poll not found")
  public async votePoll(
    @Path("postid") postid: string,
    @Request() userid: string,
    @Body() optionid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.votePoll(postid, userid, optionid);

      return { statusCode: 200, data: results, message: "Vote Succeeded" };
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Patch("/like-post/{postid}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Post not found")
  public async likePost(
    @Path("postid") postid: string,
    @Request() userid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.likePost(postid, userid);

      return { statusCode: 200, data: results, message: "Post has been liked" };
    } catch (error) {
      console.log(error);
      return handleAppExceptions(error);
    }
  }

  @Patch("/share-post/{postid}")
  @SuccessResponse("200", "OK")
  @Response<ErrorResponseModel>("404", "Post not found")
  public async sharePost(
    @Path("postid") postid: string
  ): Promise<DataResponse> {
    try {
      const results = await this.ps.sharePost(postid);

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

export default PostController;
