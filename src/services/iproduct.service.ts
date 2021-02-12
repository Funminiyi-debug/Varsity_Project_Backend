import { Document } from "mongoose";
import ICategory from "../interfaces/ICategory";
import IProduct from "../interfaces/IProduct";

export interface IProductService {
  getProducts(): Promise<Document<any>[]>;

  getProduct(id: string): Promise<Document<any>[]>;

  getProductsByCondition(query: IProduct): Promise<Document<any>[]>;

  createProduct(entity: IProduct): Promise<Document<any>>;

  updateProduct(id: string, entity: IProduct): Promise<Document<any>>;

  deleteProduct(entity: IProduct): Promise<Document<any>>;
}
