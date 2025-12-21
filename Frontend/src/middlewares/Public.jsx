import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import Loading from "../components/UI Components/Loading.jsx";
const Public = ({ children }) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const res = await axios.get(
          import.meta.env.VITE_API_URL + "auth/user/data",
          {
            withCredentials: true,
          }
        );
        if (res.data.userID) setAuthenticated(true);
      } catch (error) {
        setAuthenticated(false);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    checkAuthentication();
  }, []);
  if (loading) return <Loading />;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return children;
};

export default Public;
