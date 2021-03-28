import mongoose from "mongoose";

const Schema = mongoose.Schema;
const NotificationSchema = new Schema(
  {
    message: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
