import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  // Helper to handle navigation and scroll to top
  const handleNavigation = (path) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    navigate(path);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Poppins', sans-serif; }
      `}</style>

      <footer className="bg-gradient-to-br from-slate-50 to-blue-50 py-16 px-6 md:px-16 lg:px-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-between gap-12 mb-12">
            {/* Brand Section */}
            <div className="flex flex-col gap-4 max-w-sm">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Cyrus
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Building the future of resume creation. Empowering professionals
                to showcase their best selves with innovative tools and designs.
              </p>
            </div>

            {/* Links Sections */}
            <div className="flex flex-wrap gap-12 lg:gap-16">
              {/* Product */}
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Product</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => handleNavigation("/")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Home
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Templates
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Pricing
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Features
                    </button>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Resources</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Blog
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Support
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      About
                    </button>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-slate-900 font-semibold mb-4">Legal</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleNavigation("/demo")}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      Terms of Service
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">
              © 2025 Cyrus Resume Builder. Built by Ram.
            </p>

            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/ram-sharma-7b8426316"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://x.com/Shekhar10276577"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
