import axios from "axios";
import { Sparkle, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

const PersonalSummary = ({ data, onChange, handleSave, setResume }) => {
  const [loading, setLoading] = useState(false);
  const handleEnhance = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "ai/enhanceText",
        {
          text: data,
        },
        {
          withCredentials: true,
        }
      );
      if (!response.data.success) {
        toast.error(response.data.message);
        setLoading(false);
        return;
      }

      setResume((prev) => ({
        ...prev,
        professional_summary: response.data.responseText,
      }));
      setLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };
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

          <button
            onClick={() => {
              handleEnhance();
            }}
            disabled={loading}
            className="inline-flex items-center p-2 rounded-lg bg-slate-200 gap-2 h-10 hover:ring hover:ring-indigo-400 hover:bg-slate-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}.spinner{animation:spin 3s linear infinite}`}</style>
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 spinner"></div>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Enhancing text...
                </p>
              </div>
            ) : (
              <>
                <Sparkles className="size-4 text-slate-500" />
                <span className="text-slate-600">AI Enhance</span>
              </>
            )}
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
      <button
        onClick={() => handleSave()}
        className="self-start ml-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm active:scale-95"
      >
        Save
      </button>
    </div>
  );
};

export default PersonalSummary;
