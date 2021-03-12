import { handleResponse } from "../utils/handleResponse";
import helper from "../config/jwtHelper";
import globals from "node-global-storage";
import TokenContent from "../interfaces/TokenContent";
import express from "express";

export default {
  ensureAuth: (req, res, next) => {
    console.log(req.session.user);
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
  authMiddleware: (req, res, next) => {
    const approvedRoutesWithoutAuth = [
      "/api/auth/google",
      "/api/auth/facebook",
      "/api/auth/google/callback",
      "/api/auth/facebook/callback",
    ];
    const approved = approvedRoutesWithoutAuth.find((routes) =>
      req.originalUrl.startsWith(routes)
    );
    if (approved != undefined) {
      next();
      return;
    }
    // read the token from header or url
    //const token = req.headers["x-access-token"] || req.query.token;
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
      helper.verify(
        token,
        //req.app.get("varsity api intensify"),
        (err, decoded) => {
          if (err) reject(err);
          resolve(decoded);
        }
      );
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
    p.then((decoded: TokenContent) => {
      res.locals.userid = decoded._id;
      res.locals.email = decoded.email;
      next();
    }).catch(onError);
  },
};
