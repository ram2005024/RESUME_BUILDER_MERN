import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "./dbConfig.js";
const findOrCreate = async (email, username, providerID, providerName) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      const newUser = await prisma.user.create({
        data: {
          name: username,
          email: email,
          provider: providerName,
          providerID,
        },
      });
      return newUser;
    }
    return user;
  } catch (error) {
    console.log(error);
  }
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const name = profile.displayName;
        const email = profile.emails[0].value;
        const providerName = "google";
        const providerID = profile.id;
        const user = await findOrCreate(email, name, providerID, providerName);
        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        const userEmail =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName;
        const email = userEmail || `${profile.id}@facebook.com`;
        const providerName = "facebook";
        const providerID = profile.id;
        const user = await findOrCreate(email, name, providerID, providerName);
        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
    }
  )
);
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.SERVER_URL + "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log(profile);
        const userEmail =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const name = profile.displayName;
        const email = userEmail || `${profile.id}@github.com`;
        const providerName = "github";
        const providerID = profile.id;
        const user = await findOrCreate(email, name, providerID, providerName);
        return cb(null, user);
      } catch (error) {
        console.log(error);
        return cb(error, null);
      }
    }
  )
);
