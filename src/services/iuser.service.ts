import { Document } from "mongoose";
import IUser from "../interfaces/IUser";

export interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<any>[]>;
}
