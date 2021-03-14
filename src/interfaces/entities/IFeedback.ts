import FeedbackStatus from "../../enums/FeedbackStatus";

interface IFeed {
  message: string;
  productid: string;
  feedbackStatus: FeedbackStatus;
  feedbackid?: string;
}

export default IFeed;
