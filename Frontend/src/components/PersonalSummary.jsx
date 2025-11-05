import { Sparkle, Sparkles } from "lucide-react";
import React from "react";

const PersonalSummary = ({ data, onChange, setResume }) => {
  return (
    <div className="space-y-5 mt-7 w-full">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between ">
          <div>
            <h1 className="text-xl font-semibold ">Professional Summary</h1>
            <p className="text-slate-500 text-sm">
              Add summary for your resume
            </p>
          </div>

          <button className="inline-flex items-center p-2 rounded-lg bg-slate-200 gap-2 h-10 hover:ring hover:ring-indigo-400 hover:bg-slate-100">
            <Sparkles className="size-4 text-slate-500" />
            <span className="text-slate-600">AI Enhance</span>
          </button>
        </div>
        <div>
          <textarea
            placeholder="Creative and results-driven professional with a passion for solving problems, collaborating across teams, and delivering impactful solutions. Skilled in adapting to new challenges and driving growth through innovation and empathy."
            rows={7}
            value={data || ""}
            onChange={(e) => onChange(e.target.value)}
            className="p-3 outline-0 mb-1.5 text-sm text-slate-700 border w-full border-slate-300 rounded-lg focus:ring focus:ring-pink-300 shadow-sm resize-none"
          ></textarea>
          <p className="text-slate-600 text-center text-xs  ">
            Keep it clear, confident, and true to you—highlight your strengths
            in 2–3 sentences.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonalSummary;
