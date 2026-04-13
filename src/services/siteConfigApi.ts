/**
 * Cấu hình giao diện + Zalo public — không cần đăng nhập.
 */

import type { PublicUiConfig } from "../types/siteUi";
import api from "./axiosConfig";

const defaultNewsPage: PublicUiConfig["newsPage"] = {
  pageTitle: "Tin tức",
  pageSubtitle: null,
  layout: "magazine",
  pageSize: 12,
  showFeatured: true,
  gridColumns: 4,
  visualTemplate: "classic",
  personalized: false,
};

const defaultHomePage: PublicUiConfig["homePage"] = {
  showBannerBlock: true,
  showPromoSidebar: true,
  showMidPromo: true,
  showProductTabs: true,
  showNewArrivals: true,
  showNews: true,
  sectionOrder: ["bannerPromo", "midPromo", "productTabs", "newArrivals", "news"],
  defaultProductTab: "best",
  newArrivalsTitle: null,
  homeNewsTake: 10,
  midPromoCards: [],
};

function mergeHomePage(
  partial?: Partial<PublicUiConfig["homePage"]>,
): PublicUiConfig["homePage"] {
  const d = defaultHomePage;
  if (!partial) return { ...d };
  return {
    ...d,
    ...partial,
    sectionOrder:
      Array.isArray(partial.sectionOrder) && partial.sectionOrder.length > 0
        ? (partial.sectionOrder as PublicUiConfig["homePage"]["sectionOrder"])
        : d.sectionOrder,
    midPromoCards: Array.isArray(partial.midPromoCards)
      ? partial.midPromoCards
      : d.midPromoCards,
  };
}

const defaultConfig: PublicUiConfig = {
  themePrimaryColor: "#dc2626",
  themeAccentColor: "#f59e0b",
  logoUrl: null,
  faviconUrl: null,
  headerBackground: "transparent",
  heroTagline: null,
  zaloOaId: null,
  zaloChatUrl: null,
  zaloWelcomeMessage: null,
  newsPage: defaultNewsPage,
  homePage: defaultHomePage,
};

/** Lấy cấu hình UI từ BE; lỗi mạng thì trả về mặc định. */
export async function getPublicUiConfig(): Promise<PublicUiConfig> {
  try {
    const res = await api.get<PublicUiConfig>("/api/home/ui-config", {
      ignoreRefresh: true,
    } as object);
    const data = res.data as Partial<PublicUiConfig>;
    return {
      ...defaultConfig,
      ...data,
      newsPage: { ...defaultNewsPage, ...data.newsPage },
      homePage: mergeHomePage(data.homePage),
    };
  } catch {
    return defaultConfig;
  }
}
