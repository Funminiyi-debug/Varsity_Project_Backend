import mongoose from "mongoose";

const AppFileSchema = new mongoose.Schema(
  {
    postid: { type: mongoose.Schema.Types.ObjectId },
    name: { type: String, required: true },
    data: { type: Buffer },
    mimetype: { type: String },
  },
  { timestamps: true }
);
const AppFile = mongoose.model("AppFile", AppFileSchema);
export default AppFile;
