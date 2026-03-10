import { Routes, Route } from "react-router-dom";
import ChangePassword from "@features/Auth/pages/ChangePassword";
import ForgotPassword from "@features/Auth/pages/ForgotPassword";
import Login from "@features/Auth/pages/Login";
import VerifyOTP from "@features/Auth/pages/VerifyOTP";
import HomePage from "@features/home/pages/HomePage";
import Error403Page from "./pages/Error403Page";
import Error404Page from "./pages/Error404Page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/set-password" element={<ChangePassword />} />
      <Route path="/unauthorized" element={<Error403Page />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default App;
