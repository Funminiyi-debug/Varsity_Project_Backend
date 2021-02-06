"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FieldSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    value: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    options: [{ type: String }],
});
exports.default = FieldSchema;
//# sourceMappingURL=FieldSchema.js.map