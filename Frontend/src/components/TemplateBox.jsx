import axios from "axios";
import { CheckIcon, LayoutTemplate } from "lucide-react";

import { toast } from "react-toastify";

const TemplateBox = ({
  setIsOpen,
  isOpen,
  resume,
  templateOptions,
  onChange,
  setResume,
  id,
}) => {
  const handleTemplateChange = async (temp) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "resume/update",
        { resumeID: id, resumeData: { template: temp } },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setResume((prev) => ({ ...prev, template: res.data.resume.template }));
        toast.success("Template changed");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  console.log(resume.template);
  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 flex items-center justify-center cursor-pointer  bg-indigo-200 rounded-lg gap-1.5 hover:border hover:border-gray-200 hover:ring-1 hover:ring-slate-400 hover:bg-gradient-to-r from-indigo-100 to-indigo-200 transition-all duration-100"
      >
        <LayoutTemplate className="size-4 text-indigo-500" />
        <span className="text-indigo-500">Template</span>
      </div>
      {/* Template selecting container */}
      {isOpen && (
        <div className="p-4 flex flex-col  gap-3 rounded-lg absolute top-15 left-0 z-50  w-96 h-auto border border-gray-100 shadow-lg bg-white">
          {templateOptions.map((items) => {
            return (
              <div
                key={items.key}
                className={`flex flex-col gap-2 p-4 rounded-lg relative cursor-pointer border hover:bg-slate-300/40 border-gray-200 shadow-sm ${
                  resume.template === items.id
                    ? "bg-indigo-400/20 border border-slate-400"
                    : "hover:bg-indigo-300/40 border border-gray-400"
                }`}
                onClick={() => {
                  const selectedTemplate = items.id;

                  setIsOpen(false);
                  onChange(items.id);
                  handleTemplateChange(selectedTemplate);
                }}
              >
                <p className="text-black font-semibold text-xl">{items.key}</p>
                <div className="p-2 bg-gray-300 rounded-lg">
                  <p className="italic text-xs text-gray-500 ">{items.label}</p>
                </div>
                {resume.template === items.id && (
                  <CheckIcon className="absolute top-2 right-3 size-5 bg-indigo-500 text-white rounded-full" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TemplateBox;
