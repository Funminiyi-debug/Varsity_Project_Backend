import mongoose from "mongoose";
import Post from "./Post";
import Comment from "./Comment";
import AppFile from "./AppFile";
import Product from "./Product";
import Feedback from "./Feedback";
import VerificationStatus from "../enums/VerificationStatus";

const UserShema = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    facebookId: {
      type: String,
    },
    lastName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      default: function () {
        return `${this.lastName}_${this.firstName}`;
      },
    },
    email: {
      type: String,
      required: true,
    },
    profilePics: {
      type: String,
    },
    phone: {
      type: String,
    },
    phoneCode: {
      type: String,
    },
    verifyCode: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: [
        VerificationStatus.NotVerified,
        VerificationStatus.Verified,
        VerificationStatus.Restricted,
      ],
      default: VerificationStatus.NotVerified,
    },
  },
  { timestamps: true }
);

UserShema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  Post.remove({ author: this._id }).exec();
  AppFile.remove({ postid: this._id }).exec();
  Product.remove({ author: this._id }).exec();
  Feedback.remove({ author: this._id }).exec();

  next();
});

export default mongoose.model("User", UserShema);
