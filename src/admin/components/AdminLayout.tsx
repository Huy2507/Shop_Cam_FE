import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Image,
  LayoutGrid,
  Megaphone,
  ReceiptText,
  Settings,
} from "lucide-react";

export default function AdminLayout() {
  const { t, i18n } = useTranslation(["admin", "sidebarandtopbar"]);
  const [isDark, setIsDark] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark"),
  );
  const [collapsed, setCollapsed] = useState(
    typeof window !== "undefined" && localStorage.getItem("adminSidebarCollapsed") === "true",
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

  const navItems = [
    { to: "/", end: true, label: t("sidebarandtopbar:sidebar.items.dashboard"), icon: LayoutGrid },
    { to: "/orders", label: t("admin:nav.orders"), icon: ReceiptText },
    { to: "/products", label: t("admin:nav.products"), icon: Boxes },
    { to: "/categories", label: t("admin:nav.categories"), icon: BarChart3 },
    { to: "/banners", label: t("admin:nav.banners"), icon: Image },
    { to: "/side-ads", label: "Quảng cáo 2 bên", icon: Megaphone },
    { to: "/settings", label: t("admin:nav.settings"), icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50">
      <aside className={`${collapsed ? "w-16" : "w-64"} border-r border-slate-800 bg-slate-900 transition-all`}>
        <div className="flex items-center justify-between px-3 py-4">
          {!collapsed && <div className="px-1 text-lg font-bold">Admin</div>}
          <button
            type="button"
            onClick={() => {
              const next = !collapsed;
              setCollapsed(next);
              localStorage.setItem("adminSidebarCollapsed", String(next));
            }}
            className="rounded p-1 text-slate-300 hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="space-y-1 px-2 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded px-3 py-2 ${
                    isActive ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            );
          })}
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

