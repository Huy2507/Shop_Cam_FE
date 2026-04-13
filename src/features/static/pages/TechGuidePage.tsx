import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";

const TechGuidePage = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
    <Header />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Hướng dẫn kỹ thuật</h1>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">
        Nội dung hướng dẫn mock. Sau này sẽ hiển thị bài viết từ hệ thống quản trị.
      </p>
      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
        <li>Hướng dẫn lắp đặt camera cơ bản.</li>
        <li>Cấu hình xem camera trên điện thoại.</li>
        <li>Các lưu ý về bảo mật thiết bị.</li>
      </ul>
    </main>
    <Footer />
  </div>
);

export default TechGuidePage;

