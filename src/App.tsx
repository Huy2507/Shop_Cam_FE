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
import BuyGuidePage from "@features/static/pages/BuyGuidePage";
import ContactPage from "@features/static/pages/ContactPage";
import PolicyPage from "@features/static/pages/PolicyPage";
import OrderSuccessPage from "@features/static/pages/OrderSuccessPage";
import AgentFranchisePage from "@features/static/pages/AgentFranchisePage";
import CartPage from "@features/cart/pages/CartPage";
import ProductDetailPage from "@features/product/pages/ProductDetailPage";
import NewsDetailPage from "@features/news/pages/NewsDetailPage";
import AddToCartModal from "@components/cart/AddToCartModal";
import ZaloChatWidget from "@components/layout/ZaloChatWidget";
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
        <Route path="/san-pham/:productId" element={<ProductDetailPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/tin-tuc/:id" element={<NewsDetailPage />} />
        <Route path="/guide" element={<TechGuidePage />} />
        <Route path="/guide/buy" element={<BuyGuidePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy/:slug" element={<PolicyPage />} />
        <Route path="/dat-hang-thanh-cong" element={<OrderSuccessPage />} />
        <Route path="/agent" element={<AgentFranchisePage />} />
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
    <ZaloChatWidget />
    </>
  );
}

export default App;
