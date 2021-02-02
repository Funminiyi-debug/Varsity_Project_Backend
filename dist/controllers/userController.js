"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = exports.allUsers = void 0;
const data = require('../../dummydata')();
const response_1 = __importDefault(require("../utils/response"));
let allUsers = (req, res) => {
    res.statusCode = 200;
    //res.send({ data })
    return response_1.default(req, res, 200, { data }, null);
};
exports.allUsers = allUsers;
let user = (req, res) => {
    res.statusCode = 200;
    const user = data.filter(result => result.userId === Number(req.params.id));
    res.send({ user });
};
exports.user = user;
//# sourceMappingURL=userController.js.map