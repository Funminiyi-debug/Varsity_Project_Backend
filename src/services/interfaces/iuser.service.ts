import { Document } from "mongoose";
import VerificationStatus from "../../enums/VerificationStatus";
import { IUser } from "../../interfaces/entities";

export default interface IUserService {
  getUserByCondition(query: IUser): Promise<Document<IUser>[]>;
  getByEmail(email: string): Promise<Document<IUser>>;
  getUsers();
  updateUser(id: string, entity: IUser);
  changeVerificationStatus(id: string, status: VerificationStatus);
  getUser(id: string);
}
