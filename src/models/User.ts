import mongoose from "mongoose";
import Post from "./Post";
import Comment from "./Comment";
import AppFile from "./AppFile";

const UserShema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
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
