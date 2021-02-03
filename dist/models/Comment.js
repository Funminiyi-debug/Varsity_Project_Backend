"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppFile_1 = __importDefault(require("./AppFile"));
const CommentSchema = new mongoose_1.default.Schema({
    postid: { type: mongoose_1.default.Schema.Types.ObjectId, required: true },
    comment: { type: String, required: true },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    commentid: { type: mongoose_1.default.Schema.Types.ObjectId },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "AppFile" }],
}, { timestamps: true });
const Comment = mongoose_1.default.model("Comment", CommentSchema);
CommentSchema.pre("remove", function (next) {
    Comment.remove({ postid: this._id }).exec();
    AppFile_1.default.remove({ postid: this._id }).exec();
    next();
});
exports.default = Comment;
//# sourceMappingURL=Comment.js.map