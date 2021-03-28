import { inject, injectable } from "inversify";
import { Document } from "mongoose";
import Feedback from "../models/Feedback";
import { IFeed } from "../interfaces/entities";
import {
  IFeedbackService,
  IProductService,
  IEmailService,
  INotificationService,
  IUserService,
} from "./interfaces";

import {
  ConflictException,
  NotFoundException,
  ServerErrorException,
} from "../exceptions";
import Types from "../types";
import User from "../models/User";

@injectable()
export default class FeedbackService implements IFeedbackService {
  /**
   *
   */
  constructor(
    @inject(Types.IProductService) private productService: IProductService,
    @inject(Types.IEmailService) private emailservice: IEmailService,
    @inject(Types.INotificationService)
    private notificationService: INotificationService
  ) {}

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

    if (exists) {
      feedback.likes = feedback.likes.filter((item) => item.voter != userid);
      return await feedback.save();
    }
    // ================
    const currentUser: any = await this.getUser(userid);
    const currentProduct = await this.productService.getProduct(
      feedback.product
    );
    const receiverMail = currentProduct.author.email;
    const message = `${currentUser.firstName} liked your post ${currentProduct.title}`;
    await this.emailservice.sendmail(message, receiverMail);
    await this.notificationService.createNotification({
      message,
      user: currentProduct.author._id,
    });
    // if (exists) throw new ConflictException("User has already liked feedback");
    // =====================
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

  async getFeedbacksSentByUser(userid: string): Promise<Document<any>[]> {
    try {
      return await Feedback.find({ author: userid })
        .populate({ path: "author", select: "userName email" })
        .populate({ path: "product", select: " school title category" })
        .populate("replies");
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async getFeedbacksReceivedByUser(userid: string): Promise<Document<any>[]> {
    try {
      return await Feedback.find({ author: { $not: { $in: userid } } })
        .populate({ path: "author", select: "userName email" })
        .populate({ path: "product", select: " school title category" })
        .populate("replies");
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
    }
  }

  async createFeedback(request: IFeed, user: any): Promise<Document<any>> {
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

      entity.author = user.userid;

      // verify product
      const productExists = await this.productService.getProduct(
        request.productid
      );
      if (!productExists) throw new NotFoundException("Product does not exist");
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

      await this.productService.addFeedbackToProduct(
        entity.productid,
        feedback._id,
        ""
      );

      //=========================================================================
      const currentUser: any = await this.getUser(entity.author);
      const currentProduct = await this.productService.getProduct(
        entity.productid
      );
      const receiverMail = currentProduct.author.email;
      const message = `
      ${currentUser.firstName} left a feedback on your post ${currentProduct.title}
        "${request.message}"
      `;
      await this.emailservice.sendmail(message, receiverMail);
      await this.notificationService.createNotification({
        message,
        user: currentProduct.author._id,
      });
      //=========================================================================

      return feedback;
    } catch (error) {
      console.log(error);
      throw new ServerErrorException(error);
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

  private async getUser(userid: string) {
    try {
      return await User.findById(userid);
    } catch (error) {
      throw ServerErrorException(error);
    }
  }
}
