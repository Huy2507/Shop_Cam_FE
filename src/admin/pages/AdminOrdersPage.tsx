import { useCallback } from "react";
import { Link } from "react-router-dom";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import { getAdminOrdersPaged, type AdminOrderListItem } from "../services/adminApi";

export default function AdminOrdersPage() {
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminOrdersPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
      });
    },
    [],
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
  } = useAdminPagedList<AdminOrderListItem>(load);

  return (
    <div className="space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">Đơn hàng</h1>
      <p className="text-sm text-slate-400">
        Tìm theo mã đơn, SĐT, tên khách hoặc email.
      </p>

      <AdminListToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={submitSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        disabled={loading}
      />

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">Mã</th>
              <th className="px-3 py-2 text-left text-slate-400">Khách</th>
              <th className="px-3 py-2 text-left text-slate-400">SĐT</th>
              <th className="px-3 py-2 text-right text-slate-400">Tổng</th>
              <th className="px-3 py-2 text-left text-slate-400">Ngày</th>
              <th className="px-3 py-2 text-right text-slate-400">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row) => (
                <tr key={row.orderId}>
                  <td className="px-3 py-2 font-mono text-sky-300">{row.code}</td>
                  <td className="px-3 py-2">{row.customerName}</td>
                  <td className="px-3 py-2 tabular-nums">{row.phone}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.totalAmount.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-slate-400">
                    {new Date(row.createdAt).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link
                      to={`/orders/${row.orderId}`}
                      className="text-sky-400 hover:underline"
                    >
                      Xem
                    </Link>
                  </td>
                </tr>
              ))}
            {!loading && data && data.items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-slate-500">
                  Không có đơn hàng.
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
