import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import NewsGrid from "@components/home/NewsGrid";
import {
  blogPageMainBg,
  normalizeNewsVisualTemplate,
} from "@components/home/newsVisualSkins";
import type { NewsItem } from "../../../types/home";
import { getNews } from "@services/homeApi";
import { useSiteUiConfig } from "@contexts/SiteUiConfigProvider";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
 

const BlogPage = () => {
  const { t } = useTranslation();
  const ui = useSiteUiConfig();
  const np = ui.newsPage;
  const visual = normalizeNewsVisualTemplate(np.visualTemplate);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPage(1);
  }, [np.pageSize]);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getNews({ page, pageSize: np.pageSize });
        setNews(data.items);
        setTotalPages(Math.max(1, data.totalPages));
      } catch {
        setError(t("storefront.errors.loadNews"));
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, [page, np.pageSize, t]);

  return (
    <div className={`flex min-h-screen flex-col ${blogPageMainBg(visual)}`}>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <header className="mb-6">
          <h1
            className={`text-2xl font-bold text-slate-800 dark:text-slate-100 ${
              visual === "editorial" ? "font-serif tracking-tight" : ""
            }`}
          >
            {np.pageTitle}
          </h1>
          {np.pageSubtitle ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{np.pageSubtitle}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t("storefront.blogFromApi")}</p>
          )}
        </header>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col rounded-xl bg-white p-3 shadow-sm dark:bg-slate-900">
                <div className="mb-3 h-24 rounded-lg bg-slate-200" />
                <div className="mb-2 h-4 w-5/6 rounded bg-slate-200" />
                <div className="h-4 w-2/3 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <NewsGrid
              news={news}
              layout={np.layout}
              showFeatured={np.showFeatured}
              gridColumns={np.gridColumns}
              visualTemplate={visual}
              sectionTitle={np.pageTitle}
            />
            {totalPages > 1 ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  Trước
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Trang {page} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm disabled:opacity-40 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  Sau
                </button>
              </div>
            ) : null}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
