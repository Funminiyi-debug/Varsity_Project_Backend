import { injectable } from "inversify";
import { Document } from "mongoose";
import { ILike } from "../interfaces/entities";
import { ILikeService } from "./interfaces";
import Like from "../models/Like";
import { ServerErrorException } from "../exceptions";

@injectable()
export default class LikeService implements ILikeService {
  async getLikes(id: string): Promise<Document<any>[]> {
    try {
      return await Like.find({});
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }
}
