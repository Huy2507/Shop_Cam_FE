import ChangePassword from "@features/Auth/pages/ChangePassword";
import ForgotPassword from "@features/Auth/pages/ForgotPassword";
import Login from "@features/Auth/pages/Login";
import VerifyOTP from "@features/Auth/pages/VerifyOTP";
import HomePage from "@features/home/pages/HomePage";
import Error403Page from "../pages/Error403Page";
import Error404Page from "../pages/Error404Page";

export const routeConfigs = [
  { path: "/", title: "Trang chủ", element: <HomePage /> },
  { path: "/login", title: "Đăng nhập", element: <Login />, isFullScreenPage: true },
  { path: "/forgot-password", title: "Quên mật khẩu", element: <ForgotPassword />, isFullScreenPage: true },
  { path: "/verify-otp", title: "Xác thực OTP", element: <VerifyOTP />, isFullScreenPage: true },
  { path: "/set-password", title: "Đặt mật khẩu mới", element: <ChangePassword />, isFullScreenPage: true },
  { path: "/unauthorized", title: "Truy cập bị từ chối", element: <Error403Page />, isFullScreenPage: true },
  { path: "*", title: "Không tìm thấy", element: <Error404Page />, isFullScreenPage: true },
];
