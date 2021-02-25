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

  async createComment(entity: IComment): Promise<Document<any>> {
    try {
      const comment = new Comment(entity);
      return await comment.save();
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async updateComment(id: string, entity: IComment): Promise<Document<any>> {
    try {
      return await Comment.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async deleteComment(id: string): Promise<Document<any>> {
    try {
      return await Comment.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }
}
