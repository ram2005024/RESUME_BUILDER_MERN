import jwt from "jsonwebtoken";
export const protectUserAuth = async (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token)
    return res
      .status(401)
      .json({ message: "Missing/invalid token", success: false });
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = decodedToken.userID;
    req.userName = decodedToken.userName;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Please login first", sucess: false });
  }
};
