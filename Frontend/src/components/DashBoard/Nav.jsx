import axios from "axios";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const Nav = () => {
  const navigate = useNavigate();
  const [username, setUserName] = useState("user");
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "auth/user/data",
          {
            withCredentials: true,
          }
        );
        setUserName(res.data.userName);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUser();
  }, []);
  const handleLogout = async () => {
    const res = await axios.get(
      import.meta.env.VITE_API_URL + "auth/user/logout",
      {
        withCredentials: true,
      }
    );
    if (!res.data.success) return toast.error(res.data.message);
    navigate("/login");
    return toast.success(res.data.message);
  };

  return (
    <div className="w-screen   border border-gray-200">
      <nav className="w-full flex justify-between items-center py-4 px-2 max-w-7xl mx-auto">
        <img src="/logo.svg" alt="logo" onClick={() => navigate("/")} />
        <div className="flex gap-4 items-center">
          <p className="text-sm text-slate-600 ">{username}</p>
          <button
            className="px-8 py-2 hover:bg-slate-100 border rounded-3xl"
            onClick={() => handleLogout()}
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
