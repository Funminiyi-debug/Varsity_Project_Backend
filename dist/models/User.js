"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Post_1 = __importDefault(require("./Post"));
const Comment_1 = __importDefault(require("./Comment"));
const AppFile_1 = __importDefault(require("./AppFile"));
const Service_1 = __importDefault(require("./Service"));
const Product_1 = __importDefault(require("./Product"));
const Feedback_1 = __importDefault(require("./Feedback"));
const VerificationStatus_1 = __importDefault(require("../enums/VerificationStatus"));
const UserShema = new mongoose_1.default.Schema({
    googleId: {
        type: String,
        required: true,
    },
    facebookId: {
        type: String,
        requierd: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
        default: function () {
            return `${this.lastName}_${this.firstName}`;
        },
    },
    email: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
    },
    phone: {
        type: String,
    },
    token: {
        type: String,
        required: true,
    },
    verificationStatus: {
        type: String,
        required: true,
        enum: [
            VerificationStatus_1.default.NotVerified,
            VerificationStatus_1.default.Verified,
            VerificationStatus_1.default.Restricted,
        ],
        default: VerificationStatus_1.default.NotVerified,
    },
}, { timestamps: true });
UserShema.pre("remove", function (next) {
    Comment_1.default.remove({ postid: this._id }).exec();
    Post_1.default.remove({ author: this._id }).exec();
    AppFile_1.default.remove({ postid: this._id }).exec();
    Product_1.default.remove({ author: this._id }).exec();
    Service_1.default.remove({ author: this._id }).exec();
    Feedback_1.default.remove({ author: this._id }).exec();
    next();
});
exports.default = mongoose_1.default.model("users", UserShema);
//# sourceMappingURL=User.js.map