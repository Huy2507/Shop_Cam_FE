import { Routes, Route } from "react-router-dom";
import ChangePassword from "@features/Auth/pages/ChangePassword";
import ForgotPassword from "@features/Auth/pages/ForgotPassword";
import Login from "@features/Auth/pages/Login";
import VerifyOTP from "@features/Auth/pages/VerifyOTP";
import HomePage from "@features/home/pages/HomePage";
import IntroPage from "@features/static/pages/IntroPage";
import ProductsPage from "@features/static/pages/ProductsPage";
import BlogPage from "@features/static/pages/BlogPage";
import TechGuidePage from "@features/static/pages/TechGuidePage";
import ContactPage from "@features/static/pages/ContactPage";
import CartPage from "@features/cart/pages/CartPage";
import AddToCartModal from "@components/cart/AddToCartModal";
import Error403Page from "./pages/Error403Page";
import Error404Page from "./pages/Error404Page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Navigation bar pages */}
        <Route path="/gioi-thieu" element={<IntroPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/guide" element={<TechGuidePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<CartPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/set-password" element={<ChangePassword />} />

      <Route path="/unauthorized" element={<Error403Page />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
    <AddToCartModal />
    </>
  );
}

export default App;
