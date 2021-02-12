import { Document } from "mongoose";
import User from "../models/User";
import { IUserService } from "./iuser.service";

export default class UserService implements IUserService {
  async getUserByEmail(email: string): Promise<Document<any>[]> {
    let user = null;
    try {
      user = await User.find({ email });
    } catch (error) {
      console.log(error);
    }
    return user;
  }
}
