import { injectable } from "inversify";
import { Document } from "mongoose";
import { IFeedbackService } from "./interfaces";

@injectable()
export default class FeedbackService implements IFeedbackService {}
