"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_custom_1 = __importDefault(require("passport-custom"));
const passport_custom_2 = __importDefault(require("passport-custom"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const passport_facebook_1 = __importDefault(require("passport-facebook"));
const User_1 = __importDefault(require("../models/User"));
const twilio_1 = __importDefault(require("twilio"));
const helperFunction_1 = require("../utils/helperFunction");
const VerificationStatus_1 = __importDefault(require("../enums/VerificationStatus"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
function default_1(passport) {
    passport.use(new passport_google_oauth20_1.default.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
    }, (accessToken, refreshToken, profile, cb) => __awaiter(this, void 0, void 0, function* () {
        console.log(profile);
        const newUser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            token: accessToken,
            email: profile.emails[0].value,
        };
        const { googleId, firstName, email, lastName } = newUser;
        //return cb(null, profile);
        try {
            let user = yield User_1.default.findOne({
                $or: [{ googleId: googleId }, { email: email }],
                firstName,
                lastName,
            });
            if (user) {
                if (user.token !== newUser.token) {
                    user = yield User_1.default.findOneAndUpdate(googleId, { token: newUser.token }, { new: true });
                    cb(null, user);
                }
                else {
                    cb(null, user);
                }
            }
            else {
                user = yield User_1.default.create(newUser);
                user.verificationStatus = VerificationStatus_1.default.NotVerified;
                cb(null, user);
            }
        }
        catch (err) {
            console.error(err);
            cb(err, null);
        }
    })));
    passport.use(new passport_facebook_1.default.Strategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
    }, (accessToken, refreshToken, profile, cb) => __awaiter(this, void 0, void 0, function* () {
        console.log(profile);
        return cb(null, profile);
        /**const newUser = {
          facebookId: profile.id,
          displayName: profile.displayName,
          firstName: profile.displayName.split(" ")[2],
          lastName: profile.displayName.split(" ")[0],
          image: profile.photos[0].value,
          token: accessToken,
          email: profile.emails[0].value,
        };

        const { facebookId, firstName, email, lastName } = newUser;

        try {
          let user: any = await User.findOne({
            $or: [{ facebookId }, { email }, { firstName}, { lastName}],
          });

          if (user) {
            if (user.token !== newUser.token) {
              user = await User.findOneAndUpdate(
                facebookId,
                { token: newUser.token },
                { new: true }
              );
              cb(null, user);
            } else {
              cb(null, user);
            }
          } else {
            user = await User.create(newUser);
            user.verificationStatus = VerificationStatus.NotVerified;
            cb(null, user);
          }
        } catch (err) {
          console.error(err);
          cb(err, null);
        }*/
    })));
    passport.use("sendSms", new passport_custom_1.default.Strategy(function (req, cb) {
        return cb(null, req.body);
        //used when phone number verified @ twillo
        twilio_1.default(accountSid, authToken)
            .messages.create({
            body: helperFunction_1.generateRandomNumber(),
            from: "+12565673518",
            to: req.body.phoneNumber,
        })
            .then((message) => {
            //db check and update user
            return cb(null, Object.assign(Object.assign({}, req.body), { messageid: message.sid }));
        })
            .catch((err) => cb(err, null));
    }));
    passport.use("validateSmsCode", new passport_custom_2.default.Strategy(function (req, cb) {
        return cb(null, Object.assign({}, req.body));
    }));
    passport.serializeUser((user, done) => {
        done(null, user);
    });
    passport.deserializeUser((/**id*/ user, done) => {
        //User.findById(id, (err, user) => done(err, user));
        done(null, user);
    });
}
exports.default = default_1;
//# sourceMappingURL=passport.js.map