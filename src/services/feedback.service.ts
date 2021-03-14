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
  async likeFeedback(
    feedbackid: string,
    userid: string
  ): Promise<Document<any>> {
    const feedback: any = await Feedback.findById(feedbackid);

    if (!feedback) throw new NotFoundException("feedback not found");

    const like = { voter: userid };

    const exists = feedback.likes
      // .map((element) => Object.values(element))
      .some((val) => val["voter"] == userid);

    if (exists) throw new ConflictException("User has already liked feedback");
    feedback.likes = [...feedback.likes, like];

    return await feedback.save();
  }
  async getFeedbacks(): Promise<Document<any>[]> {
    return await Feedback.find({})
      .populate({ path: "author", select: "userName email" })
      .populate({ path: "product", select: " school title category" })
      .populate("replies");
  }

  async getFeedback(id: string): Promise<Document<any>[]> {
    try {
      return await Feedback.find({ _id: id })
        .populate({ path: "author", select: "userName email" })
        .populate({ path: "product", select: " school title category" })
        .populate("replies");
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async createFeedback(request: IFeed, userid: string): Promise<Document<any>> {
    const { productid } = request;
    interface ICreateFeed extends IFeed {
      author: string;
      product: string;
      feedback: string;
    }
    try {
      const entity: ICreateFeed = {
        ...request,
        author: "",
        product: "",
        feedback: undefined,
      };

      if (request.feedbackid != undefined) {
        entity.feedback = request.feedbackid;
      }

      entity.author = userid;
      entity.product = request.productid;

      const feedback = await (await Feedback.create(entity))
        .populate({ path: "author", select: "userName email" })
        .populate({ path: "product", select: " school title category" })
        .populate("replies");

      if (request.feedbackid != undefined) {
        await Feedback.findByIdAndUpdate(entity.feedback, {
          $push: { replies: feedback._id },
        });
      }

      return feedback;
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
