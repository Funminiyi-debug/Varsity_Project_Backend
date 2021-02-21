import fs from "fs";
import path from "path";
import { injectable } from "inversify";
import { Document } from "mongoose";
import { ServerErrorException } from "../exceptions";
import IAppFile from "../interfaces/entities/IAppFile";
import AppFile from "../models/AppFile";
import { IAppFileService } from "./interfaces";

@injectable()
export default class AppFileService implements IAppFileService {
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

  async addAppFile(entity: IAppFile): Promise<Document<any>> {
    try {
      const image = {
        name: `../uploads/${entity.filename}`,
        data: fs.readFileSync(
          path.resolve(__dirname, "../uploads/" + entity.filename)
        ),
        mimetype: entity.mimetype,
      };
      return await AppFile.create(image);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
}
