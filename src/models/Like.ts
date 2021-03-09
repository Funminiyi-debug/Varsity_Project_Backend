import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";
import LikeService from "../services/like.service";

const LikeSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Like" },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

const Like = mongoose.model("Like", LikeSchema);

export default Like;
