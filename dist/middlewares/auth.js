"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_1 = __importDefault(require("../utils/response"));
exports.default = {
    ensureAuth: function (req, res, next) {
        if (req.session.user.verified) {
            return next();
        }
        else {
            return response_1.default(res, {
                statusCode: 403,
                message: "forbidden page... login first ",
            });
            //res.status(403).json({ msg: "forbidden page... login first " });
        }
    },
    ensureGuest: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        else {
            return response_1.default(res, {
                statusCode: 200,
            });
        }
    },
};
//# sourceMappingURL=auth.js.map