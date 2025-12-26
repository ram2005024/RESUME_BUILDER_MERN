import axios from "axios";
import {
  CheckIcon,
  Paintbrush,
  PaintBucket,
  PaintBucketIcon,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AssetContainer = ({ onChange, resume, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ColorArray = [
    { colorName: "Blue", colorCode: "#3B82F6" },
    { colorName: "Indigo", colorCode: "#6366F1" },
    { colorName: "Purple", colorCode: "#8B5CF6" },
    { colorName: "Green", colorCode: "#22C55E" },
    { colorName: "Red", colorCode: "#EF4444" },
    { colorName: "Orange", colorCode: "#F97316" },
    { colorName: "Teal", colorCode: "#14B8A6" },
    { colorName: "Pink", colorCode: "#EC4899" },
    { colorName: "Gray", colorCode: "#9CA3AF" },
    { colorName: "Black", colorCode: "#000000" },
  ];

  const handleSave = async (code) => {
    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "resume/update",
        {
          resumeID: id,
          resumeData: { accent_color: code },
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="relative">
      <div
        className="flex gap-2 hover:bg-slate-200 group items-center  hover:border hover:border-slate-200 hover:ring-1 hover:ring-indigo-400  bg-slate-200  relative rounded-lg p-2 cursor-pointer transition-all duration-100"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <Paintbrush className="size-5 text-slate-500" />

        <p className="text-slate-500 group-hover:text-slate-600 ">Assets</p>
      </div>

      {isOpen && (
        <div className="flex flex-wrap gap-2 p-3 w-78 absolute top-15  left-2 bg-white rounded-lg border border-gray-300  z-50 shadow-lg">
          {ColorArray.map((items) => {
            const isChecked = items.colorCode === resume.accent_color;
            return (
              <div className="flex flex-col gap-1.5 text-center group items-center justify-center cursor-pointer">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  onClick={() => {
                    onChange(items.colorCode);

                    setIsOpen(false);
                    handleSave(items.colorCode);
                  }}
                  style={{
                    backgroundColor: items.colorCode,
                  }}
                >
                  {isChecked && (
                    <CheckIcon className="size-8 text-white bg-none font-extrabold" />
                  )}
                </div>
                <p className={` text-slate-700 text-sm font-extralight`}>
                  {items.colorName}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssetContainer;
