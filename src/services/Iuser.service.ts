import { Document } from "mongoose";
import IUser from "../interfaces/IUser";

export interface IUserService {
  getUsers(): Promise<Document<any>[]>;

  getUser(id: string): Promise<Document<any>[]>;

  updateUser(id: string, entity: IUser): Promise<Document<any>>;

  deleteUser(entity: IUser): Promise<Document<any>>;
}
