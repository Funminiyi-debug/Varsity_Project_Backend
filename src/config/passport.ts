<<<<<<< HEAD
import passportSmsAuth from "passport-custom";
import passportSmsCodeAuth from "passport-custom";
import passportUsernameAuth from "passport-custom";
=======
import passportSms from "passport-custom";
import passportSmsAuth from "passport-custom";
import { Get } from "tsoa";
>>>>>>> c0fb4b6d0e7b7390424860420e3b9006a94f306d
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import TokenRefreshStrategy from "passport-custom";
import helper from "./jwtHelper";
import User from "../models/User";
import client, { jwt } from "twilio";
import { generateRandomNumber } from "../utils/helperFunction";
<<<<<<< HEAD
=======
import { createBuilderStatusReporter } from "typescript";
import { Document } from "mongoose";
>>>>>>> c0fb4b6d0e7b7390424860420e3b9006a94f306d
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
        console.log("my token", accessToken);
        console.log("my refresh token", refreshToken);

        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          profilePics: profile.photos[0].value,
          token: accessToken,
          email: profile.emails[0].value,
        };

        const { googleId, email, displayName } = newUser;

        const jwtAccessToken = helper.sign({
          googleId,
          displayName,
        });

        newUser.token = jwtAccessToken;

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
            user.save();
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

        const jwtAccessToken = helper.sign({
          facebookId,
          displayName,
        });

        newUser.token = jwtAccessToken;

        if (!email) return cb(null, newUser);

        try {
          let user: any = await User.findOne({
            $or: [{ facebookId }, { email }],
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
            user.save();
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
<<<<<<< HEAD
    new passportSmsAuth.Strategy(async function (req, cb) {
      const code = generateRandomNumber();
      const authHeader = req.headers.authorization;
      let token: any;
      if (authHeader) token = authHeader.split(" ")[1];
      await helper.verify(token, async (err, decoded) => {
        if (!err) {
          console.log(decoded);
          const { phoneNumber } = req.body;
          const { facebookId, googleId } = decoded;

          try {
            var user = await User.findOneAndUpdate(
              { $or: [{ facebookId }, { googleId }] },
              { phone: phoneNumber, phoneCode: code },
              { new: true }
            );
            console.log(facebookId, googleId);
            client(accountSid, authToken)
              .messages.create({
                body: code,
                from: "+12565673518",
                to: phoneNumber,
              })
              .then((message) => {
                return cb(null, { user, messageid: message.sid });
              })
              .catch((err) => cb(null, { user, phoneCode: code, error: true }));
            //phoneCode shouldnt be sent, just for testing
          } catch (error) {
            return cb(error, null);
          }
        }
      });
=======
    new passportSms.Strategy(async function (req, cb) {
      return cb("fdsgfygdsyf", null);
      //used when phone number verified @ twillo
      const code = generateRandomNumber();
      const { payload, phone } = req.body;
      const { googleId, facebookId } = payload;

      try {
        await User.findOneAndUpdate(
          { $or: [{ googleId }, { facebookId }] },
          { phone: phone, phoneCode: code },
          { new: true }
        );
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
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
>>>>>>> c0fb4b6d0e7b7390424860420e3b9006a94f306d
    })
  );

  passport.use(
    "validateSmsCode",
<<<<<<< HEAD
    new passportSmsCodeAuth.Strategy(async function (req, cb) {
      const authHeader = req.headers.authorization;
      let token: any;
      if (authHeader) token = authHeader.split(" ")[1];
      await helper.verify(token, async (err, decoded) => {
        if (!err) {
          const { phoneCode } = req.body;
          const { facebookId, googleId } = decoded;
          try {
            let user: any = await User.findOne({
              $or: [{ facebookId }, { googleId }],
            });
            if (user) {
              if (phoneCode === user.phoneCode) return cb(null, user);
              else cb(null, { ...user, error: true });
            }
          } catch (err) {
            console.error(err);
            cb(err, null);
          }
        }
      });
    })
  );

  passport.use(
    "usernameAuth",
    new passportUsernameAuth.Strategy(async function (req, cb) {
      const authHeader = req.headers.authorization;
      let token: any;
      if (authHeader) token = authHeader.split(" ")[1];
      await helper.verify(token, async (err, decoded) => {
        if (!err) {
          const { username } = req.body;
          const { facebookId, googleId } = decoded;
          try {
            let user: any = await User.findOne({
              $or: [{ facebookId }, { googleId }],
            });
            if (user) {
              if (user.userName === username) {
                return cb(null, { ...user, error: true });
              } else {
                await User.findOneAndUpdate(
                  { $or: [{ facebookId }, { googleId }] },
                  {
                    userName: username,
                    verificationStatus: VerificationStatus.Verified,
                  },
                  { new: true }
                );
                return cb(null, user);
              }
            }
          } catch (err) {
            console.error(err);
            cb(err, null);
          }
        }
      });
=======
    new passportSmsAuth.Strategy(function (req, cb) {
      return cb(null, req.body);
      let user: any = User.findOne(req.body.payload);
      if (user) {
        if (req.body.phoneCode === user.phoneCode) return cb(null, req.body);
        else cb("enter the correct code", null);
      }
>>>>>>> c0fb4b6d0e7b7390424860420e3b9006a94f306d
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
