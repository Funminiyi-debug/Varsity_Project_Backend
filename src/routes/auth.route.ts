import passport from "passport";
import express, { Response } from "express";
import AuthController from "../controllers/auth.controller";
import middleWare from "../middlewares/auth";
import { handleResponse } from "../utils/handleResponse";
import validatorMiddleware from "../middlewares/schemaValidator";
import { identifierSchema, categorySchema } from "../validators";

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
  "/test",
  validatorMiddleware(identifierSchema, categorySchema),
  (req, res) => {
    res.send("working");
  }
);

router.post(
  "/sendsms",
  middleWare.authMiddleware,
  passport.authenticate("sendSms", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    //let response = await authController.sendSms(req.user);
    const { data, validationError, error } = req.user;
    req.session.user = data;
    console.log(req.user);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number...",
      });
    } else if (error) {
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
  middleWare.authMiddleware,
  passport.authenticate("validateSmsCode", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    const { data, validationError, error } = req.user;
    req.session.user = data;
    console.log(req.user);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Incomplete code entered...",
      });
    } else if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid code entered...",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Code verified,  username next",
      });
    }
  }
);

router.post(
  "/username",
  middleWare.authMiddleware,
  passport.authenticate("usernameAuth", { failureRedirect: "/auth/failed" }),
  async function (req: any, res: Response) {
    const { data, validationError, error } = req.user;
    req.session.user = data;
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: "Enter username at least 4 characters long...",
      });
    } else if (error) {
      return res.status(400).json({
        success: false,
        message: "Username Unavailable",
      });
    } else {
      return res.status(200).json({
        success: true,
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
