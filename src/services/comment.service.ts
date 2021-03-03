import { inject, injectable } from "inversify";
import { Document } from "mongoose";
import { IComment } from "../interfaces/entities";
import { ICommentService, IPostService } from "./interfaces";
import Comment from "../models/Comment";
import { NotFoundException, ServerErrorException } from "../exceptions";
import Types from "../types";

@injectable()
export default class CommentService implements ICommentService {
  /**
   *
   */
  constructor(@inject(Types.IPostService) private postService: IPostService) {}
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

  async createComment(
    request: IComment,
    userid: string
  ): Promise<Document<any>> {
    try {
      const entity: any = {
        ...request,
        post: request.postid,
      };

      entity.author = userid;
      const comment = new Comment(entity);
      const commentAddedToPost = this.postService.addCommentToPost(
        comment._id,
        entity.post
      );

      if (!commentAddedToPost) {
        await comment.remove();
        throw new ServerErrorException("Unable to add comment to post");
      }

      return await comment.save();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async updateComment(
    id: string,
    request: IComment,
    userid: string
  ): Promise<Document<any>> {
    try {
      const entity: any = {
        ...request,
        post: request.postid,
      };
      const exists = (await Comment.find({ _id: id, author: userid }))[0];
      if (!exists) throw new NotFoundException("comment not found");

      return await Comment.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      throw error;
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
