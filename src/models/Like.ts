import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";
import LikeService from "../services/like.service";

const LikeSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likeid: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
    commentid: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
