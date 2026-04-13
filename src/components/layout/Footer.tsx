import { STOREFRONT_CATEGORY_NAMES_FOOTER } from "@constants/storefrontCategories";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
      {/* Service info band */}
      <div className="border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-8 px-4 py-6">
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
              <span className="text-lg">✓</span>
            </div>
            <div>
              <p className="font-medium">Bảo Hành</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">028.3950 5060 (8h30 - 21h00)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
              <span className="text-lg">📋</span>
            </div>
            <div>
              <p className="font-medium">Hỗ trợ</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">028.3950 5060 (8h30 - 21h00)</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30">
              <span className="text-lg">✉</span>
            </div>
            <div>
              <p className="font-medium">Liên hệ</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">028.3950 5060 (8h30 - 21h00)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Contact */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
              <MapPin className="h-4 w-4 text-red-600" />
              Thông tin liên hệ Camera
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>Trụ Sở TPHCM: Tân Bình TPHCM</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>Chi Nhánh Đà Nẵng: Toà Nhà, Đường Morisson, Sơn Trà, Đà Nẵng</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                <span>Chi Nhánh Hà Nội: Trần Cung, Cầu Giấy, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
              Chính sách & Hướng dẫn
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/agent" className="hover:text-red-600">
                  Đại Lý - Nhượng Quyền
                </Link>
              </li>
              <li>
                <Link to="/guide/buy" className="hover:text-red-600">
                  Hướng dẫn mua hàng
                </Link>
              </li>
              <li>
                <Link to="/policy/delivery" className="hover:text-red-600">
                  Chính sách giao hàng
                </Link>
              </li>
              <li>
                <Link to="/policy/warranty" className="hover:text-red-600">
                  Quy định bảo hành
                </Link>
              </li>
              <li>
                <Link to="/policy/return" className="hover:text-red-600">
                  Chính sách đổi trả
                </Link>
              </li>
              <li>
                <Link to="/policy/payment" className="hover:text-red-600">
                  Phương thức thanh toán
                </Link>
              </li>
              <li>
                <Link to="/policy/privacy" className="hover:text-red-600">
                  Chính sách bảo mật thông tin
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product categories — đồng bộ với danh mục header */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
              Sản phẩm
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <Link to="/products?tab=hot" className="hover:text-red-600">
                  Khuyến mãi / giảm giá
                </Link>
              </li>
              <li>
                <Link to="/products?tab=combo" className="hover:text-red-600">
                  Combo trọn bộ
                </Link>
              </li>
              {STOREFRONT_CATEGORY_NAMES_FOOTER.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="hover:text-red-600"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact numbers */}
          <div>
            <h3 className="mb-4 font-bold uppercase tracking-wide text-slate-800 dark:text-slate-100">
              Liên hệ
            </h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>
                <p className="text-slate-500 dark:text-slate-400">Gọi tư vấn camera</p>
                <a href="tel:0999999999" className="font-semibold text-red-600 hover:underline">
                  0999999999
                </a>
                <span className="text-slate-500 dark:text-slate-400"> (08:00-17:00)</span>
              </li>
              <li>
                <p className="text-slate-500 dark:text-slate-400">Bảo hành - Hỗ trợ kỹ thuật</p>
                <a href="tel:0999999999" className="font-semibold text-red-600 hover:underline">
                  0999999999
                </a>
                <span className="text-slate-500 dark:text-slate-400"> (08:00-17:00)</span>
              </li>
              <li>
                <p className="text-slate-500 dark:text-slate-400">Góp Ý - Phản Ánh Dịch Vụ</p>
                <a href="tel:0999999999" className="font-semibold text-red-600 hover:underline">
                  0999999999
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
          © {new Date().getFullYear()} Shop Cam. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
