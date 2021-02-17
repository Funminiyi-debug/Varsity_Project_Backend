import { Document } from "mongoose";
import IUser from "../../interfaces/IUser";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
}
