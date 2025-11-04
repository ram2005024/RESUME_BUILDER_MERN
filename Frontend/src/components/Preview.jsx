import React from "react";
import ClassicTemplate from "./templates/ClassicTemplate";
import MinimalTemplate from "./templates/MinimalTemplate";
import MinimalImageTemplate from "./templates/MinimalImageTemplate";
import ModernTemplate from "./templates/ModernTemplate";
const Preview = ({ data, accent, template, classes = "" }) => {
  const templateSelector = () => {
    console.log(template);
    switch (template) {
      case "minimal":
        return <MinimalTemplate data={data} accentColor={accent} />;

      case "minimalImage":
        return <MinimalImageTemplate data={data} accentColor={accent} />;

      case "modern":
        return <ModernTemplate data={data} accentColor={accent} />;

      default:
        return <ClassicTemplate data={data} accentColor={accent} />;
    }
  };
  return (
    <div className="w-full bg-white">
      <div
        className={
          "border border-gray-400 print:border-none print:shadow-none " +
          classes
        }
      >
        {templateSelector()}
      </div>
      <style jsx>{`
        @page {
          size: letter;
          margin: 0;
        }

        @media print {
          html,
          body {
            width: 8.5in;
            height: 11in;
            overflow: hidden;
          }
          body * {
            visibility: hidden;
          }
          #resume-preview,
          #resume-preview * {
            visibility: visible;
          }
          #resume-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 0;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Preview;
