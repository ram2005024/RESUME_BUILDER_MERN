import express from "express";
import {
  createResume,
  getResume,
  editResumeTitle,
  deleteResume,
} from "../controllers/Resume.js";

import { protectUserAuth } from "../middlewares/protect.js";

export const resumeRoute = express.Router();
resumeRoute.get("/get", protectUserAuth, getResume);
resumeRoute.post("/create", createResume);
resumeRoute.put("/editResumeTitle/:resumeID", editResumeTitle);
resumeRoute.delete("/deleteResume/:resumeID", deleteResume);
