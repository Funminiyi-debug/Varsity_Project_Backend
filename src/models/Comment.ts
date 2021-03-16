import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";
import AppFile from "./AppFile";

const Schema = mongoose.Schema;
const LikeSchema = new Schema({
  liker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});
const CommentSchema = new Schema(
  {
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [LikeSchema],
    commentid: { type: Schema.Types.ObjectId, ref: "Comment" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: Schema.Types.ObjectId, ref: "AppFile" }],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

CommentSchema.pre("remove", async function (next) {
  Comment.remove({ post: this._id }).exec();
  AppFile.remove({ post: this._id }).exec();
  next();
});

export default Comment;
