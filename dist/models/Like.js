"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const LikeSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Like" },
    comment: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Comment",
    },
}, { timestamps: true });
const Like = mongoose_1.default.model("Like", LikeSchema);
exports.default = Like;
//# sourceMappingURL=Like.js.map