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
    saveMessage = async (response: Chat):Promise<boolean> => { 
      try {
        
        if(response.user == undefined) { 
          return false;
        }
        const message = { message: response.message, sender: response.user._id}
        const status = await Room.findByIdAndUpdate(response.room, { $push: { chats: message}})
        return true;
      } catch (error) {
        console.log(error) 
        return false;
      }
  }
}
