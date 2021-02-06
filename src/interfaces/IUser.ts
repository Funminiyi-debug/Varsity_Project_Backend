import mongoose, { Document, Types } from "mongoose";
import VerificationStatus from "../enums/VerificationStatus";
// import CategoryType from "../enums/CategoryType";
interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  gender: string;
  verificationStatus: VerificationStatus;
}

export default IUser;
