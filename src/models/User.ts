import mongoose from "mongoose";
import Post from "./Post";
import Comment from "./Comment";
import AppFile from "./AppFile";

const UserShema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    profileImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AppFile",
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

UserShema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  Post.remove({ author: this._id }).exec();
  AppFile.remove({ postid: this._id }).exec();

  next();
});

export default mongoose.model("users", UserShema);
