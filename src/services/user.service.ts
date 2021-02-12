import { Document } from "mongoose";
import IUser from "../interfaces/IUser";
import User from "../models/User";
import { IUserService } from "./iuser.service";

export default class UserService implements IUserService {
  async getUserByCondition(query: IUser): Promise<Document<any>[]> {
    return await User.find(query);
  }
}
