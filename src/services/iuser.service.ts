import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import IProduct from "../interfaces/IProduct";
import IUser from "../interfaces/IUser";

export interface IUserService {
  getUserByEmail(email: string): Promise<Document<any>[]>;
}
