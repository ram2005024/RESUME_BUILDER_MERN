import { useState } from "react";

const Login = () => {
  // state can be: "login", "register", or "forgot"
  const [state, setState] = useState("login");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-[400px] bg-white border border-gray-200 rounded-2xl p-10 shadow-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Hey
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {state === "login" && "Welcome back, please sign in"}
            {state === "register" && "Create your account to start"}
            {state === "forgot" && "Reset your account password"}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          {/* Name Field (Register Only) */}
          {state === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Ram Sharma"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              />
            </div>
          )}

          {/* Email Field (All States) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="ram@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
            />
          </div>

          {/* Password Field (Login & Register Only) */}
          {state !== "forgot" && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  Password
                </label>
                {state === "login" && (
                  <button
                    type="button"
                    onClick={() => setState("forgot")}
                    className="text-[10px] font-bold text-gray-400 hover:text-black uppercase"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              />
            </div>
          )}

          {/* Main Action Button */}
          <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm mt-4 hover:bg-gray-800 transition-colors">
            {state === "login" && "Login"}
            {state === "register" && "Sign Up"}
            {state === "forgot" && "Send Reset Link"}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          {state === "forgot" ? (
            <button
              onClick={() => setState("login")}
              className="text-sm font-bold text-black hover:underline"
            >
              Back to Login
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              {state === "login"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <button
                onClick={() =>
                  setState(state === "login" ? "register" : "login")
                }
                className="text-black font-bold hover:underline ml-1"
              >
                {state === "login" ? "Register" : "Login"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
