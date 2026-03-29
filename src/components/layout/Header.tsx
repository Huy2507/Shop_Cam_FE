import { formatVnd } from "@utils/formatVnd";
import { Menu, Phone, Search, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { STOREFRONT_CATEGORY_NAMES_HEADER } from "@constants/storefrontCategories";
import { useCart } from "../../contexts/CartContext";

/**
 * Header chung cho toàn bộ site:
 * - Thanh logo + ô tìm kiếm + hotline + nút giỏ hàng (hiển thị tổng số lượng và tổng tiền).
 * - Thanh navigation với nút DANH MỤC SẢN PHẨM và các trang tĩnh.
 */
const Header = () => {
    const { totalCount, totalAmount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const isHome = location.pathname === "/";

    const [searchQuery, setSearchQuery] = useState("");
    const [categoriesOpen, setCategoriesOpen] = useState(isHome);

    useEffect(() => {
        // Trên màn hình Trang chủ, danh mục luôn mở mặc định khi load.
        setCategoriesOpen(isHome);
    }, [isHome]);

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

    return (
        <header className="relative sticky top-0 z-50 bg-white border-b shadow-sm border-slate-200">
            {/* Top bar */}
            <div className="border-b border-slate-100 bg-slate-50">
                <div className="flex justify-between items-center px-4 py-2 mx-auto max-w-7xl">
                    <Link to="/" className="flex gap-2 items-center">
                        <div className="flex justify-center items-center w-10 h-10 text-white bg-red-600 rounded-lg">
                            <span className="font-bold">TH</span>
                        </div>
                        <span className="hidden font-semibold text-slate-800 sm:inline">
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
                            placeholder="Bạn muốn tìm gì....."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-4 pr-12 text-sm outline-none transition focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            autoComplete="off"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            aria-label="Tìm kiếm"
                        >
                            <Search className="h-5 w-5" />
                        </button>
                    </form>

                    <div className="flex gap-4 items-center">
                        <a
                            href="tel:1900"
                            className="flex gap-2 items-center text-sm text-slate-700 hover:text-red-600"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Hotline mua hàng 1900
                            </span>
                        </a>
                        <Link
                            to="/cart"
                            className="flex gap-2 items-center px-3 py-2 text-sm font-medium rounded-lg border transition border-slate-200 text-slate-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span>
                                Giỏ hàng {totalCount > 0 ? `(${totalCount}) ` : ""}
                                {formatVnd(totalAmount)}
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="px-4 mx-auto max-w-7xl">
                <div className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
                    <CategoryMenu
                        isHome={isHome}
                        open={categoriesOpen}
                        onOpenChange={setCategoriesOpen}
                    />

                    <div className="flex gap-6">
                        <Link
                            to="/gioi-thieu"
                            className="text-sm font-medium text-slate-700 hover:text-red-600"
                        >
                            Giới thiệu
                        </Link>
                        <Link
                            to="/products"
                            className="text-sm font-medium text-slate-700 hover:text-red-600"
                        >
                            Mua hàng Online
                        </Link>
                        <Link
                            to="/blog"
                            className="text-sm font-medium text-slate-700 hover:text-red-600"
                        >
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
            </nav>
        </header>
    );
};

interface CategoryMenuProps {
    isHome: boolean;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const CategoryMenu = ({ isHome, open, onOpenChange }: CategoryMenuProps) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);

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
            className="inline-block relative"
            onMouseEnter={() => onOpenChange(true)}
            onMouseLeave={() => {
                if (!isHome) onOpenChange(false);
            }}
        >
            <button
                type="button"
                onClick={() => onOpenChange(!open)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
            >
                <Menu className="w-5 h-5" />
                <span>DANH MỤC SẢN PHẨM</span>
            </button>

            {/* Categories dropdown - độ rộng đúng theo nút */}
            {open && (
                <div className="absolute left-0 top-full z-50 w-full">
                    {/* Lấp khoảng giữa nút và panel — tránh chuột “lọt” ra ngoài và kích hoạt mouseleave */}
                    <div className="h-2 w-full" aria-hidden />
                    <div className="overflow-hidden rounded-b-lg border border-t-0 border-slate-200 bg-white shadow-lg">
                    <ul className="py-2">
                        {STOREFRONT_CATEGORY_NAMES_HEADER.map((cat) => (
                            <li key={cat}>
                                <Link
                                    to={`/products?category=${encodeURIComponent(cat)}`}
                                    className="flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600"
                                    onClick={() => onOpenChange(false)}
                                >
                                    {cat}
                                    <span className="text-slate-400">›</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
