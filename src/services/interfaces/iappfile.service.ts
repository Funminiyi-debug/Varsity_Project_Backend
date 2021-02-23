import { Document } from "mongoose";
import IAppFile from "../../interfaces/entities/IAppFile";

export default interface IAppFileService {
  addAppFile(entity: any): Promise<Document<any>>;
  getAppFile(id: string): Promise<Document<any>>;
  getAllAppFiles(): Promise<Document<any>[]>;
  deleteAppFile(id: string): Promise<any>;
}
