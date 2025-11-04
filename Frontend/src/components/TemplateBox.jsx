import { CheckCheck, LayoutTemplate } from "lucide-react";
import React, { useState } from "react";

const TemplateBox = ({ setIsOpen, isOpen, templateOptions, onchange }) => {
  const [isCheckedIndex, setIsChecked] = useState(null);
  return (
    <div className="flex gap-2 relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 flex items-center justify-center  bg-indigo-200 rounded-lg gap-1.5 hover:border hover:border-gray-400 hover:ring-1 hover:ring-indigo-300 hover:bg-gradient-to-r from-indigo-200 to-indigo-300"
      >
        <LayoutTemplate className="size-6 text-indigo-500" />
        <span className="text-indigo-500">Template</span>
        {/* Template selecting container */}
        {isOpen && (
          <div
            className="p-4 space-y-2 absolute top-9 left-0  w-96 border-gray-400 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {templateOptions.map((items, index) => {
              const isSelected = index === isCheckedIndex;
              return (
                <div
                  key={items.key}
                  className={`flex flex-col gap-2 relative ${
                    isSelected ? "bg-indigo-300" : ""
                  }`}
                  onClick={() => {
                    setIsChecked(index);

                    setIsOpen(false);
                    onchange({ field: items.field, key: items.key });
                  }}
                >
                  <p className="text-black font-semibold">{items.key}</p>
                  <div className="p-2 bg-gray-300 ">
                    <p className="italic text-gray-500">{items.label}</p>
                  </div>
                  {isSelected && (
                    <CheckCheck className="absolute top-1 right-2 size-7 bg-indigo-500 text-white rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateBox;
