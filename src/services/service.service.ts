import { injectable } from "inversify";
import { Document } from "mongoose";
import { IServiceService } from "./interfaces";

@injectable()
export default class ServiceService implements IServiceService {}
