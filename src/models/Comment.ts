import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  postid: { type: mongoose.Schema.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  likes: { type: Number, default: 0 },
  commentid: { type: mongoose.Schema.Types.ObjectId },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  shares: { type: Number, default: 0 },
});

const Comment = mongoose.model("Comment", CommentSchema);

CommentSchema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  next();
});
export default Comment;
