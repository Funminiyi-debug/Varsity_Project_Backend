import Category from "../models/Category";
import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import { injectable } from "inversify";
import { IProductService } from "./iproduct.service";
import IProduct from "../interfaces/IProduct";

@injectable()
export default class ProductService implements IProductService {
  constructor() {}
  getProducts(): Promise<Document<any>[]> {
    throw new Error("Method not implemented.");
  }
  getProduct(id: string): Promise<Document<any>[]> {
    throw new Error("Method not implemented.");
  }
  getProductsByCondition(query: IProduct): Promise<Document<any>[]> {
    throw new Error("Method not implemented.");
  }
  createProduct(entity: IProduct): Promise<Document<any>> {
    throw new Error("Method not implemented.");
  }
  updateProduct(id: string, entity: IProduct): Promise<Document<any>> {
    throw new Error("Method not implemented.");
  }
  deleteProduct(entity: IProduct): Promise<Document<any>> {
    throw new Error("Method not implemented.");
  }

  getData() {
    return "sample data";
  }
}
