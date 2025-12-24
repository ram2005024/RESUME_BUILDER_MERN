import express from "express";
import {
  createResume,
  getResume,
  editResumeTitle,
  deleteResume,
  getResumeByResumeID,
  updateResumeField,
  updateExperience,
  updateEducation,
  updateProject,
  updateSkills,
  deleteExperience,
  deleteProject,
  deleteEducation,
  uploadImage,
} from "../controllers/Resume.js";
import { upload } from "../config/multer.js";

import { protectUserAuth } from "../middlewares/protect.js";
import { enhanceText } from "../controllers/aiController.js";

export const resumeRoute = express.Router();
resumeRoute.get("/get", protectUserAuth, getResume);
resumeRoute.post("/create", createResume);
resumeRoute.put("/editResumeTitle/:resumeID", editResumeTitle);
resumeRoute.delete("/deleteResume/:resumeID", deleteResume);
resumeRoute.get("/get/:resumeID", getResumeByResumeID);
resumeRoute.put("/update", updateResumeField);
resumeRoute.put("/updateExperience", updateExperience);
resumeRoute.put("/updateEducation", updateEducation);
resumeRoute.put("/updateProjects", updateProject);
resumeRoute.put("/update/skills", updateSkills);
resumeRoute.delete("/delete/experience", deleteExperience);
resumeRoute.delete("/delete/project", deleteProject);
resumeRoute.delete("/delete/education", deleteEducation);
resumeRoute.post("/uploadImage", upload.single("image"), uploadImage);
