import { inject, injectable } from "inversify";
import { Document } from "mongoose";
import { ISubcategory } from "../interfaces/entities";
import SubCategory from "../models/SubCategory";
import Types from "../types";
import { ICategoryService, ISubcategoryService } from "./interfaces";
import { ServerErrorException } from "../exceptions";

@injectable()
export default class SubcategoryService implements ISubcategoryService {
  /**
   *
   */
  constructor(
    @inject(Types.ICategoryService) private categoryService: ICategoryService
  ) {}
  // get all subcategories
  async getSubcategories(): Promise<Document<any>[]> {
    return await SubCategory.find().populate("products");
  }

  //   get subcategry by id
  async getSubcategory(id: string): Promise<Document<any>[]> {
    return await SubCategory.find({ id }).populate("products");
  }

  //   get subcategory by any condition
  async getSubcategoryByCondition(query: object): Promise<Document<any>[]> {
    return await SubCategory.find(query).populate("products");
  }

  //   creates a subcategory
  async createSubcategory(entity: ISubcategory): Promise<Document<any>> {
    try {
      const createdSubcategory = await SubCategory.create(entity);
      const addCategory = await this.categoryService.addSubcategoryToCategory(
        entity.category,
        createdSubcategory.id
      );

      if (addCategory) {
        return createdSubcategory;
      }
      throw new ServerErrorException("unable to add subcategory to category");
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }

    // return createdSubcategory;
  }

  //   updates a subcategory
  async updateSubcategory(
    id: string,
    entity: ISubcategory
  ): Promise<Document<any>> {
    return await SubCategory.findByIdAndUpdate(id, entity);
  }

  //   add product to a subcategory
  async addProductToSubcategory(
    id: string,
    productid: string
  ): Promise<boolean> {
    try {
      await SubCategory.findByIdAndUpdate(id, {
        $push: {
          products: productid,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async deleteSubcategory(id: string): Promise<Document<any>> {
    return await SubCategory.findByIdAndDelete(id);
  }
}
