import { Document } from "mongoose";
import { ISubcategory } from "../../interfaces/entities";

export default interface ISubcategoryService {
  getSubcategories(): Promise<Document<any>[]>;

  getSubcategory(id: string): Promise<Document<any>[]>;

  getSubcategoryByCondition(query: ISubcategory): Promise<Document<any>[]>;

  createSubcategory(entity: ISubcategory): Promise<Document<any>>;

  updateSubcategory(id: string, entity: ISubcategory): Promise<Document<any>>;

  deleteSubcategory(id: string): Promise<Document<any>>;

  addProductToSubcategory(id: string, productid: string): Promise<boolean>;
}
