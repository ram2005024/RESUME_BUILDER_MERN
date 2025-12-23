import axios from "axios";
import { BriefcaseBusiness, PlusIcon, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
const ExperienceContainer = ({ data, onChange, setResume, handleSave }) => {
  const handleDeleteExperience = async (exp, index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
    if (!exp?.id) return;
    try {
      const expID = exp?.id;
      const res = await axios.delete(
        import.meta.env.VITE_API_URL + "resume/delete/experience",
        { data: { expID }, withCredentials: true }
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
          <h2 className="text-xl font-semibold mb-1.5">
            Professional Experience
          </h2>
          <p className="text-slate-400 text-sm font-light ">
            Add your job experience
          </p>
        </div>
        <div>
          <button
            onClick={() => {
              setResume((prev) => ({
                ...prev,
                experience: [...prev.experience, {}],
              }));
            }}
            className="inline-flex px-3 py-1 items-center gap-2 bg-slate-300 hover:border hover:bg-slate-200 outline-none rounded-lg  hover:border-slate-400 hover:ring hover:ring-indigo-300 "
          >
            <PlusIcon className="text-slate-500 size-5 hover:text-slate-600" />
            <span className="text-slate-500 hover:text-slate-600 ">
              Add Experience
            </span>
          </button>
        </div>
      </div>
      {data.length === 0 ? (
        <div className="w-full py-10 flex flex-col justify-center items-center mb-5">
          <BriefcaseBusiness className="size-10 text-slate-300 font-bold mb-3" />
          <p className="text-slate-500 mb-1">No work experience added yet</p>
          <p className="text-slate-500 ">
            Click "Add Experience" to get started
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {data.map((exp, index) => {
            return (
              <div
                className="flex flex-col gap-4 px-4 py-6 border border-slate-300 rounded-lg "
                key={index}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold ">
                    Experience #{index + 1}
                  </h2>
                  <Trash2
                    className="text-red-400 cursor-pointer hover:text-red-600 size-5"
                    onClick={() => {
                      handleDeleteExperience(exp, index);
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    className="p-2 text-slate-600 rounded-lg border w-[calc(50%-0.5rem)] border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    placeholder="Company name"
                    value={data[index].company || ""}
                    onChange={(e) => {
                      onChange({ company: e.target.value }, index);
                    }}
                  />
                  <input
                    type="text"
                    value={data[index].position || ""}
                    className="p-2 rounded-lg text-slate-600 border w-[calc(50%-0.5rem)] border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    placeholder="Job Title"
                    onChange={(e) => {
                      onChange({ position: e.target.value }, index);
                    }}
                  />
                  <input
                    type="date"
                    value={data[index].start_date || ""}
                    className="p-2 rounded-lg text-slate-600 border w-[calc(50%-0.5rem)] border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    onChange={(e) => {
                      onChange({ start_date: e.target.value }, index);
                    }}
                  />
                  <input
                    type="date"
                    value={data[index].end_date || ""}
                    className="p-2 rounded-lg text-slate-600 border w-[calc(50%-0.5rem)] border-slate-200 focus:ring focus:ring-slate-600 outline-none"
                    onChange={(e) => {
                      onChange({ end_date: e.target.value }, index);
                    }}
                  />
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    type="checkbox"
                    checked={data[index].is_current || false}
                    className="h-4 w-6 cursor-pointer accent-indigo-400  outline-none"
                    onChange={(e) => {
                      onChange({ is_current: e.target.checked }, index);
                    }}
                  />
                  <span className="text-slate-500">Currently working here</span>
                </div>
                <div className="flex items-center justify-between ">
                  <h2>Job Description</h2>
                  <button className="inline-flex items-center p-2 rounded-lg bg-slate-200 gap-2 h-10 hover:ring hover:ring-indigo-400 hover:bg-slate-100">
                    <Sparkles className="size-4 text-slate-500" />
                    <span className="text-slate-600">AI Enhance</span>
                  </button>
                </div>
                <div>
                  <textarea
                    placeholder="Describe your key responsibilities and achievements"
                    rows={7}
                    value={data[index].description || ""}
                    onChange={(e) => {
                      onChange({ description: e.target.value }, index);
                    }}
                    className="p-3 outline-0 mb-1.5 text-sm text-slate-700 border w-full border-slate-300 rounded-lg focus:ring focus:ring-pink-300 shadow-sm resize-none"
                  ></textarea>
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

export default ExperienceContainer;
