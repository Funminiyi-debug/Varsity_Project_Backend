import passportSmsAuth from "passport-custom";
import passportSmsCodeAuth from "passport-custom";
import passportUsernameAuth from "passport-custom";
import GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook";
import helper from "./jwtHelper";
import User from "../models/User";
import client, { jwt } from "twilio";
import { generateRandomNumber } from "../utils/helperFunction";
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

        const { googleId, email, displayName } = newUser;

        const jwtAccessToken = helper.sign({
          email,
          displayName,
        });

        newUser.token = jwtAccessToken;

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

              cb(null, { data: user });
            } else {
              cb(null, { data: user });
            }
          } else {
            user = await User.create(newUser);
            user.verificationStatus = VerificationStatus.NotVerified;
            user.save();
            cb(null, { data: user });
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
        console.log(email);
        if (!email) return cb(null, { data: newUser });

        const jwtAccessToken = helper.sign({
          email,
          displayName,
        });

        newUser.token = jwtAccessToken;

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
              cb(null, { data: user });
            } else {
              cb(null, { data: user });
            }
          } else {
            user = await User.create(newUser);
            user.verificationStatus = VerificationStatus.NotVerified;
            user.save();
            cb(null, { data: user });
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
    new passportSmsAuth.Strategy(async function (req, cb) {
      const code = generateRandomNumber();
      const authHeader = req.headers.authorization;
      let token: any;
      if (authHeader) token = authHeader.split(" ")[1];
      await helper.verify(token, async (err, decoded) => {
        if (!err) {
          const { phoneNumber } = req.body;
          const { email } = decoded;

          try {
            let user: any = await User.findOne({ email });

            if (user) {
              user = await User.findOneAndUpdate(
                email,
                { phone: phoneNumber, phoneCode: code },
                { new: true }
              );

              client(accountSid, authToken)
                .messages.create({
                  body: code,
                  from: "+12565673518",
                  to: phoneNumber,
                })
                .then((message) => {
                  return cb(null, { data: user, messageid: message.sid });
                })
                .catch((err) =>
                  cb(null, { data: user, phoneCode: code, error: true })
                );
            }
            //phoneCode shouldnt be sent, just for testing
          } catch (error) {
            return cb(error, null);
          }
        }
      });
    })
  );

  passport.use(
    "validateSmsCode",
    new passportSmsCodeAuth.Strategy(async function (req, cb) {
      const authHeader = req.headers.authorization;
      let token: any;
      if (authHeader) token = authHeader.split(" ")[1];
      await helper.verify(token, async (err, decoded) => {
        if (!err) {
          const { phoneCode } = req.body;
          const { email } = decoded;
          try {
            let user: any = await User.findOne({ email });
            if (user) {
              if (phoneCode === user.phoneCode) {
                user = await User.findOneAndUpdate(
                  email,
                  { verifyCode: true },
                  { new: true }
                );
                return cb(null, { data: user });
              } else cb(null, { data: user, error: true });
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
          const { email } = decoded;
          try {
            let user: any = await User.findOne({ email });
            if (user) {
              if (user.userName === username) {
                return cb(null, { data: user, error: true });
              } else {
                let newUser = await User.findOneAndUpdate(
                  email,
                  {
                    userName: username,
                    verificationStatus: VerificationStatus.Verified,
                  },
                  { new: true }
                );
                return cb(null, { data: newUser });
              }
            }
          } catch (err) {
            console.error(err);
            cb(err, null);
          }
        }
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}
