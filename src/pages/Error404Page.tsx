import { FileX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Error404Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500">
          <FileX className="h-12 w-12 text-white" />
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-slate-100">
            {t("error.404.title")}
          </h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-slate-200">
            {t("error.404.subtitle")}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-slate-400">
            {t("error.404.description")}
          </p>
        </div>

        <div className="flex flex-row space-x-4">
          <button
            onClick={() => navigate("/")}
            className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-violet-600 hover:to-pink-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] dark:focus:ring-offset-slate-900"
          >
            {t("error.404.homeButton")}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-violet-500 to-pink-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-violet-600 hover:to-pink-600 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] dark:focus:ring-offset-slate-900"
          >
            {t("error.403.loginButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404Page;
