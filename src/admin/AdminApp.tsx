import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminBannersPage from "./pages/AdminBannersPage";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminSideAdsPage from "./pages/AdminSideAdsPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import AdminCategoryFormPage from "./pages/AdminCategoryFormPage";
import AdminBannerFormPage from "./pages/AdminBannerFormPage";
import AdminSideAdFormPage from "./pages/AdminSideAdFormPage";
import AdminRequireAuth from "./routes/AdminRequireAuth";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      <Route
        path="/"
        element={
          <AdminRequireAuth>
            <AdminLayout />
          </AdminRequireAuth>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:orderId" element={<AdminOrderDetailPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="products/new" element={<AdminProductFormPage />} />
        <Route path="products/:productId/edit" element={<AdminProductFormPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="categories/new" element={<AdminCategoryFormPage />} />
        <Route path="categories/:categoryId/edit" element={<AdminCategoryFormPage />} />
        <Route path="banners" element={<AdminBannersPage />} />
        <Route path="banners/new" element={<AdminBannerFormPage />} />
        <Route path="banners/:bannerId/edit" element={<AdminBannerFormPage />} />
        <Route path="side-ads" element={<AdminSideAdsPage />} />
        <Route path="side-ads/new" element={<AdminSideAdFormPage />} />
        <Route path="side-ads/:sideAdId/edit" element={<AdminSideAdFormPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

