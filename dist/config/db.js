"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const connectDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
        });
        console.log(`DB connected successfully to ${connection.connection.host}`);
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = connectDb;
//# sourceMappingURL=db.js.map