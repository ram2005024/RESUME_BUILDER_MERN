import { prisma } from "../config/dbConfig.js";
import { sendOTP } from "../libs/ForgetPass/SendOTP.js";
import { generateOTP } from "../libs/ForgetPass/generateOTP.js";
import { compareHash, createUser, generateToken } from "../libs/DBMethods.js";

import bcrypt from "bcryptjs";
//---------------registerController-------------
export const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.json({ message: "All fields are required", status: false });

  try {
    //Checking if user exists or not
    const userExist = await prisma.user.findUnique({
      where: { email },
    });
    if (userExist)
      return res.json({ message: "User already exists.", success: false });
    //if user doesnot exist create a database
    const user = await createUser({ name: username, email, password });
    const token = generateToken(user.id, user.name);
    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      message: "User registered successfully",
      success: true,
      user,
      token,
    });
  } catch (error) {
    return res.json({ message: "Error to register user", success: false });
    console.log("Error: ", error.message);
  }
};
//------------------------------ login controller-----------------------
export const loginController = async (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password)
    return res.json({ success: false, message: "ALL fields are required" });
  try {
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist)
      return res.json({
        message: "User doesn't exist with this email.",
        success: false,
      });
    if (!(await compareHash(password, userExist.password)))
      return res.json({ message: "Invalid credentials", success: false });
    const token = generateToken(userExist.id, userExist.name);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production" ,
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 1 * 60 * 1000,
    });
    userExist.password = undefined;
    return res.status(200).json({
      message: "Login successfull",
      success: true,
      user: userExist,
    });
  } catch (error) {
    return res.json({ message: "System failed to login", success: false });
  }
};
//-----------Getting userInfo by id------------------
export const getUserController = async (req, res) => {
  const userID = req.userID;
  const userName = req.userName;
  try {
    const user = await prisma.user.findUnique({ where: { id: userID } });
    if (!user) return res.json({ message: "User not found", success: false });
    user.password = undefined;
    return res.status(200).json({ userID, userName, success: true });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};
//---------------Getting userResume by id------------------
export const getResumeController = async (req, res) => {
  const userID = req.userID;
  try {
    const resume = await prisma.resume.findUnique({
      where: { userID },
      include: { education: true, experience: true, project: true },
    });
    if (!resume) {
      return res.json({
        resume: {
          title: "Untitled resume",
          public: false,
          template: "classic",
          accent_color: "3B82F6",
          professional_summary: "",
          personal_info: {},
          skills: [],
          education: [],
          experience: [],
          project: [],
        },
        success: true,
        message: "Resume fetched (empty)",
      });
    }
    return res.json({ resume, success: true, message: "Resume fetched" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//-------------------Logout controller-----------------
export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token", {
      secure: process.env.NODE_ENV === "production" ? true : false,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ success: true, message: "Logout successfull" });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//------------------------Forgot Controller--------------
export const forgotPass = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.json({ message: "Please enter an email", success: false });
  try {
    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!userExist)
      return res.json({ message: "user doesnot exist", success: false });
    const otp = String(generateOTP());
    const hashedOTP = await bcrypt.hash(otp, 5);
    await prisma.user.update({
      where: { email: email },
      data: {
        otp: hashedOTP,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    await sendOTP(email, otp);
    return res.json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//------------verify controller
export const verifyOTP = async (req, res) => {
  const { otp, email } = req.body;
  if (!email) return res.json({ message: "Invalid email", success: false });
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!user)
      return res.json({ message: "user doesnot exist", success: false });
    if (!(await compareHash(otp, user.otp)))
      return res.json({ message: "Invalid otp", success: false });

    if (Date.now() > user.otpExpires)
      return res.json({
        message: "OTP expired please resend",
        success: false,
      });
    user.otp = "";
    user.otpExpires = "";
    return res.json({ message: "OTP Verified", success: true });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
//---------------Change password-------------------
export const changePass = async (req, res) => {
  const { email, password, confirmPwd } = req.body;
  if (!email) return res.json({ message: "Invalid email", success: false });
  try {
    const userExist = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!userExist)
      return res.json({ message: "user doesnot exist", success: false });
    if (password !== confirmPwd)
      return res.json({ message: "Password didnot match", success: false });
    const hashedPwd = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { email: email },
      data: {
        password: hashedPwd,
      },
    });

    return res.json({ message: "Password changed", success: true });
  } catch (error) {
    return res.json({ message: error.message });
  }
};
