"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const path = require("path");
const multer = require("multer");
class Storage {
    constructor(location, filetypes) {
        this.location = location;
        this.filetypes = filetypes;
    }
    store() {
        const storage = multer.diskStorage({
            destination: this.location,
            filename: function (req, file, cb) {
                cb(null, Date.now() + "-" + file.originalname);
            },
        });
        return storage;
    }
    uploadFile() {
        const upload = multer({
            storage: this.store(),
            limits: { fileSize: 3000000 },
            fileFilter: (req, file, cb) => {
                let extname = this.filetypes.test(path.extname(file.originalname).toLowerCase());
                let mimetype = this.filetypes.test(file.mimetype);
                if (mimetype && extname) {
                    return cb(null, true);
                }
                else {
                    cb("Error: Images");
                }
            },
        }).single("file");
        return upload;
    }
}
exports.Storage = Storage;
//# sourceMappingURL=storage.js.map