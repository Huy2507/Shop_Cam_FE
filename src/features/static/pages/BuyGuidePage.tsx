import BreadcrumbNav from "@components/layout/BreadcrumbNav";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { Link } from "react-router-dom";

const buyGuideBreadcrumb = [
  { label: "Trang chủ", to: "/" },
  { label: "Hướng dẫn mua hàng" },
] as const;

const BuyGuidePage = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
    <Header />
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <BreadcrumbNav items={[...buyGuideBreadcrumb]} />
      <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Hướng dẫn mua hàng online</h1>
        <ol className="mt-6 list-decimal space-y-4 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
          <li>
            Chọn sản phẩm tại mục <Link to="/products" className="font-medium text-red-600 hover:underline">Mua hàng Online</Link> hoặc từ trang chủ, xem chi tiết và thêm vào giỏ.
          </li>
          <li>
            Vào <Link to="/cart" className="font-medium text-red-600 hover:underline">Giỏ hàng</Link>, kiểm tra số lượng và nhấn đặt hàng.
          </li>
          <li>
            Điền đầy đủ họ tên, số điện thoại và địa chỉ giao hàng, ghi chú nếu cần, rồi xác nhận đơn.
          </li>
          <li>
            Nhân viên sẽ gọi xác nhận và hướng dẫn thanh toán / giao hàng. Bạn có thể theo dõi mã đơn trên màn hình cảm ơn sau khi đặt thành công.
          </li>
        </ol>
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          Cần tư vấn thêm? Gọi hotline trên website hoặc để lại tin nhắn tại trang{" "}
          <Link to="/contact" className="text-red-600 hover:underline">
            Liên hệ
          </Link>
          .
        </p>
      </article>
    </main>
    <Footer />
  </div>
);

export default BuyGuidePage;
