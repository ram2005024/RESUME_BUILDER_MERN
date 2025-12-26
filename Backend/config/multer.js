import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory
export const upload = multer({ storage });
