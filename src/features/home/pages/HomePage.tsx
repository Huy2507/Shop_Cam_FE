import Banner from "@components/home/Banner";
import NewsGrid from "@components/home/NewsGrid";
import ProductGrid from "@components/home/ProductGrid";
import PromoBanners from "@components/home/PromoBanners";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import type {
  Banner as BannerType,
  NewsItem,
  Product,
} from "../../../types/home";
import {
  getBanners,
  getNews,
  getNewProducts,
  getProducts,
  getPromoBanners,
} from "@services/homeApi";
import { useEffect, useState } from "react";

const HomePage = () => {
  const [productFilter, setProductFilter] = useState("best");

  const [banners, setBanners] = useState<BannerType[]>([]);
  const [promoBanners, setPromoBanners] = useState<BannerType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load toàn bộ dữ liệu trang chủ lần đầu.
  // Nếu BE lỗi, ta hiển thị skeleton + thông báo lỗi nhỏ phía trên.
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [b, pb, p, np, n] = await Promise.all([
          getBanners(),
          getPromoBanners(),
          getProducts(productFilter),
          getNewProducts(),
          getNews(),
        ]);
        setBanners(b);
        setPromoBanners(pb);
        setProducts(p);
        setNewProducts(np);
        setNews(n);
      } catch {
        setError("Không tải được dữ liệu trang chủ. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload danh sách sản phẩm khi đổi filter, vẫn giữ lại dữ liệu cũ để tránh giật layout.
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts(productFilter);
        setProducts(data);
      } catch {
        setError("Không tải được danh sách sản phẩm. Vui lòng thử lại sau.");
      }
    };
    loadProducts();
  }, [productFilter]);

  // Skeleton giống Youtube: khung xám khi đang loading / BE lỗi.
  if (isLoading && !banners.length && !products.length && !news.length) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
          <div className="mb-6 h-4 w-40 rounded bg-slate-200" />

          {/* Banner + promo skeleton */}
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_280px] animate-pulse">
            <div className="h-64 rounded-xl bg-slate-200" />
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-slate-200" />
              <div className="h-20 rounded-lg bg-slate-200" />
              <div className="h-20 rounded-lg bg-slate-200" />
            </div>
          </div>

          {/* Product list skeleton */}
          <div className="mb-12">
            <div className="mb-4 h-6 w-48 rounded bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-xl bg-white p-3 shadow-sm"
                >
                  <div className="mb-3 h-32 rounded-lg bg-slate-200" />
                  <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                  <div className="mb-1 h-4 w-1/2 rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>

          {/* News skeleton */}
          <div className="mb-12">
            <div className="mb-4 h-6 w-40 rounded bg-slate-200" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col rounded-xl bg-white p-3 shadow-sm"
                >
                  <div className="mb-3 h-24 rounded-lg bg-slate-200" />
                  <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Banner + Promo section */}
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_280px]">
          <Banner banner={banners[0] ?? null} className="min-h-[280px]" />
          <PromoBanners banners={promoBanners} />
        </div>

        {/* Mid promotional banners (Apple, etc.) */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              id: "m1",
              title: "Apple Chính Hãng ƯU ĐÃI NGẬP TRÀN",
              img: "https://picsum.photos/400/150?random=apple1",
            },
            {
              id: "m2",
              title: "Apple Chính Hãng ƯU ĐÃI NGẬP TRÀN",
              img: "https://picsum.photos/400/150?random=apple2",
            },
            {
              id: "m3",
              title: "QUÀ TẶNG TRAO TAY 18/05 - 17/07/2022",
              img: "https://picsum.photos/400/150?random=gift",
            },
          ].map((b) => (
            <a
              key={b.id}
              href="#"
              className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[4/1.5] overflow-hidden">
                <img
                  src={b.img}
                  alt={b.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <p className="text-center text-sm font-semibold text-white">
                    {b.title}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Product list - Bán chạy nhất / Hot Sale / Combo */}
        <div className="mb-12">
          <ProductGrid
            products={products}
            activeFilter={productFilter}
            onFilterChange={setProductFilter}
          />
        </div>

        {/* Bộ sưu tập mới */}
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-1 w-12 rounded-full bg-red-600" />
            <h2 className="text-lg font-bold uppercase text-red-600">
              Bộ sưu tập mới
            </h2>
          </div>
          <ProductGrid products={newProducts} title="" />
        </div>

        {/* News */}
        <div className="mb-12">
          <NewsGrid news={news} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
