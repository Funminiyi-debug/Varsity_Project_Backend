import { injectable } from "inversify";
import { Document } from "mongoose";
import Feedback from "../models/Feedback";
import { IFeed } from "../interfaces/entities";
import { IFeedbackService } from "./interfaces";
import {
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from "../exceptions";

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

  async createFeedback(request: IFeed, userid: string): Promise<Document<any>> {
    const { productid, serviceid } = request;
    if (productid && serviceid) throw new ConflictException("ids conflict");
    else if (productid) delete request.serviceid;
    else if (serviceid) delete request.productid;
    try {
      const feedback = new Feedback(request);
      return await feedback.save();
    } catch (error) {
      console.log(error);
      throw ServerErrorException(error);
    }
  }

  async updateFeedback(
    id: string,
    entity: IFeed,
    userid: string
  ): Promise<Document<any>> {
    try {
      const exists = (await Feedback.find({ _id: id, author: userid }))[0];
      if (exists) throw new NotFoundException("feedback not found");
      return await Feedback.findByIdAndUpdate(id, entity, { new: true });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async deleteFeedback(id: string, userid: string): Promise<Document<any>> {
    try {
      const exists = await Feedback.find({ _id: id, author: userid })[0];
      if (!exists) throw new NotFoundException("Feedback not found");
      return await exists.remove();
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }
}
