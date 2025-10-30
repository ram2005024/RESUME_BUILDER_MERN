import Nav from "../components/DashBoard/Nav";
import {
  PlusIcon,
  UploadCloud,
  NotebookPen,
  Trash,
  PenIcon,
} from "lucide-react";
import { dummyResumeData } from "../assets/assets";
import { useEffect, useState } from "react";
const DashBoard = () => {
  const [allResumes, setAllResumes] = useState([]);
  const loadResumes = async () => {
    setAllResumes(dummyResumeData);
  };
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
  return (
    <div className=" flex flex-col h-screen">
      <Nav />
      <div className=" bg-slate-50  grow flex ">
        <div className="sm:w-7xl mx-auto flex flex-col gap-8 py-10">
          <div className="flex  gap-6 px-4 py-4 w-screen group">
            <button className="sm:w-[200px] h-48  bg-white flex rounded-lg border flex-col justify-center hover:shadow-lg items-center gap-3 hover:scale-105 transition-all border-dashed duration-200">
              <PlusIcon
                size={40}
                className="bg-gradient-to-tl from-indigo-500  to-indigo-200 text-white rounded-full"
              />
              <p className="text-slate-500">Create Resume</p>
            </button>
            <button className="sm:w-[200px] h-48 bg-white hover:shadow-lg flex border-dashed border rounded-lg flex-col justify-center  items-center gap-3 hover:scale-105 transition-all duration-200">
              <UploadCloud
                size={40}
                strokeWidth={1.5}
                className="bg-gradient-to-bl from-purple-700  to-purple-300  text-white rounded-full"
              />
              <p className="text-slate-500">Create Resume</p>
            </button>
          </div>
          <hr className="text-slate-400 sm:w-100 w-auto mx-10 " />
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-6 sm:max-w-2xl w-screen">
            {dummyResumeData.map((items, index) => {
              const bgColorCode = color[index % color.length];
              return (
                <button
                  className="sm:w-[200px] h-48 flex justify-center items-center rounded-lg relative group hover:scale-105 transition-all duration-200"
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
                    <div className="flex gap-2">
                      <Trash
                        size={20}
                        className="rounded-lg shadow-sm group-hover:scale-110 transition-all duration-300"
                        style={{
                          color: "purple",
                          background: bgColorCode,
                        }}
                      />
                      <PenIcon
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
    </div>
  );
};

export default DashBoard;
