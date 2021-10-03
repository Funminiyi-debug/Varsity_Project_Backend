import { Document } from "mongoose";
import ICategory from "../../interfaces/entities/ICategory";
import IStaticPage from "../../interfaces/entities/StaticPage";

export default interface IStaticService {
  getStaticPages(status: string): Promise<Document<any>[]>;

  getStaticPage(id: string): Promise<Document<any>>;

  getStaticPageByCondition(query: IStaticPage): Promise<Document<any>[]>;

  createStaticPage(entity: IStaticPage): Promise<Document<any>>;

  updateStaticPage(id: string, entity: IStaticPage): Promise<Document<any>>;

  deleteStaticPage(id: string): Promise<Document<any>>;

  changeStatus(id: string, status: string): Promise<Document<any>>;
}
