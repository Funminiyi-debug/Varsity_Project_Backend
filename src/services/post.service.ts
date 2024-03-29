import { injectable, inject, postConstruct } from "inversify";
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
import IPostFilter from "../interfaces/entities/IPostFilter";
import PostSortBy from "../enums/PostSortBy";
import { Body } from "@decorators/express";
import PostStatus from "../enums/PostStatus";

@injectable()
export default class PostService implements IPostService {
  constructor(
    @inject(Types.IFeedbackService) private appfileService: IAppFileService
  ) {}
  async approvePost(
    id: string,
    approvalStatus: PostStatus
  ): Promise<Document<any>> {
    const post = (await Post.findById(id)) as any;
    if (!post) throw new NotFoundException("post not found");

    if (approvalStatus == PostStatus.Approved) {
      post.status = PostStatus.Approved;
    }
    if (approvalStatus == PostStatus.Rejected) {
      post.status = PostStatus.Rejected;
    }

    return await post.save();
  }
  // vote on poll type posts
  async votePoll(
    postid: string,
    userid: string,
    optionid: string
  ): Promise<Document<any>> {
    const post: any = await Post.findById(postid);

    let voters = [];
    let alreadyExist = false;
    const dummy = post.options.map(async (element) => {
      if (element._id.equals(optionid)) {
        const alreadyExists = element.voters.some((val) => val == userid);
        voters = element.voters;

        alreadyExist = alreadyExists;

        // element.votes += 1;

        // element.voters = [...element.voters, userid];
      }

      return element;
    });

    if (!post) throw new NotFoundException("Post not found");

    if (post.postType != PostType.Poll) {
      throw new UnprocessedEntityException("You can only vote on a poll");
    }
    if (alreadyExist) {
      throw new UnprocessedEntityException("User has already voted");
    }

    if (Date.now > post.pollExpiryDate) {
      throw new UnprocessedEntityException("Poll date has expired");
    }

    const updated = await Post.findOneAndUpdate(
      {
        _id: postid,
        "options._id": optionid,
      },
      {
        $set: {
          "options.$.votes": voters.length + 1,
          "options.$.voters": [...voters, userid],
        },
      },
      { new: true }
    );

    console.log(updated);

    return await post.save();
  }

  // like post
  async likePost(postid: string, userid: string): Promise<Document<any>> {
    const post: any = await Post.findById(postid);

    if (!post) throw new NotFoundException("Post not found");

    const like = { liker: userid };

    const exists = post.likes.some((val) => val["liker"] == userid);

    if (exists)
      throw new UnprocessedEntityException("User has already liked post");

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

  // get one post by user
  async getPostsByUser(userid: string): Promise<Document<any>[]> {
    try {
      return await Post.find({ author: userid })
        .populate("author", { userName: 1, email: 1 })
        .populate("images")
        .populate("comments");
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getPostsLikedByUser(userid: string): Promise<Document<any>[]> {
    try {
      return await Post.find({ "likes.author": userid })
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
      status: PostStatus.Pending,
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

    entity.status = PostStatus.Pending;

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
      // return await Post.deleteMany();
      const post = (await Post.find({ _id: id, author: userid }))[0];
      if (post) return await post.remove();
      throw new NotFoundException("post not found");
    } catch (error) {
      throw error;
    }
  }
  // report post
  async reportPost(id: string): Promise<Document<any>> {
    try {
      // return await Post.deleteMany();
      // const post = (await Post.find({ _id: id }))[0];
      const post = await Post.findByIdAndUpdate(
        id,
        {
          status: PostStatus.Reported,
        },
        { new: true }
      );

      if (post) return post;

      throw new NotFoundException("post not found");
    } catch (error) {
      throw new ServerErrorException(error);
    }
  }

  async getPostByCondition(query: IPostFilter): Promise<Document<any>[]> {
    let { takeCount, pageNo } = query;
    takeCount = takeCount == undefined ? 10 : takeCount;
    pageNo = pageNo == undefined ? 1 : pageNo;
    const skip = (pageNo - 1) * takeCount;
    const post: any[] = await Post.find({ sector: query.sector })
      .limit(takeCount)
      .skip(skip)
      .populate("author", { userName: 1, email: 1 })
      .populate("images")
      .populate("comments");

    if (query.sortBy != undefined) {
      post.sort((a, b) => {
        if (
          query.sortBy.toLowerCase() == PostSortBy.HighestComment.toLowerCase()
        ) {
          return b.comments.length - a.comments.length;
        }

        if (
          query.sortBy.toLowerCase() == PostSortBy.LowestComment.toLowerCase()
        ) {
          return a.comments.length - b.comments.length;
        }

        return a.updatedAt > b.updatedAt ? 1 : -1;
      });
    }

    return post;
  }

  async searchPost(searchTerm: string): Promise<Document<any>[]> {
    const post: any[] = await Post.find({ $text: { $search: searchTerm } })
      .populate("author", { userName: 1, email: 1 })
      .populate("images")
      .populate("comments");

    return post;
  }
}
