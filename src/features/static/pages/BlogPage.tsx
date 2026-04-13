import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import NewsGrid from "@components/home/NewsGrid";
import {
  blogPageMainBg,
  NEWS_VISUAL_LABELS,
  NEWS_VISUAL_TEMPLATE_IDS,
  normalizeNewsVisualTemplate,
} from "@components/home/newsVisualSkins";
import type { NewsItem } from "../../../types/home";
import { getNews } from "@services/homeApi";
import { putNewsPagePreference } from "@services/userPreferencesApi";
import { useSiteUiConfig, useSiteUiConfigReload } from "@contexts/SiteUiConfigProvider";
import { useAuth } from "@hooks/useAuth";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import type { NewsPageLayout, NewsVisualTemplate } from "../../../types/siteUi";

const BlogPage = () => {
  const { t } = useTranslation();
  const ui = useSiteUiConfig();
  const reloadUi = useSiteUiConfigReload();
  const { isAuthenticated } = useAuth();
  const np = ui.newsPage;
  const [guestSkin, setGuestSkin] = useState<NewsVisualTemplate | null>(null);
  const visual =
    guestSkin ?? normalizeNewsVisualTemplate(np.visualTemplate);

  useEffect(() => {
    if (isAuthenticated) setGuestSkin(null);
  }, [isAuthenticated]);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingPref, setSavingPref] = useState(false);

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

  const applyLayout = async (layout: NewsPageLayout) => {
    if (!isAuthenticated) {
      toast.error("Đăng nhập để lưu giao diện riêng.");
      return;
    }
    setSavingPref(true);
    try {
      await putNewsPagePreference({ layout });
      await reloadUi();
      toast.success("Đã lưu giao diện trang tin.");
    } catch {
      toast.error("Không lưu được. Thử đăng nhập lại.");
    } finally {
      setSavingPref(false);
    }
  };

  const toggleFeatured = async () => {
    if (!isAuthenticated) {
      toast.error("Đăng nhập để lưu giao diện riêng.");
      return;
    }
    setSavingPref(true);
    try {
      await putNewsPagePreference({ showFeatured: !np.showFeatured });
      await reloadUi();
      toast.success("Đã cập nhật.");
    } catch {
      toast.error("Không lưu được.");
    } finally {
      setSavingPref(false);
    }
  };

  const setGridCols = async (gridColumns: 2 | 3 | 4) => {
    if (!isAuthenticated) {
      toast.error("Đăng nhập để lưu giao diện riêng.");
      return;
    }
    setSavingPref(true);
    try {
      await putNewsPagePreference({ gridColumns });
      await reloadUi();
      toast.success("Đã lưu số cột.");
    } catch {
      toast.error("Không lưu được.");
    } finally {
      setSavingPref(false);
    }
  };

  const pickVisualTemplate = async (tpl: NewsVisualTemplate) => {
    if (!isAuthenticated) {
      setGuestSkin(tpl);
      toast.success("Đang xem thử — đăng nhập và chọn lại để lưu theo tài khoản.");
      return;
    }
    setSavingPref(true);
    try {
      await putNewsPagePreference({ visualTemplate: tpl });
      await reloadUi();
      toast.success("Đã lưu kiểu giao diện.");
    } catch {
      toast.error("Không lưu được.");
    } finally {
      setSavingPref(false);
    }
  };

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
          {np.personalized ? (
            <p className="mt-2 text-xs text-amber-700">
              Bạn đang xem giao diện đã tùy chỉnh (đã lưu theo tài khoản).
            </p>
          ) : null}
        </header>

        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-slate-600 dark:text-slate-300">Kiểu giao diện (skin)</p>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {NEWS_VISUAL_TEMPLATE_IDS.map((id) => (
              <button
                key={id}
                type="button"
                disabled={savingPref}
                onClick={() => void pickVisualTemplate(id)}
                className={`flex flex-col rounded-xl border-2 p-3 text-left text-sm transition ${
                  visual === id
                    ? "border-[var(--site-primary,#dc2626)] bg-white shadow-md ring-1 ring-[var(--site-primary,#dc2626)]/20 dark:bg-slate-800"
                    : "border-slate-200 bg-white/90 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600"
                } disabled:opacity-50`}
              >
                <span className="font-semibold text-slate-800 dark:text-slate-100">{NEWS_VISUAL_LABELS[id].title}</span>
                <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{NEWS_VISUAL_LABELS[id].hint}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAuthenticated
              ? "Skin đã chọn được lưu theo tài khoản và áp trên mọi thiết bị khi đăng nhập."
              : "Chưa đăng nhập: đổi skin chỉ xem thử trên trình duyệt này — đăng nhập rồi chọn lại để lưu."}
          </p>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <span className="font-medium text-slate-600 dark:text-slate-300">Bố cục:</span>
          {(["magazine", "grid", "list"] as const).map((l) => (
            <button
              key={l}
              type="button"
              disabled={savingPref}
              onClick={() => void applyLayout(l)}
              className={`rounded-md px-2 py-1 ${
                np.layout === l
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              } disabled:opacity-50`}
            >
              {l === "magazine" ? "Tạp chí" : l === "grid" ? "Lưới" : "Danh sách"}
            </button>
          ))}
          {np.layout !== "list" ? (
            <>
              <span className="ml-2 hidden sm:inline text-slate-400 dark:text-slate-500">|</span>
              <button
                type="button"
                disabled={savingPref || np.layout !== "magazine"}
                onClick={() => void toggleFeatured()}
                className="rounded-md bg-slate-100 px-2 py-1 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                title="Chỉ áp dụng khi layout Tạp chí"
              >
                {np.showFeatured ? "Ẩn tin nổi bật" : "Bật tin nổi bật"}
              </button>
              <span className="text-slate-500 dark:text-slate-400">Cột:</span>
              {([2, 3, 4] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  disabled={savingPref || np.layout === "list"}
                  onClick={() => void setGridCols(c)}
                  className={`rounded-md px-2 py-1 ${
                    np.gridColumns === c
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  } disabled:opacity-40`}
                >
                  {c}
                </button>
              ))}
            </>
          ) : null}
          {!isAuthenticated ? (
            <span className="text-xs text-slate-500 dark:text-slate-400">(Đăng nhập để lưu lựa chọn)</span>
          ) : null}
        </div>

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
