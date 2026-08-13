import express from "express";
import { protectUserAuth } from "../middlewares/protect.js";
import { enhanceText, generateResume } from "../controllers/aiController.js";
import { upload } from "./../config/multer";
export const aiRoute = express.Router();
aiRoute.post("/enhanceText", protectUserAuth, enhanceText);
aiRoute.post(
  "/generateResume",
  protectUserAuth,
  upload.single("file"),
  generateResume,
);
