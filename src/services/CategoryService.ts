import ICategory from "../interfaces/ICategory";
import Category from "../models/Category";
import { Types } from "mongoose";

export default class CategoryService {
  constructor() {}

  public async getCategories(): Promise<any> {
    return await Category.find({});
  }

  public async getCategory(id: string): Promise<any> {
    return await Category.find({ _id: id });
  }

  public async getCategoryByCondition(query: object): Promise<any> {
    return await Category.find(query);
  }

  public async createCategory(entity: ICategory): Promise<any> {
    const category = new Category(entity);
    return await category.save();
  }

  public async updateCategory(entity: ICategory): Promise<any> {
    return Category.findByIdAndUpdate(entity._id, entity);
  }

  public async deleteCategory(entity: ICategory): Promise<any> {
    return Category.findByIdAndDelete(entity._id);
  }
}
