import { Document } from "mongoose";
import { IUser } from "../interfaces/entities";
import User from "../models/User";
import { IUserService } from "./interfaces";
import { injectable } from "inversify";
import VerificationStatus from "../enums/VerificationStatus";
import { ServerErrorException } from "../exceptions";

@injectable()
export default class UserService implements IUserService {
  async getUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  updateUser(id: string, entity: IUser) {
    throw new Error("Method not implemented.");
  }

  changeVerificationStatus(id: string, status: VerificationStatus) {
    throw new Error("Method not implemented.");
  }

  async getUser(id: string) {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getUserByCondition(query: IUser): Promise<Document<any>[]> {
    try {
      return await User.find(query);
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getByEmail(email: string): Promise<Document<IUser>> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async deleteService(id: string, userEmail: string) {
    try {
      return (await User.findById(id)).remove();
    } catch (error) {
      throw ServerErrorException(error);
    }
  }
}
