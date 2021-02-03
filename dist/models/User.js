"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = __importDefault(require("./Post"));
const Comment_1 = __importDefault(require("./Comment"));
const AppFile_1 = __importDefault(require("./AppFile"));
const UserShema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "AppFile",
    },
    posts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Comment" }],
}, { timestamps: true });
UserShema.pre("remove", function (next) {
    Comment_1.default.remove({ postid: this._id }).exec();
    Post_1.default.remove({ author: this._id }).exec();
    AppFile_1.default.remove({ postid: this._id }).exec();
    next();
});
exports.default = mongoose_1.default.model("users", UserShema);
//# sourceMappingURL=User.js.map