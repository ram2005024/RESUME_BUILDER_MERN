import express from "express";
import { userRoute } from "./userRoutes.js";
import { resumeRoute } from "./resumeRoutes.js";
export const allRoutes = express.Router();
allRoutes.use("/auth/user", userRoute);
allRoutes.use("/resume", resumeRoute);
