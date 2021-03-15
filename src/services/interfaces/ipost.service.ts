import { Document } from "mongoose";
import { IPost } from "../../interfaces/entities";

export default interface IPostService {
  getPosts(): Promise<Document<any>[]>;

  getPost(id: string): Promise<Document<any>[]>;

  createPost(
    entity: IPost,
    files: any[],
    userid: string
  ): Promise<Document<any>>;

  updatePost(id: string, entity: any, userid: string): Promise<Document<any>>;

  deletePost(id: string, userid: string): Promise<Document<any>>;

  addCommentToPost(commentid: string, postid: string): Promise<boolean>;

  likePost(postid: string, userid: string): Promise<Document<any>>;

  sharePost(postid: string);

  votePoll(
    postid: string,
    userid: string,
    optionid: string
  ): Promise<Document<any>>;
}
