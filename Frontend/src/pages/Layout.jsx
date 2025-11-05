import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/DashBoard/Nav";

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <Outlet />
    </div>
  );
};

export default Layout;
