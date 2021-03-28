"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelper_1 = __importDefault(require("../config/jwtHelper"));
const User_1 = __importDefault(require("../models/User"));
const containerDI_1 = require("../containerDI");
const types_1 = __importDefault(require("../types"));
const userService = containerDI_1.container.get(types_1.default.IUserService);
exports.default = {
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
        }
        else if (!req.session.user.verifyCode) {
            return res.status(401).json({
                success: false,
                message: "User hasn't verified code yet",
            });
        }
        else if (req.session.user.verificationStatus === "NotVerified") {
            return res.status(401).json({
                success: false,
                message: "Registration Not Completed",
            });
        }
        else if (req.session.user.verificationStatus === "Restricted") {
            return res.status(401).json({
                success: false,
                message: "User is Restricted from using the App",
            });
        }
        else {
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
    authMiddleware: (req, res, next) => {
        const approvedRoutesWithoutAuth = [
            "/api/auth/google",
            "/api/auth/facebook",
            "/api/auth/google/callback",
            "/api/auth/facebook/callback",
            "/docs",
        ];
        const approved = approvedRoutesWithoutAuth.find((routes) => req.originalUrl.startsWith(routes));
        res.locals.url = req.originalUrl;
        if (approved != undefined) {
            next();
            return;
        }
        const authHeader = req.headers.authorization;
        let token;
        if (authHeader)
            token = authHeader.split(" ")[1];
        // token does not exist
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "not logged in",
            });
        }
        // create a promise that decodes the token
        const p = new Promise((resolve, reject) => {
            jwtHelper_1.default.verify(token, (err, decoded) => {
                if (err)
                    reject(err);
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
        p.then(async (decoded) => {
            const user = await User_1.default.findById(decoded._id);
            if (!user) {
                return res.status(401).json({ message: "User does not exist" });
            }
            res.locals.userid = decoded._id;
            res.locals.email = decoded.email;
            next();
        }).catch(onError);
    },
};
//# sourceMappingURL=auth.js.map