"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const handleResponse_1 = require("../utils/handleResponse");
const schemaValidator_1 = __importDefault(require("../middlewares/schemaValidator"));
const validators_1 = require("../validators");
const router = express_1.default.Router();
const authController = new auth_controller_1.default();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/facebook", passport_1.default.authenticate("facebook", { authType: "rerequest", scope: ["email"] }));
router.post("/test", schemaValidator_1.default(validators_1.identifierSchema, validators_1.categorySchema), (req, res) => {
    res.send("working");
});
router.post("/sendsms", auth_1.default.authMiddleware, passport_1.default.authenticate("sendSms", { failureRedirect: "/auth/failed" }), async function (req, res) {
    //let response = await authController.sendSms(req.user);
    const { data, validationError, error } = req.user;
    req.session.user = data;
    console.log(req.user);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: "Invalid mobile number...",
        });
    }
    else if (error) {
        return res.status(400).json({
            success: false,
            message: "Check number and Try again...",
        });
    }
    else {
        return res.status(200).json({
            success: true,
            message: "SMS sent, Code validation next",
        });
    }
});
router.post("/validatesmscode", auth_1.default.authMiddleware, passport_1.default.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }), async function (req, res) {
    const { data, validationError, error } = req.user;
    req.session.user = data;
    console.log(req.user);
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: "Incomplete code entered...",
        });
    }
    else if (error) {
        return res.status(400).json({
            success: false,
            message: "Invalid code entered...",
        });
    }
    else {
        return res.status(200).json({
            success: true,
            message: "Code verified,  username next",
        });
    }
});
router.post("/username", auth_1.default.authMiddleware, passport_1.default.authenticate("usernameAuth", { failureRedirect: "/auth/failed" }), async function (req, res) {
    const { data, validationError, error } = req.user;
    req.session.user = data;
    if (validationError) {
        return res.status(400).json({
            success: false,
            message: "Enter username at least 4 characters long...",
        });
    }
    else if (error) {
        return res.status(400).json({
            success: false,
            message: "Username Unavailable",
        });
    }
    else {
        return res.status(200).json({
            success: true,
            message: "Registration Completed",
        });
    }
});
// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: false,
}), async (req, res) => {
    req.session.user = req.user.data;
    let response = await authController.login(req.user.data);
    return handleResponse_1.handleResponse(res, response);
});
router.get("/facebook/callback", passport_1.default.authenticate("facebook", {
    failureRedirect: "/auth/failed",
}), async function (req, res) {
    req.session.user = req.user.data;
    let response = await authController.login(req.user.data);
    return handleResponse_1.handleResponse(res, response);
});
// @desc    welcome user
// @route   GET /auth/welcome
router.get("/welcome", [auth_1.default.authMiddleware, auth_1.default.ensureAuth], (req, res) => {
    res.send(`welcome ${req.session.user.userName}`);
});
router.get("/failed", (req, res) => {
    res.status(500).json({ success: false });
});
// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
    req.session.user = null;
    res.send({ msg: "logged out" });
});
exports.default = router;
//# sourceMappingURL=auth.route.js.map