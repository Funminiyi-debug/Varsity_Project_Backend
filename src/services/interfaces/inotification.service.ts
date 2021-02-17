import { Document } from "mongoose";
import ICategory from "../../interfaces/ICategory";

export default interface INotificationService {
  getCategories(): Promise<Document<any>[]>;

  getCategory(id: string): Promise<Document<any>[]>;

  getCategoryByCondition(query: ICategory): Promise<Document<any>[]>;

  createCategory(entity: ICategory): Promise<Document<any>>;

  updateCategory(id: string, entity: ICategory): Promise<Document<any>>;

  deleteCategory(id: string): Promise<Document<any>>;
}
