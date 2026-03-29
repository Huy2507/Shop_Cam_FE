import BreadcrumbNav from "@components/layout/BreadcrumbNav";
import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

type PolicyKey = "delivery" | "warranty" | "return" | "payment" | "privacy";

const POLICIES: Record<
  PolicyKey,
  { title: string; sections: { heading?: string; paragraphs: string[] }[] }
> = {
  delivery: {
    title: "Chính sách giao hàng",
    sections: [
      {
        paragraphs: [
          "Shop Cam giao hàng toàn quốc thông qua đối tác vận chuyển uy tín. Thời gian giao hàng dự kiến từ 2–5 ngày làm việc tùy khu vực (nội thành nhanh hơn).",
          "Phí vận chuyển được thông báo tại bước xác nhận đơn hàng hoặc qua tư vấn hotline trước khi giao.",
        ],
      },
      {
        heading: "Kiểm tra khi nhận hàng",
        paragraphs: [
          "Quý khách vui lòng kiểm tra tình trạng bao bì và số lượng sản phẩm ngay khi nhận. Mọi bất thường (móp méo, thiếu hàng) xin báo ngay cho nhân viên giao hàng hoặc hotline trong 24 giờ.",
        ],
      },
    ],
  },
  warranty: {
    title: "Quy định bảo hành",
    sections: [
      {
        paragraphs: [
          "Sản phẩm được bảo hành theo chính sách của nhà sản xuất ghi trên tem/phiếu bảo hành và hóa đơn mua hàng.",
          "Bảo hành áp dụng cho lỗi kỹ thuật do nhà sản xuất, không bao gồm hư hỏng do va đập, nước vào, tự ý sửa chữa ngoài trung tâm ủy quyền.",
        ],
      },
      {
        heading: "Liên hệ bảo hành",
        paragraphs: [
          "Vui lòng gọi hotline hoặc mang sản phẩm kèm phiếu bảo hành đến cửa hàng/đại lý được chỉ định để được hỗ trợ nhanh nhất.",
        ],
      },
    ],
  },
  return: {
    title: "Chính sách đổi trả",
    sections: [
      {
        paragraphs: [
          "Trong 7 ngày kể từ khi nhận hàng, nếu sản phẩm còn nguyên seal/bao bì và chưa qua sử dụng, Quý khách có thể yêu cầu đổi/trả theo quy định (một số mặt hàng đặc thù có thể không áp dụng — sẽ được thông báo khi mua).",
        ],
      },
      {
        heading: "Quy trình",
        paragraphs: [
          "Liên hệ hotline hoặc email hỗ trợ, cung cấp mã đơn hàng và hình ảnh sản phẩm. Sau khi xác nhận, chúng tôi sẽ hướng dẫn gửi hàng hoặc thu hồi tại chỗ tùy khu vực.",
        ],
      },
    ],
  },
  payment: {
    title: "Phương thức thanh toán",
    sections: [
      {
        paragraphs: [
          "Hiện tại Shop Cam hỗ trợ thanh toán khi nhận hàng (COD) và chuyển khoản ngân hàng theo thông tin trên hóa đơn/đơn đặt hàng.",
          "Website demo chưa tích hợp cổng thanh toán trực tuyến; khi triển khai thật sẽ bổ sung ví điện tử và thẻ quốc tế.",
        ],
      },
    ],
  },
  privacy: {
    title: "Chính sách bảo mật thông tin",
    sections: [
      {
        paragraphs: [
          "Thông tin cá nhân (họ tên, số điện thoại, địa chỉ) chỉ dùng để xử lý đơn hàng, giao hàng và hỗ trợ sau bán — không bán hoặc chia sẻ cho bên thứ ba ngoài phạm vi pháp luật.",
        ],
      },
      {
        heading: "Cookie & truy cập",
        paragraphs: [
          "Website có thể sử dụng cookie để cải thiện trải nghiệm. Bạn có thể từ chối cookie trên trình duyệt; một số tính năng có thể bị hạn chế.",
        ],
      },
    ],
  },
};

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const key = slug as PolicyKey | undefined;
  const policy = key && POLICIES[key] ? POLICIES[key] : null;

  const breadcrumbItems = useMemo(
    () =>
      policy
        ? [
            { label: "Trang chủ", to: "/" },
            { label: "Chính sách" },
            { label: policy.title },
          ]
        : [
            { label: "Trang chủ", to: "/" },
            { label: "Chính sách" },
          ],
    [policy],
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
        <BreadcrumbNav items={breadcrumbItems} />

        {!policy && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">Không tìm thấy nội dung chính sách.</p>
            <Link to="/" className="mt-4 inline-block text-sm font-medium text-red-600 hover:underline">
              Về trang chủ
            </Link>
          </div>
        )}

        {policy && (
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h1 className="text-2xl font-bold text-slate-900">{policy.title}</h1>
            <div className="mt-6 space-y-8 text-sm leading-relaxed text-slate-700 sm:text-base">
              {policy.sections.map((sec, i) => (
                <section key={i}>
                  {sec.heading && (
                    <h2 className="mb-3 text-lg font-semibold text-slate-800">{sec.heading}</h2>
                  )}
                  {sec.paragraphs.map((p, j) => (
                    <p key={j} className={j > 0 ? "mt-3" : ""}>
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </article>
        )}
      </main>
      <Footer />
    </div>
  );
}
