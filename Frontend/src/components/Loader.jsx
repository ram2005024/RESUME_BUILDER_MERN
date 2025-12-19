import { File } from "lucide-react";
import { useState, useEffect } from "react";

const LoaderComponent = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-slate-100">
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-slate-300 animate-pulse"></div>

          <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-500 animate-spin"></div>

          <div
            className="absolute inset-4 rounded-full border-2 border-transparent border-b-slate-700 border-l-slate-600 animate-spin"
            style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
          ></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <File size={16} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
            CYRUS
          </h1>

          <p className="text-slate-500 text-sm font-medium">
            The best resume builder app
          </p>

          <p className="text-slate-400 text-xs tracking-wide mt-1">
            Loading<span className="inline-block w-6 text-left">{dots}</span>
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 text-center">
        <p className="text-slate-400 text-xs">
          Crafted by{" "}
          <span className="text-slate-600 font-medium">Ram Sharma</span>
        </p>
      </div>
    </div>
  );
};

export default LoaderComponent;
