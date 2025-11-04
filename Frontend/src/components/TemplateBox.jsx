import { CheckCheck, CheckIcon, LayoutTemplate } from "lucide-react";
import React, { useState } from "react";

const TemplateBox = ({ setIsOpen, isOpen, templateOptions, onChange }) => {
  const [isCheckedIndex, setIsChecked] = useState(0);
  return (
    <div className="flex gap-2 relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 flex items-center justify-center cursor-pointer  bg-indigo-200 rounded-lg gap-1.5 hover:border hover:border-gray-200 hover:ring-1 hover:ring-slate-400 hover:bg-gradient-to-r from-indigo-100 to-indigo-200"
      >
        <LayoutTemplate className="size-4 text-indigo-500" />
        <span className="text-indigo-500">Template</span>
      </div>
      {/* Template selecting container */}
      {isOpen && (
        <div
          className="p-4 flex flex-col gap-3 absolute top-15 left-0 z-50 overflow-y-visible w-96 border border-gray-100 shadow-lg bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {templateOptions.map((items, index) => {
            const isSelected = index === isCheckedIndex;
            return (
              <div
                key={items.key}
                className={`flex flex-col gap-2 p-4 rounded-lg relative cursor-pointer border hover:bg-slate-300/40 border-gray-200 shadow-sm ${
                  isSelected
                    ? "bg-indigo-400/20 border border-slate-400"
                    : "hover:bg-indigo-300/40 border border-gray-400"
                }`}
                onClick={() => {
                  setIsChecked(index);
                  setIsOpen(false);
                  onChange(items.id);
                }}
              >
                <p className="text-black font-semibold text-xl">{items.key}</p>
                <div className="p-2 bg-gray-300 rounded-lg">
                  <p className="italic text-xs text-gray-500 ">{items.label}</p>
                </div>
                {isSelected && (
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
