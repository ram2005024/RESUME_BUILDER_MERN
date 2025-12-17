import Nav from "../components/DashBoard/Nav";
import {
  PlusIcon,
  UploadCloud,
  NotebookPen,
  Trash,
  PenIcon,
  XIcon,
  FileIcon,
  File,
} from "lucide-react";
import { dummyResumeData } from "../assets/assets";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const DashBoard = () => {
  const [allResumes, setAllResumes] = useState([]);
  const [isCreateResume, setIsCreateResume] = useState(false);
  const [isUploadResume, setIsUploadResume] = useState(false);
  const [title, setTitle] = useState("");
  const [editResume, setIsEditResume] = useState(false);
  const [resumeID, setResumeID] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const loadResumes = async () => {
    setAllResumes(dummyResumeData);
  };
  const navigate = useNavigate();
  useEffect(() => {
    loadResumes();
  }, []);
  const color = [
    "#dcfce7",
    "#f1f5f9",
    "#e0f2fe",
    "#e0e7ff",
    "#fef9c3",
    "#dcfce7",
    "#fce7f3",
    "#f3e8ff",
    "#fff7ed",
    "#fef2f2",
  ];
  const handleCreateResume = async (e) => {
    e.preventDefault();
    navigate("/app/build/resumeID");
  };
  const handleUploadResume = async () => {
    setTitle("");
    setIsUploadResume(false);
    setUploadFile(null);
    navigate("/app/build/resume123");
  };
  const handleEditResume = async (e) => {
    e.preventDefault();
    setAllResumes((prev) =>
      prev.map((items) =>
        items._id === resumeID ? { ...items, title } : items
      )
    );
    setTitle("");
    setIsEditResume(false);
    setResumeID(false);
  };

  const handleDelete = async (resumeID) => {
    const confirm = window.confirm("Are you sure want to delete this resume?");
    if (confirm) {
      setAllResumes((pre) => pre.filter((items) => items._id !== resumeID));
    }
  };

  return (
    <div className=" flex flex-col h-screen ">
      <div className=" bg-slate-50  grow flex ">
        <div className="sm:w-7xl mx-auto flex flex-col gap-8 py-10">
          <div className="flex  gap-6 px-4 py-4 w-screen group">
            <button
              onClick={() => setIsCreateResume(true)}
              className="sm:w-[200px] h-48  bg-white flex rounded-lg border flex-col justify-center hover:shadow-lg items-center gap-3 hover:scale-105 transition-all border-dashed duration-200"
            >
              <PlusIcon
                size={40}
                className="bg-gradient-to-tl from-indigo-500  to-indigo-200 text-white rounded-full"
              />
              <p className="text-slate-500">Create Resume</p>
            </button>
            <button
              onClick={() => setIsUploadResume(true)}
              className="sm:w-[200px] h-48 bg-white hover:shadow-lg flex border-dashed border rounded-lg flex-col justify-center  items-center gap-3 hover:scale-105 transition-all duration-200"
            >
              <UploadCloud
                size={40}
                strokeWidth={1.5}
                className="bg-gradient-to-bl from-purple-700  to-purple-300  text-white rounded-full"
              />
              <p className="text-slate-500">Upload Resume</p>
            </button>
          </div>
          <hr className="text-slate-400 sm:w-100 w-auto mx-10 " />
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 sm:max-w-2xl w-screen">
            {allResumes.map((items, index) => {
              const bgColorCode = color[index % color.length];
              return (
                <button
                  className="sm:w-[200px] h-48 inline-flex justify-center items-center rounded-lg relative group hover:scale-105 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/build/${items._id}`);
                  }}
                  style={{
                    background: bgColorCode,
                  }}
                  key={index}
                >
                  <div key={index} className="  flex flex-col gap-2">
                    <div className="flex flex-col gap-2 py-2 justify-center items-center">
                      <NotebookPen
                        size={20}
                        className="text-zinc-700 group-hover:text-slate-800"
                      />
                      <p className="group-hover:text-purple-500 text-indigo-800">
                        {items.title}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 opacity-80 absolute bottom-1  text-[12px] text-center font-extralight">
                    Updated on {new Date(items.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2 absolute opacity-0 top-3 right-4 group-hover:opacity-100  ">
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash
                        size={20}
                        className="rounded-lg shadow-sm group-hover:scale-110 transition-all duration-300"
                        onClick={() => handleDelete(items._id)}
                        style={{
                          color: "purple",
                          background: bgColorCode,
                        }}
                      />
                      <PenIcon
                        onClick={() => {
                          setIsEditResume(true);
                          setTitle(items.title);
                          setResumeID(items._id);
                        }}
                        size={20}
                        className="rounded-lg shadow-sm  group-hover:scale-110  transition-all duration-300"
                        style={{
                          color: "purple",
                          background: bgColorCode,
                        }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {isCreateResume && (
        <form
          onClick={() => {
            setIsCreateResume(false);
            setTitle("");
          }}
          onSubmit={(e) => handleCreateResume(e)}
          className="fixed inset-0 flex items-center justify-center  bg-black/70 backdrop-blur bg-opacity-50 z-100 h-full w-screen transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sm:max-w-sm  w-auto flex flex-col gap-5 py-4 px-7 shadow-2xl  rounded-lg relative bg-white"
          >
            <p className="font-bold text-xl ">Create a resumee</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full py-2 px-3 rounded-lg transition-color duration-200"
              placeholder="Enter resume"
            />
            <button
              type="submit"
              className="w-full text-center bg-green-900 rounded-sm text-white font-2xl py-3"
            >
              Create Resume
            </button>
            <XIcon
              onClick={() => {
                setIsCreateResume(false);
                setTitle("");
              }}
              size={20}
              className="absolute top-5 right-5 text-zinc-500 cursor-pointer hover:scale-105 hover:text-red-400"
            />
          </div>
        </form>
      )}
      {isUploadResume && (
        <form
          onClick={() => {
            setIsUploadResume(false);
            setUploadFile(false);
            setTitle("");
          }}
          onSubmit={(e) => handleUploadResume(e)}
          className="fixed inset-0 flex items-center justify-center  bg-black/70 backdrop-blur bg-opacity-50 z-100 h-full w-screen transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sm:max-w-sm  w-auto flex flex-col gap-5 py-4 px-7 shadow-2xl  rounded-lg relative bg-white"
          >
            <p className="font-bold text-xl ">Upload a resumee</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full py-2 px-3 rounded-lg transition-color duration-200"
              placeholder="Enter resume title"
            />

            <p className="text-sm text-slate-600">Select resume file</p>
            <div className="w-full flex flex-col group items-center justify-center border border-dashed border-gray-400 py-18 ">
              {!uploadFile ? (
                <>
                  <UploadCloud size={40} className="text-grey stroke-1 mb-3" />
                  <label
                    className="  text-gray-400 cursor-pointer group-hover:text-gray-500"
                    htmlFor="inputUpload"
                  >
                    Upload a resume
                  </label>
                </>
              ) : (
                <>
                  <File size={30} className="text-red stroke-2 mb-3" />
                  <span>{uploadFile.name}</span>
                </>
              )}
              <input
                type="file"
                hidden
                accept=".pdf"
                required
                file
                id="inputUpload"
                onChange={(e) => setUploadFile(e.target.files[0])}
              />
            </div>
            <button
              type="submit"
              className="w-full text-center bg-green-900 rounded-sm text-white font-2xl py-3"
            >
              Upload Resume
            </button>
            <XIcon
              onClick={() => {
                setIsUploadResume(false);
                setTitle("");
                setUploadFile(null);
              }}
              size={20}
              className="absolute top-5 right-5 text-zinc-500 cursor-pointer hover:scale-105 hover:text-red-400"
            />
          </div>
        </form>
      )}
      {editResume && (
        <form
          onClick={() => {
            setIsEditResume(false);
            setTitle("");
            setResumeID("");
          }}
          onSubmit={(e) => handleEditResume(e)}
          className="fixed inset-0 flex items-center justify-center  bg-black/70 backdrop-blur bg-opacity-50 z-100 h-full w-screen transition-all duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sm:max-w-sm  w-auto flex flex-col gap-5 py-4 px-7 shadow-2xl  rounded-lg relative bg-white"
          >
            <p className="font-bold text-xl ">Create a resumee</p>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full py-2 px-3 rounded-lg transition-color duration-200"
              placeholder="Enter new resume title"
            />
            <button
              type="submit"
              className="w-full text-center bg-green-900 rounded-sm text-white font-2xl py-3"
            >
              Edit Resume
            </button>
            <XIcon
              onClick={() => {
                setIsEditResume(false);
                setTitle("");
                setResumeID("");
              }}
              size={20}
              className="absolute top-5 right-5 text-zinc-500 cursor-pointer hover:scale-105 hover:text-red-400"
            />
          </div>
        </form>
      )}
      ;
    </div>
  );
};
export default DashBoard;
