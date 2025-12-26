import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Layout from "./pages/Layout.jsx";
import DashBoard from "./pages/DashBoard.jsx";
import Build from "./pages/Build.jsx";
import View from "./pages/View.jsx";
import Login from "./pages/Login.jsx";
import Protected from "./middlewares/Protected.jsx";
import Public from "./middlewares/Public.jsx";
import DemoContent from "./pages/FooterPages/Dummy.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const App = () => {
  const route = createBrowserRouter([
    {
      path: "/",
      element: (
        <Public>
          <Home />
        </Public>
      ),
    },
    {
      path: "/app",
      element: (
        <UserProvider>
          <Protected>
            <Layout />
          </Protected>
        </UserProvider>
      ),
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
      path: "/view/:resumeId",
      element: (
        <UserProvider>
          <Protected>
            <View />
          </Protected>
        </UserProvider>
      ),
    },
    {
      path: "/login",
      element: (
        <Public>
          <Login />
        </Public>
      ),
    },
    {
      path: "/demo",
      element: <DemoContent />,
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
