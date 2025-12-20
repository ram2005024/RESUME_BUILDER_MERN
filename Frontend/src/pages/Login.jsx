import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    setEmail("");
    setName("");
    setPassword("");
  }, [state]);
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (state === "register") {
      try {
        const res = await axios.post(
          import.meta.env.VITE_API_URL + "auth/user/register",
          {
            username: name,
            email,
            password,
          },
          {
            withCredentials: true,
          }
        );
        if (!res.data.success) {
          setMessage(res.data?.message);
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
          navigate("/app");
        }
      } catch (error) {
        console.log(error);
        setMessage(error.message);

        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

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
        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
          {/* Name Field (Register Only) */}
          {state === "register" && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-600 uppercase ml-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all text-sm"
              />
            </div>
          )}
          {message && (
            <div
              role="alert"
              className="mt-2 flex items-center gap-2 px-2.5 py-1.5 rounded-md 
               bg-red-50/50 border border-red-100 
               text-red-600 text-[11px] font-medium tracking-wide
               animate-in fade-in slide-in-from-top-1 duration-200"
            >
              {/* A tiny dot or icon adds a premium feel */}
              <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
              {message}
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
