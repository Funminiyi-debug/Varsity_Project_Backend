import { inject, injectable } from 'inversify'
import IEmailService from './interfaces/iemail.service'
import nodemailer from 'nodemailer'
import 'dotenv/config'
import { ServerErrorException } from '../exceptions'
import { IProductService, IUserService } from './interfaces'
import Types from '../types'

@injectable()
export default class EmailService implements IEmailService {
  constructor(
    @inject(Types.IProductService) private productService: IProductService,
  ) {}

  public async sendmail(message, senderMail, productid) {
    const receiverMail = (await this.productService.getProduct(productid))
      .author.email

    return await this.main(message, senderMail, receiverMail)
  }

  private async main(message, sender, receiver) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, //587
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.email_user,
        pass: process.env.email_password,
      },
    })

    // send mail with defined transport object
    await transporter.sendMail(
      {
        from: sender,
        to: receiver,
        subject: 'Versity Feedbacks',
        text: message,
      },
      (error, info) => {
        if (error) return ServerErrorException(error)
        else return info.messageId
      },
    )
  }
}
