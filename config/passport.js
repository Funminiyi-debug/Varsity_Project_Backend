const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
require("dotenv").config();

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  //User.findById(id, (err, user) => done(err, user));
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cd) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //  return cb(err, user);
      //});
      //console.log(profile);
      return cd(null, profile);
    }
  )
);
