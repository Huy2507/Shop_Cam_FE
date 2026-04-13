import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Import translation files EN
import enAdmin from "./locales/en/admin.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enError from "./locales/en/error.json";
import enPricingPlan from "./locales/en/pricingplan.json";
import enSidebarAndTopbar from "./locales/en/sidebarandtopbar.json";
import enUser from "./locales/en/user.json";

// Import translation files VI
import viAdmin from "./locales/vi/admin.json";
import viAuth from "./locales/vi/auth.json";
import viCommon from "./locales/vi/common.json";
import viError from "./locales/vi/error.json";
import viPricingPlan from "./locales/vi/pricingplan.json";
import viSidebarAndTopbar from "./locales/vi/sidebarandtopbar.json";
import viUser from "./locales/vi/user.json";

const resources = {
  en: {
    admin: enAdmin,
    sidebarandtopbar: enSidebarAndTopbar,
    common: enCommon,
    auth: enAuth,
    error: enError,
    users: enUser,
    pricingplan: enPricingPlan,
  },
  vi: {
    admin: viAdmin,
    sidebarandtopbar: viSidebarAndTopbar,
    common: viCommon,
    auth: viAuth,
    error: viError,
    users: viUser,
    pricingplan: viPricingPlan,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "vi",
    defaultNS: "common",
    ns: ["admin", "sidebarandtopbar", "common", "error", "auth", "users", "pricingplan"],
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
