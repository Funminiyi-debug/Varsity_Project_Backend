import { Document } from "mongoose";
import IFeed from "../../interfaces/entities/IFeedback";

export default interface IFeedbackService {
  getFeedbacks(): Promise<Document<any>[]>;

  getFeedback(id: string): Promise<Document<any>[]>;

  createFeedback(entity: IFeed): Promise<Document<any>>;

  updateFeedback(id: string, entity: IFeed): Promise<Document<any>>;

  deleteFeedback(id: string): Promise<Document<any>>;
}
