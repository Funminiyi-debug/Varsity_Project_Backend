"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppFile_1 = __importDefault(require("./AppFile"));
const Schema = mongoose_1.default.Schema;
const LikeSchema = new Schema({
    liker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});
const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    comment: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [LikeSchema],
    commentid: { type: Schema.Types.ObjectId, ref: "Comment" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: Schema.Types.ObjectId, ref: "AppFile" }],
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", CommentSchema);
CommentSchema.pre("remove", async function (next) {
    Comment.remove({ post: this._id }).exec();
    AppFile_1.default.remove({ post: this._id }).exec();
    next();
});
exports.default = Comment;
//# sourceMappingURL=Comment.js.map