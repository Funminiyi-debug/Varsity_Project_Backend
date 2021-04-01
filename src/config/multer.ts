const path = require("path");
const fs = require("fs");

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images");
  }
};

import multer from "multer";
// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    var dir = "";
    if (process.env.MONGO_ENV == "development") {
      dir = path.resolve(__dirname, "./src/uploads");
      console.log(dir);
    } else {
      dir = path.resolve(__dirname, "../uploads");
      console.log(dir);
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        "." +
        file.mimetype.split("/")[1]
      // file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

export default upload;
