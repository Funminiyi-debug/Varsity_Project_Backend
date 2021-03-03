import mongoose from "mongoose";
import Comment from "./Comment";
import AppFile from "./AppFile";
import { optionalWithLength } from "./modelValidators";
import PostType from "../enums/PostType";

const OptionsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  votes: { type: Number, default: 0 },
});

const PostSchema = new mongoose.Schema(
  {
    // post type
    title: {
      type: String,
      required: function () {
        return this.postType == PostType.Regular;
      },
      validate: optionalWithLength(3, 300),
    },
    body: {
      type: String,
      required: function () {
        this.postType == PostType.Regular;
      },
      validate: optionalWithLength(3, 300),
    },
    // end of post type
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
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
      required: function () {
        return this.postType == PostType.Poll;
      },
      validate: optionalWithLength(5, 300),
    },
    sector: { type: String, required: true },
    options: [OptionsSchema],

    pollExpiryDate: {
      type: Date,
      required: function () {
        return this.postType == PostType.Poll;
      },
    },
    // end of poll
  },
  {
    timestamps: true,
  }
);

PostSchema.virtual("noOfComments").get(function () {
  return this.comments.length;
});
PostSchema.virtual("noOfLikes").get(function () {
  return this.likes.length;
});

// cascade delete
PostSchema.pre("remove", function (next) {
  Comment.remove({ postid: this._id }).exec();
  AppFile.remove({ postid: this._id }).exec();
  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
