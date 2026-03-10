import Banner from "@components/home/Banner";
import NewsGrid from "@components/home/NewsGrid";
import ProductGrid from "@components/home/ProductGrid";
import PromoBanners from "@components/home/PromoBanners";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import {
  mockBanners,
  mockNews,
  mockProducts,
  mockPromoBanners,
} from "@mocks/homeMockData";
import { useState } from "react";

const HomePage = () => {
  const [productFilter, setProductFilter] = useState("best");

  const mainBanner = mockBanners[0] ?? null;
  const bestSellers = mockProducts;
  const newProducts = mockProducts.filter((p) => p.isNew).length > 0
    ? mockProducts.filter((p) => p.isNew)
    : mockProducts.slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Banner + Promo section */}
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_280px]">
          <Banner banner={mainBanner} className="min-h-[280px]" />
          <PromoBanners banners={mockPromoBanners} />
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
            products={bestSellers}
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
          <NewsGrid news={mockNews} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
