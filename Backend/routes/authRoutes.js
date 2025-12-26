import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
export const authRoute = express.Router();
//------------Google auth---------------------
authRoute.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
authRoute.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    const token = jwt.sign(
      { userID: req.user.id, userName: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.redirect("https://frotend-resume.onrender.com/app");
  }
);
//---------------Facebook auth--------------------
authRoute.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

authRoute.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),

  function (req, res) {
    const token = jwt.sign(
      { userID: req.user.id, userName: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.redirect("https://frotend-resume.onrender.com/app");
  }
);
authRoute.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRoute.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    const token = jwt.sign(
      { userID: req.user.id, userName: req.user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    res.redirect("https://frotend-resume.onrender.com/app");
  }
);
