import nodemailer from "nodemailer";
import { OTPEmailTemplate } from "./OTPFormat.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export const sendOTP = async (email, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email verification Code",
      html: OTPEmailTemplate(otp),
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
