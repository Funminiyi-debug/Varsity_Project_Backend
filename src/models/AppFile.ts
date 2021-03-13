import mongoose from "mongoose";

const AppFileSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: { type: String, required: true },
    data: { type: Buffer },
    mimetype: { type: String },
  },
  { timestamps: true }
);
const AppFile = mongoose.model("AppFile", AppFileSchema);
export default AppFile;
