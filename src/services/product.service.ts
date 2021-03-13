// @ts-nocheck
import { Document } from "mongoose";
import { inject, injectable } from "inversify";
import { Express } from "express";
import {
  IProductService,
  IUserService,
  IFeedbackService,
  IAppFileService,
  ISubcategoryService,
  ICategoryService,
} from "./interfaces";
import Product from "../models/Product";
import Types from "../types";
import { IProduct, IFilter } from "../interfaces/entities";
import IAppFile from "../interfaces/entities/IAppFile";
import {
  BadDataException,
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from "../exceptions";
import UnauthorizedException from "../exceptions/UnauthorizedException";
import "../utils/flatArray";
interface IProductCreate extends IProduct {
  author: string;
  images: any[];
  subcategory: string;
  category: string;
}

@injectable()
export default class ProductService implements IProductService {
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.IFeedbackService) private feedbackService: IFeedbackService,
    @inject(Types.IAppFileService) private appfileService: IAppFileService,
    @inject(Types.ISubcategoryService)
    private subcategoryService: ISubcategoryService,
    @inject(Types.ICategoryService)
    private categoryService: ICategoryService
  ) {}
  async addFeedbackToProduct(
    productid: string,
    feedbackids: string,
    useremail: string
  ) {
    return await Product.findByIdAndUpdate(productid, {
      $push: {
        feedbacks: feedbackids,
      },
    });
  }
  async getProducts(): Promise<Document<any>[]> {
    return await Product.find({})
      .populate("author", { userName: 1, email: 1 })
      .populate("subcategory")
      .populate("images")
      .populate("feedback")
      .populate("category");
    // return await this.appfileService.getAllAppFiles();
  }

  // get product
  async getProduct(id: string): Promise<Document<any>[]> {
    return await Product.find({ _id: id });
  }

  // search for product
  async getProductsByCondition(query: IFilter): Promise<Document<any>[]> {
    let {
      name,
      school,
      priceMax,
      priceMin,
      sortBy,
      otherFields,
    }: IFilter = query;
    if (otherFields == undefined) otherFields = [];
    console.log("query from service ", query);
    const sortedData =
      sortBy === "Newest"
        ? { timestamps: "descending" } // or { _id: -1 }
        : sortBy === "Highest Price"
        ? { price: -1 }
        : sortBy === "Lowest Price"
        ? { price: 1 }
        : { price: 1 };

    const allProducts = Product.find()
      .populate("author")
      .populate("subcategory")
      .populate("category")
      .populate("images")
      .populate("Feedback");

    return await allProducts
      .or(
        [
          {
            "subcategory.name": name,
          },
          {
            "category.name": name,
          },
          { school: school },
          { price: { $gte: priceMin || 0, $lte: priceMax || 1000000000000 } },

          otherFields,
        ].flat(Infinity)
      )
      // .or(otherFields)
      .sort(sortedData);
  }

  // create product
  async createProduct(
    product: IProduct,
    files: any,
    userid: string
  ): Promise<Document<any>> {
    const entity: IProductCreate = {
      ...product,
      author: "",
      images: [],
      subcategory: "",
      category: "",
    };

    const isProduct: boolean = product.subcategoryId != undefined;

    // AUTHOR

    entity.author = userid;

    // Check if product exists
    const exists = await Product.find({
      title: entity.title,
      author: entity.author,
    });

    if (exists.length > 0) throw new ConflictException("Product already exist");

    // IMAGE
    if (!files || files.length == 0) {
      throw new BadDataException("you must include images");
    }

    const imageids = await Promise.all([
      ...files.map(async (file) => {
        const appfile = await this.appfileService.addAppFile(file);
        return appfile.id;
      }),
    ]);
    // await Promise.all(imageids);
    entity.images = imageids;

    // SUBCATEGORY
    if (isProduct) {
      const subcategoryExist = await this.subcategoryService.getSubcategory(
        entity.subcategoryId
      );

      if (subcategoryExist.length == 0) {
        imageids.forEach(
          async (id) => await this.appfileService.deleteAppFile(id)
        );
        throw new BadDataException("subcategory does not exist");
      }

      entity.subcategory = subcategoryExist[0].id;
      delete entity.category;
    } else {
      // CATEGORY
      const categoryExist = await this.categoryService.getCategory(
        entity.categoryId
      );
      if (categoryExist.length == 0) {
        imageids.forEach(
          async (id) => await this.appfileService.deleteAppFile(id)
        );
        throw new BadDataException("category does not exist");
      }

      entity.category = categoryExist[0].id;
      delete entity.subcategory;
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
    files: any,
    product: any,
    userid
  ): Promise<Document<any>> {
    const entity: IProductCreate = {
      ...product,
      subcategory: "",
      category: "",
      images: [],
    };

    // AUTHOR
    entity.author = userid;

    // Check if product exists
    const exists = (await Product.findOne({
      _id: id,
      author: userid,
    })) as any;

    if (!exists) throw new NotFoundException("product not found");

    //Product
    const subcategoryExist = await this.subcategoryService.getSubcategory(
      entity.subcategoryId
    );

    if (subcategoryExist.length == 0) {
      entity.subcategory = exists.subcategoryId;
    } else {
      entity.subcategory = subcategoryExist[0].id;
    }

    //Service
    const categoryExist = await this.categoryService.getCategory(
      entity.categoryId
    );

    if (categoryExist.length == 0) {
      entity.category = exists.categoryId;
    } else {
      entity.category = categoryExist[0].id;
    }

    // IMAGE
    if (files || files.length > 0) {
      const imageids = await Promise.all([
        ...files.map(async (file) => {
          const appfile = await this.appfileService.addAppFile(file);
          return appfile.id;
        }),
      ]);
      entity.images = [...entity.images, ...imageids];
    } else {
      entity.images = exists.images;
    }

    try {
      const product = await Product.findByIdAndUpdate(id, entity, {
        new: true,
      });

      return product;
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  // delete product
  async deleteProduct(
    productid: string,
    userid: string
  ): Promise<Document<any>> {
    try {
      const product = (
        await Product.find({ _id: productid, author: userid })
      )[0];
      if (product) return await product.remove();
      throw new NotFoundException("product not found");
    } catch (error) {
      throw error;
    }
  }
}
