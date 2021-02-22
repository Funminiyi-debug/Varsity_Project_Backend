import { Document } from "mongoose";
import { IUser } from "../interfaces/entities";
import User from "../models/User";
import { IUserService } from "./interfaces";
import { injectable } from "inversify";
import VerificationStatus from "../enums/VerificationStatus";

@injectable()
export default class UserService implements IUserService {
  async getUsers() {
    return await User.find({});
  }
  updateUser(id: string, entity: IUser) {
    throw new Error("Method not implemented.");
  }
  changeVerificationStatus(id: string, status: VerificationStatus) {
    throw new Error("Method not implemented.");
  }
  async getUser(id: string) {
    const user = await User.findById(id);
    if (user) {
      return user;
    }
    return null;
  }
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
