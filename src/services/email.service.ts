import { inject, injectable } from "inversify";
import IEmailService from "./interfaces/iemail.service";
import "dotenv/config";
import nodemailer from "nodemailer";
import { ServerErrorException } from "../exceptions";
import { IProductService, IUserService } from "./interfaces";
import Types from "../types";

@injectable()
export default class EmailService implements IEmailService {
  constructor(
    @inject(Types.IProductService) private productService: IProductService
  ) {}

  public async sendmail(message, receiverMail) {
    // const receiverMail = (await this.productService.getProduct(productid))
    //   .author.email;
    const senderMail = process.env.SENDER_EMAIL;
    return await this.main(message, senderMail, receiverMail);
  }

  private async main(message, sender, receiver) {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT, //587
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail(
      {
        from: sender,
        to: receiver,
        subject: "Varsity Feedbacks",
        text: message,
      },
      (error, info) => {
        if (error) return ServerErrorException(error);
        else return info.messageId;
      }
    );
  }
}
