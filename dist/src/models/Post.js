"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comment_1 = __importDefault(require("./Comment"));
const AppFile_1 = __importDefault(require("./AppFile"));
const modelValidators_1 = require("./modelValidators");
const PostType_1 = __importDefault(require("../enums/PostType"));
const Schema = mongoose_1.default.Schema;
const OptionsSchema = new Schema({
    name: { type: String, required: true },
    votes: { type: Number, default: 0 },
    voters: [
        {
            type: Schema.Types.ObjectId,
            /*required: true,*/ ref: "User",
        },
    ],
});
const LikeSchema = new Schema({
    liker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});
const PostSchema = new Schema({
    // post type
    title: {
        type: String,
        required: function () {
            return this.postType == PostType_1.default.Regular;
        },
        validate: modelValidators_1.optionalWithLength(3, 300),
    },
    // end of post type
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [LikeSchema],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: Schema.Types.ObjectId, ref: "AppFile" }],
    // for polls
    postType: {
        type: String,
        enum: [PostType_1.default.Regular, PostType_1.default.Poll],
        required: true,
    },
    question: {
        type: String,
        required: function () {
            return this.postType == PostType_1.default.Poll;
        },
        validate: modelValidators_1.optionalWithLength(5, 300),
    },
    sector: { type: String, required: true },
    options: [OptionsSchema],
    pollExpiryDate: {
        type: Date,
        required: function () {
            return this.postType == PostType_1.default.Poll;
        },
    },
}, {
    timestamps: true,
});
PostSchema.virtual("noOfComments").get(function () {
    return this.comments.length;
});
PostSchema.virtual("noOfLikes").get(function () {
    return this.likes.length;
});
// cascade delete
PostSchema.pre("remove", function (next) {
    Comment_1.default.remove({ postid: this._id }).exec();
    AppFile_1.default.remove({ postid: this._id }).exec();
    next();
});
const Post = mongoose_1.default.model("Post", PostSchema);
exports.default = Post;
//# sourceMappingURL=Post.js.map