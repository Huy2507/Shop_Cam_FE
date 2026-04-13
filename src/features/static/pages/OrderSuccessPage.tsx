import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { formatVnd } from "@utils/formatVnd";
import { CheckCircle2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export interface OrderSuccessState {
  code: string;
  orderId?: string;
  totalAmount?: number;
}

export default function OrderSuccessPage() {
  const location = useLocation();
  const state = location.state as OrderSuccessState | null;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 text-center shadow-sm dark:border-emerald-800 dark:bg-slate-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Đặt hàng thành công</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Cảm ơn Quý khách đã mua sắm tại Shop Cam. Chúng tôi sẽ liên hệ xác nhận đơn trong thời gian sớm nhất.
          </p>
          {state?.code && (
            <div className="mt-6 rounded-lg bg-slate-50 px-4 py-3 text-left text-sm dark:bg-slate-800">
              <p className="text-slate-600 dark:text-slate-300">
                Mã đơn hàng:{" "}
                <strong className="text-lg text-red-600">{state.code}</strong>
              </p>
              {state.orderId && (
                <p className="mt-1 text-slate-500 dark:text-slate-400">
                  Mã tham chiếu: <span className="font-mono text-slate-700 dark:text-slate-200">{state.orderId}</span>
                </p>
              )}
              {typeof state.totalAmount === "number" && (
                <p className="mt-2 text-slate-700 dark:text-slate-200">
                  Tổng thanh toán: <strong>{formatVnd(state.totalAmount)}</strong>
                </p>
              )}
            </div>
          )}
          {!state?.code && (
            <p className="mt-4 text-sm text-amber-700">
              Nếu bạn vừa hoàn tất đơn hàng, thông tin có thể không hiển thị khi tải lại trang. Vui lòng kiểm tra email/SĐT đã đăng ký.
            </p>
          )}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/products"
              className="inline-flex justify-center rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-red-700"
            >
              Tiếp tục mua sắm
            </Link>
            <Link
              to="/"
              className="inline-flex justify-center rounded-lg border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
