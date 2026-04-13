import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { getZaloChatUrl } from "@constants/zaloConfig";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { SiZalo } from "react-icons/si";

const ContactPage = () => {
  const { t } = useTranslation();
  const zaloUrl = getZaloChatUrl();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !message.trim()) {
      toast.error(t("common.storefront.contactValidate"));
      return;
    }
    toast.success(t("common.storefront.contactSuccess"));
    setName("");
    setContact("");
    setMessage("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <h1 className="mb-4 text-2xl font-bold text-slate-800">{t("common.storefront.contact")}</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              <span className="font-medium text-slate-800">{t("common.storefront.hotlineLabel")}:</span> 028.3950 5060 (8h30 - 21h00)
            </p>
            <p>
              <span className="font-medium text-slate-800">{t("common.storefront.email")}:</span> support@shopcam.vn (demo)
            </p>
            <p>
              <span className="font-medium text-slate-800">{t("common.storefront.address")}:</span> Tân Bình, TP.HCM
            </p>
            {zaloUrl && (
              <p className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-800">Zalo:</span>
                <a
                  href={zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0068FF] px-3 py-1.5 text-sm font-medium text-white hover:brightness-110"
                >
                  <SiZalo className="h-4 w-4" aria-hidden />
                  {t("common.storefront.chatNow")}
                </a>
              </p>
            )}
            <p className="text-slate-500">
              {t("common.storefront.contactDemoNote")}
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder={t("common.storefront.fullNameRequired")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder={t("common.storefront.emailOrPhoneRequired")}
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <textarea
              className="w-full rounded border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              rows={4}
              placeholder={t("common.storefront.contactMessageRequired")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              {t("common.storefront.send")}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;
