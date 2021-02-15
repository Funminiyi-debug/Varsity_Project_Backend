import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable, inject } from "inversify";
import Types from "../types";
import { ICategoryService } from "./icategory.service";
import { IProductService } from "./iproduct.service";
import cacheClient from "../config/redis";

@injectable()
export default class CategoryService implements ICategoryService {
  constructor(
    @inject(Types.IProductService) private productService: IProductService
  ) {}

  public async getCategories(): Promise<Document<any>[]> {
    return await Category.find({}).populate("SubCategory").populate("Service");
    // const results = this.productService.getData();
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
    const exists = await Category.find({ name: entity.name });
    if (exists.length > 0) {
      return null;
    }

    const category = new Category(entity);
    return await category.save();
    // return await Category.create({
    //   name: entity.name,
    //   categoryType: entity.categoryType,
    // });
  }

  public async updateCategory(
    id: string,
    entity: ICategory
  ): Promise<Document<any>> {
    return await Category.findByIdAndUpdate(id, entity, { new: true });
  }

  public async deleteCategory(id: string): Promise<Document<any>> {
    return await Category.findByIdAndDelete(id);
  }
}
