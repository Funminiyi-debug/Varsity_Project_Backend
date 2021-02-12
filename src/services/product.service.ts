import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable } from "inversify";
import { IProductService } from "./iproduct.service";
import IProduct from "../interfaces/IProduct";
import Product from "../models/Product";

@injectable()
export default class ProductService implements IProductService {
  constructor() {}
  async getProducts(): Promise<Document<any>[]> {
    return await Product.find({})
      .populate("User")
      .populate("subcategory")
      .populate("AppFile")
      .populate("Feedback");
  }

  // get product
  async getProduct(id: string): Promise<Document<any>[]> {
    return await Product.find({ _id: id });
  }

  // search for product
  async getProductsByCondition(query: IProduct): Promise<Document<any>[]> {
    return await Product.find(query);
  }
  // create product
  async createProduct(entity: IProduct, userEmail): Promise<Document<any>> {
    const exists = await Product.find({
      name: entity.title,
      author: entity.author,
    });
    if (exists.length > 0) return null;
    const product = new Product(entity);
    return await product.save();
  }

  // update product
  async updateProduct(
    id: string,
    entity: IProduct,
    userEmail
  ): Promise<Document<any>> {
    return await Product.findByIdAndUpdate(id, entity, { new: true });
  }

  // delete product
  async deleteProduct(id: string, userEmail): Promise<Document<any>> {
    return await Product.findByIdAndDelete(id);
  }
}
