import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { initZaloOfficialChatWidget } from "../bootstrap/zaloChat";
import { applyZaloConfigFromApi } from "@constants/zaloConfig";
import { getPublicUiConfig } from "@services/siteConfigApi";
import type { PublicUiConfig } from "../types/siteUi";

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

type SiteUiContextValue = {
  config: PublicUiConfig;
  reload: () => Promise<void>;
};

const SiteUiConfigContext = createContext<SiteUiContextValue>({
  config: defaultConfig,
  reload: async () => {},
});

export function useSiteUiConfig(): PublicUiConfig {
  return useContext(SiteUiConfigContext).config;
}

export function useSiteUiConfigReload(): () => Promise<void> {
  return useContext(SiteUiConfigContext).reload;
}

function applyCssVariables(cfg: PublicUiConfig) {
  const root = document.documentElement;
  root.style.setProperty("--site-primary", cfg.themePrimaryColor);
  root.style.setProperty("--site-accent", cfg.themeAccentColor);
  root.style.setProperty("--site-header-bg", cfg.headerBackground);

  let link = document.querySelector<HTMLLinkElement>("link[data-site-favicon]");
  if (cfg.faviconUrl) {
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.setAttribute("data-site-favicon", "true");
      document.head.appendChild(link);
    }
    link.href = cfg.faviconUrl;
  } else if (link) {
    link.remove();
  }
}

/**
 * Tải cấu hình từ API, gán CSS, áp Zalo (DB + env), khởi tạo widget OA.
 */
export function SiteUiConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<PublicUiConfig>(defaultConfig);

  const reload = useCallback(async () => {
    const cfg = await getPublicUiConfig();
    setConfig(cfg);
    applyCssVariables(cfg);
    applyZaloConfigFromApi(cfg);
    initZaloOfficialChatWidget(cfg.themePrimaryColor);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      await reload();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [reload]);

  return (
    <SiteUiConfigContext.Provider value={{ config, reload }}>{children}</SiteUiConfigContext.Provider>
  );
}
