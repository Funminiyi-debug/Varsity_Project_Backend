import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable } from "inversify";
import { IProductService } from "./iproduct.service";
import IProduct from "../interfaces/IProduct";
import Product from "../models/Product";

@injectable()
export default class ProductService implements IProductService {
  results: Document<any>[] = [];
  result: Document<any> = null;
  constructor() {}
  async getProducts(): Promise<Document<any>[]> {
    try {
      this.results = await Product.find({})
        .populate("User")
        .populate("subcategory")
        .populate("AppFile")
        .populate("Feedback");
    } catch (error) {
      this.results = undefined;
      console.log(error);
    }

    return this.results;
  }
  async getProduct(id: string): Promise<Document<any>[]> {
    try {
      this.results = await Product.find({ _id: id });
    } catch (error) {
      this.results = undefined;
      console.log(error);
    }
    return this.results;
  }
  async getProductsByCondition(query: IProduct): Promise<Document<any>[]> {
    try {
      this.results = await Product.find(query);
    } catch (error) {
      this.results = undefined;
      console.log(error);
    }
    return this.results;
  }
  async createProduct(entity: IProduct): Promise<Document<any>> {
    try {
      const product = await new Product(entity);
      this.result = await product.save();
    } catch (error) {
      this.result = undefined;
      console.log(error);
    }

    return this.result;
  }
  async updateProduct(id: string, entity: IProduct): Promise<Document<any>> {
    try {
      this.result = await Product.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      this.result = undefined;
      console.log(error);
    }
    return this.result;
  }
  async deleteProduct(entity: IProduct): Promise<Document<any>> {
    try {
      this.result = await Product.findByIdAndDelete(entity._id);
    } catch (error) {
      this.result = undefined;
      console.log(error);
    }
    return this.result;
  }
}
