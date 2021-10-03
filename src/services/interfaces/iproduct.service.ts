import { Document } from "mongoose";
import { IFilter, IProduct } from "../../interfaces/entities";
import IAppFile from "../../interfaces/entities/IAppFile";
import { Express } from "express";
import AdStatus from "../../enums/AdStatus";

export default interface IProductService {
  getProducts(): Promise<Document<any>[]>;

  getProduct(id: string);

  getProductsByCondition(query: IFilter): Promise<Document<any>[]>;

  getProductFeedbacks(userid: string);

  getProductsByUser(userid: string): Promise<Document<any>[]>;

  createProduct(
    entity: IProduct,
    files: any,
    email: string
  ): Promise<Document<any>>;

  updateProduct(
    id: string,
    files: any,
    entity: any,
    userEmail: string
  ): Promise<Document<any>>;

  deleteProduct(id: string, userEmail: string): Promise<Document<any>>;

  searchProduct(searchTerm: string): Promise<Document<any>[]>;

  addFeedbackToProduct(
    productid: string,
    feedbackids: string,
    useremail: string
  );

  reportProduct(id: string): Promise<Document<any>>;
  approveProduct(id: string, approvalStatus: AdStatus): Promise<Document<any>>;
}
