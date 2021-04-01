"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb("Error: Images");
    }
};
const multer_1 = __importDefault(require("multer"));
// multer setup
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname.split(".")[0] +
            "-" +
            Date.now() +
            "." +
            file.mimetype.split("/")[1]
        // file.originalname
        );
    },
});
const upload = multer_1.default({
    storage: storage,
    limits: { fileSize: 100000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});
exports.default = upload;
//# sourceMappingURL=multer.js.map