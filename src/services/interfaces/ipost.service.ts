import { Document } from "mongoose";
import { IPost } from "../../interfaces/entities";

export default interface IPostService {
  getPosts(): Promise<Document<any>[]>;

  getPost(id: string): Promise<Document<any>[]>;

  createPost(entity: IPost, files: any, email: string): Promise<Document<any>>;

  updatePost(
    id: string,
    files: any,
    entity: any,
    userEmail: string
  ): Promise<Document<any>>;

  deletePost(id: string, userEmail: string): Promise<Document<any>>;
}
