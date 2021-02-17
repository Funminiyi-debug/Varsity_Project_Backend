import { Document } from "mongoose";
import { ISubcategory } from "../interfaces/entities";
import SubCategory from "../models/SubCategory";
import { ISubcategoryService } from "./interfaces";

export default class SubcategoryService implements ISubcategoryService {
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
    return await SubCategory.create(entity);
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
