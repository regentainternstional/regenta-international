import env from "dotenv";
env.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
//   secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOwnerEmail({ subject, html }) {
    console.log("smtp host: ",process.env.SMTP_HOST)
  await transporter.sendMail({
    from: `"Regenta Payments" <${process.env.MAIL_FROM}>`,
    to: process.env.OWNER_EMAIL,
    subject,
    html,
  });
};
