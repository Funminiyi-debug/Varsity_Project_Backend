"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Comment_1 = __importDefault(require("./Comment"));
const AppFile_1 = __importDefault(require("./AppFile"));
const PostSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 300 },
    post: { type: String, required: true, minlength: 10 },
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    likes: { type: Number, default: 0 },
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
    shares: { type: Number, default: 0 },
    images: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "AppFile" }],
}, {
    timestamps: true,
});
PostSchema.virtual("noOfComments").get(function () {
    return this.comments.length;
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