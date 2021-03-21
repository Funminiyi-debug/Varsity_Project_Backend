import { Document } from 'mongoose'

export default interface IEmailService {
  sendmail(message, senderid, productid)
}
