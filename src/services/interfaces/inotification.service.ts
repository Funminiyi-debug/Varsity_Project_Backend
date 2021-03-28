import { Document } from "mongoose";
import ICategory from "../../interfaces/entities/ICategory";
import { INotification } from "../../interfaces/entities";

export default interface INotificationService {
  getNotifications(userid: string): Promise<Document<any>[]>;

  getNotification(id: string, userid: string): Promise<Document<any>[]>;

  createNotification(entity: INotification): Promise<Document<any>>;

  updateNotification(id: string, entity: INotification): Promise<Document<any>>;

  deleteNotification(id: string, userid: string): Promise<Document<any>>;
}
