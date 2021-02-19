// import mongoose from "mongoose";
// import databaseConnection from "../config/db";
const connectDb = require("./connectDb.ts");
import "dotenv/config";
dotenv.config({ path: "../../.env" });

const mongoose = require("mongoose");

// =====================================end of db
// import "dotenv/config";
// database();

const Schema = mongoose.Schema;

const Sample$ = new Schema(
  {
    name: String,
    title: String,
    example: String,
  },
  { timestamps: true }
);

const Sample = mongoose.model("User", Sample$);
const DO = async () => {
  const sample = new Sample({
    name: "sample nae",
    title: "Mr",
    example: "example 5",
  });
  //   const sample2 = new Sample({
  //     name: "sample nae 2",
  //     title: "Ms",
  //   });

  console.log(await sample.save());
  //   console.log(await sample2.save());
  process.exit(0);
};

const Search = async () => {
  const data = await Sample.find({
    $or: [{ name: "sample nae" }, { example: "example 10" }],
    example: "example 1",
  });
  //   const data = await Sample.find({});
  console.log(data);
  process.exit(0);
};

const all = async () => {
  const data = await Sample.find();
  //   const data = await Sample.find({});
  console.log(data);
  process.exit(0);
};

(async () => {
  await connectDb();
  //   await DO();
  //await Search();
  await all();
})();
