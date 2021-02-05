import handleResponse from "../utils/response";
export default {
  ensureAuth: function (req, res, next) {
    if (req.session.user.verified) {
      return next();
    } else {
      return handleResponse(res, {
        statusCode: 403,
        message: "forbidden page... login first ",
      });
      //res.status(403).json({ msg: "forbidden page... login first " });
    }
  },
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      return handleResponse(res, {
        statusCode: 200,
      });
    }
  },
};
