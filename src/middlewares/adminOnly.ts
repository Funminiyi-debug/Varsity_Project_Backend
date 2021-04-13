import UserRole from "../enums/UserRole";
import User from "../models/User";

const adminOnly = async (req, res, next) => {
  const userid = res.locals.userid;
  const user = (await User.findById(userid)) as any;
  if (user.userRole != UserRole.ADMIN) {
    return res
      .status(403)
      .json({ message: "You can't access this route", success: false });
  }
  return next();
};

export default adminOnly;
