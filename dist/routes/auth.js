"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const VerificationStatus_1 = __importDefault(require("../enums/VerificationStatus"));
const express = require("express");
const router = express.Router();
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/facebook", passport_1.default.authenticate("facebook"));
router.post("/sendsms", passport_1.default.authenticate("sendSms", { failureRedirect: "/auth/failed" }), function (req, res) {
    req.session.user = req.user;
    res.redirect("/auth/success");
});
router.post("/validsmscode", passport_1.default.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }), function (req, res) {
    req.session.user = req.user;
    res.redirect("/auth/success");
});
// @desc    welcome user
// @route   GET /auth/welcome
router.get("/success", (req, res) => {
    //console.log(req.session.user);
    res.send("sucessfull");
});
router.get("/failed", (req, res) => {
    res.send("failed");
});
// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get("/google/callback", passport_1.default.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: false,
}), (req, res) => {
    //const token = req.user.token;
    if (req.user.verificationStatus == VerificationStatus_1.default.Verified) {
        req.session.user = req.user;
        return res
            .status(200)
            .json({ success: true, message: "You are logged In" });
    }
    if (req.user.verificationStatus == VerificationStatus_1.default.NotVerified) {
        return res.status(201).json({
            message: "User Created, Please conplete registration",
            success: true,
        });
    }
    return res
        .status(403)
        .json({ success: false, message: "User is restricted" });
});
router.get("/facebook/callback", passport_1.default.authenticate("facebook", { failureRedirect: "/auth/failed" }), function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect("/auth/success");
});
// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
    req.logout();
    req.session = null;
    res.send({ msg: "logged out" });
});
module.exports = router;
//# sourceMappingURL=auth.js.map