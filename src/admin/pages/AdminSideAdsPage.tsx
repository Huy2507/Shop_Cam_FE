import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import { deleteAdminSideAd, getAdminSideAdsPaged, type AdminSideAdListItem } from "../services/adminApi";
import { resolveMediaUrl } from "@utils/mediaUrl";

export default function AdminSideAdsPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [position, setPosition] = useState<"" | "left" | "right">("");
  const [isActive, setIsActive] = useState<string>("");
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) =>
      getAdminSideAdsPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
        position: position || undefined,
        isActive: isActive === "" ? undefined : isActive === "true",
      }),
    [position, isActive],
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
  } = useAdminPagedList<AdminSideAdListItem>(load);

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quảng cáo hai bên</h1>
        <button
          type="button"
          onClick={() => setAdvancedOpen((x) => !x)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Bộ lọc nâng cao
        </button>
        <Link
          to="/side-ads/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600"
        >
          + Thêm ads
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
        <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-800 p-3 md:grid-cols-2">
          <select value={position} onChange={(e) => setPosition(e.target.value as "" | "left" | "right")} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Vị trí: tất cả</option><option value="left">left</option><option value="right">right</option></select>
          <select value={isActive} onChange={(e) => setIsActive(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Trạng thái: tất cả</option><option value="true">Đang bật</option><option value="false">Đang tắt</option></select>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">STT</th>
              <th className="px-3 py-2 text-left text-slate-400">Code</th>
              <th className="px-3 py-2 text-left text-slate-400">Tên</th>
              <th className="px-3 py-2 text-left text-slate-400">Vị trí</th>
              <th className="px-3 py-2 text-left text-slate-400">Ảnh</th>
              <th className="px-3 py-2 text-center text-slate-400">Bật</th>
              <th className="px-3 py-2 text-right text-slate-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row, idx) => (
                <tr key={row.sideAdId}>
                  <td className="px-3 py-2 tabular-nums">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-2 font-mono text-sky-300">{row.code}</td>
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.position}</td>
                  <td className="px-3 py-2">
                    <img src={resolveMediaUrl(row.imageUrl)} alt="" className="h-10 w-16 rounded object-cover" />
                  </td>
                  <td className="px-3 py-2 text-center">{row.isActive ? "✓" : ""}</td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/side-ads/${row.sideAdId}/edit`} className="mr-2 text-sky-400 hover:underline">
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        if (!window.confirm("Xóa ads này?")) return;
                        await deleteAdminSideAd(row.sideAdId);
                        void reload();
                      }}
                      className="text-red-400 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
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

