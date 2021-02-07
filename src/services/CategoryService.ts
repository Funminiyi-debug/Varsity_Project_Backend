import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable, inject } from "inversify";
import { ICategoryService } from "./ICategoryService";
import ProductService from "./ProductService";
import Types from "../types";

@injectable()
export default class CategoryService implements ICategoryService {
  constructor(
    @inject(Types.ProductService) private productService: ProductService
  ) {}

  public async getCategories(): Promise<any> {
    // const results: Document<any>[] = await Category.find({})
    //   .populate("SubCategory")
    //   .populate("Service");
    const results = this.productService.getData();
    return results;
  }

  public async getCategory(id: string): Promise<Document<any>[]> {
    return await Category.find({ _id: id });
  }

  public async getCategoryByCondition(
    query: ICategory
  ): Promise<Document<any>[]> {
    return await Category.find(query);
  }

  public async createCategory(entity: ICategory): Promise<Document<any>> {
    const category = new Category(entity);
    return await category.save();
  }

  public async updateCategory(entity: ICategory): Promise<Document<any>> {
    return Category.findByIdAndUpdate(entity._id, entity);
  }

  public async deleteCategory(entity: ICategory): Promise<Document<any>> {
    return Category.findByIdAndDelete(entity._id);
  }
}
