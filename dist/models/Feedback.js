"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FeedbackStatus_1 = __importDefault(require("../enums/FeedbackStatus"));
const Schema = mongoose_1.default.Schema;
const LikeSchema = new Schema({
    voter: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
const FeedbackSchema = new mongoose_1.default.Schema({
    message: { type: String, required: true },
    feedbackStatus: {
        type: String,
        enum: [
            FeedbackStatus_1.default.Positive,
            FeedbackStatus_1.default.Neutral,
            FeedbackStatus_1.default.Negative,
        ],
        required: true,
    },
    author: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    likes: [{ type: LikeSchema }],
    replies: [{ type: Schema.Types.ObjectId, ref: "Feedback" }],
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    feedback: { type: Schema.Types.ObjectId, ref: "Feedback" },
}, {
    timestamps: true,
});
FeedbackSchema.virtual("noOfLikes").get(function () {
    return this.likes.length;
});
FeedbackSchema.pre("remove", function (next) {
    // Feedback.remove({ feedback: this._id }).exec();
    Feedback.remove({ replies: this._id }).exec();
    next();
});
const Feedback = mongoose_1.default.model("Feedback", FeedbackSchema);
exports.default = Feedback;
//# sourceMappingURL=Feedback.js.map