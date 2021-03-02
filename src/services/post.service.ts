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

@injectable()
export default class PostService implements IPostService {
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.ICommentService) private commentService: ICommentService,
    @inject(Types.IAppFileService) private appfileService: IAppFileService,
    @inject(Types.ILikeService) private likeService: ILikeService
  ) {}

  async getPosts(): Promise<Document<any>[]> {
    try {
      return await Post.find({});
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getPost(id: string): Promise<Document<any>[]> {
    try {
      return await Post.find({ _id: id });
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async createPost(
    post: IPost,
    files: any,
    email: string
  ): Promise<Document<any>> {
    const entity = {
      ...post,
      author: "",
      images: [],
    };
    // AUTHOR
    const user = await this.userService.getByEmail(email);
    entity.author = user.id;

    // Check if post exists
    const exists = (await Post.find({
      name: entity.title,
      author: entity.author,
    })) as any[];

    if (exists.length > 0) throw new ConflictException("Product already exist");

    // IMAGE
    if (!files || files.length == 0) {
      throw new BadDataException("you must include images");
    }

    const imageids = await Promise.all([
      ...files.map(async (file) => {
        const appfile = await this.appfileService.addAppFile(file);
        return appfile.id;
      }),
    ]);
    // await Promise.all(imageids);
    entity.images = imageids;

    try {
      return await Post.create(entity);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async updatePost(
    id: string,
    files: any,
    post: any,
    userEmail: string
  ): Promise<Document<any>> {
    throw new Error("Method not implemented.");
    const entity = {
      ...post,
      author: "",
      images: [],
    };
    // AUTHOR
    const user = await this.userService.getByEmail(userEmail);
    entity.author = user.id;

    // Check if product exists
    const exists = (await Post.find({
      name: entity.title,
      author: entity.author,
    })) as any[];

    if (exists.length == 0) throw new NotFoundException("product not found");

    // IMAGE
    if (files || files.length > 0) {
      const imageids = await Promise.all([
        ...files.map(async (file) => {
          const appfile = await this.appfileService.addAppFile(file);
          return appfile.id;
        }),
      ]);
      entity.images.push(...imageids);
    } else {
      entity.images = exists[0].images;
    }

    try {
      return await Post.findByIdAndUpdate(id, entity, {
        new: true,
      });
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async deletePost(id: string, userEmail: string): Promise<Document<any>> {
    return await Post.findByIdAndDelete(id);
  }
}
