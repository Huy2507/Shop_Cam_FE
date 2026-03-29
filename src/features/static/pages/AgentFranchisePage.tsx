import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { Link } from "react-router-dom";

/** Trang giới thiệu đại lý / nhượng quyền (nội dung tĩnh — bổ sung CMS sau). */
const AgentFranchisePage = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Header />
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Đại lý & nhượng quyền</h1>
      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-700 shadow-sm sm:text-base">
        <p>
          Shop Cam chào đón hợp tác đại lý, nhà phân phối và cửa hàng có nhu cầu kinh doanh thiết bị camera, an ninh và phụ kiện.
        </p>
        <p>
          Chúng tôi hỗ trợ chính sách giá, tài liệu kỹ thuật và đào tảo sản phẩm (theo từng khu vực). Để được tư vấn chi tiết, vui lòng{" "}
          <Link to="/contact" className="font-medium text-red-600 hover:underline">
            liên hệ
          </Link>{" "}
          kèm thông tin doanh nghiệp và khu vực mong muốn hợp tác.
        </p>
        <p className="text-slate-500">
          Đây là trang demo; nội dung và form đăng ký đại lý có thể được kết nối backend sau.
        </p>
      </div>
    </main>
    <Footer />
  </div>
);

export default AgentFranchisePage;
