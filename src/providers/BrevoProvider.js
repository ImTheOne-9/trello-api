const brevo = require('@getbrevo/brevo')
import { env } from '~/config/environment'

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khoi tao email voi nhung thong tin can thiet
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tai khoan gui mail
  sendSmtpEmail.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // Tai khoan nhan email
  sendSmtpEmail.to = [{ email: recipientEmail }]

  sendSmtpEmail.subject = customSubject
  sendSmtpEmail.htmlContent = htmlContent

  // Goi hanh dong gui mail
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}
