import { injectable } from "inversify";
import { Document } from "mongoose";
import Feedback from "../models/Feedback";
import { IFeed } from "../interfaces/entities";
import { IFeedbackService } from "./interfaces";
import { ConflictException, ServerErrorException } from "../exceptions";

@injectable()
export default class FeedbackService implements IFeedbackService {
  async getFeedbacks(): Promise<Document<any>[]> {
    return await Feedback.find({});
  }

  async getFeedback(id: string): Promise<Document<any>[]> {
    try {
      return await Feedback.find({ _id: id });
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async createFeedback(request: IFeed): Promise<Document<any>> {
    const { productId, serviceId } = request;
    if (productId && serviceId) throw new ConflictException("ids conflit");
    else if (productId) delete request.serviceId;
    else if (serviceId) delete request.productId;

    const feedback = new Feedback(request);
    return await feedback.save();
  }

  async updateFeedback(id: string, entity: IFeed): Promise<Document<any>> {
    try {
      return await Feedback.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async deleteFeedback(id: string): Promise<Document<any>> {
    try {
      return await Feedback.findByIdAndDelete(id);
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
}
