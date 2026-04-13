import { ADMIN_PAGE_SIZES } from "../types/paged";

type Props = {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  onSearchSubmit: () => void;
  pageSize: number;
  onPageSizeChange: (n: number) => void;
  disabled?: boolean;
};

/**
 * Thanh tìm kiếm + chọn page size (mỗi lần đổi size gọi lại API qua hook).
 */
export default function AdminListToolbar({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  pageSize,
  onPageSizeChange,
  disabled,
}: Props) {
  return (
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <form
        className="flex flex-1 flex-wrap gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit();
        }}
      >
        <input
          type="search"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          placeholder="Tìm kiếm…"
          disabled={disabled}
          className="min-w-[200px] flex-1 rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800 disabled:opacity-50"
        >
          Tìm
        </button>
      </form>
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <span className="whitespace-nowrap">Hiển thị</span>
        <select
          value={pageSize}
          disabled={disabled}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded border border-slate-600 bg-slate-900 px-2 py-2 text-slate-100"
        >
          {ADMIN_PAGE_SIZES.map((n) => (
            <option key={n} value={n}>
              {n} / trang
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
