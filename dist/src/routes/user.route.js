"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const express_1 = __importDefault(require("express"));
const handleResponse_1 = require("../utils/handleResponse");
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const adminUpdateUser_validator_1 = __importDefault(require("../validators/adminUpdateUser.validator"));
const cache_data_1 = require("../utils/cache-data");
const router = express_1.default.Router();
const userService = containerDI_1.container.get(types_1.default.IUserService);
const Users = new user_controller_1.default(userService);
//geting all users
router.get("/", async (req, res) => {
    const response = await Users.getAllUsers();
    return handleResponse_1.handleResponse(res, response);
});
//geting single user
router.get("/:id", async (req, res) => {
    const response = await Users.getUser(req.params.id);
    return handleResponse_1.handleResponse(res, response);
});
router.put("/update/:id", schemaValidator_1.default(validators_1.identifierSchema, adminUpdateUser_validator_1.default), async (req, res) => {
    const data = await Users.updateVerificationStatus(req.params.id, req.body);
    return handleResponse_1.handleResponse(res, data);
});
router.put("/:id", async (req, res) => {
    const { error } = validators_1.userSchema.validate(req.body);
    if (error) {
        return res.status(422).json(error.details);
    }
    const data = await Users.updateUser(res.locals.userid, req.body);
    return handleResponse_1.handleResponse(res, data);
});
router.delete("/:id", async (req, res) => {
    const response = await Users.deleteUser(req.params.id);
    cache_data_1.flushCache();
    return handleResponse_1.handleResponse(res, response);
});
router.post("/save-ad", async (req, res) => {
    const response = await Users.savedAd(res.locals.userid, req.body);
    return handleResponse_1.handleResponse(res, response);
});
exports.default = router;
//# sourceMappingURL=user.route.js.map