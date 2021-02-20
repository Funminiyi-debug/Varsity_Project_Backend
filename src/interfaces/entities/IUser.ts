import VStatus from "../../enums/VerificationStatus";

interface IUser {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  token: string;
  gender: string;
  verificationStatus: VStatus;
}

export default IUser;
