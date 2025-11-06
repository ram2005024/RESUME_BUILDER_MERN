import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeft,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  SparkleIcon,
  User,
} from "lucide-react";
import PersonalInfo from "../components/PersonalInfo";
import Preview from "../components/Preview";
import TemplateBox from "../components/TemplateBox";
import AssetContainer from "../components/AssetContainer";
import PersonalSummary from "../components/PersonalSummary";
import ExperienceContainer from "../components/ExperienceContainer";

const Build = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resume, setResume] = useState({
    personal_info: {},
    professional_summary: "",
    experience: [],
    skills: [],
    projects: [],
    template: "ClassicTemplate",
    accent_color: "#818cf8",
    public: false,
    education: [],
    _id: "",
    userId: "",
    title: "",
  });
  const [removeBackground, setRemoveBackground] = useState(false);
  const sections = [
    { id: "personal", name: "Personal Info", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education Info", icon: GraduationCap },
    { id: "skills", name: "Skills Info", icon: SparkleIcon },
    { id: "projects", name: "Projects Info", icon: FolderIcon },
  ];
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const { id } = useParams();
  const loadExisting = async () => {
    const existingResume = dummyResumeData.find((items) => items._id === id);
    if (existingResume) {
      setResume(existingResume);
      document.title(existingResume.title);
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
  return (
    <div className="flex-1 bg-zinc-100">
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

        <div className="grid lg:grid-cols-12 gap-10 ">
          <div className="lg:col-span-5  rounded-lg overflow-y-visible">
            {/* Left entry point */}
            <div className="bg-white border relative border-slate-300 p-6 pt-1 rounded-lg shadow-sm ">
              {/* For progress bar */}
              <hr className="absolute top-0 left-0 border-3 border-gray-400 rounded-lg w-full" />
              <hr
                className="absolute top-0 left-0 opacity-50 border-3 rounded-lg border-gray-700 transition-all duration-300"
                style={{
                  width: `${(activeSectionIndex / sections.length) * 120}%`,
                }}
              />
              <div className="flex justify-between items-center w-full mt-4 ">
                {/* Template desiging container */}

                <div className="flex gap-3">
                  <TemplateBox
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    templateOptions={templateOptions}
                    onChange={(data) => {
                      setResume((prev) => ({ ...prev, template: data }));
                    }}
                  />
                  <AssetContainer
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
                    onChange={(data) =>
                      setResume((prev) => ({ ...prev, personal_info: data }))
                    }
                  />
                )}
                {activeSection.id === "summary" && (
                  <PersonalSummary
                    data={resume.professional_summary}
                    setResume={setResume}
                    onChange={(data) =>
                      setResume((prev) => ({
                        ...prev,
                        professional_summary: data,
                      }))
                    }
                  />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceContainer
                    data={resume.experience}
                    setResume={setResume}
                    onChange={(data, index) =>
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
                      })
                    }
                  />
                )}
              </div>
            </div>
          </div>
          {/* Right view point */}
          <div className="lg:col-span-7 max-lg:mt-5">
            <div>
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
