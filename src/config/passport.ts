import passportSms from "passport-custom";
import passportFinalAuth from "passport-custom";
import { Get } from "tsoa";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import User from "../models/User";
import client from "twilio";
import { generateRandomNumber } from "../utils/helperFunction";
import { createBuilderStatusReporter } from "typescript";
import { Document } from "mongoose";
import VerificationStatus from "../enums/VerificationStatus";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default function (passport) {
  // @Get("/auth/google")
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
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

        //return cb(null, profile);
        try {
          let user: any = await User.findOne({
            $or: [{ googleId: googleId }, { email: email }],
          });

          if (user) {
            if (user.token !== newUser.token) {
              user = await User.findOneAndUpdate(
                googleId,
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
            //user.save();
            cb(null, user);
          }
        } catch (err) {
          console.error(err);
          cb(err, null);
        }
      }
    )
  );

  passport.use(
    new FacebookStrategy.Strategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: [
          "id",
          "gender",
          "displayName",
          "photos",
          "email",
          "name",
        ],
      },
      async (accessToken, refreshToken, profile, cb) => {
<<<<<<< HEAD
        console.log(profile);
        // return cb(null, profile);
=======
>>>>>>> 487a3037dab9b8b309448396edabcdd180d3c3c8
        const newUser = {
          facebookId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
          token: accessToken,
          email: profile.emails[0].value,
        };

        const { facebookId, email } = newUser;

        if (!email) return cb(null, newUser);

        try {
          let user: any = await User.findOne({
<<<<<<< HEAD
            $or: [{ facebookId }, { email }, { firstName }, { lastName }],
=======
            $or: [{ facebookId }, { email }],
>>>>>>> 487a3037dab9b8b309448396edabcdd180d3c3c8
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
            //user.save();
            cb(null, user);
          }
        } catch (err) {
          console.error(err);
          cb(err, null);
        }
      }
    )
  );

  passport.use(
    "sendSms",
    new passportSms.Strategy(function async(req, cb) {
      return cb(null, req.body);
      //used when phone number verified @ twillo
      const code = generateRandomNumber();
      const { payload, phone } = req.body;
      User.findOneAndUpdate(
        payload,
        { phone: phone, phoneCode: code },
        { new: true }
      );
      client(accountSid, authToken)
        .messages.create({
          body: code,
          from: "+12565673518",
          to: req.body.phoneNumber,
        })
        .then((message) => {
          return cb(null, { ...req.body, messageid: message.sid });
        })
        .catch((err) => cb(err, null));
    })
  );

  passport.use(
    "validateSmsCode",
    new passportFinalAuth.Strategy(function (req, cb) {
      return cb(null, req.body);
      let user: any = User.findOne(req.body.payload);
      if (user) {
        if (req.body.phoneCode === user.phoneCode) return cb(null, req.body);
        else cb("enter the correct code", null);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((/**id*/ user, done) => {
    //User.findById(id, (err, user) => done(err, user));
    done(null, user);
  });
}
