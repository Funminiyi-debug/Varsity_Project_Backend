import { Document } from "mongoose";
import { IProduct } from "../../interfaces/entities";
import IAppFile from "../../interfaces/entities/IAppFile";

export default interface IProductService {
  getProducts(): Promise<Document<any>[]>;

  getProduct(id: string): Promise<Document<any>[]>;

  getProductsByCondition(query: IProduct): Promise<Document<any>[]>;

  createProduct(
    entity: IProduct,
    files: IAppFile[],
    email: string
  ): Promise<Document<any>>;

  updateProduct(
    id: string,
    entity: IProduct,
    userEmail: string
  ): Promise<Document<any>>;

  deleteProduct(id: string, userEmail: string): Promise<Document<any>>;
}
