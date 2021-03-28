"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const savedAdsSchema = new Schema({
    items: { type: Schema.Types.Array },
    user: { type: Schema.Types.ObjectId, required: true },
});
const SavedAds = mongoose_1.default.model("SavedAds", savedAdsSchema);
exports.default = SavedAds;
//# sourceMappingURL=SavedAds.js.map