import mongoose from "mongoose";
import { ServerErrorException } from "../exceptions";
import AppFile from "./AppFile";

const CommentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Post" },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    commentid: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "AppFile" }],
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
