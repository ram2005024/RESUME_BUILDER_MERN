import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/dbConfig.js";
export const createUser = async (data) => {
  data.password = await bcrypt.hash(data.password, 10);
  return prisma.user.create({ data });
};
export const comparePwd = async (plainPwd, hashedPwd) => {
  return await bcrypt.compare(plainPwd, hashedPwd);
};
export const generateToken = (id, name) => {
  const token = jwt.sign(
    { userID: id, userName: name },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};
