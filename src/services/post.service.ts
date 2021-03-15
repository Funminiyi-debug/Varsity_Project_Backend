import { injectable, inject } from "inversify";
import { Document } from "mongoose";
import { IAppFileService, IPostService, IUserService } from "./interfaces";
import Types from "../types";
import Post from "../models/Post";
import { IPost } from "../interfaces/entities";
import {
  ConflictException,
  ServerErrorException,
  NotFoundException,
  UnprocessedEntityException,
} from "../exceptions";
import PostType from "../enums/PostType";

@injectable()
export default class PostService implements IPostService {
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.IFeedbackService) private appfileService: IAppFileService
  ) {}
  // vote on poll type posts
  async votePoll(
    postid: string,
    userid: string,
    optionid: string
  ): Promise<Document<any>> {
    const post: any = await Post.findById(postid);
    if (!post) throw new NotFoundException("Post not found");

    if (Date.now > post.pollExpiryDate) {
      throw new UnprocessedEntityException("Poll date has expired");
    }
    const votedPost = post.options.map((option) => {
      if (option._id == optionid) {
        option.votes += 1;
        option.voters = [...option.voters, userid];
      }

      return option;
    });

    post.options = votedPost;

    return await post.save();
  }

  // like post
  async likePost(postid: string, userid: string): Promise<Document<any>> {
    const post: any = await Post.findById(postid);

    if (!post) throw new NotFoundException("Post not found");

    const like = { liker: userid };

    const exists = post.likes.some((val) => val["liker"] == userid);

    if (exists) throw ConflictException("User has already liked post");

    post.likes = [...post.likes, like];

    return await post.save();
  }

  // share post
  async sharePost(postid: string) {
    const post: any = await Post.findById(postid);

    if (!post) throw new NotFoundException("Post not found");

    post.shares += 1;

    return await post.save();
  }

  //add comment to post
  async addCommentToPost(commentid: string, postid: string): Promise<boolean> {
    let post = (await Post.findById(postid)) as any;
    if (post) {
      post.comments = [commentid, ...post.comments];
      await post.save();
      return true;
    }

    return false;
  }

  //get all posts
  async getPosts(): Promise<Document<any>[]> {
    try {
      return await Post.find({})
        .populate("author", { userName: 1, email: 1 })
        .populate("images")
        .populate("comments");
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  // get one post by id
  async getPost(id: string): Promise<Document<any>[]> {
    try {
      return await Post.find({ _id: id })
        .populate("author", { userName: 1, email: 1 })
        .populate("images")
        .populate("comments");
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  // create new post
  async createPost(
    post: IPost,
    files: any[],
    userid: string
  ): Promise<Document<any>> {
    const entity = {
      ...post,
      author: "",
      images: [],
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

      entity.options = entity.options.map((option) => {
        return { name: option };
      });

      if (exists.length > 0) throw new ConflictException("Post already exist");
    }

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

    try {
      return await Post.create(entity);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  // update previous posts
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
    const exists: any = await Post.find({ _id: postid, author: userid });

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

  // delete post
  async deletePost(id: string, userid: string): Promise<Document<any>> {
    try {
      const post = (await Post.find({ _id: id, author: userid }))[0];
      if (post) return await post.remove();
      throw new NotFoundException("post not found");
    } catch (error) {
      throw error;
    }
  }
}
