import Banner from "@components/home/Banner";
import MidPromoGrid from "@components/home/MidPromoGrid";
import NewsGrid from "@components/home/NewsGrid";
import ProductGrid from "@components/home/ProductGrid";
import PromoBanners from "@components/home/PromoBanners";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import StorefrontWithSideAds from "@components/layout/StorefrontWithSideAds";
import type {
  Banner as BannerType,
  NewsItem,
  Product,
} from "../../../types/home";
import type { HomeSectionId } from "../../../types/siteUi";
import {
  getBanners,
  getNews,
  getNewProducts,
  getProducts,
  getPromoBanners,
} from "@services/homeApi";
import { useSiteUiConfig } from "@contexts/SiteUiConfigProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const HomePage = () => {
  const ui = useSiteUiConfig();
  const hp = ui.homePage;
  const { t } = useTranslation();
  const [productFilter, setProductFilter] = useState(hp.defaultProductTab);

  const [banners, setBanners] = useState<BannerType[]>([]);
  const [promoBanners, setPromoBanners] = useState<BannerType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setProductFilter(hp.defaultProductTab);
  }, [hp.defaultProductTab]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [b, pb, p, np, n] = await Promise.all([
          getBanners(),
          getPromoBanners(),
          getProducts(productFilter),
          getNewProducts(),
          getNews({ page: 1, pageSize: hp.homeNewsTake }),
        ]);
        if (cancelled) return;
        setBanners(b);
        setPromoBanners(pb);
        setProducts(p);
        setNewProducts(np);
        setNews(n.items);
      } catch {
        if (!cancelled) setError(t("common.storefront.errors.loadHome"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [productFilter, hp.homeNewsTake, t]);

  const renderSection = (sectionId: HomeSectionId) => {
    switch (sectionId) {
      case "bannerPromo": {
        if (!hp.showBannerBlock && !hp.showPromoSidebar) return null;
        const both = hp.showBannerBlock && hp.showPromoSidebar;
        return (
          <div
            key="bannerPromo"
            className={`mb-8 grid gap-4 ${both ? "lg:grid-cols-[1fr_260px]" : "lg:grid-cols-1"}`}
          >
            {hp.showBannerBlock ? (
              <Banner banners={banners} className="min-h-[300px]" />
            ) : null}
            {hp.showPromoSidebar ? <PromoBanners banners={promoBanners} /> : null}
          </div>
        );
      }
      case "midPromo": {
        if (!hp.showMidPromo) return null;
        const midItems =
          hp.midPromoCards.length > 0
            ? hp.midPromoCards.map((c, i) => ({
                id: `cfg-${i}`,
                title: (c.title ?? "").trim(),
                img: c.imageUrl,
                href: c.link?.trim() || undefined,
              }))
            : undefined;
        return <MidPromoGrid key="midPromo" items={midItems} />;
      }
      case "productTabs":
        if (!hp.showProductTabs) return null;
        return (
          <div key="productTabs" className="mb-12">
            <ProductGrid
              products={products}
              activeFilter={productFilter}
              onFilterChange={setProductFilter}
            />
          </div>
        );
      case "newArrivals":
        if (!hp.showNewArrivals) return null;
        {
          const naTitle =
            hp.newArrivalsTitle?.trim() || t("common.storefront.newCollection");
          return (
            <div key="newArrivals" className="mb-12">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-1 w-12 rounded-full bg-red-600" />
                <h2 className="text-lg font-bold uppercase text-red-600">{naTitle}</h2>
              </div>
              <ProductGrid products={newProducts} title="" />
            </div>
          );
        }
      case "news":
        if (!hp.showNews) return null;
        return (
          <div key="news" className="mb-12">
            <NewsGrid
              news={news}
              layout={ui.newsPage.layout}
              showFeatured={ui.newsPage.showFeatured}
              gridColumns={ui.newsPage.gridColumns}
              visualTemplate={ui.newsPage.visualTemplate}
              sectionTitle={ui.newsPage.pageTitle}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading && !banners.length && !products.length && !news.length) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        <Header />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6">
          <div className="mb-6 h-4 w-40 rounded bg-slate-200" />

          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_280px] animate-pulse">
            <div className="h-64 rounded-xl bg-slate-200" />
            <div className="space-y-3">
              <div className="h-20 rounded-lg bg-slate-200" />
              <div className="h-20 rounded-lg bg-slate-200" />
              <div className="h-20 rounded-lg bg-slate-200" />
            </div>
          </div>

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

  const order = hp.sectionOrder.filter((id): id is HomeSectionId =>
    ["bannerPromo", "midPromo", "productTabs", "newArrivals", "news"].includes(id),
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />

      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6">
        {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

        {ui.heroTagline ? (
          <p className="mb-4 text-center text-base font-medium text-[var(--site-primary)] dark:text-slate-200">
            {ui.heroTagline}
          </p>
        ) : null}

        <StorefrontWithSideAds
          leftAdLabel={t("common.storefront.adSlotLeft")}
          rightAdLabel={t("common.storefront.adSlotRight")}
        >
          {order.map((sid) => renderSection(sid))}
        </StorefrontWithSideAds>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
