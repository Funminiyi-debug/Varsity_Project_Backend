import { Document } from "mongoose";
import { inject, injectable } from "inversify";
import {
  IProductService,
  IUserService,
  IFeedbackService,
  IAppFileService,
  ISubcategoryService,
} from "./interfaces";
import Product from "../models/Product";
import Types from "../types";
import { IProduct } from "../interfaces/entities";
import IAppFile from "../interfaces/entities/IAppFile";
import {
  BadDataException,
  ConflictException,
  ServerErrorException,
} from "../exceptions";

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.IFeedbackService) private feedbackService: IFeedbackService,
    @inject(Types.IAppFileService) private appfileService: IAppFileService,
    @inject(Types.ISubcategoryService)
    private subcategoryService: ISubcategoryService
  ) {}
  async getProducts(): Promise<Document<any>[]> {
    return await Product.find({})
      .populate("author")
      .populate("subcategory")
      .populate("images")
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
  async createProduct(
    entity: any,
    files: IAppFile[],
    email: string
  ): Promise<Document<any>> {
    // AUTHOR
    const user = await this.userService.getByEmail(email);
    entity.author = user.id;

    // Check if product exists
    const exists = await Product.find({
      name: entity.title,
      author: entity.author,
    });
    if (exists.length > 0) throw new ConflictException("Product already exist");

    // IMAGE
    if (!files || files.length == 0) {
      throw new BadDataException("you must include images");
    }

    const imageids = files.map(async (file) => {
      const appfile = await this.appfileService.addAppFile(file);
      return appfile.id;
    });
    entity.images = imageids;

    // SUBCATEGORY
    const subcategoryExist = await this.subcategoryService.getSubcategory(
      entity.subcategoryId
    );
    if (subcategoryExist.length == 0) {
      throw new BadDataException("subcategory does not exist");
    }

    try {
      const product = await Product.create(entity);

      await this.subcategoryService.addProductToSubcategory(
        entity.subcategoryId,
        product.id
      );

      return product;
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
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
