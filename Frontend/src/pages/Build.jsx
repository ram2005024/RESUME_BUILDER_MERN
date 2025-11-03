import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderIcon,
  GraduationCap,
  SparkleIcon,
  User,
} from "lucide-react";

const Build = () => {
  const [resume, setResume] = useState({
    personalInfo: {},
    personalSummary: "",
    experience: [],
    skills: [],
    projects: [],
    template: "classic",
    accent: "#A855F7",
    public: false,
    education: [],
    _id: "",
    userId: "",
    title: "",
  });
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

  return (
    <div>
      <div className="max-w-7xl mx-auto flex flex-col  py-5">
        <div>
          <Link
            to="/app"
            className="inline-flex items-center gap-3 text-gray-500 hover:text-gray-600 transition-all duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            Back to dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 ">
          <div className="lg:col-span-5  rounded-lg overflow-hidden ">
            {/* Left entry point */}
            <div className="bg-white border relative border-gray-400 p-6 pt-1 rounded-lg shadow-sm">
              {/* For progress bar */}
              <hr className="absolute top-0 left-0 border-3 border-gray-400 rounded-lg w-full" />
              <hr
                className="absolute top-0 left-0 opacity-50 border-3 rounded-lg border-gray-700 transition-all duration-300"
                style={{
                  width: `${(activeSectionIndex / sections.length) * 120}%`,
                }}
              />
              <div className="flex justify-between items-center w-full mt-4">
                {/* Template desiging container */}
                <div></div>
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
            </div>

            {/* Right view point */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Build;
