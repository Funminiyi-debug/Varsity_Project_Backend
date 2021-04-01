"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ChatSchema = new Schema({
    message: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
const RoomSchema = new Schema({
    // name of the chat is the product
    roomName: { type: String, required: true },
    chats: [ChatSchema],
    //   note: participants shouldn't be greater than two people
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
});
const Room = mongoose_1.default.model("Room", RoomSchema);
exports.default = Room;
//# sourceMappingURL=Room.js.map