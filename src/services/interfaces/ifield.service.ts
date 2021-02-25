import { Document } from "mongoose";
import ICategory from "../../interfaces/entities/ICategory";
import { IFields } from "../../interfaces/entities";

export default interface IFieldService {
  getFields(): Promise<Document<any>[]>;

  getField(id: string): Promise<Document<any>[]>;

  createField(entity: IFields): Promise<Document<any>>;

  updateField(id: string, entity: IFields): Promise<Document<any>>;

  deleteField(id: string): Promise<Document<any>>;
}
