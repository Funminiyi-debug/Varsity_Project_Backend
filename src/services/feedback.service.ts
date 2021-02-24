import { injectable } from "inversify";
import { Document } from "mongoose";
import Feedback from "../models/Feedback";
import { IFeed } from "../interfaces/entities";
import { IFeedbackService } from "./interfaces";

@injectable()
export default class FeedbackService implements IFeedbackService {
  async getFeedbacks(): Promise<Document<any>[]> {
    return await Feedback.find({});
  }

  async getFeedback(id: string): Promise<Document<any>[]> {
    return await Feedback.find({ _id: id });
  }

  async createFeedback(entity: IFeed): Promise<Document<any>> {
    const exists = await Feedback.find({ _id: entity.productId });
    if (exists.length > 0) {
      return null;
    }

    const feedback = new Feedback(entity);
    return await feedback.save();
  }

  async updateFeedback(id: string, entity: IFeed): Promise<Document<any>> {
    return await Feedback.findByIdAndUpdate(id, entity, { new: true });
  }

  async deleteFeedback(id: string): Promise<Document<any>> {
    return await Feedback.findByIdAndDelete(id);
  }
}
