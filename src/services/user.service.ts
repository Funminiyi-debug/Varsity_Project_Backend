import { Document } from "mongoose";
import IUser from "../interfaces/IUser";
import User from "../models/User";
import { IUserService } from "./interfaces";

export default class UserService implements IUserService {
  async getUserByCondition(query: IUser): Promise<Document<any>[]> {
    return await User.find(query);
  }

  async getByEmail(email: string): Promise<Document<IUser>> {
    const user = await User.findOne({ email });
    if (user) {
      return user;
    }
    return null;
  }
}
