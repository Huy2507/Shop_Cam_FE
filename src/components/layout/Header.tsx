import { Menu, Phone, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm relative">
      {/* Top bar */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white">
              <span className="font-bold">TH</span>
            </div>
            <span className="hidden font-semibold text-slate-800 sm:inline">Shop Cam</span>
          </Link>

          <div className="relative flex-1 max-w-xl mx-4">
            <input
              type="text"
              placeholder="Bạn muốn tìm gì....."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-12 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
            />
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:1900"
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-red-600"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Hotline mua hàng 1900</span>
            </a>
            <Link
              to="/cart"
              className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <ShoppingBag className="h-5 w-5" />
              <span>Giỏ hàng 0đ</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-6 py-3">
          <button
            type="button"
            onClick={() => setCategoriesOpen(!categoriesOpen)}
            className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            <Menu className="h-5 w-5" />
            <span>DANH MỤC SẢN PHẨM</span>
          </button>
          <div className="flex gap-6">
            <Link
              to="/products"
              className="text-sm font-medium text-slate-700 hover:text-red-600"
            >
              Mua hàng Online
            </Link>
            <Link to="/blog" className="text-sm font-medium text-slate-700 hover:text-red-600">
              Blog
            </Link>
            <Link
              to="/guide"
              className="text-sm font-medium text-slate-700 hover:text-red-600"
            >
              Hướng Dẫn Kỹ thuật
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium text-slate-700 hover:text-red-600"
            >
              Liên hệ
            </Link>
          </div>
        </div>

        {/* Categories dropdown */}
        {categoriesOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mx-auto mt-0 max-w-7xl rounded-b-lg border border-t-0 border-slate-200 bg-white shadow-lg">
            <ul className="py-2">
              {[
                "Đầu ghi Camera",
                "Phụ Kiện Camera",
                "Thiết bị chống trộm",
                "Máy Chấm Công",
                "Thiết Bị Mạng",
                "Thiết Bị Gia Đình",
                "Camera Yoosee",
                "Trọn Bộ Camera Hikvision IP",
                "Trọn Bộ Camera Hikvision HDTVI",
              ].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {cat}
                    <span className="text-slate-400">›</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
