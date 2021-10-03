import { Document } from "mongoose";
import StaticPageStatus from "../enums/StaticPageStatus";
import { ICategory } from "../interfaces/entities";
import IStaticPage from "../interfaces/entities/StaticPage";
import StaticPage from "../models/Static";
import IStaticService from "./interfaces/istatic.service";

export default class StaticService implements IStaticService {
  constructor() {}
  async changeStatus(id: string, status: string): Promise<Document<any>> {
    return await StaticPage.findByIdAndUpdate(id, { status }, { new: true });
  }
  async getStaticPages(status: string): Promise<Document<any>[]> {
    return await StaticPage.find({ status });
  }
  async getStaticPage(id: string): Promise<Document<any>> {
    return await StaticPage.findById(id);
  }
  async getStaticPageByCondition(query: IStaticPage): Promise<Document<any>[]> {
    return await StaticPage.find({ query });
  }
  async createStaticPage(entity: IStaticPage): Promise<Document<any>> {
    entity.status = StaticPageStatus.Active;
    return await StaticPage.create(entity);
  }
  async updateStaticPage(
    id: string,
    entity: IStaticPage
  ): Promise<Document<any>> {
    return await StaticPage.findByIdAndUpdate(id, { ...entity }, { new: true });
  }
  async deleteStaticPage(id: string): Promise<Document<any>> {
    return await StaticPage.findByIdAndDelete(id);
  }
}
