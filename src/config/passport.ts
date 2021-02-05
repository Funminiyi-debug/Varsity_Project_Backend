import passportSms from "passport-custom";
import passportFinalAuth from "passport-custom";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import client from "twilio";
import { generateRandomNumber } from "../utils/helperFunction";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default function (passport) {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, cb) => {
        return cb(null, profile);
      }
    )
  );

  passport.use(
    new FacebookStrategy.Strategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "/auth/facebook/callback",
      },
      function (accessToken, refreshToken, profile, cb) {
        //User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(null, profile);
        //});
      }
    )
  );

  passport.use(
    "sendSms",
    new passportSms.Strategy(function (req, cb) {
      return cb(null, req.body);

      //used when phone number verified @ twillo
      client(accountSid, authToken)
        .messages.create({
          body: generateRandomNumber(),
          from: "+12565673518",
          to: req.body.phoneNumber,
        })
        .then((message) => {
          //db check and update user
          return cb(null, { ...req.body, messageid: message.sid });
        })
        .catch((err) => cb(err, null));
    })
  );

  passport.use(
    "validateSmsCode",
    new passportFinalAuth.Strategy(function (req, cb) {
      return cb(null, { ...req.body });
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
