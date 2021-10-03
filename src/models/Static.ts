import mongoose from "mongoose";
import StaticPageStatus from "../enums/StaticPageStatus";
import { ServerErrorException } from "../exceptions";
import LikeService from "../services/like.service";

const StaticPageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: [StaticPageStatus.Active, StaticPageStatus.InActive],
      default: StaticPageStatus.InActive,
    },
  },
  { timestamps: true }
);

const StaticPage = mongoose.model("StaticPage", StaticPageSchema);

export default StaticPage;
