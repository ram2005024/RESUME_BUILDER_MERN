import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      "C:/Users/sharm/OneDrive/Desktop/resume_builder_mern/Backend/uploadsProfile"
    );
  },
  filename: (req, file, cb) => {
    cb(null, req.body.resumeID + path.extname(file.originalname));
  },
});
export const upload = multer({ storage });
