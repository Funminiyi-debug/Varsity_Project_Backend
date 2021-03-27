"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const PostType_1 = __importDefault(require("../enums/PostType"));
const PostSchema = joi_1.default.object().keys({
    title: joi_1.default.alternatives().conditional("postType", {
        is: PostType_1.default.Regular,
        then: joi_1.default.string().min(3).required(),
    }),
    postType: joi_1.default.string().valid(PostType_1.default.Regular, PostType_1.default.Poll),
    question: joi_1.default.alternatives().conditional("postType", {
        is: PostType_1.default.Poll,
        then: joi_1.default.string().min(5).max(125).required(),
    }),
    sector: joi_1.default.string()
        .required()
        .valid("Business", "Poll", "Entertainment", "Sports & Hobbies", "Science & Tech", "General", "Animal & Pets"),
    options: joi_1.default.alternatives().conditional("postType", {
        is: PostType_1.default.Poll,
        then: joi_1.default.array().required(),
    }),
    pollExpiryDate: joi_1.default.alternatives().conditional("postType", {
        is: PostType_1.default.Poll,
        then: joi_1.default.date().required(),
    }),
});
exports.default = PostSchema;
//# sourceMappingURL=post.validator.js.map