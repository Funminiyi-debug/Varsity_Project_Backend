import JWTHelper from "jwthelper";
import "dotenv/config";

var helper = JWTHelper.createJWTHelper({
  secret: process.env.JWT_KEY,
  algorithm: "HS256",
  expiresIn: process.env.ACCESS_TOKEN_LIFE,
});

export default helper;
