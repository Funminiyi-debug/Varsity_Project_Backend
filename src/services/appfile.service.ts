import fs from "fs";
import path from "path";
import { injectable } from "inversify";
import { Document } from "mongoose";
import { ServerErrorException } from "../exceptions";
import AppFile from "../models/AppFile";
import { IAppFileService } from "./interfaces";

@injectable()
export default class AppFileService implements IAppFileService {
  async deleteAppFile(id: string) {
    return await AppFile.findByIdAndDelete(id);
  }
  async getAppFile(id: string): Promise<Document<any>> {
    try {
      return await AppFile.findById(id)
        .populate("postid")
        .populate("productId")
        .populate("serviceId");
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
  async getAllAppFiles(): Promise<Document<any>[]> {
    try {
      return await AppFile.find()
        .populate("postid")
        .populate("productId")
        .populate("serviceId");
    } catch (error) {
      throw new ServerErrorException(error);
    }
  }

  async addAppFile(entity: Express.Multer.File): Promise<Document<any>> {
    try {
      const image = {
        name: `image_${entity.originalname}`,
        data: fs.readFileSync(path.resolve(__dirname, "../../", entity.path)),
        mimetype: entity.mimetype,
      };
      return await AppFile.create(image);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
}
