import { injectable } from "inversify";
import { Document } from "mongoose";
import { IAppFileService } from "./interfaces";

@injectable()
export default class AppFileService implements IAppFileService {}
