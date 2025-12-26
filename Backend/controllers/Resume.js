import { prisma } from "../config/dbConfig.js";
import imagekit from "../config/ImageKit.js";
import path from "path";

import fs from "fs";
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
//---------------Get resume by resume id-----------------
export const getResumeByResumeID = async (req, res) => {
  const { resumeID } = req.params;
  try {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeID },
      include: {
        education: true,
        project: true,
        experience: true,
      },
    });
    if (resume)
      return res.json({ message: "Resume retrieved", success: true, resume });
    return res.json({ success: false, message: "No resume existed" });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
//--------------------Update resume field----------
export const updateResumeField = async (req, res) => {
  const { resumeID, resumeData } = req.body;

  try {
    const resume = await prisma.resume.update({
      where: { id: resumeID },
      data: {
        updated_at: new Date(),
        ...resumeData,
      },
    });
    if (!resume) return res.json({ message: "Error", success: false });
    return res.json({ message: "Saved successfully", success: true, resume });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
//---------------For experience
export const updateExperience = async (req, res) => {
  const { resumeID, resumeData } = req.body;
  const experiences = [];
  try {
    //Checking if expererience exist or not
    for (let exp of resumeData) {
      let updatedExperience;
      //if exp exists update
      if (exp.id) {
        updatedExperience = await prisma.experience.update({
          where: { id: exp.id },
          data: { ...exp },
        });
      } else {
        //insert the new experience
        updatedExperience = await prisma.experience.create({
          data: { resumeID, ...exp },
        });
      }
      experiences.push(updatedExperience);
    }

    return res.json({
      message: "Saved successfully",
      success: true,
      experience: experiences,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

//---------------For education
export const updateEducation = async (req, res) => {
  const { resumeID, resumeData } = req.body;
  let educations = [];
  try {
    //Checking if education exist or not
    for (let edu of resumeData) {
      let education;
      //if edu exists update
      if (edu.id) {
        education = await prisma.education.update({
          where: { id: edu.id },
          data: { ...edu },
        });
      } else {
        //insert the new education
        education = await prisma.education.create({
          data: { resumeID, ...edu },
        });
      }
      educations.push(education);
    }
    return res.json({
      message: "Saved successfully",
      success: true,
      education: educations,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

//---------------For projects
export const updateProject = async (req, res) => {
  const { resumeID, resumeData } = req.body;
  const allProjects = [];
  try {
    //Checking if project exist or not
    for (let pro of resumeData) {
      let project;
      //if pro exists update
      if (pro.id) {
        project = await prisma.project.update({
          where: { id: pro.id },
          data: { ...pro },
        });
      } else {
        //insert the new project
        project = await prisma.project.create({
          data: { resumeID, ...pro },
        });
      }
      allProjects.push(project);
    }
    return res.json({
      message: "Saved successfully",
      success: true,
      project: allProjects,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
//---------delete experience-------------
export const deleteExperience = async (req, res) => {
  const { expID } = req.body;
  try {
    await prisma.experience.delete({ where: { id: expID } });
    return res.json({
      message: "Deleted education successfully",
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};

//delete project-----------------------
export const deleteProject = async (req, res) => {
  const { proID } = req.body;
  try {
    await prisma.project.delete({ where: { id: proID } });
    return res.json({
      message: "Deleted project successfully",
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
//delete education-----------------------
export const deleteEducation = async (req, res) => {
  const { eduID } = req.body;
  try {
    await prisma.education.delete({ where: { id: eduID } });
    return res.json({
      message: "Deleted education successfully",
      success: true,
    });
  } catch (error) {
    return res.json({ message: error.message, success: false });
  }
};
//---------FOR UPDATION OF SKILLS--------------------
export const updateSkills = async (req, res) => {
  const { id, resumeData } = req.body;
  try {
    const resume = await prisma.resume.update({
      where: { id: id },
      data: {
        skills: resumeData,
      },
    });

    return res.json({
      message: "Added skill",
      success: true,
      skills: resume.skills,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};
//---------------------For image url------------------------
export const uploadImage = async (req, res) => {
  const image = req.file;

  try {
    if (!image) {
      console.log("No file uploaded");
      const response = await imagekit.files.upload({
        file: req.file.buffer,
        fileName: req.body.resumeID + path.extname(req.file.originalname),
        folder: "user_resumes",
        transformation: {
          pre:
            "w-300,h-300,fo-face,z-0.75" +
            (req.body.removeBG === "true" ? ",e-bgremove" : ""),
        },
      });

      return res.json({
        message: "Added image",
        success: true,
        imageURL: response.url,
      });
    }
  } catch (error) {
    return res.json({ message: error.message });
  }
};
