import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import ProductCard from "@components/home/ProductCard";
import type { Product } from "../../../types/home";
import { getCatalog } from "@services/homeApi";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSearchParams } from "react-router-dom";

const PAGE_SIZE = 12;

type SortKey = "newest" | "price_asc" | "price_desc" | "name";

/**
 * Trang mua hàng online: catalog từ API (tìm kiếm, danh mục, tab bán chạy/hot/combo, sort, phân trang).
 */
const ProductsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const tab = searchParams.get("tab") ?? "best";
  const sort = (searchParams.get("sort") as SortKey | null) ?? "newest";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);

  const [items, setItems] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setParam = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === "" || v === null) next.delete(k);
        else next.set(k, String(v));
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getCatalog({
          q: q || undefined,
          category: category || undefined,
          tab: tab === "hot" || tab === "combo" ? tab : undefined,
          sort,
          page,
          pageSize: PAGE_SIZE,
        });
        setItems(res.items);
        setTotalPages(res.totalPages);
        setTotalCount(res.totalCount);
      } catch {
        setError(t("common.storefront.errors.loadProducts"));
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [q, category, tab, sort, page, t]);

  const titleParts: string[] = [];
  if (q) titleParts.push(t("common.storefront.searchFor", { q }));
  if (category) titleParts.push(category);
  if (!q && !category) {
    if (tab === "hot") titleParts.push(t("common.storefront.hotSale"));
    else if (tab === "combo") titleParts.push(t("common.storefront.comboCheap"));
    else titleParts.push(t("common.storefront.bestSeller"));
  }
  const pageTitle = titleParts.join(" · ") || t("common.storefront.products");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h1 className="mb-2 text-2xl font-bold text-slate-800">{t("common.storefront.buyOnline")}</h1>
        <p className="mb-4 text-sm text-slate-600">
          {totalCount > 0 ? (
            <>
              {t("common.storefront.found")} <strong>{totalCount}</strong> {t("common.storefront.products")}
              {category && (
                <>
                  {" "}
                  {t("common.storefront.inCategory")} <strong>{category}</strong>
                </>
              )}
            </>
          ) : (
            t("common.storefront.exploreText")
          )}
        </p>

        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "best", label: t("common.storefront.bestSeller") },
                { id: "hot", label: t("common.storefront.hotSale") },
                { id: "combo", label: t("common.storefront.comboCheap") },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setParam({ tab: t.id, page: 1 });
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === t.id
                    ? "bg-red-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-sm text-slate-600">{t("common.storefront.sort")}</label>
            <select
              value={sort}
              onChange={(e) => {
                setParam({ sort: e.target.value as SortKey, page: 1 });
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500"
            >
              <option value="newest">{t("common.storefront.sortNewest")}</option>
              <option value="price_asc">{t("common.storefront.sortPriceAsc")}</option>
              <option value="price_desc">{t("common.storefront.sortPriceDesc")}</option>
              <option value="name">{t("common.storefront.sortName")}</option>
            </select>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {isLoading ? (
          <div className="grid animate-pulse gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="rounded-xl bg-white p-3 shadow-sm">
                <div className="mb-3 aspect-square rounded-lg bg-slate-200" />
                <div className="mb-2 h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-4 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-slate-600">
            <p className="mb-4">{t("common.storefront.noProductMatched")}</p>
            <Link to="/products" className="text-red-600 underline">
              {t("common.storefront.viewAllProducts")}
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm font-medium text-slate-700">{pageTitle}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setParam({ page: page - 1 })}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  {t("common.storefront.previous")}
                </button>
                <span className="flex items-center px-2 text-sm text-slate-600">
                  {t("common.storefront.page")} {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setParam({ page: page + 1 })}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  {t("common.storefront.next")}
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductsPage;
