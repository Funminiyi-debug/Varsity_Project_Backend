import { Document } from "mongoose";
import VerificationStatus from "../../enums/VerificationStatus";
// import VerificationStatus from "../../enums/VerificationStatus";
import { IUser } from "../../interfaces/entities";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
  getUsers(): Promise<Document<any>[]>;
  updateUser(id: string, entity: IUser);
  updateVerificationStatus(id: string, status: VerificationStatus);
  getUser(id: string);
  deleteUser(id: string): Promise<Document<any>>;
  saveAd(item: any, userid: string): Promise<Document<any>>;
}
