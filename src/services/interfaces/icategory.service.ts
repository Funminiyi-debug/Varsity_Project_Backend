import { Document } from "mongoose";
import ICategory from "../../interfaces/entities/ICategory";

export default interface ICategoryService {
  getCategories(): Promise<Document<any>[]>;

  getCategory(id: string): Promise<Document<any>[]>;

  getCategoryByCondition(query: ICategory): Promise<Document<any>[]>;

  createCategory(entity: ICategory): Promise<Document<any>>;

  updateCategory(id: string, entity: ICategory): Promise<Document<any>>;

  deleteCategory(id: string): Promise<Document<any>>;

  addSubcategoryToCategory(id: string, subcategoryid: string): Promise<boolean>;

  addServiceToCategory(id: string, serviceid: string): Promise<boolean>;
}
