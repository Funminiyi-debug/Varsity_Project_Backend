"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AppFileSchema = new mongoose_1.default.Schema({
    postid: { type: mongoose_1.default.Schema.Types.ObjectId },
    name: { type: String, required: true },
    data: { type: Buffer },
    mimetype: { type: String },
}, { timestamps: true });
const AppFile = mongoose_1.default.model("AppFile", AppFileSchema);
exports.default = AppFile;
//# sourceMappingURL=AppFile.js.map