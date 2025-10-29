import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Build from "./pages/Build.jsx";
import View from "./pages/View.jsx";
import Login from "./pages/login.jsx";
const App = () => {
  const route = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/app",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <DashBoard />,
        },
        {
          path: "build/:id",
          element: <Build />,
        },
      ],
    },
    {
      path: "/view/:id",
      element: <View />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ]);
  return (
    <div>
      {" "}
      <RouterProvider router={route} />
    </div>
  );
};

export default App;
