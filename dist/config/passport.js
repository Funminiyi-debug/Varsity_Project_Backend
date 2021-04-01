"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_custom_1 = __importDefault(require("passport-custom"));
const passport_custom_2 = __importDefault(require("passport-custom"));
const passport_custom_3 = __importDefault(require("passport-custom"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const jwtHelper_1 = __importDefault(require("./jwtHelper"));
const User_1 = __importDefault(require("../models/User"));
const twilio_1 = __importDefault(require("twilio"));
const VerificationStatus_1 = __importDefault(require("../enums/VerificationStatus"));
const helperFunction_1 = require("../utils/helperFunction");
const validators_1 = require("../validators");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
function default_1(passport) {
    // @Get("/auth/google")
    passport.use(new passport_google_oauth20_1.default.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
    }, async (accessToken, refreshToken, profile, cb) => {
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePics: profile.photos[0].value,
            token: accessToken,
            email: profile.emails[0].value,
        };
        const { googleId, email } = newUser;
        try {
            let user = await User_1.default.findOne({
                $or: [{ googleId: googleId }, { email: email }],
            });
            if (user) {
                if (user.token !== newUser.token) {
                    user = await User_1.default.findOneAndUpdate(googleId, { token: helperFunction_1.generateJwtToken(user) }, { new: true });
                    console.log(user);
                    cb(null, { data: user });
                }
                else {
                    cb(null, { data: user });
                }
            }
            else {
                user = await User_1.default.create(newUser);
                user.token = helperFunction_1.generateJwtToken(user);
                user.verificationStatus = VerificationStatus_1.default.NotVerified;
                await user.save();
                cb(null, { data: user });
            }
        }
        catch (err) {
            console.error(err);
            cb(err, null);
        }
    }));
    passport.use(new passport_facebook_1.default.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/api/auth/facebook/callback",
        profileFields: [
            "id",
            "gender",
            "displayName",
            "photos",
            "email",
            "name",
        ],
    }, async (accessToken, refreshToken, profile, cb) => {
        const newUser = {
            facebookId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            token: accessToken,
            email: profile.emails[0].value,
        };
        const { facebookId, email, displayName } = newUser;
        if (!email)
            return cb(null, { data: newUser });
        try {
            let user = await User_1.default.findOne({
                $or: [{ facebookId }, { email }],
            });
            if (user) {
                if (user.token !== newUser.token) {
                    user = await User_1.default.findOneAndUpdate(facebookId, { token: helperFunction_1.generateJwtToken(user) }, { new: true });
                    cb(null, { data: user });
                }
                else {
                    cb(null, { data: user });
                }
            }
            else {
                user = await User_1.default.create(newUser);
                user.token = helperFunction_1.generateJwtToken(user);
                user.verificationStatus = VerificationStatus_1.default.NotVerified;
                user.save();
                cb(null, { data: user });
            }
        }
        catch (err) {
            console.error(err);
            cb(err, null);
        }
    }));
    passport.use("sendSms", new passport_custom_1.default.Strategy(async function (req, cb) {
        //validate incoming requests
        const data = req.body;
        const { phoneNumber } = data;
        const { error } = validators_1.smsSchema.validate(data);
        if (error) {
            return cb(null, {
                validationError: true,
            });
        }
        else {
            const code = helperFunction_1.generateRandomNumber();
            const authHeader = req.headers.authorization;
            let token;
            if (authHeader)
                token = authHeader.split(" ")[1];
            await jwtHelper_1.default.verify(token, async (err, decoded) => {
                if (!err) {
                    const { email } = decoded;
                    try {
                        let user = await User_1.default.findOne({ email });
                        if (user) {
                            user = await User_1.default.findOneAndUpdate(email, { phone: phoneNumber, phoneCode: code }, { new: true });
                            twilio_1.default(accountSid, authToken)
                                .messages.create({
                                body: code,
                                from: "+12565673518",
                                to: phoneNumber,
                            })
                                .then((message) => {
                                return cb(null, { data: user, messageid: message.sid });
                            })
                                .catch((err) => cb(null, { data: user, phoneCode: code, error: true }));
                        }
                        //phoneCode shouldnt be sent, just for testing
                    }
                    catch (error) {
                        return cb(error, null);
                    }
                }
            });
        }
    }));
    passport.use("validateSmsCode", new passport_custom_2.default.Strategy(async function (req, cb) {
        //validate incoming requests
        const data = req.body;
        const { error } = validators_1.validateSmsCodeSchema.validate(data);
        if (error) {
            return cb(null, {
                validationError: true,
            });
        }
        else {
            const authHeader = req.headers.authorization;
            let token;
            if (authHeader)
                token = authHeader.split(" ")[1];
            await jwtHelper_1.default.verify(token, async (err, decoded) => {
                if (!err) {
                    const { phoneCode } = req.body;
                    const { email } = decoded;
                    try {
                        let user = await User_1.default.findOne({ email });
                        if (user) {
                            if (phoneCode === user.phoneCode) {
                                user = await User_1.default.findOneAndUpdate(email, { verifyCode: true }, { new: true });
                                return cb(null, { data: user });
                            }
                            else
                                cb(null, { data: user, error: true });
                        }
                    }
                    catch (err) {
                        console.error(err);
                        cb(err, null);
                    }
                }
            });
        }
    }));
    passport.use("usernameAuth", new passport_custom_3.default.Strategy(async function (req, cb) {
        //validate incoming requests
        const data = req.body;
        const { error } = validators_1.usernameSchema.validate(data);
        if (error) {
            return cb(null, {
                validationError: true,
            });
        }
        else {
            const authHeader = req.headers.authorization;
            let token;
            if (authHeader)
                token = authHeader.split(" ")[1];
            await jwtHelper_1.default.verify(token, async (err, decoded) => {
                if (!err) {
                    const { username } = req.body;
                    const { email } = decoded;
                    try {
                        let user = await User_1.default.findOne({ email });
                        if (user) {
                            if (user.userName === username) {
                                return cb(null, { data: user, error: true });
                            }
                            else {
                                let newUser = await User_1.default.findOneAndUpdate(email, {
                                    userName: username,
                                    verificationStatus: VerificationStatus_1.default.Verified,
                                }, { new: true });
                                return cb(null, { data: newUser });
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                        cb(err, null);
                    }
                }
            });
        }
    }));
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}
exports.default = default_1;
//# sourceMappingURL=passport.js.map