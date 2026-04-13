import { formatVnd } from "@utils/formatVnd";
import { getMenuCategories } from "@services/homeApi";
import { ChevronDown, Menu, Moon, Phone, Search, ShoppingBag, Sun } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { CategoryMenu as CategoryMenuItem } from "../../types/home";
import { useCart } from "../../contexts/CartContext";
import { useSiteUiConfig } from "../../contexts/SiteUiConfigProvider";

/**
 * Header chung cho toàn bộ site:
 * - Thanh logo + ô tìm kiếm + hotline + nút giỏ hàng (hiển thị tổng số lượng và tổng tiền).
 * - Thanh navigation với nút DANH MỤC SẢN PHẨM và các trang tĩnh.
 */
const Header = () => {
    const ui = useSiteUiConfig();
    const { totalCount, totalAmount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const isHome = location.pathname === "/";

    const [searchQuery, setSearchQuery] = useState("");
    const [categoriesOpen, setCategoriesOpen] = useState(false);
    const [categories, setCategories] = useState<CategoryMenuItem[]>([]);
    const [isDark, setIsDark] = useState(
        document.documentElement.classList.contains("dark"),
    );

    useEffect(() => {
        // Không auto xổ menu danh mục khi vào trang; chỉ mở khi user chủ động bấm.
        setCategoriesOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getMenuCategories();
                setCategories(data);
            } catch {
                setCategories([]);
            }
        };
        void loadCategories();
    }, []);

    useEffect(() => {
        if (location.pathname === "/products") {
            const q = new URLSearchParams(location.search).get("q") ?? "";
            setSearchQuery(q);
        }
    }, [location.pathname, location.search]);

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        const v = searchQuery.trim();
        if (location.pathname === "/products") {
            const sp = new URLSearchParams(location.search);
            if (v) sp.set("q", v);
            else sp.delete("q");
            sp.set("page", "1");
            navigate({ pathname: "/products", search: sp.toString() });
        } else {
            navigate(v ? `/products?q=${encodeURIComponent(v)}` : "/products");
        }
    };

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
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {/* Top bar */}
            <div
                className={`border-b border-slate-100 dark:border-slate-700 ${
                    ui.headerBackground === "transparent"
                        ? "bg-slate-50 dark:bg-slate-800"
                        : ""
                }`}
                style={
                    ui.headerBackground !== "transparent"
                        ? { backgroundColor: ui.headerBackground }
                        : undefined
                }
            >
                <div className="mx-auto flex max-w-[1120px] items-center justify-between px-4 py-2">
                    <Link to="/" className="flex gap-2 items-center">
                        {ui.logoUrl ? (
                            <img
                                src={ui.logoUrl}
                                alt=""
                                className="h-10 w-auto max-w-[160px] object-contain"
                            />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--site-primary)] text-white">
                                <span className="font-bold">TH</span>
                            </div>
                        )}
                        <span className="hidden font-semibold text-slate-800 dark:text-slate-100 sm:inline">
                            Shop Cam
                        </span>
                    </Link>

                    <form
                        onSubmit={handleSearchSubmit}
                        className="relative mx-4 flex-1 max-w-xl"
                        role="search"
                    >
                        <input
                            type="search"
                            name="q"
                            placeholder={t("storefront.searchPlaceholder")}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-12 text-sm outline-none transition focus:border-[var(--site-primary)] focus:ring-1 focus:ring-[var(--site-primary)] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[var(--site-primary)] dark:text-slate-300 dark:hover:bg-slate-700"
                            aria-label={t("storefront.search")}
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="flex gap-4 items-center">
                        <a
                            href="tel:1900"
                            className="flex gap-2 items-center text-sm text-slate-700 hover:text-[var(--site-primary)] dark:text-slate-200"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                {t("storefront.hotline")}
                            </span>
                        </a>
                        <button
                            type="button"
                            onClick={toggleLanguage}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                            {i18n.language?.startsWith("vi") ? "EN" : "VI"}
                        </button>
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                            aria-label={t("storefront.toggleTheme")}
                        >
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                        <Link
                            to="/cart"
                            className="flex gap-2 items-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-[var(--site-primary)] hover:bg-slate-50 hover:text-[var(--site-primary)] dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>
                                {t("storefront.cart")} {totalCount > 0 ? `(${totalCount}) ` : ""}
                                {formatVnd(totalAmount)}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navbar: light mode nền trắng/chữ đen; dark mode nền tối/chữ trắng */}
            <nav className="w-full border-t border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white">
                <div className="mx-auto flex max-w-[1120px] flex-col sm:flex-row sm:items-stretch">
                    {(!isHome || (ui.homePage?.categoryLayout ?? "navbar") === "navbar") ? (
                        <CategoryMenu
                            open={categoriesOpen}
                            onOpenChange={setCategoriesOpen}
                            categories={categories}
                        />
                    ) : (
                        <div className="hidden sm:block sm:w-[220px]" aria-hidden />
                    )}
                    <div className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2 border-t border-slate-200 px-4 py-2.5 sm:border-t-0 sm:border-l sm:border-slate-200 sm:py-3 dark:border-white/10">
                        <Link
                            to="/gioi-thieu"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
                        >
                            {t("storefront.intro")}
                        </Link>
                        <Link
                            to="/products"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
                        >
                            {t("storefront.buyOnline")}
                        </Link>
                        <Link
                            to="/blog"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
                        >
                            Blog
                        </Link>
                        <Link
                            to="/guide"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
                        >
                            {t("storefront.techGuide")}
                        </Link>
                        <Link
                            to="/contact"
                            className="text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:text-white/90 dark:hover:text-white"
                        >
                            {t("storefront.contact")}
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

interface CategoryMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    categories: CategoryMenuItem[];
}

const CategoryMenu = ({ open, onOpenChange, categories }: CategoryMenuProps) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                onOpenChange(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onOpenChange]);

    return (
        <div
            ref={wrapperRef}
            className="relative z-[100] w-full shrink-0 sm:w-[280px]"
        >
            <button
                type="button"
                onClick={() => onOpenChange(!open)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100 sm:py-3.5 dark:text-white dark:hover:bg-white/10"
            >
                <span className="flex min-w-0 items-center gap-2">
                    <Menu className="h-5 w-5 shrink-0" aria-hidden />
                    <span className="truncate">{t("storefront.categoryMenu")}</span>
                </span>
                <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-600 transition-transform duration-200 dark:text-white/80 ${open ? "rotate-180" : ""}`}
                    aria-hidden
                />
            </button>

            {open && (
                <div
                    className="absolute left-0 right-0 top-full z-[100] px-0 pt-0 sm:left-0 sm:right-auto sm:min-w-[280px]"
                    role="presentation"
                >
                    <div className="max-h-[50vh] overflow-y-auto overflow-x-hidden border border-slate-200 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-900">
                        <ul className="py-1">
                            {categories.map((cat) => (
                                <li key={cat.id || cat.name}>
                                    <Link
                                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                                        className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5 text-sm text-slate-800 last:border-b-0 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                                        onClick={() => onOpenChange(false)}
                                    >
                                        <span className="truncate">{cat.name}</span>
                                        <span className="shrink-0 text-slate-400 dark:text-slate-500">›</span>
                                    </Link>
                                </li>
                            ))}
                            {categories.length === 0 && (
                                <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                                    {t("storefront.noCategories")}
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
