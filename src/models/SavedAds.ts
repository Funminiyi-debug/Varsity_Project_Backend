import mongoose from "mongoose";

const Schema = mongoose.Schema;

const savedAdsSchema = new Schema({
  items: { type: Schema.Types.Array },
  user: { type: Schema.Types.ObjectId, required: true },
});
const SavedAds = mongoose.model("SavedAds", savedAdsSchema);

export default SavedAds;
