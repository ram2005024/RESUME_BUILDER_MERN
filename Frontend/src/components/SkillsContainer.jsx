import { PlusIcon, Sparkles, XIcon } from "lucide-react";
import { useRef, useState } from "react";
const SkillsContainer = ({ data, setResume, handleSave }) => {
  const [skillName, setSkillName] = useState(null);
  const inputRef = useRef(null);
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex justify-between  items-center p-2">
        <div>
          <h2 className="text-xl font-semibold mb-1.5">Skills</h2>
          <p className="text-slate-400 text-sm font-light ">
            Add your technical and soft skills
          </p>
        </div>
      </div>
      <div className="flex  items-center  gap-3">
        <input
          type="text"
          ref={inputRef}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Enter a skill (e.g. Javascript,Project management,Designer)"
          className="p-2 text-slate-600 rounded-lg border w-10/12 border-slate-200 focus:ring focus:ring-slate-600 outline-none"
        />
        <button
          onClick={() => {
            if (!skillName) return;
            const newSkill = [...data, skillName];
            setResume((prev) => ({
              ...prev,
              skills: newSkill,
            }));
            setSkillName("");
            inputRef.current.value = "";
            inputRef.current.focus();
          }}
          className="inline-flex px-4 py-2 items-center gap-4 bg-indigo-500 text-white hover:border hover:bg-indigo-500 outline-none rounded-lg  hover:border-slate-400 hover:ring hover:ring-indigo-300 "
        >
          <PlusIcon className="text-white text-sm  size-4 hover:text-slate-200" />
          <span className="text-white text-sm font-light hover:text-slate-200 ">
            Add
          </span>
        </button>
      </div>

      {data.length !== 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {data.map((items, index) => {
            return (
              <div
                className="bg-indigo-100 flex justify-between items-center   px-2 py-1.5 gap-3 rounded-3xl hover:bg-indigo-100 cursor-pointer hover:ring hover:ring-slate-500 "
                key={index}
              >
                <span className="text-indigo-900 font-light">{items}</span>
                <XIcon
                  className="size-3 text-indigo-800 hover:text-red-600"
                  onClick={() =>
                    setResume((prev) => ({
                      ...prev,
                      skills: data.filter((_, i) => i !== index),
                    }))
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      <div className="bg-indigo-100  p-3 rounded-lg text-sm">
        <p className="text-indigo-500">
          <strong>Tip:</strong> Add up to 10 skills that showcase your
          expertise—technical, creative, or interpersonal. Keep it clear,
          relevant, and confident
        </p>
      </div>
      <button
        onClick={() => {
          handleSave();
        }}
        disabled={data.length === 0}
        className="self-start ml-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm active:scale-95"
      >
        Save
      </button>
    </div>
  );
};

export default SkillsContainer;
