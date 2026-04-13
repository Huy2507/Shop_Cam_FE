import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";

const IntroPage = () => (
  <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
    <Header />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Giới thiệu</h1>
      <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
        Đây là trang giới thiệu mock. Sau này sẽ lấy nội dung từ hệ thống quản trị (CMS / API).
      </p>
    </main>
    <Footer />
  </div>
);

export default IntroPage;

