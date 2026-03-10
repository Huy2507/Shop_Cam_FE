import { AlertTriangle, ShieldOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Error403Page = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-4 dark:bg-slate-900">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-violet-500">
          <ShieldOff className="h-12 w-12 text-white" />
        </div>

        <div className="mb-8">
          <h1 className="mb-4 text-6xl font-bold text-gray-900 dark:text-slate-100">
            {t("error.403.title")}
          </h1>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-slate-200">
            {t("error.403.subtitle")}
          </h2>
          <p className="mb-6 text-gray-600 dark:text-slate-400">
            {t("error.403.description")}
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-2 flex items-center text-amber-500 dark:text-amber-400">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <span className="font-medium">{t("error.403.note")}</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-300">
            {t("error.403.noteDescription")}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("login")}
            className="w-full transform cursor-pointer rounded-lg bg-gradient-to-r from-pink-500 to-violet-500 px-6 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:from-pink-600 hover:to-violet-600 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none active:scale-[0.98] dark:focus:ring-offset-slate-900"
          >
            {t("error.403.loginButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error403Page;
