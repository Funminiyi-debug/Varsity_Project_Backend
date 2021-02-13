import passport from "passport";
import { Route, Get } from "tsoa";
import express, { Response } from "express";
import AuthController from "../controllers/auth.controller";
import VerificationStatus from "../enums/VerificationStatus";
import middleWare from "../middlewares/auth";
import { handleResponse } from "../utils/handleResponse";
const router = express.Router();
const authController = new AuthController();

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
  [middleWare.authMiddleware, middleWare.ensureSmsAuth],
  passport.authenticate("sendSms", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    // let response = await authController.sendSms(req.user);
    req.session.user = req.user.data;
    console.log(req.user);
    if (req.user.error) {
      return res.status(400).json({
        success: false,
        message: "Check number and Try again...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "SMS sent, Code validation next",
      });
    }
  }
);

router.post(
  "/validatesmscode",
  [middleWare.authMiddleware, middleWare.ensureSmsCodeAuth],
  passport.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    console.log(req.user);
    req.session.user = req.user.data;
    if (req.user.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid code entered...",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Code verified,  username next",
      });
    }
  }
);

router.post(
  "/username",
  [middleWare.authMiddleware, middleWare.ensureVerifyCodeAuth],
  passport.authenticate("usernameAuth", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    console.log(req.user);
    req.session.user = req.user.data;
    if (req.user.error) {
      return res.status(400).json({
        success: false,
        message: "Username Unavailable",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Registration Completed",
      });
    }
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
  async (req: any, res: Response) => {
    req.session.user = req.user.data;
    let response = await authController.login(req.user.data);
    return handleResponse(res, response);
  }
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/failed",
  }),
  async function (req: any, res: Response) {
    req.session.user = req.user.data;
    let response = await authController.login(req.user.data);
    return handleResponse(res, response);
  }
);

// @desc    welcome user
// @route   GET /auth/welcome
router.get(
  "/welcome",
  [middleWare.authMiddleware, middleWare.ensureAuth],
  (req, res) => {
    res.send(`welcome ${req.session.user.userName}`);
  }
);

router.get("/failed", (req, res) => {
  res.status(500).json({ success: false });
});

// @desc    Logout user
// @route   /auth/logout
router.get("/logout", (req: any, res: Response) => {
  req.session.user = null;
  res.send({ msg: "logged out" });
});

export default router;
