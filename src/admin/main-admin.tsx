import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "../i18n/i18n";
import "../index.css";
import AdminApp from "./AdminApp";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter basename="/admin">
      <AdminApp />
      <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
    </BrowserRouter>
  </React.StrictMode>,
);

