import { Document } from "mongoose";
import { IComment } from "../../interfaces/entities";

export default interface ICommentService {
  getComments(): Promise<Document<any>[]>;

  getComment(id: string): Promise<Document<any>[]>;

  getCommentsByUser(userid: string): Promise<Document<any>[]>;

  getCommentsLikedByUser(userid: string): Promise<Document<any>[]>;

  createComment(
    entity: IComment,
    files: any[],
    userid: string
  ): Promise<Document<any>>;

  updateComment(
    id: string,
    entity: IComment,
    userid: string
  ): Promise<Document<any>>;

  deleteComment(id: string): Promise<Document<any>>;
  likeComment(commentid: string, userid: string): Promise<Document<any>>;
  shareComment(commentid: string);
}
