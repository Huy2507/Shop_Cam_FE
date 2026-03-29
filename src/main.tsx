import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { initZaloOfficialChatWidget } from "./bootstrap/zaloChat";
import App from "./App";
import { AuthProvider } from "./contexts/AuthProvider";
import { CartProvider } from "./contexts/CartContext";
import "./i18n/i18n";
import "./index.css";

initZaloOfficialChatWidget();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster position="top-center" toastOptions={{ duration: 3500 }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
