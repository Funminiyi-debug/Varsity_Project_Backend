import { Document } from "mongoose";

export default interface IEmailService {
  sendmail(message: string, receiverMail: string): void;
}
