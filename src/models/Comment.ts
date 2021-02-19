import mongoose from "mongoose";
import AppFile from "./AppFile";

const CommentSchema = new mongoose.Schema(
  {
    postid: { type: mongoose.Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    commentid: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: "Comment" },
    shares: { type: Number, default: 0 },
    images: { type: [mongoose.Schema.Types.ObjectId], ref: "AppFile" },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);

CommentSchema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  AppFile.remove({ postid: this._id }).exec();

  next();
});
export default Comment;
