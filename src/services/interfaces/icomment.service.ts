import { Document } from "mongoose";
import { IComment } from "../../interfaces/entities";

export default interface ICommentService {
  getComments(): Promise<Document<any>[]>;

  getComment(id: string): Promise<Document<any>[]>;

  createComment(entity: IComment): Promise<Document<any>>;

  updateComment(id: string, entity: IComment): Promise<Document<any>>;

  deleteComment(id: string): Promise<Document<any>>;
}
