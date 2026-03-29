import {
  createProductReview,
  getProductReviews,
  type CreateProductReviewPayload,
} from "@services/homeApi";
import type { ProductReview } from "../../types/home";
import { isAxiosError } from "axios";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import toast from "react-hot-toast";

function StarsDisplay({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const n = Math.round(Math.min(5, Math.max(1, rating)));
  const cls = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${cls} ${i < n ? "fill-current" : "fill-none stroke-current opacity-35"}`}
        />
      ))}
    </span>
  );
}

type ProductReviewsSectionProps = {
  productId: string;
};

/**
 * Đánh giá & bình luận PDP: điểm TB, danh sách phân trang, form gửi (khách không đăng nhập).
 */
export default function ProductReviewsSection({ productId }: ProductReviewsSectionProps) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ProductReview[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);

  const [authorName, setAuthorName] = useState("");
  const [ratingPick, setRatingPick] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProductReviews(productId, { page, pageSize });
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setAverageRating(data.averageRating);
    } catch {
      toast.error("Không tải được đánh giá.");
      setItems([]);
      setTotalCount(0);
      setTotalPages(0);
      setAverageRating(null);
    } finally {
      setLoading(false);
    }
  }, [productId, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = authorName.trim();
    const text = comment.trim();
    if (name.length < 1) {
      toast.error("Nhập tên hoặc biệt danh.");
      return;
    }
    if (text.length < 1) {
      toast.error("Nhập nội dung đánh giá.");
      return;
    }
    const payload: CreateProductReviewPayload = {
      authorName: name,
      rating: ratingPick,
      comment: text,
    };
    setSubmitting(true);
    try {
      await createProductReview(productId, payload);
      toast.success("Cảm ơn bạn đã đánh giá!");
      setAuthorName("");
      setComment("");
      setRatingPick(5);
      setPage(1);
      const data = await getProductReviews(productId, { page: 1, pageSize });
      setItems(data.items);
      setTotalCount(data.totalCount);
      setTotalPages(data.totalPages);
      setAverageRating(data.averageRating);
    } catch (err) {
      const msg = isAxiosError(err)
        ? (err.response?.data as { errors?: string[] })?.errors?.[0] ??
          (err.response?.data as { message?: string })?.message
        : null;
      toast.error(msg || "Gửi đánh giá thất bại.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-800">Đánh giá sản phẩm</h2>
        {!loading && totalCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="font-medium text-slate-800">
              {averageRating != null ? averageRating.toFixed(1) : "—"}
            </span>
            <StarsDisplay rating={averageRating ?? 0} />
            <span className="text-slate-500">({totalCount} đánh giá)</span>
          </div>
        )}
      </div>

      <div className="mb-8 rounded-lg border border-slate-100 bg-slate-50/80 p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Viết đánh giá</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Tên hiển thị</label>
            <input
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              maxLength={100}
              className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="Ví dụ: Nguyễn Văn A"
            />
          </div>
          <div>
            <span className="mb-1 block text-xs font-medium text-slate-600">Số sao</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRatingPick(n)}
                  className="rounded p-0.5 text-amber-500 transition hover:scale-110"
                  aria-label={`${n} sao`}
                >
                  <Star
                    className={`h-7 w-7 ${n <= ratingPick ? "fill-current" : "fill-none stroke-current opacity-30"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Nội dung</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={2000}
              rows={4}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="Chia sẻ trải nghiệm về sản phẩm..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 rounded-lg bg-slate-100" />
          <div className="h-16 rounded-lg bg-slate-100" />
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-slate-500">Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
      ) : (
        <ul className="space-y-4">
          {items.map((r) => (
            <li
              key={r.id}
              className="border-b border-slate-100 pb-4 last:border-0 last:pb-0"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-slate-800">{r.authorName}</span>
                <StarsDisplay rating={r.rating} size="sm" />
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{r.comment}</p>
              <p className="mt-1 text-xs text-slate-400">
                {dayjs(r.createdAt).format("DD/MM/YYYY HH:mm")}
              </p>
            </li>
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-slate-600">
            Trang {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </section>
  );
}
