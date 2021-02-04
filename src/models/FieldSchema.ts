import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  options: [{ type: String }],
});

export default FieldSchema;
