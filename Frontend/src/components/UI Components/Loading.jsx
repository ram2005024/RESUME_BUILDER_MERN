import { Zap, FileText } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 text-center">
        <div className="mb-8 flex justify-center gap-2 items-center">
          <FileText className="w-12 h-12 text-blue-400 animate-pulse" />
          <h1 className="text-4xl font-bold text-slate-100">Resume</h1>
          <span className="text-4xl font-bold text-blue-400">Builder</span>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-700 border-t-blue-400 animate-spin"></div>
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-r-purple-400 animate-spin"
              style={{ animationDirection: "reverse", animationDuration: "2s" }}
            ></div>
          </div>
        </div>

        <div className="mb-12">
          <p className="text-slate-300 text-lg font-medium">
            Preparing your workspace
            <span className="inline-flex gap-1 ml-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
              <span
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></span>
              <span
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></span>
            </span>
          </p>
        </div>

        <div className="border-t border-slate-700 pt-8 mt-8">
          <p className="text-slate-400 text-sm mb-2">
            Crafted by <span className="text-blue-400 font-semibold">Ram</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <p className="text-slate-500 text-xs">
              Powered by{" "}
              <span className="text-blue-400 font-semibold">Cyrus</span>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Loading;
