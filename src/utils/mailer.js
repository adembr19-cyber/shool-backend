const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports.sendMail = async function({ to, subject, text, html }) {
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@school.test', to, subject, text, html });
  return info;
};
