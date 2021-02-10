import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable, inject } from "inversify";
import { ICategoryService } from "./Icategory.service";
import ProductService from "./product.service";
import Types from "../types";

@injectable()
export default class CategoryService implements ICategoryService {
  constructor(
    @inject(Types.ProductService) private productService: ProductService
  ) {}

  public async getCategories(): Promise<any> {
    const results: Document<any>[] = await Category.find({})
      .populate("SubCategory")
      .populate("Service");
    // const results = this.productService.getData();
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
    const exists = await Category.find({ name: entity.name });
    if (exists.length > 0) {
      return null;
    }
    const category = new Category(entity);

    return await category.save();
  }

  public async updateCategory(
    id: string,
    entity: ICategory
  ): Promise<Document<any>> {
    try {
      return await Category.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  public async deleteCategory(entity: ICategory): Promise<Document<any>> {
    return Category.findByIdAndDelete(entity._id);
  }
}
