import User from "../models/User";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable, inject } from "inversify";
import { IUserService } from "./Iuser.service";
import Types from "../types";
import IUser from "../interfaces/IUser";

@injectable()
export default class UserService implements IUserService {
  public async getUsers(): Promise<any> {
    const results: Document<any>[] = await User.find({});
    return results;
  }

  public async getUser(id: string): Promise<Document<any>[]> {
    return await User.find({ _id: id });
  }

  public async updateUser(id: string, entity: IUser): Promise<Document<any>> {
    try {
      return await User.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public async deleteUser(entity: IUser): Promise<Document<any>> {
    return User.findByIdAndDelete(entity._id);
  }
}
