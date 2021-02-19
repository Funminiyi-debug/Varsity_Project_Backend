import { Document } from "mongoose";
import VerificationStatus from "../enums/VerificationStatus";

interface IUser extends Document {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  gender: string;
  verificationStatus: VerificationStatus;
}

export default IUser;
