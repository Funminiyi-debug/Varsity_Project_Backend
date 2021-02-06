"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const express_1 = __importDefault(require("express"));
const response_1 = __importDefault(require("../utils/response"));
const router = express_1.default.Router();
const Users = new user_controller_1.default();
//geting all users
router.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = __rest(yield Users.getAllUsers(), []);
    return response_1.default(res, response);
}));
//geting single user
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = __rest(yield Users.getUser(Number(req.params.id)), []);
    return response_1.default(res, response);
}));
router.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield Users.createUser(req.body);
    res.status(201).json({ sucess: "ok", data: data });
}));
exports.default = router;
//# sourceMappingURL=user.route.js.map