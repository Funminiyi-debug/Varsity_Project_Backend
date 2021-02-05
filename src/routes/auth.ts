import passport from "passport";
import middleWare from "../middlewares/auth";
const express = require("express");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/facebook", passport.authenticate("facebook"));

router.post(
  "/sendsms",
  passport.authenticate("sendSms", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    req.session.user = req.user;
    res.redirect("/auth/success");
  }
);

router.post(
  "/validsmscode",
  passport.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    req.session.user = req.user;
    res.redirect("/auth/success");
  }
);

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
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/failed",
    session: false,
  }),
  (req, res) => {
    //const token = req.user.token;
    req.session.user = req.user;
    res.redirect("/auth/success");
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/auth/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect("/auth/success");
  }
);

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.send({ msg: "logged out" });
});

module.exports = router;
