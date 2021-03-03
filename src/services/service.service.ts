import { injectable, inject } from "inversify";
import { Document } from "mongoose";
import IService from "../interfaces/entities/IService";
import Service from "../models/Service";
import Types from "../types";
import {
  BadDataException,
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from "../exceptions";
import {
  IServiceService,
  IUserService,
  IFeedbackService,
  IAppFileService,
  ICategoryService,
} from "./interfaces";

@injectable()
export default class ServiceService implements IServiceService {
  constructor(
    @inject(Types.IUserService) private userService: IUserService,
    @inject(Types.IFeedbackService) private feedbackService: IFeedbackService,
    @inject(Types.IAppFileService) private appfileService: IAppFileService,
    @inject(Types.ICategoryService)
    private categoryService: ICategoryService
  ) {}

  addFeedbacksToService(
    serviceid: string,
    feedbackids: string[],
    useremail: string
  ) {
    throw new Error("Method not implemented.");
  }

  async getServices(): Promise<Document<any>[]> {
    return await Service.find({})
      .populate("author")
      .populate("category")
      .populate("images")
      .populate("feedbacks");
  }

  async getService(id: string): Promise<Document<any>[]> {
    return await Service.find({ _id: id });
  }

  async getServicesByCondition(query: IService): Promise<Document<any>[]> {
    return await Service.find(query);
  }

  async createService(
    service: IService,
    files: any,
    email: string
  ): Promise<Document<any>> {
    const entity = {
      ...service,
      author: "",
      images: [],
      subcategory: "",
    };
    // AUTHOR
    const user = await this.userService.getByEmail(email);
    entity.author = user.id;

    // Check if product exists
    const exists = await Service.find({
      name: entity.title,
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
    const categoryExist = await this.categoryService.getCategory(
      entity.categoryId
    );
    if (categoryExist.length == 0) {
      imageids.forEach(
        async (id) => await this.appfileService.deleteAppFile(id)
      );
      throw new BadDataException("subcategory does not exist");
    }

    entity.subcategory = categoryExist[0].id;

    try {
      const product = await Service.create(entity);

      await this.categoryService.addServiceToCategory(
        entity.categoryId,
        product.id
      );

      return product;
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async updateService(
    id: string,
    files: any,
    service: any,
    userEmail: string
  ): Promise<Document<any>> {
    const entity = {
      ...service,
      author: "",
      images: [],
      subcategory: "",
    };
    // AUTHOR
    const user = await this.userService.getByEmail(userEmail);
    entity.author = user.id;

    // Check if product exists
    const exists = (await Service.find({
      name: entity.title,
      author: entity.author,
    })) as any[];

    if (exists.length == 0) throw new NotFoundException("product not found");

    // IMAGE
    if (files || files.length > 0) {
      const imageids = await Promise.all([
        ...files.map(async (file) => {
          const appfile = await this.appfileService.addAppFile(file);
          return appfile.id;
        }),
      ]);
      entity.images.push(...imageids);
    } else {
      entity.images = exists[0].images;
    }

    try {
      const product = await Service.findByIdAndUpdate(id, entity, {
        new: true,
      });

      return product;
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async deleteService(id: string, userid: string): Promise<Document<any>> {
    try {
      const service = (await Service.find({ _id: id, author: userid }))[0];
      if (service) return await service.remove();
      throw new NotFoundException("service not found");
    } catch (error) {
      throw error;
    }
  }
}
