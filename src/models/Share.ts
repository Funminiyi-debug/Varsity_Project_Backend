import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";

const ShareSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    shareid: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", ShareSchema);

export default Comment;
