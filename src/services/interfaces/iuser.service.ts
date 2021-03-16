import { Document } from "mongoose";
// import VerificationStatus from "../../enums/VerificationStatus";
import { IUser } from "../../interfaces/entities";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
  getUsers();
  updateUser(id: string, entity: IUser);
  updateVerificationStatus(id: string, status: any);
  getUser(id: string);
  deleteUser(id: string): Promise<Document<any>>;
}
