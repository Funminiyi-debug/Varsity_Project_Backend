import { inject, injectable } from "inversify";
import { Document } from "mongoose";
import { ISubcategory } from "../interfaces/entities";
import SubCategory from "../models/SubCategory";
import Types from "../types";
import { ICategoryService, ISubcategoryService } from "./interfaces";
import { ConflictException, ServerErrorException } from "../exceptions";

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
    try {
      return await SubCategory.find().populate("products");
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  //   get subcategry by id
  async getSubcategory(id: string): Promise<Document<any>[]> {
    try {
      return await SubCategory.find({ id }).populate("products");
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  //   get subcategory by any condition
  async getSubcategoryByCondition(query: object): Promise<Document<any>[]> {
    try {
      return await SubCategory.find(query).populate("products");
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  //   creates a subcategory
  async createSubcategory(entity: ISubcategory): Promise<Document<any>> {
    const exists = await SubCategory.find({
      name: entity.name,
      category: entity.category,
    });
    if (exists.length > 0) {
      throw new ConflictException("subcategory already exist");
    }
    const createdSubcategory = await SubCategory.create(entity);
    const addCategory = await this.categoryService.addSubcategoryToCategory(
      entity.category,
      createdSubcategory.id
    );

    console.log("category added", addCategory);
    if (addCategory) {
      return createdSubcategory;
    }
    throw new ServerErrorException("unable to add subcategory to category");

    // return createdSubcategory;
  }

  //   updates a subcategory
  async updateSubcategory(
    id: string,
    entity: ISubcategory
  ): Promise<Document<any>> {
    try {
      return await SubCategory.findByIdAndUpdate(id, entity);
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
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
      throw new ServerErrorException(error);
    }
  }

  async deleteSubcategory(id: string): Promise<Document<any>> {
    try {
      return (await SubCategory.findById(id)).remove();
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
}
