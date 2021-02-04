import mongoose from "mongoose";

const AppFileSchema = new mongoose.Schema(
  {
    postid: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
    name: { type: String, required: true },
    data: { type: Buffer },
    mimetype: { type: String },
  },
  { timestamps: true }
);
const AppFile = mongoose.model("AppFile", AppFileSchema);
export default AppFile;
