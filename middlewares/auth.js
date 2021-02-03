module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.session.user) {
      //console.log(req.session.user);
      return next();
    } else {
      res.status(403).json({ msg: "forbidden page... login first " });
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      // res.redirect("/dashboard");
      res.status(200).json({ msg: "continue" });
    }
  },
};
