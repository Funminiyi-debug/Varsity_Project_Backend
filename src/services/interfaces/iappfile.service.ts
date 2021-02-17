import { Document } from "mongoose";
import IAppFile from "../../interfaces/entities/ICategory";

export default interface IAppFileService {
  getAppFiles(): Promise<Document<any>[]>;

  getAppFile(id: string): Promise<Document<any>[]>;

  getAppFileByCondition(query: IAppFile): Promise<Document<any>[]>;

  createAppFiles(entity: IAppFile): Promise<Document<any>>;

  updateAppFile(id: string, entity: IAppFile): Promise<Document<any>>;

  deleteAppFile(id: string): Promise<Document<any>>;
}
