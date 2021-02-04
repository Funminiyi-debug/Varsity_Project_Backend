import mongoose from "mongoose";

const FieldSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  options: { type: String },
});

export default FieldSchema;
