import { injectable, inject } from "inversify";
import { Document } from "mongoose";
import {
  IAppFileService,
  ICommentService,
  ILikeService,
  IPostService,
  IUserService,
} from "./interfaces";
import Types from "../types";
import Post from "../models/Post";
import { IPost } from "../interfaces/entities";
import {
  BadDataException,
  ConflictException,
  ServerErrorException,
  NotFoundException,
} from "../exceptions";
import PostType from "../enums/PostType";
import UnauthorizedException from "../exceptions/UnauthorizedException";

@injectable()
export default class PostService implements IPostService {
  constructor(@inject(Types.IUserService) private userService: IUserService) {}

  async addCommentToPost(commentid: string, postid: string): Promise<boolean> {
    let post = (await Post.findById(postid)) as any;
    if (post) {
      post.comments = [commentid, ...post.comments];
      await post.save();
      return true;
    }

    return false;
  }

  async getPosts(): Promise<Document<any>[]> {
    try {
      return await Post.find({})
        .populate("author", { userName: 1, email: 1 })
        .populate("images");
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getPost(id: string): Promise<Document<any>[]> {
    try {
      return await Post.find({ _id: id })
        .populate("author", { userName: 1, email: 1 })
        .populate("images");
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async createPost(post: IPost, userid: string): Promise<Document<any>> {
    const entity = {
      ...post,
      author: "",
    };
    // AUTHOR
    entity.author = userid;

    // Check if post exists

    if (entity.postType == PostType.Regular) {
      const exists = await Post.find({
        title: entity.title,
        author: entity.author,
        sector: entity.sector,
      });

      if (exists.length > 0) throw new ConflictException("Post already exist");
    }

    if (entity.postType == PostType.Poll) {
      const exists = await Post.find({
        question: entity.question,
        author: entity.author,
        sector: entity.sector,
      });

      if (exists.length > 0) throw new ConflictException("Post already exist");
    }

    try {
      return await Post.create(entity);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async updatePost(
    postid: string,
    post: any,
    userid: string
  ): Promise<Document<any>> {
    const entity = {
      ...post,
      author: "",
    };

    // Check if product exists
    const exists = await Post.find({ _id: postid, author: userid });

    if (!exists) throw new NotFoundException("post not found");

    // AUTHOR
    entity.author = userid;

    try {
      return await Post.findByIdAndUpdate(postid, entity, {
        new: true,
      });
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async deletePost(id: string, userid: string): Promise<Document<any>> {
    try {
      // return ()[0].remove();
      const post = (await Post.find({ _id: id, author: userid }))[0];
      if (post) return await post.remove();
      throw new NotFoundException("post not found");
    } catch (error) {
      throw error;
    }
  }
}
