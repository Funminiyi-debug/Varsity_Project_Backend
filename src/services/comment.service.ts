import { injectable } from "inversify";
import { Document } from "mongoose";
import { IComment } from "../interfaces/entities";
import { ICommentService } from "./interfaces";
import Comment from "../models/Comment";
import { ServerErrorException } from "../exceptions";

@injectable()
export default class CommentService implements ICommentService {
  async getComments(): Promise<Document<any>[]> {
    try {
      return await Comment.find({});
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async getComment(id: string): Promise<Document<any>[]> {
    try {
      return await Comment.find({ _id: id });
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async createComment(request: IComment): Promise<Document<any>> {
    try {
      const entity = {
        ...request,
        post: request.postid,
      };
      const comment = new Comment(entity);
      return await comment.save();
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async updateComment(id: string, request: IComment): Promise<Document<any>> {
    try {
      const entity = {
        ...request,
        post: request.postid,
      };
      return await Comment.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async deleteComment(id: string): Promise<Document<any>> {
    try {
      return (await Comment.findById(id)).remove();
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }
}
