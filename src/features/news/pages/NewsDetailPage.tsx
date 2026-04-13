import BreadcrumbNav from "@components/layout/BreadcrumbNav";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { getNewsById } from "@services/homeApi";
import { resolveMediaUrl } from "@utils/mediaUrl";
import type { NewsDetail } from "../../../types/home";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

export default function NewsDetailPage() {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(t("storefront.missingNewsId"));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewsById(id);
        if (!cancelled) setDetail(data);
      } catch {
        if (!cancelled) setError(t("storefront.errors.loadNewsDetail"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const breadcrumbItems = useMemo(
    () =>
      detail
        ? [
            { label: t("storefront.home"), to: "/" },
            { label: "Blog", to: "/blog" },
            { label: detail.title },
          ]
        : [
            { label: t("storefront.home"), to: "/" },
            { label: "Blog", to: "/blog" },
          ],
    [detail, t],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <BreadcrumbNav items={breadcrumbItems} />

        {loading && (
          <div className="animate-pulse space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="h-8 w-3/4 rounded bg-slate-200" />
            <div className="aspect-video rounded-lg bg-slate-200" />
            <div className="h-4 w-full rounded bg-slate-200" />
            <div className="h-4 w-5/6 rounded bg-slate-200" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && detail && (
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img src={resolveMediaUrl(detail.imageUrl)} alt="" className="h-full w-full object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">{detail.title}</h1>
              {detail.publishedAt && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {new Date(detail.publishedAt).toLocaleDateString(
                    i18n.language?.startsWith("vi") ? "vi-VN" : "en-US",
                    {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    },
                  )}
                </p>
              )}
              {detail.excerpt && (
                <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">{detail.excerpt}</p>
              )}
              <div className="prose prose-slate mt-6 max-w-none">
                <div className="whitespace-pre-wrap text-base leading-relaxed text-slate-700 dark:text-slate-300">
                  {detail.body?.trim() || t("storefront.newsContentUpdating")}
                </div>
              </div>
              <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-700">
                <Link
                  to="/blog"
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                >
                  {t("storefront.backToNews")}
                </Link>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
