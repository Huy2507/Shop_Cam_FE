import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const { t, i18n } = useTranslation(["admin", "sidebarandtopbar"]);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true";
    setIsDark(darkMode);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("darkMode", String(next));
  };

  const toggleLanguage = async () => {
    const next = i18n.language?.startsWith("vi") ? "en" : "vi";
    await i18n.changeLanguage(next);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className="w-64 border-r border-slate-800 bg-slate-900">
        <div className="px-4 py-4 text-lg font-bold">Admin</div>
        <nav className="space-y-1 px-2 text-sm">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("sidebarandtopbar:sidebar.items.dashboard")}
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("admin:nav.orders")}
          </NavLink>
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("admin:nav.products")}
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("admin:nav.categories")}
          </NavLink>
          <NavLink
            to="/banners"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("admin:nav.banners")}
          </NavLink>
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `block rounded px-3 py-2 ${
                isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            {t("admin:nav.settings")}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 bg-slate-950">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-3 text-sm text-slate-200">
          <span>{t("sidebarandtopbar:topbar.welcome")}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleLanguage}
              className="rounded-lg border border-slate-600 px-2 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
            >
              {i18n.language?.startsWith("vi") ? "EN" : "VI"}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-slate-600 px-2 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800"
            >
              {isDark ? t("admin:theme.light") : t("admin:theme.dark")}
            </button>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

