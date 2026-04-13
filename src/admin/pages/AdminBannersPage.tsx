import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { resolveMediaUrl } from "@utils/mediaUrl";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import { deleteAdminBanner, getAdminBannersPaged, type AdminBannerListItem } from "../services/adminApi";

export default function AdminBannersPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [isMain, setIsMain] = useState<string>("");
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminBannersPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
        isMain: isMain === "" ? undefined : isMain === "true",
      });
    },
    [isMain],
  );

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    submitSearch,
    data,
    loading,
    reload,
  } = useAdminPagedList<AdminBannerListItem>(load);


  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa banner này?")) return;
    try {
      await deleteAdminBanner(id);
      toast.success("Đã xóa.");
      void reload();
    } catch {
      toast.error("Xóa thất bại.");
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Banner trang chủ</h1>
        <button
          type="button"
          onClick={() => setAdvancedOpen((x) => !x)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Bộ lọc nâng cao
        </button>
        <Link
          to="/banners/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600"
        >
          + Thêm banner
        </Link>
      </div>

      <AdminListToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={submitSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        disabled={loading}
      />
      {advancedOpen && (
        <div className="rounded-lg border border-slate-800 p-3">
          <select value={isMain} onChange={(e) => setIsMain(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2">
            <option value="">Tất cả loại banner</option>
            <option value="true">Banner chính</option>
            <option value="false">Banner phụ</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">Ảnh</th>
              <th className="px-3 py-2 text-left text-slate-400">Tiêu đề</th>
              <th className="px-3 py-2 text-center text-slate-400">Chính</th>
              <th className="px-3 py-2 text-right text-slate-400">Thứ tự</th>
              <th className="px-3 py-2 text-right text-slate-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row) => (
                <tr key={row.homeBannerId}>
                  <td className="px-3 py-2">
                    <img
                      src={resolveMediaUrl(row.urlImg)}
                      alt=""
                      className="h-12 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="px-3 py-2">{row.title ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{row.isMain ? "✓" : ""}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.displayOrder}</td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/banners/${row.homeBannerId}/edit`} className="mr-2 text-sky-400 hover:underline">
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.homeBannerId)}
                      className="text-red-400 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && data && data.items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <AdminPaginationFooter
          page={page}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPage}
          disabled={loading}
        />
      )}

    </div>
  );
}
