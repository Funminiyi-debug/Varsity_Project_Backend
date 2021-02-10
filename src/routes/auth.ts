import passport from "passport";
import { Route, Get } from "tsoa";
import VerificationStatus from "../enums/VerificationStatus";
import middleWare from "../middlewares/auth";
const express = require("express");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { authType: "rerequest", scope: ["email"] })
);

router.post(
  "/sendsms",
  passport.authenticate("sendSms", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    return res.status(200).json({
      success: true,
      payload: req.user.payload,
      message: "SMS sent, Code validation next",
    });
  }
);

router.post(
  "/validsmscode",
  passport.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    req.session.user = req.user;
    return res.status(200).json({
      success: true,
      payload: req.user.payload,
      message: "Code verified,  username next",
    });
  }
);

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: false,
  }),
  (req, res) => {
    //const token = req.user.token;
    if (req.user.verificationStatus == VerificationStatus.Verified) {
      req.session.user = req.user;
      return res.status(200).json({
        success: true,
        payload: { googleId: req.user.googleId },
        message: "You are logged In",
      });
    } else if (req.user.verificationStatus == VerificationStatus.NotVerified) {
      return res.status(201).json({
        success: true,
        payload: { googleId: req.user.googleId },
        message: "User Created, Phone registration next",
      });
    } else
      return res
        .status(403)
        .json({ success: false, message: "User is restricted" });
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failed",
  }),
  function (req, res) {
    if (!req.user.email)
      return res.status(401).json({
        success: true,
        message: "verify your email account on facebook",
      });

    if (req.user.verificationStatus == VerificationStatus.Verified) {
      req.session.user = req.user;
      return res.status(200).json({
        success: true,
        payload: { facebookId: req.user.facebookId },
        message: "You are logged In",
      });
    } else if (req.user.verificationStatus == VerificationStatus.NotVerified) {
      return res.status(201).json({
        success: true,
        payload: { facebookId: req.user.facebookId },
        message: "User Created, Phone registration next",
      });
    } else
      return res
        .status(403)
        .json({ success: false, message: "User is restricted" });
  }
);

// @desc    welcome user
// @route   GET /auth/welcome
router.get("/success", (req, res) => {
  res.status(200).json({ message: "sucessfull" });
});

router.get("/failed", (req, res) => {
  res.status(400).send(req.err);
});

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
  req.session = null;
  res.send({ msg: "logged out" });
});

module.exports = router;
