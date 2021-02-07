import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";

export interface ICategoryService {
  getCategories(): Promise<Document<any>[]>;

  getCategory(id: string): Promise<Document<any>[]>;

  getCategoryByCondition(query: ICategory): Promise<Document<any>[]>;

  createCategory(entity: ICategory): Promise<Document<any>>;

  updateCategory(entity: ICategory): Promise<Document<any>>;

  deleteCategory(entity: ICategory): Promise<Document<any>>;
}