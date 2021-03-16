import { inject, injectable } from "inversify";
import { Document } from "mongoose";
import { IComment } from "../interfaces/entities";
import { IAppFileService, ICommentService, IPostService } from "./interfaces";
import Comment from "../models/Comment";
import {
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from "../exceptions";
import Types from "../types";

@injectable()
export default class CommentService implements ICommentService {
  /**
   *
   */
  constructor(
    @inject(Types.IPostService) private postService: IPostService,
    @inject(Types.IAppFileService) private appfileService: IAppFileService
  ) {}
  async getComments(): Promise<Document<any>[]> {
    try {
      return await Comment.find({})
        .populate("comments")
        .populate("commentid")
        .populate({ path: "author", select: "userName email" })
        .populate("images")
        .populate("post");
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async getComment(id: string): Promise<Document<any>[]> {
    try {
      return await Comment.find({ _id: id })
        .populate("comments")
        .populate("commentid")
        .populate({ path: "author", select: "userName email" })
        .populate("images")
        .populate("post");
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async createComment(
    request: IComment,
    files: any[],
    userid: string
  ): Promise<Document<any>> {
    interface ICreateComment extends IComment {
      post: string;
      images: string[];
      author: string;
    }
    try {
      const entity: ICreateComment = {
        ...request,
        post: request.postid,
        images: [],
        author: "",
      };

      entity.author = userid;

      if (files != undefined) {
        // images
        const imageids = await Promise.all([
          ...files.map(async (file) => {
            const appfile = await this.appfileService.addAppFile(file);
            return appfile.id;
          }),
        ]);

        entity.images = imageids;
      }

      const comment = await Comment.create(entity);
      const commentAddedToPost = this.postService.addCommentToPost(
        comment._id,
        entity.post
      );

      if (request.commentid != undefined) {
        await Comment.findByIdAndUpdate(request.commentid, {
          $push: { comments: request.commentid },
        });
      }

      if (!commentAddedToPost) {
        await comment.remove();
        throw new ServerErrorException("Unable to add comment to post");
      }

      return comment
        .populate("comments")
        .populate("commentid")
        .populate({ path: "author", select: "userName email" })
        .populate("images")
        .populate("post");
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
      const comment = await Comment.findById(id);

      if (!comment) throw new NotFoundException("comment not found");
      return await comment.remove();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async likeComment(commentid: string, userid: string): Promise<Document<any>> {
    const comment: any = await Comment.findById(commentid);

    if (!comment) throw new NotFoundException("comment not found");

    const like = { liker: userid };

    const exists = comment.likes.some((val) => val["liker"] == userid);

    if (exists) throw ConflictException("User has already liked comment");

    comment.likes = [...comment.likes, like];

    return await comment.save();
  }

  async shareComment(commentid: string) {
    const comment: any = await Comment.findById(commentid);

    if (!comment) throw new NotFoundException("Comment not found");

    comment.shares += 1;

    return await comment.save();
  }
}
