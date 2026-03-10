import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import NewsGrid from "@components/home/NewsGrid";
import type { NewsItem } from "../../../types/home";
import { getNews } from "@services/homeApi";
import { useEffect, useState } from "react";

const BlogPage = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getNews();
        setNews(data);
      } catch {
        setError("Không tải được tin tức. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">Blog</h1>
        <p className="mb-4 text-sm text-slate-600">
          Tin tức / bài viết được lấy từ API backend.
        </p>
        {error && (
          <p className="mb-4 text-sm text-red-600">
            {error}
          </p>
        )}
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
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
        ) : (
          <NewsGrid news={news} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;

