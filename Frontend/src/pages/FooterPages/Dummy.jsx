import React from "react";

const DemoContent = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 min-h-screen py-20 px-6 animate-in fade-in duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-6 mb-12 rounded-lg shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <p className="text-yellow-800 font-semibold text-lg">
              This is a demo page - Content coming soon!
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Under Construction
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We're working hard to bring you amazing content. Stay tuned!
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-12 mb-12">
          <div className="text-center">
            <div className="text-8xl mb-6">🚧</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Coming Soon
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              This page is currently being developed. We're adding exciting
              features and content to make your experience better. Check back
              soon for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoContent;
