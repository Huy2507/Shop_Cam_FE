/**
 * Khớp PublicUiConfigDto từ GET /api/home/ui-config.
 */
export type NewsPageLayout = "magazine" | "grid" | "list";

/** Skin giao diện trang tin — khớp BE news_visual_template / visualTemplate */
export type NewsVisualTemplate = "classic" | "editorial" | "minimal" | "bold" | "glass";

/** Section trang chủ — khớp BE HomePage.SectionOrder */
export type HomeSectionId =
  | "bannerPromo"
  | "midPromo"
  | "productTabs"
  | "newArrivals"
  | "news";

export interface HomeMidPromoCard {
  title?: string | null;
  imageUrl: string;
  link?: string | null;
}

export interface HomePageConfig {
  showBannerBlock: boolean;
  showPromoSidebar: boolean;
  showMidPromo: boolean;
  showProductTabs: boolean;
  showNewArrivals: boolean;
  showNews: boolean;
  sectionOrder: HomeSectionId[];
  defaultProductTab: "best" | "hot" | "combo";
  newArrivalsTitle: string | null;
  homeNewsTake: number;
  midPromoCards: HomeMidPromoCard[];
}

export interface NewsPageConfig {
  pageTitle: string;
  pageSubtitle: string | null;
  layout: NewsPageLayout;
  pageSize: number;
  showFeatured: boolean;
  gridColumns: 2 | 3 | 4;
  /** classic | editorial | minimal | bold | glass */
  visualTemplate: NewsVisualTemplate;
  personalized: boolean;
}

export interface PublicUiConfig {
  themePrimaryColor: string;
  themeAccentColor: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  headerBackground: string;
  heroTagline: string | null;
  /** ID Zalo OA — bật widget SDK */
  zaloOaId?: string | null;
  /** Link chat khi không có OA */
  zaloChatUrl?: string | null;
  zaloWelcomeMessage?: string | null;
  /** Trang tin: mặc định site + gộp tùy user (cookie JWT) */
  newsPage: NewsPageConfig;
  /** Trang chủ: khối hiển thị, thứ tự, cấu hình promo giữa trang */
  homePage: HomePageConfig;
}
