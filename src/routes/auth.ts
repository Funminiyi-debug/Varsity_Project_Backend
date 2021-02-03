const express = require("express");
const passport = require("passport");
const router = express.Router();
const middleWare = require("../../middlewares/auth");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    welcome user
// @route   GET /auth/welcome
router.get("/welcome", middleWare.ensureAuth, (req, res) => {
  console.log(req.session.user);
  res.send(`welcome ${req.session.user.displayName}`);
});

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/", session: false }),
  (req, res) => {
    //const token = req.user.token;
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
