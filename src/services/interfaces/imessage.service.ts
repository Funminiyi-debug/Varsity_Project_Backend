import { Document } from "mongoose";
import { ILike } from "../../interfaces/entities";
import { Chat } from "../../interfaces/SocketInterfaces";

export default interface IMessageService {
  saveMessage(message: Chat): Promise<boolean>;
  createRoom(
    sender: string,
    receiver: string,
    roomName: string,
    message: string
  ): Promise<Document<any>>;
}
