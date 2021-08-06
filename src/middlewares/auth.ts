import { handleResponse } from "../utils/handleResponse";
import helper from "../config/jwtHelper";
import globals from "node-global-storage";
import TokenContent from "../interfaces/TokenContent";
import express from "express";
import { Console } from "console";
import User from "../models/User";
import { container } from "../containerDI";
import { UserService } from "../services";
import Types from "../types";
import UserRole from "../enums/UserRole";
const userService = container.get<UserService>(Types.IUserService);

export default {
  ensureAuth: (req, res, next) => {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "User Not yet Created by Google or Facebook",
      });
    }
    if (!req.session.user.phoneCode) {
      return res.status(401).json({
        success: false,
        message: "Please go back to phone registration Stage",
      });
    } else if (!req.session.user.verifyCode) {
      return res.status(401).json({
        success: false,
        message: "User hasn't verified code yet",
      });
    } else if (req.session.user.verificationStatus === "NotVerified") {
      return res.status(401).json({
        success: false,
        message: "Registration Not Completed",
      });
    } else if (req.session.user.verificationStatus === "Restricted") {
      return res.status(401).json({
        success: false,
        message: "User is Restricted from using the App",
      });
    } else {
      next();
    }
    if (!req.session.user.verifyCode) {
      return res.status(401).json({
        success: false,
        message: "User hasn't verified code yet",
      });
    }
    if (req.session.user.verificationStatus === "NotVerified") {
      return res.status(401).json({
        success: false,
        message: "Registration Not Completed",
      });
    }
    if (req.session.user.verificationStatus === "Restricted") {
      return res.status(401).json({
        success: false,
        message: "User Restricted from using App",
      });
    }
    next();
  },
  authenticate: (req, res, next) => {
    // const approvedRoutesWithoutAuth = [
    //   "/api/auth/google",
    //   "/api/auth/facebook",
    //   "/api/auth/google/callback",
    //   "/api/auth/facebook/callback",
    //   "/api/categories",
    //   "/api/products",
    //   "/api/subcategories",
    //   "/api/posts",
    //   "/docs",
    // ];
    // const approved = approvedRoutesWithoutAuth.find((routes) =>
    //   req.originalUrl.startsWith(routes)
    // );
    // res.locals.url = req.originalUrl;
    // if (approved != undefined) {
    //   next();
    //   return;
    // }

    const authHeader = req.headers.authorization;
    let token: any;
    if (authHeader) token = authHeader.split(" ")[1];
    // token does not exist
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "not logged in",
      });
    }

    // create a promise that decodes the token
    const p = new Promise((resolve, reject) => {
      helper.verify(token, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });

    // if it has failed to verify, it will return an error message
    const onError = (error) => {
      req.session.user = null;
      res.status(403).json({
        success: false,
        message: error.message,
      });
    };

    // process the promise
    p.then(async (decoded: TokenContent) => {
      const user = await User.findById(decoded._id);
      if (!user) {
        return res.status(401).json({ message: "User does not exist" });
      }
      res.locals.userid = decoded._id;
      res.locals.email = decoded.email;
      req.user = user;
      next();
    }).catch(onError);
  },
  admin: (req, res, next) => {
    if (
      req.user.userRole == UserRole.ADMIN ||
      req.user.userRole == UserRole.SUPERADMIN
    ) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You do not have the rights to this resource" });
  },

  superadmin: (req, res, next) => {
    if (req.user.userRole == UserRole.SUPERADMIN) {
      return next();
    }
    return res
      .status(403)
      .json({ message: "You do not have the rights to this resource" });
  },
};
