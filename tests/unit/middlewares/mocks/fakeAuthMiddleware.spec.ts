import authMiddleware from "../../../../src/middlewares/auth";

/*=====================================================================*/
/*=================== Mocking ensureAuth Function  ====================*/
/*=====================================================================*/
let ensureAuth = authMiddleware.ensureAuth;
ensureAuth = (req, res, next) => {
  if (!req.session.user) {
    res.status(401);
    res.json({
      success: false,
      message: "User Not yet Created by Google or Facebook",
    });
    return res;
  }
  if (!req.session.user.phoneCode) {
    res.status(401);
    res.json({
      success: false,
      message: "Please go back to phone registration Stage",
    });
    return res;
  }
  if (!req.session.user.verifyCode) {
    res.status(401);
    res.json({
      success: false,
      message: "User hasn't verified code yet",
    });
    return res;
  }
  if (req.session.user.verificationStatus === "NotVerified") {
    res.status(401);
    res.json({
      success: false,
      message: "Registration Not Completed",
    });
    return res;
  }
  if (req.session.user.verificationStatus === "Restricted") {
    res.status(401);
    res.json({
      success: false,
      message: "User Restricted from using App",
    });
    return res;
  }
  next();
};

export = { ensureAuth };
