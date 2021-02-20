import { injectable } from "inversify";
import { Document } from "mongoose";
import { ICommentService } from "./interfaces";
@injectable()
export default class CommentService implements ICommentService {}
