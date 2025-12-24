import express from "express";
import { protectUserAuth } from "../middlewares/protect.js";
import { enhanceText, generateResume } from "../controllers/aiController.js";
export const aiRoute = express.Router();
aiRoute.post("/enhanceText", enhanceText);
aiRoute.post("/generateResume", protectUserAuth, generateResume);
