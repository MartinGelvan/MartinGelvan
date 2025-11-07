import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx"; // 👈 importá el provider
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App /> {/* 👈 tu App ahora está dentro del contexto */}
    </AuthProvider>
  </React.StrictMode>
);
