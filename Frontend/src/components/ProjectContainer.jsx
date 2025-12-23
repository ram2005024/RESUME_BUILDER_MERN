import axios from "axios";
import { Workflow, PlusIcon, Trash2 } from "lucide-react";
import React from "react";
import { toast } from "react-toastify";

const ProjectContainer = ({ setResume, data, onChange, handleSave }) => {
  const handleDeleteProject = async (pro) => {
    if (!pro?.id) toast.error("Deletion failed");
    try {
      const proID = pro?.id;
      const res = await axios.delete(
        import.meta.env.VITE_API_URL + "resume/delete/project",
        { data: { proID }, withCredentials: true }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex justify-between  items-center p-2">
        <div>
          <h2 className="text-xl font-semibold mb-1.5">Projects</h2>
          <p className="text-slate-400 text-sm font-light ">
            Add your projects
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setResume((prev) => ({
                ...prev,
                project: [...prev.project, {}],
              }));
            }}
            className="inline-flex px-3 py-1 items-center gap-2 bg-slate-300 hover:border hover:bg-slate-200 outline-none rounded-lg  hover:border-slate-400 hover:ring hover:ring-indigo-300 "
          >
            <PlusIcon className="text-slate-500 size-5 hover:text-slate-600" />
            <span className="text-slate-500 hover:text-slate-600 ">
              Add project
            </span>
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="w-full py-10 flex flex-col justify-center items-center mb-5">
          <Workflow className="size-10 text-slate-300 font-bold mb-3" />
          <p className="text-slate-500 mb-1">No projects added yet</p>
          <p className="text-slate-500 ">Click "Add Projects" to get started</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {data.map((project, index) => {
            return (
              <div
                className="flex flex-col gap-4 px-4 py-6 border border-slate-300 rounded-lg "
                key={index}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold ">
                    Project #{index + 1}
                  </h2>
                  <Trash2
                    className="text-red-400 cursor-pointer hover:text-red-600 size-5"
                    onClick={() => {
                      setResume((prev) => ({
                        ...prev,
                        project: prev.project.filter((_, i) => i !== index),
                      }));
                      handleDeleteProject(project);
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    className="p-2 text-slate-600 rounded-lg border w-full border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    placeholder="Project name"
                    value={data[index].name || ""}
                    onChange={(e) => {
                      onChange({ name: e.target.value }, index);
                    }}
                  />
                  <input
                    type="text"
                    value={data[index].type || ""}
                    className="p-2 rounded-lg text-slate-600 border w-full border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    placeholder="Project Type"
                    onChange={(e) => {
                      onChange({ type: e.target.value }, index);
                    }}
                  />
                  <textarea
                    type="text"
                    rows={7}
                    value={data[index].description || ""}
                    placeholder="Project description"
                    className="p-2 rounded-lg text-slate-600 border resize-none w-full border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    onChange={(e) => {
                      onChange({ description: e.target.value }, index);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button
        onClick={() => handleSave()}
        disabled={data.length === 0}
        className="self-start ml-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm active:scale-95"
      >
        Save
      </button>
    </div>
  );
};

export default ProjectContainer;
