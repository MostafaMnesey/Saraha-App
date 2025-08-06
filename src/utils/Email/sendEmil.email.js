import nodemailer from "nodemailer";

export default async function sendEmail({
  from = process.env.APP_MAIL,
  to = "",
  cc = [],
  bcc = [],
  attachments = [],
  subject = "",
  text = "",
  html = "",
} = {}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_MAIL,
      pass: process.env.APP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Saraha App" <${from}>'`,
    to,
    cc,
    bcc,
    attachments,
    subject,
    text,
    html,
  });

  console.log("Message sent:", info.messageId);
}
