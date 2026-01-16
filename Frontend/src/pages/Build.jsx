import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOffIcon,
  FileText,
  FolderIcon,
  GraduationCap,
  Share,
  SparkleIcon,
  User,
} from "lucide-react";
import PersonalInfo from "../components/PersonalInfo";
import Preview from "../components/Preview";
import TemplateBox from "../components/TemplateBox";
import AssetContainer from "../components/AssetContainer";
import PersonalSummary from "../components/PersonalSummary";
import ExperienceContainer from "../components/ExperienceContainer";
import ProjectContainer from "../components/ProjectContainer";
import EducationContainer from "../components/EducationContainer";
import SkillsContainer from "../components/SkillsContainer";
import axios from "axios";

const Build = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [resume, setResume] = useState({
    personal_info: {},
    professional_summary: "",
    experience: [],
    skills: [],
    project: [],
    template: "classic",
    accent_color: "#3B82F6",
    public: false,
    education: [],
    id: "",
    userId: "",
    title: "",
  });
  const [removeBackground, setRemoveBackground] = useState(false);
  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "projects", name: "Projects Info", icon: FolderIcon },
    { id: "education", name: "Education Info", icon: GraduationCap },
    { id: "skills", name: "Skills Info", icon: SparkleIcon },
  ];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const { id } = useParams();

  const loadExisting = async () => {
    try {
      const res = await axios.get(
        import.meta.env.VITE_API_URL + `resume/get/${id}`,
        {
          withCredentials: true,
        }
      );
      const resumee = res.data.resume;
      if (resumee)
        setResume({
          ...resumee,
          personal_info: resumee.personal_info || {},
          experience: resumee.experience || [],
          project: resumee.project || [],
          education: resumee.education || [],
          skills: resumee.skills || [],
        });
    } catch (error) {
      console.log(error);
    }
  };
  const activeSection = sections[activeSectionIndex];
  useEffect(() => {
    loadExisting();
  }, []);
  const templateOptions = [
    {
      field: "template",
      key: "Classic",
      id: "classic",
      label:
        "ClassicTemplate delivers timeless elegance with structured layouts and refined typography. Ideal for formal resumes or documents that value tradition and clarity.",
    },
    {
      field: "template",
      key: "Minimal",
      id: "minimal",
      label:
        "MinimalTemplate offers a clean, distraction-free layout that highlights your content with elegance. Perfect for resumes or portfolios that need clarity and impact.",
    },
    {
      field: "template",
      key: "Minimal image",
      id: "minimalImage",
      label:
        "MinimalImageTemplate pairs clean typography with subtle image integration, creating a balanced layout that feels modern yet understated. Ideal for resumes or profiles that need visual warmth without clutter",
    },
    {
      field: "template",
      key: "Modern",
      id: "modern",
      label:
        "ModernTemplate blends sleek design with bold structure, perfect for showcasing skills and achievements with clarity. Its dynamic layout and confident typography make every section stand out.",
    },
  ];

  const handleVisibility = async (status) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "resume/update",
        { resumeID: id, resumeData: { public: status } },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setSaveMessage(res.data.message);
      }
    } catch (error) {
      setResume((prev) => ({ ...prev, public: !status }));
      toast.error(error.message);
    }
  };
  const handleResumeShare = async () => {
    const frontendURL = window.location.href.split(`/app/`)[0];
    const resumeURL = frontendURL + "/view/" + id;
    if (navigator.share) {
      navigator.share({ url: resumeURL, text: "My resume" });
    } else alert("Your browser doesn't support share option.");
  };
  const handleDownloadResume = async () => {
    window.print();
  };
  const handleSave = async () => {
    let resumeData = {};

    switch (activeSection.id) {
      case "personal":
        resumeData = {
          personal_info: resume.personal_info,

          title: resume.title,
          template: resume.template,
          accent_color: resume.accent_color,
          public: resume.public,
          professional_summary: resume.professional_summary,
        };
        break;
      case "summary":
        resumeData = {
          professional_summary: resume.professional_summary,
        };
        break;
      case "experience":
        try {
          const res = await axios.put(
            import.meta.env.VITE_API_URL + "resume/updateExperience",
            { resumeID: id, resumeData: resume.experience },
            {
              withCredentials: true,
            }
          );
          setResume((prev) => ({
            ...prev,
            experience: res.data.experience,
          }));

          if (res.data.success) setSaveMessage(res.data.message);
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        break;
      case "projects":
        try {
          const res = await axios.put(
            import.meta.env.VITE_API_URL + "resume/updateProjects",
            { resumeID: id, resumeData: resume.project },
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            setResume((prev) => ({ ...prev, project: res.data.project }));
            setSaveMessage(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        break;
      case "education":
        try {
          const res = await axios.put(
            import.meta.env.VITE_API_URL + "resume/updateEducation",
            { resumeID: id, resumeData: resume.education },
            {
              withCredentials: true,
            }
          );
          if (res.data.success) {
            setResume((prev) => ({ ...prev, education: res.data.education }));
            setSaveMessage(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        break;
      case "skills":
        try {
          const res = await axios.put(
            import.meta.env.VITE_API_URL + "resume/update/skills",
            {
              id,
              resumeData: resume.skills,
            }
          );
          if (res.data.success) {
            setSaveMessage(res.data.message);
            setResume((prev) => ({ ...prev, skills: res.data.skills }));
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
        break;

      default:
        resumeData = {};
    }
    if (activeSection.id === "personal" || activeSection.id === "summary") {
      try {
        const res = await axios.put(
          import.meta.env.VITE_API_URL + "resume/update",
          { resumeID: id, resumeData: resumeData },
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          setSaveMessage(res.data.message);

          setResume((prev) => ({ ...prev, ...res.data.resume }));
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };
  useEffect(() => {
    if (!isDirty || !id) return;

    const timer = setTimeout(() => {
      handleSave();
      setIsDirty(false);
    }, 1000); // auto-save after 1 second

    return () => clearTimeout(timer); // cancel if user types again
  }, [
    isDirty,
    resume.personal_info,
    resume.professional_summary,
    resume.experience,
    resume.project,
    resume.education,
    resume.skills,
    resume.template,
    resume.accent_color,
  ]);
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSaveMessage("");
    }, 3000);
    return () => clearTimeout(timerId);
  }, [saveMessage]);
  return (
    <div className="flex-1 bg-zinc-100">
      {/* SHOW SAVED MESSAGE */}

      <div
        className={`absolute top-0 right-3 text-gray-400 text-sm transition-all duration-300 transform ${
          saveMessage ? "translate-x-0 " : "translate-x-full "
        }`}
      >
        {saveMessage}
      </div>

      <div className="max-w-7xl mx-auto flex flex-col  py-5 relative">
        <div>
          <Link
            to="/app"
            className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-600 transition-all duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            Back to dashboard
          </Link>
        </div>

        <div className="  grid lg:grid-cols-12 gap-10 ">
          <div className="lg:col-span-5 print:hidden  rounded-lg overflow-y-visible">
            {/* Left entry point */}
            <div className="bg-white border relative border-slate-300 p-6 pt-1 rounded-lg shadow-sm ">
              {/* For progress bar */}
              <hr className="absolute top-0 left-0 border-3 border-gray-400 rounded-lg w-full" />
              <hr
                className="absolute top-0 left-0 opacity-50 border-3 rounded-lg border-gray-900 transition-all duration-300"
                style={{
                  width: `${(activeSectionIndex / sections.length) * 120}%`,
                }}
              />
              <div className="flex justify-between items-center w-full mt-4 ">
                {/* Template desiging container */}

                <div className="flex gap-3">
                  <TemplateBox
                    isOpen={isOpen}
                    id={id}
                    setResume={setResume}
                    resume={resume}
                    setIsOpen={setIsOpen}
                    templateOptions={templateOptions}
                    onChange={(data) => {
                      setResume((prev) => ({ ...prev, template: data }));
                    }}
                  />
                  <AssetContainer
                    resume={resume}
                    id={id}
                    onChange={(data) => {
                      setResume((prev) => ({ ...prev, accent_color: data }));
                    }}
                  />
                </div>
                {/* Controllers for resumes */}
                <div className="flex items-center gap-2">
                  {activeSectionIndex > 0 && (
                    <button
                      disabled={activeSectionIndex === 0}
                      onClick={() =>
                        setActiveSectionIndex((prev) => Math.max(prev - 1, 0))
                      }
                      className="inline-flex items-center gap-1.5 rounded-sm p-3 hover:bg-gray-200 text-gray-500  hover:text-gray-600 transition-all duration-200"
                    >
                      <ChevronLeft size={15} />
                      <span>Previous</span>
                    </button>
                  )}
                  <button
                    disabled={activeSectionIndex === sections.length - 1}
                    onClick={() =>
                      setActiveSectionIndex((prev) =>
                        Math.min(prev + 1, sections.length - 1)
                      )
                    }
                    className={`inline-flex items-center gap-1.5 rounded-sm p-3 hover:bg-gray-200 text-gray-500  hover:text-gray-600 transition-all duration-200 ${
                      activeSectionIndex === sections.length - 1 && "opacity-50"
                    }`}
                  >
                    <span>Next</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
              <hr className="text-gray-300 w-full mt-2" />
              {/* For form filling */}
              <div className="mt-4 w-full">
                {activeSection.id === "personal" && (
                  <PersonalInfo
                    data={resume.personal_info}
                    removeBackground={removeBackground}
                    setRemoveBackground={setRemoveBackground}
                    setResume={setResume}
                    resume={resume}
                    setIsDirty={setIsDirty}
                    onChange={(data) => {
                      setIsDirty(true);
                      setResume((prev) => ({ ...prev, personal_info: data }));
                    }}
                    handleSave={handleSave}
                  />
                )}
                {activeSection.id === "summary" && (
                  <PersonalSummary
                    data={resume.professional_summary}
                    setResume={setResume}
                    onChange={(data) => {
                      setIsDirty(true);
                      setResume((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }));
                    }}
                    handleSave={handleSave}
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceContainer
                    data={resume.experience}
                    setResume={setResume}
                    onChange={(data, index) => {
                      setIsDirty(true);
                      setResume((prev) => {
                        const updatedExperience = [...prev.experience];
                        updatedExperience[index] = {
                          ...updatedExperience[index],
                          ...data,
                        };
                        return {
                          ...prev,
                          experience: updatedExperience,
                        };
                      });
                    }}
                    handleSave={handleSave}
                  />
                )}
                {activeSection.id === "projects" && (
                  <ProjectContainer
                    data={resume.project}
                    setResume={setResume}
                    onChange={(data, index) => {
                      setIsDirty(true);
                      setResume((prev) => {
                        const updatedProject = [...prev.project];
                        updatedProject[index] = {
                          ...updatedProject[index],
                          ...data,
                        };
                        return {
                          ...prev,
                          project: updatedProject,
                        };
                      });
                    }}
                    handleSave={handleSave}
                  />
                )}
                {activeSection.id === "education" && (
                  <EducationContainer
                    data={resume.education}
                    setResume={setResume}
                    onChange={(data, index) => {
                      setIsDirty(true);
                      setResume((prev) => {
                        const updatedEducation = [...prev.education];
                        updatedEducation[index] = {
                          ...updatedEducation[index],
                          ...data,
                        };
                        return {
                          ...prev,
                          education: updatedEducation,
                        };
                      });
                    }}
                    handleSave={handleSave}
                  />
                )}
                {activeSection.id === "skills" && (
                  <SkillsContainer
                    data={resume.skills}
                    setResume={setResume}
                    handleSave={handleSave}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Right view point */}
          <div className="lg:col-span-7 max-lg:mt-5  ">
            <div className="relative w-full">
              <div className="flex gap-3 absolute bottom-3 right-0 mr-5 sm:mr-0">
                {resume.public && (
                  <button
                    onClick={() => handleResumeShare()}
                    className="px-3 py-2.5 rounded-sm  ring-green-600 hover:ring text-indigo-600 bg-gradient-to-br from-indigo-100 to-indigo-200 inline-flex items-center gap-1.5 transition-colors duration-200"
                  >
                    <Share size={12} />
                    <span className="text-xs">Share</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    handleVisibility(!resume.public);
                    setResume({ ...resume, public: !resume.public });
                  }}
                  className="px-3 py-2.5 rounded-sm text-xs ring-indigo-400 hover:ring text-indigo-600 bg-gradient-to-br from-green-100 to-green-200 inline-flex items-center gap-1.5 transition-colors duration-200"
                >
                  {resume.public ? (
                    <>
                      <Eye size={12} />
                      <span>Public</span>
                    </>
                  ) : (
                    <>
                      <EyeOffIcon size={12} />
                      <span>Private</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleDownloadResume()}
                  className="px-4 py-2.5 rounded-sm text-xs  ring-green-400 hover:ring text-green-900 bg-gradient-to-br from-green-200 to-gray-200 inline-flex items-center gap-1.5 transition-colors duration-200"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div id="resume-preview">
              <Preview
                data={resume}
                template={resume.template}
                accent={resume.accent_color}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Build;
