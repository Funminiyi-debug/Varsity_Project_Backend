const express = require("express");
const passport = require("passport");
const router = express.Router();
import middleWare from "../middlewares/auth";

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/facebook", passport.authenticate("facebook"));

// @desc    welcome user
// @route   GET /auth/welcome
router.get("/welcome", middleWare.ensureAuth, (req, res) => {
  res.send(`welcome ${req.session.user.displayName}`);
});

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    //const token = req.user.token;
    req.session.user = req.user;
    res.redirect("/auth/welcome");
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect("/auth/welcome");
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
