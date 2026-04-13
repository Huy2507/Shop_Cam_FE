import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getAdminOrder,
  getAdminOrderStatuses,
  updateAdminOrderStatus,
  type AdminOrderDetail,
  type AdminOrderStatus,
} from "../services/adminApi";

export default function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [data, setData] = useState<AdminOrderDetail | null>(null);
  const [statuses, setStatuses] = useState<AdminOrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      try {
        const d = await getAdminOrder(orderId);
        const ss = await getAdminOrderStatuses();
        if (!cancelled) setData(d);
        if (!cancelled) setStatuses(ss);
      } catch {
        toast.error("Không tải được đơn hàng.");
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return <p className="text-slate-400">Đang tải…</p>;
  }

  if (!data) {
    return (
      <div className="text-slate-300">
        <p>Không tìm thấy đơn.</p>
        <Link to="/orders" className="mt-2 inline-block text-sky-400 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 text-slate-100">
      <div>
        <Link to="/orders" className="text-sm text-sky-400 hover:underline">
          ← Danh sách đơn
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Đơn {data.code}</h1>
        <p className="text-sm text-slate-400">
          {new Date(data.createdAt).toLocaleString("vi-VN")}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-400">Trạng thái:</span>
          <select
            value={data.orderStatusId}
            disabled={updatingStatus}
            onChange={async (e) => {
              if (!orderId) return;
              setUpdatingStatus(true);
              try {
                await updateAdminOrderStatus(orderId, e.target.value);
                const selected = statuses.find((x) => x.orderStatusId === e.target.value);
                setData((prev) =>
                  prev
                    ? {
                        ...prev,
                        orderStatusId: e.target.value,
                        orderStatusCode: selected?.code ?? prev.orderStatusCode,
                        orderStatusName: selected?.name ?? prev.orderStatusName,
                        orderStatusColorHex: selected?.colorHex ?? prev.orderStatusColorHex,
                      }
                    : prev,
                );
                toast.success("Đã cập nhật trạng thái đơn.");
              } catch {
                toast.error("Cập nhật trạng thái thất bại.");
              } finally {
                setUpdatingStatus(false);
              }
            }}
            className="rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
          >
            {statuses.map((s) => (
              <option key={s.orderStatusId} value={s.orderStatusId}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-sm">
        <h2 className="mb-2 font-medium text-slate-300">Khách hàng</h2>
        <dl className="grid gap-1 sm:grid-cols-2">
          <dt className="text-slate-500">Tên</dt>
          <dd>{data.customerName}</dd>
          <dt className="text-slate-500">SĐT</dt>
          <dd className="tabular-nums">{data.phone}</dd>
          <dt className="text-slate-500">Email</dt>
          <dd>{data.email ?? "—"}</dd>
          <dt className="text-slate-500">Địa chỉ</dt>
          <dd className="sm:col-span-1">{data.address}</dd>
        </dl>
        {data.note && (
          <p className="mt-2 text-slate-400">
            <span className="text-slate-500">Ghi chú: </span>
            {data.note}
          </p>
        )}
      </section>

      <section className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">Sản phẩm</th>
              <th className="px-3 py-2 text-right text-slate-400">Đơn giá</th>
              <th className="px-3 py-2 text-right text-slate-400">SL</th>
              <th className="px-3 py-2 text-right text-slate-400">Thành tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {data.items.map((line) => (
              <tr key={line.orderItemId}>
                <td className="px-3 py-2">{line.productName}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {line.unitPrice.toLocaleString("vi-VN")}
                </td>
                <td className="px-3 py-2 text-right">{line.quantity}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {line.lineTotal.toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="text-right text-lg font-semibold">
        Tổng:{" "}
        <span className="text-amber-400">
          {data.totalAmount.toLocaleString("vi-VN")} đ
        </span>
      </p>
    </div>
  );
}
