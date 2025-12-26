import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { prisma } from "./config/dbConfig.js";
import { allRoutes } from "./routes/index.js";
import passport from "passport";
import "./config/passport.js";
const port = process.env.PORT || 5000;
const app = express();
//------------Database connection with prisma------------------
if (prisma) {
  console.log("Database Connection established");
} else {
  console.log("Failed to connect database");
}
//--------------------------

//---------------------Middlewares------------------
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://frotend-resume.onrender.com/"
        : "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use(passport.initialize());
app.use(allRoutes);
//----------------------------

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
