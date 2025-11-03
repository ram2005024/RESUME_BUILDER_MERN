import React from "react";
import { useNavigate } from "react-router-dom";
const Nav = () => {
  const user = { name: "Shekhar" };
  const navigate = useNavigate();
  return (
    <div className="w-screen   border border-gray-200">
      <nav className="w-full flex justify-between items-center py-4 px-2 max-w-7xl mx-auto">
        <img src="/logo.svg" alt="logo" onClick={() => navigate("/")} />
        <div className="flex gap-4 items-center">
          <p className="text-sm text-slate-600 ">{user.name}</p>
          <button className="px-8 py-2 hover:bg-slate-100 border rounded-3xl">
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
