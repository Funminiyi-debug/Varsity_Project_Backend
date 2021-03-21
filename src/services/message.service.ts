import { inject, injectable } from "inversify";
import IMessageService from "./interfaces/imessage.service";
import { Chat } from "../interfaces/SocketInterfaces";
import Room from "../models/Room";
import { Document } from "mongoose";
import Types from "../types";
import { UserService } from ".";

@injectable()
export default class MessageService implements IMessageService {
  /**
   *
   */
  constructor(@inject(Types.IUserService) private userService: UserService) {}
  saveMessage = async (response: Chat): Promise<boolean> => {
    try {
      if (response.user == undefined) {
        return false;
      }
      const message = { message: response.message, sender: response.user._id };
      await Room.findByIdAndUpdate(response.room, {
        $push: { chats: message },
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  createRoom = async (
    sender: string,
    receiver: string,
    roomName: string,
    message: string
  ): Promise<Document<any>> => {
    try {
      const receiverExists = await this.userService.getUser(receiver);

      if (receiverExists != null) {
        const status = await Room.create({
          roomName,
          chats: [{ message, sender }],
          participants: [sender, receiver],
        });

        return await (await status.save()).populate("participants");
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
