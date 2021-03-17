import { Document } from "mongoose";
import IFeed from "../../interfaces/entities/IFeedback";

export default interface IFeedbackService {
  getFeedbacks(): Promise<Document<any>[]>;

  getFeedback(id: string): Promise<Document<any>[]>;

  getFeedbacksByUser(userid: string): Promise<Document<any>[]>;

  createFeedback(entity: IFeed, userid: string): Promise<Document<any>>;

  updateFeedback(
    id: string,
    entity: IFeed,
    userid: string
  ): Promise<Document<any>>;

  deleteFeedback(id: string, userid: string): Promise<Document<any>>;

  likeFeedback(feedbackid: string, userid: string): Promise<Document<any>>;
}
