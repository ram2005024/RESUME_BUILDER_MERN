import express from "express";
import {
  changePass,
  forgotPass,
  getResumeController,
  getUserController,
  loginController,
  logoutController,
  registerController,
  verifyOTP,
} from "../controllers/User.js";
import { protectUserAuth } from "../middlewares/protect.js";
export const userRoute = express.Router();
userRoute.post("/register", registerController);
userRoute.post("/login", loginController);
userRoute.get("/logout", logoutController);
userRoute.get("/data", protectUserAuth, getUserController);
userRoute.post("/forgot", forgotPass);
userRoute.post("/verify", verifyOTP);
userRoute.post("/changePass", changePass);
