import { Document } from "mongoose";
import { IUser, IVerify } from "../interfaces/entities";
import User from "../models/User";
import { IUserService } from "./interfaces";
import { injectable } from "inversify";
// import VerificationStatus from "../enums/VerificationStatus";
import { ServerErrorException } from "../exceptions";
import UsersController from "../controllers/user.controller";
import VerificationStatus from "../enums/VerificationStatus";

@injectable()
export default class UserService implements IUserService {
  async getUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async updateUser(id: string, entity: IUser) {
    try {
      return await User.findByIdAndUpdate(id, entity);
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async updateVerificationStatus(id: string, status: VerificationStatus) {
    try {
      return await User.findByIdAndUpdate(id, { verificationStatus: status });
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = (await User.findById(id)) as any;
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

  async deleteUser(id: string): Promise<Document<any>> {
    try {
      return await (await User.findById(id)).remove();
    } catch (error) {
      throw ServerErrorException(error);
    }
  }
}
