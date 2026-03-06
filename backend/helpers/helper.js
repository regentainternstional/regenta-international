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
  // logger: true,
  // debug: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});


export async function sendOwnerEmail({ subject, html }) {
  try {
    console.log("📧 Sending email...");
    console.log("SMTP Host:", process.env.SMTP_HOST);
    console.log("From:", process.env.MAIL_FROM);
    console.log("To:", process.env.OWNER_EMAIL);

    const info = await transporter.sendMail({
      from: `"Regenta Payments" <${process.env.MAIL_FROM}>`,
      to: process.env.OWNER_EMAIL,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
  } catch (error) {
    console.error("❌ Email sending failed");
    console.error("Error message:", error.message);
    console.error("Full error:", error);
    throw error;
  }
}

