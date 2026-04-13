type Props = {
  page: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (p: number) => void;
  disabled?: boolean;
};

export default function AdminPaginationFooter({
  page,
  totalPages,
  totalCount,
  onPageChange,
  disabled,
}: Props) {
  const max = Math.max(1, totalPages);
  const canPrev = page > 1;
  const canNext = page < max;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-4 text-sm text-slate-400">
      <span>Tổng {totalCount} bản ghi</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled || !canPrev}
          onClick={() => onPageChange(page - 1)}
          className="rounded border border-slate-600 px-3 py-1 text-slate-200 hover:bg-slate-800 disabled:opacity-40"
        >
          ← Trước
        </button>
        <span className="px-2 text-slate-300">
          Trang {page} / {max}
        </span>
        <button
          type="button"
          disabled={disabled || !canNext}
          onClick={() => onPageChange(page + 1)}
          className="rounded border border-slate-600 px-3 py-1 text-slate-200 hover:bg-slate-800 disabled:opacity-40"
        >
          Sau →
        </button>
      </div>
    </div>
  );
}
