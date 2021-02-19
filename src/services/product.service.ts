import { Document } from "mongoose";
import { inject, injectable } from "inversify";
import { IProductService, IUserService } from "./interfaces";
import IProduct from "../interfaces/IProduct";
import Product from "../models/Product";
import Types from "../types";

@injectable()
export default class ProductService implements IProductService {
  constructor(@inject(Types.IUserService) private userService: IUserService) {}
  async getProducts(): Promise<Document<any>[]> {
    return await Product.find({})
      .populate("author")
      .populate("subcategory")
      .populate("images")
      .populate("feedbacks");
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
  async createProduct(entity: IProduct, email: string): Promise<Document<any>> {
    const user = await this.userService.getByEmail(email);
    entity.author = user.id;
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
