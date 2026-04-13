import { useEffect, useState } from "react";
import { getAdminSummary, type AdminSummary } from "../services/adminApi";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const s = await getAdminSummary();
        if (!cancelled) setData(s);
      } catch {
        if (!cancelled) setError("Không tải được số liệu (kiểm tra đăng nhập / API).");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = data
    ? [
        { label: "Sản phẩm", value: data.productsCount },
        { label: "Đơn hàng", value: data.ordersCount },
        { label: "Người dùng", value: data.usersCount },
        { label: "Đánh giá", value: data.reviewsCount },
        { label: "Danh mục", value: data.categoriesCount },
        { label: "Tin tức", value: data.newsCount },
      ]
    : [];

  return (
    <div className="space-y-6 text-slate-100">
      <div>
        <h1 className="text-2xl font-bold">Tổng quan</h1>
        <p className="mt-1 text-sm text-slate-400">Số liệu tổng hợp theo thời gian thực.</p>
      </div>

      {error && (
        <p className="rounded-lg border border-amber-700/50 bg-amber-950/40 px-3 py-2 text-sm text-amber-200">
          {error}
        </p>
      )}

      {!data && !error && (
        <p className="text-sm text-slate-400">Đang tải…</p>
      )}

      {data && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 shadow-sm"
            >
              <p className="text-xs uppercase tracking-wide text-slate-500">{c.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
