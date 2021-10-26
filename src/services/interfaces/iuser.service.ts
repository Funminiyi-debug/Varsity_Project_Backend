import { Document } from "mongoose";
import VerificationStatus from "../../enums/VerificationStatus";
// import VerificationStatus from "../../enums/VerificationStatus";
import { IUser } from "../../interfaces/entities";
import { Chat } from "../../interfaces/SocketInterfaces";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
  getUsers(): Promise<Document<any>[]>;
  updateUser(id: string, entity: IUser);
  updateVerificationStatus(id: string, status: VerificationStatus);
  getUser(id: string);
  deleteUser(id: string): Promise<Document<any>>;
  saveAd(item: any, userid: string): Promise<Document<any>>;
  makeAdmin(userid): Promise<boolean>;
  removeAdmin(userid): Promise<boolean>;
  adminLogin(username: string, password: string): Promise<boolean>;
  resetAdminLogin(
    username: string,
    oldpassword: string,
    newpassword: string
  ): Promise<boolean>;
  getAdmin();
}
