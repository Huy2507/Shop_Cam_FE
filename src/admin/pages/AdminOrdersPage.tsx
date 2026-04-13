import { useCallback } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import {
  getAdminOrdersPaged,
  getAdminOrderStatuses,
  type AdminOrderListItem,
  type AdminOrderStatus,
} from "../services/adminApi";
import { useEffect } from "react";

export default function AdminOrdersPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [orderStatuses, setOrderStatuses] = useState<AdminOrderStatus[]>([]);
  const [orderStatusId, setOrderStatusId] = useState("");
  const [codeFilter, setCodeFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminOrdersPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
        orderStatusId: orderStatusId || undefined,
        code: codeFilter || undefined,
        phone: phoneFilter || undefined,
        minTotalAmount: minTotal ? Number(minTotal) : undefined,
        maxTotalAmount: maxTotal ? Number(maxTotal) : undefined,
        createdFrom: fromDate || undefined,
        createdTo: toDate || undefined,
      });
    },
    [orderStatusId, codeFilter, phoneFilter, minTotal, maxTotal, fromDate, toDate],
  );

  useEffect(() => {
    void getAdminOrderStatuses().then(setOrderStatuses).catch(() => {});
  }, []);

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
      <div className="flex justify-end">
        <button type="button" onClick={() => setAdvancedOpen((x) => !x)} className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800">Bộ lọc nâng cao</button>
      </div>
      {advancedOpen && (
        <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-800 p-3 md:grid-cols-3">
          <select value={orderStatusId} onChange={(e) => setOrderStatusId(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2">
            <option value="">Trạng thái: tất cả</option>
            {orderStatuses.map((s) => (
              <option key={s.orderStatusId} value={s.orderStatusId}>
                {s.name}
              </option>
            ))}
          </select>
          <input value={codeFilter} onChange={(e) => setCodeFilter(e.target.value)} placeholder="Mã đơn" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input value={phoneFilter} onChange={(e) => setPhoneFilter(e.target.value)} placeholder="SĐT" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input type="number" value={minTotal} onChange={(e) => setMinTotal(e.target.value)} placeholder="Tổng từ" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input type="number" value={maxTotal} onChange={(e) => setMaxTotal(e.target.value)} placeholder="Tổng đến" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input type="datetime-local" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input type="datetime-local" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">STT</th>
              <th className="px-3 py-2 text-left text-slate-400">Mã</th>
              <th className="px-3 py-2 text-left text-slate-400">Trạng thái</th>
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
                <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row, idx) => (
                <tr key={row.orderId}>
                  <td className="px-3 py-2 tabular-nums">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-2 font-mono text-sky-300">{row.code}</td>
                  <td className="px-3 py-2">
                    <span className="rounded px-2 py-1 text-xs" style={{ backgroundColor: `${row.orderStatusColorHex ?? "#334155"}33`, color: row.orderStatusColorHex ?? "#cbd5e1" }}>
                      {row.orderStatusName}
                    </span>
                  </td>
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
                <td colSpan={8} className="px-3 py-8 text-center text-slate-500">
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
