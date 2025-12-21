import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ToastContainer
      position="top-center"
      autoClose={1500}
      pauseOnHover={false}
      theme="colored"
      closeButton={false}
    />

    <App />
  </StrictMode>
);
