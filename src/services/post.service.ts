import { injectable } from "inversify";
import { Document } from "mongoose";
import { IPostService } from "./interfaces";

@injectable()
export default class PostService implements IPostService {}
