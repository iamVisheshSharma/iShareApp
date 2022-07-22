import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();


async function sendMail({ from, to, subject, text, html }) {
  let tranporter = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
  });

  let info = await tranporter.sendMail({
    from: `uShare <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: html
  })
}

export default sendMail;