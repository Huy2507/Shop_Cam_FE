import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";

const ContactPage = () => (
  <div className="flex min-h-screen flex-col bg-slate-50">
    <Header />
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-slate-800">Liên hệ</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3 text-sm text-slate-700">
          <p>Hotline: 0999 999 999 (mock)</p>
          <p>Email: support@shopcam.mock</p>
          <p>Địa chỉ: Tân Bình, TP.HCM (mock)</p>
        </div>
        <form className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <input
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Họ tên"
          />
          <input
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            placeholder="Email / SĐT"
          />
          <textarea
            className="w-full rounded border border-slate-200 px-3 py-2 text-sm"
            rows={4}
            placeholder="Nội dung liên hệ"
          />
          <button
            type="button"
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Gửi
          </button>
        </form>
      </div>
    </main>
    <Footer />
  </div>
);

export default ContactPage;

