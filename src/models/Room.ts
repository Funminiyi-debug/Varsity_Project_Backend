import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  message: { type: String, required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  //   room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
});

const RoomSchema = new Schema({
  // name of the chat is the product
  roomName: { type: String, required: true },
  chats: [ChatSchema],
  //   note: participants shouldn't be greater than two people
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Room = mongoose.model("Room", RoomSchema);

export default Room;
