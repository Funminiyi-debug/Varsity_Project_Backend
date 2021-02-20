import { Document } from "mongoose";
import { IUser } from "../../interfaces/entities";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
}
