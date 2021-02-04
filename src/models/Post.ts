import mongoose from "mongoose";
import Comment from "./Comment";
import AppFile from "./AppFile";
import { optionalWithLength, requiredIf } from "./modelValidators";
import PostType from "../enums/PostType";

const PostSchema = new mongoose.Schema(
  {
    // post type
    title: {
      type: String,
      required: requiredIf(PostType.Regular),
      validate: optionalWithLength(3, 300),
    },
    body: {
      type: String,
      required: requiredIf(PostType.Regular),
      validate: optionalWithLength(3, 300),
    },
    // end of post type
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: "AppFile" }],

    // for polls
    postType: {
      type: String,
      enum: [PostType.Regular, PostType.Poll],
      required: true,
    },
    question: {
      type: String,
      required: requiredIf(PostType.Poll),
      validate: optionalWithLength(5, 300),
    },

    options: [
      {
        type: String,
        required: requiredIf(PostType.Poll),
        votes: { type: Number, default: 0 },
      },
    ],

    pollExpiryDate: { type: Date, required: requiredIf(PostType.Poll) },
    // end of poll
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
  AppFile.remove({ postid: this._id }).exec();
  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
