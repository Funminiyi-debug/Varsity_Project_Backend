import mongoose from "mongoose";
import Comment from "./Comment";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, minlength: 5, maxlength: 300 },
    post: { type: String, required: true, minlength: 10 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual("noOfComments").get(function () {
  return this.comments.length;
});

// cascade delete
PostSchema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  next();
});
