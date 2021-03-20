import { injectable } from "inversify";
import { Document } from "mongoose";
import { ILike } from "../interfaces/entities";
import { ILikeService } from "./interfaces";
import Like from "../models/Like";
import { ServerErrorException } from "../exceptions";
import IMessageService from "./interfaces/imessage.service";
import { Chat } from "../interfaces/SocketInterfaces";
import Room from "../models/Room";

@injectable()
export default class MessageService implements IMessageService {
    saveMessage = async (message: Chat):Promise<boolean> => { 
     if(message.user == undefined) { 
       return false;
     }
// const status = Room.findById()
     return true;
  }
}
