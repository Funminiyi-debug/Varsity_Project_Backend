import { injectable } from "inversify";
import { INotificationService } from "./interfaces";
import Notification from "../models/Notification";
import { Document } from "mongoose";
import { ServerErrorException } from "../exceptions";
import { INotification } from "../interfaces/entities";

@injectable()
export default class NotificationService implements INotificationService {
  async getNotifications(userid: string): Promise<Document<any>[]> {
    try {
      // const allNotifications = await Notification.find();
      return await Notification.find({ user: userid });
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }
  async getNotification(id: string, userid: string): Promise<Document<any>[]> {
    try {
      return await Notification.find({ _id: id, user: userid });
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async createNotification(entity: INotification): Promise<Document<any>> {
    try {
      const notification = new Notification(entity);
      return await notification.save();
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async updateNotification(
    id: string,
    entity: INotification
  ): Promise<Document<any>> {
    try {
      return await Notification.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      throw ServerErrorException(error);
    }
  }

  async deleteNotification(id: string, userid: string): Promise<Document<any>> {
    try {
      return await Notification.findOneAndDelete({ _id: id, user: userid });
    } catch (error) {
      throw ServerErrorException(error);
    }
  }
}
