import { Document } from "mongoose";
import { ILike } from "../../interfaces/entities";

export default interface ILikeService {
  getLikes(id: string): Promise<Document<any>[]>;
  //   createLike(entity: ILike): Promise<Document<any>>;
}
