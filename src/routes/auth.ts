import passport from "passport";
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
  middleWare.authMiddleware,
  passport.authenticate("sendSms", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    console.log(req.user);
    if (req.user.error)
      return res.status(400).json({
        success: false,
        payload: req.user.payload,
        phoneCode: req.user.phoneCode,
        message: "Wrong phone number, Try again...",
      });
    return res.status(200).json({
      success: true,
      payload: req.user.payload,
      message: "SMS sent, Code validation next",
    });
  }
);

router.post(
  "/validsmscode",
  middleWare.authMiddleware,
  passport.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    console.log(req.user);
    if (req.user.error)
      return res.status(400).json({
        success: false,
        payload: req.user.payload,
        message: "Invalid code entered...",
      });
    return res.status(200).json({
      success: true,
      payload: req.user.payload,
      message: "Code verified,  username next",
    });
  }
);

router.post(
  "/username",
  middleWare.authMiddleware,
  passport.authenticate("usernameAuth", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    if (req.user.error)
      return res.status(400).json({
        success: false,
        payload: req.user.payload,
        message: "Username Unavailable.",
      });
    return res.status(200).json({
      success: true,
      payload: req.user.payload,
      message: "Registration Completed",
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
    const { verificationStatus, token } = req.user;
    if (verificationStatus == VerificationStatus.Verified) {
      req.session.user = req.user;
      return res.status(200).json({
        success: true,
        payload: { token },
        message: "You are logged In",
      });
    } else if (verificationStatus == VerificationStatus.NotVerified) {
      return res.status(201).json({
        success: true,
        payload: { token },
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
    const { verificationStatus, token } = req.user;
    if (!req.user.email)
      return res.status(401).json({
        success: true,
        message: "verify your email account on facebook",
      });

    if (verificationStatus == VerificationStatus.Verified) {
      req.session.user = req.user;
      return res.status(200).json({
        success: true,
        payload: { token },
        message: "You are logged In",
      });
    } else if (verificationStatus == VerificationStatus.NotVerified) {
      return res.status(201).json({
        success: true,
        payload: { token },
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
router.get(
  "/welcome",
  [middleWare.authMiddleware, middleWare.ensureAuth],
  (req, res) => {
    res.send("welcome" + req.session.user.userName);
  }
);

router.get("/failed", (req, res) => {
  res.status(500).json({ success: false });
});

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.send({ msg: "logged out" });
});

module.exports = router;
