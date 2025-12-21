import { prisma } from "../config/dbConfig.js";
//------Get resume by userID--------------
export const getResume = async (req, res) => {
  const id = req.userID;
  try {
    const resumes = await prisma.resume.findMany({
      where: { userID: id },
      include: {
        experience: true,
        education: true,
        project: true,
      },
    });
    return res.json({ success: true, resumes });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//-----------------Create new resume using title-------------
export const createResume = async (req, res) => {
  const { title, userID } = req.body;
  try {
    const resume = await prisma.resume.create({
      data: { userID: userID, title: title },
    });
    return res.json({
      message: "Created resume successfully",
      success: true,
      resume,
    });
  } catch (error) {
    return res.json({ message: "Error creating resume" });
  }
};
//----------------update resume title---------------
export const editResumeTitle = async (req, res) => {
  const resumeID = req.params.resumeID;
  const { title } = req.body;
  try {
    const resume = await prisma.resume.update({
      where: { id: resumeID },
      data: { title: title },
    });
    return res.json({
      message: "Updated  resume title",
      success: true,
      resume,
    });
  } catch (error) {
    return res.json({ message: "Error creating resume" });
  }
};
//-------------------delete the resume---------------
export const deleteResume = async (req, res) => {
  const resumeID = req.params.resumeID;
  try {
    const resume = await prisma.resume.delete({
      where: { id: resumeID },
    });
    return res.json({
      message: "Deleted resume successfully",
      success: true,
      resume,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
