import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { CategoryMenu } from "../../types/home";

interface HomeCategorySidebarProps {
  categories: CategoryMenu[];
  className?: string;
}

/**
 * Trang chủ: cột danh mục cố định bên trái banner (giống layout TMĐT).
 * Responsive: ẩn dưới lg để tránh banner bị "đẩy" khi thu màn hình.
 */
const HomeCategorySidebar = ({
  categories,
  className = "",
}: HomeCategorySidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside
      className={`hidden min-h-[280px] min-w-0 flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex ${className}`}
    >
      <div className="flex shrink-0 items-center gap-2 bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white">
        <Menu className="h-5 w-5 shrink-0" aria-hidden />
        <span className="truncate">{t("storefront.categoryMenu")}</span>
      </div>
      <nav
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-1"
        aria-label={t("storefront.categoryMenu")}
      >
        <ul>
          {categories.map((cat) => (
            <li key={cat.id || cat.name}>
              <Link
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-800 last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <span className="truncate">{cat.name}</span>
                <span className="shrink-0 text-slate-400 dark:text-slate-500">
                  ›
                </span>
              </Link>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
              {t("storefront.noCategories")}
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default HomeCategorySidebar;

