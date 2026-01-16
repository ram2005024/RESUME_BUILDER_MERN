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

export const resumeRoute = express.Router();
resumeRoute.get("/get", protectUserAuth, getResume);
resumeRoute.post("/create", protectUserAuth, createResume);
resumeRoute.put("/editResumeTitle/:resumeID", protectUserAuth, editResumeTitle);
resumeRoute.delete("/deleteResume/:resumeID", protectUserAuth, deleteResume);
resumeRoute.get("/get/:resumeID", protectUserAuth, getResumeByResumeID);
resumeRoute.put("/update", protectUserAuth, updateResumeField);
resumeRoute.put("/updateExperience", protectUserAuth, updateExperience);
resumeRoute.put("/updateEducation", protectUserAuth, updateEducation);
resumeRoute.put("/updateProjects", protectUserAuth, updateProject);
resumeRoute.put("/update/skills", protectUserAuth, updateSkills);
resumeRoute.delete("/delete/experience", protectUserAuth, deleteExperience);
resumeRoute.delete("/delete/project", protectUserAuth, deleteProject);
resumeRoute.delete("/delete/education", protectUserAuth, deleteEducation);
resumeRoute.post(
  "/uploadImage",
  protectUserAuth,
  upload.single("image"),
  uploadImage
);
