import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getAdminSiteSettings,
  putAdminSiteSettings,
  type UpsertSiteSettingItem,
} from "../services/adminApi";

const UI_GROUP = "UI";
const INTEGRATIONS_GROUP = "Integrations";
const NEWS_PAGE_GROUP = "NewsPage";
const HOME_PAGE_GROUP = "HomePage";

type FieldType = "text" | "url" | "color" | "textarea" | "select" | "radio" | "checkbox";
type FieldOption = { value: string; label: string };
type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  defaultValue: string;
  hint?: string;
  options?: FieldOption[];
  rows?: number;
};

const UI_KEYS = [
  {
    key: "theme_primary_color",
    label: "Màu chủ đạo (buttons, link)",
    type: "color" as const,
    defaultValue: "#dc2626",
  },
  {
    key: "theme_accent_color",
    label: "Màu nhấn (phụ)",
    type: "color" as const,
    defaultValue: "#f59e0b",
  },
  { key: "logo_url", label: "URL logo (để trống = chữ TH)", type: "url" as const, defaultValue: "" },
  { key: "favicon_url", label: "URL favicon", type: "url" as const, defaultValue: "" },
  {
    key: "header_background",
    label: "Nền thanh trên (transparent | #hex | tên màu)",
    type: "text" as const,
    defaultValue: "transparent",
  },
  { key: "hero_tagline", label: "Tagline / slogan (tuỳ chọn)", type: "text" as const, defaultValue: "" },
];

const INTEGRATION_KEYS: FieldDef[] = [
  {
    key: "zalo_oa_id",
    label: "Zalo OA ID (số Official Account)",
    hint: "Để trống nếu chỉ dùng link chat bên dưới. Lấy tại oa.zalo.me",
    type: "text" as const,
    defaultValue: "",
  },
  {
    key: "zalo_chat_url",
    label: "Link chat dự phòng",
    hint: "Khi không có OA: https://zalo.me/84901234567",
    type: "url" as const,
    defaultValue: "",
  },
  {
    key: "zalo_welcome_message",
    label: "Lời chào widget Zalo",
    hint: "Hiển thị trên khung chat OA",
    type: "text" as const,
    defaultValue: "",
  },
];

const NEWS_PAGE_KEYS: FieldDef[] = [
  { key: "news_page_title", label: "Tiêu đề trang tin", type: "text", defaultValue: "Tin tức" },
  {
    key: "news_page_subtitle",
    label: "Mô tả phụ (tuỳ chọn)",
    type: "text",
    defaultValue: "",
  },
  {
    key: "news_default_layout",
    label: "Layout mặc định",
    type: "radio",
    defaultValue: "magazine",
    options: [
      { value: "magazine", label: "Tạp chí" },
      { value: "grid", label: "Lưới" },
      { value: "list", label: "Danh sách" },
    ],
  },
  {
    key: "news_page_size",
    label: "Số bài / trang",
    type: "select",
    defaultValue: "12",
    options: [
      { value: "6", label: "6 bài" },
      { value: "8", label: "8 bài" },
      { value: "10", label: "10 bài" },
      { value: "12", label: "12 bài" },
      { value: "15", label: "15 bài" },
      { value: "20", label: "20 bài" },
      { value: "24", label: "24 bài" },
      { value: "30", label: "30 bài" },
      { value: "50", label: "50 bài" },
    ],
  },
  {
    key: "news_show_featured",
    label: "Hiển thị khối tin nổi bật (layout tạp chí)",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "news_grid_columns",
    label: "Số cột lưới",
    type: "select",
    defaultValue: "4",
    options: [
      { value: "2", label: "2 cột" },
      { value: "3", label: "3 cột" },
      { value: "4", label: "4 cột" },
    ],
  },
  {
    key: "news_visual_template",
    label: "Skin giao diện",
    type: "radio",
    defaultValue: "classic",
    options: [
      { value: "classic", label: "Cổ điển (classic)" },
      { value: "editorial", label: "Tạp chí (editorial)" },
      { value: "minimal", label: "Tối giản (minimal)" },
      { value: "bold", label: "Nổi bật (bold)" },
      { value: "glass", label: "Kính mờ (glass)" },
    ],
  },
];

const HOME_PAGE_KEYS: FieldDef[] = [
  {
    key: "home_category_layout",
    label: "Bố cục danh mục trang chủ",
    hint:
      "navbar: danh mục nằm trên thanh menu (dropdown). sidebar_no_promo: danh mục nằm cạnh banner và ẩn cột promo phải để banner rộng.",
    type: "radio",
    defaultValue: "navbar",
    options: [
      { value: "navbar", label: "Navbar dropdown" },
      { value: "sidebar_no_promo", label: "Sidebar (ẩn promo phải)" },
    ],
  },
  {
    key: "home_show_banner_block",
    label: "Hiện banner chính (carousel)",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_show_promo_sidebar",
    label: "Hiện cột banner khuyến mãi bên phải",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_show_mid_promo",
    label: "Hiện 3 ô promo giữa trang (ảnh + link tùy JSON bên dưới)",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_show_product_tabs",
    label: "Hiện khối sản phẩm (Bán chạy / Hot / Combo)",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_show_new_arrivals",
    label: "Hiện khối hàng mới",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_show_news",
    label: "Hiện khối tin tức",
    type: "checkbox",
    defaultValue: "true",
  },
  {
    key: "home_default_product_tab",
    label: "Tab sản phẩm mặc định",
    type: "select",
    defaultValue: "best",
    options: [
      { value: "best", label: "Bán chạy nhất" },
      { value: "hot", label: "Hot sale" },
      { value: "combo", label: "Combo siêu rẻ" },
    ],
  },
  {
    key: "home_new_arrivals_title",
    label: "Tiêu đề khối hàng mới (để trống = dùng bản dịch FE)",
    type: "text",
    defaultValue: "",
  },
  {
    key: "home_news_take",
    label: "Số bài tin trên trang chủ",
    type: "select",
    defaultValue: "10",
    options: [
      { value: "4", label: "4 bài" },
      { value: "6", label: "6 bài" },
      { value: "8", label: "8 bài" },
      { value: "10", label: "10 bài" },
      { value: "12", label: "12 bài" },
      { value: "15", label: "15 bài" },
      { value: "20", label: "20 bài" },
      { value: "30", label: "30 bài" },
    ],
  },
  {
    key: "home_section_order",
    label:
      'Thứ tự section (JSON array): bannerPromo, midPromo, productTabs, newArrivals, news',
    type: "textarea",
    defaultValue: '["bannerPromo","midPromo","productTabs","newArrivals","news"]',
    rows: 4,
  },
  {
    key: "home_mid_promo_json",
    label:
      'JSON mảng tối đa 6 ô: [{"title":"...","imageUrl":"https://...","link":"https://..."}] — [] = dùng ảnh mẫu + i18n',
    type: "textarea",
    defaultValue: "[]",
    rows: 10,
  },
];

function parseJsonString(raw: string | undefined, fallback: string): string {
  if (!raw) return fallback;
  try {
    const v = JSON.parse(raw) as unknown;
    if (typeof v === "string") return v;
    return String(v);
  } catch {
    return raw.replace(/^"|"$/g, "");
  }
}

function isTrue(v: string | undefined): boolean {
  return String(v ?? "").trim().toLowerCase() === "true";
}

function normalizeByCatalog(def: FieldDef, raw: string): string {
  if (def.type === "checkbox") return isTrue(raw) ? "true" : "false";
  if (def.options?.length) {
    return def.options.some((o) => o.value === raw) ? raw : def.defaultValue;
  }
  return raw;
}

type TabId = "ui" | "integrations" | "news" | "home";

export default function AdminSettingsPage() {
  const [tab, setTab] = useState<TabId>("ui");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uiValues, setUiValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(UI_KEYS.map((k) => [k.key, k.defaultValue])),
  );
  const [intValues, setIntValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(INTEGRATION_KEYS.map((k) => [k.key, k.defaultValue])),
  );
  const [newsValues, setNewsValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(NEWS_PAGE_KEYS.map((k) => [k.key, k.defaultValue])),
  );
  const [homeValues, setHomeValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(HOME_PAGE_KEYS.map((k) => [k.key, k.defaultValue])),
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [uiRows, intRows, newsRows, homeRows] = await Promise.all([
          getAdminSiteSettings(UI_GROUP),
          getAdminSiteSettings(INTEGRATIONS_GROUP),
          getAdminSiteSettings(NEWS_PAGE_GROUP),
          getAdminSiteSettings(HOME_PAGE_GROUP),
        ]);

        const nextUi: Record<string, string> = Object.fromEntries(
          UI_KEYS.map((k) => [k.key, k.defaultValue]),
        );
        for (const def of UI_KEYS) {
          const row = uiRows.find((r) => r.key === def.key);
          nextUi[def.key] = row
            ? parseJsonString(row.valueJson, def.defaultValue)
            : def.defaultValue;
        }
        setUiValues(nextUi);

        const nextInt: Record<string, string> = Object.fromEntries(
          INTEGRATION_KEYS.map((k) => [k.key, k.defaultValue]),
        );
        for (const def of INTEGRATION_KEYS) {
          const row = intRows.find((r) => r.key === def.key);
          nextInt[def.key] = row
            ? parseJsonString(row.valueJson, def.defaultValue)
            : def.defaultValue;
        }
        setIntValues(nextInt);

        const nextNews: Record<string, string> = Object.fromEntries(
          NEWS_PAGE_KEYS.map((k) => [k.key, k.defaultValue]),
        );
        for (const def of NEWS_PAGE_KEYS) {
          const row = newsRows.find((r) => r.key === def.key);
          nextNews[def.key] = row
            ? parseJsonString(row.valueJson, def.defaultValue)
            : def.defaultValue;
        }
        setNewsValues(nextNews);

        const nextHome: Record<string, string> = Object.fromEntries(
          HOME_PAGE_KEYS.map((k) => [k.key, k.defaultValue]),
        );
        for (const def of HOME_PAGE_KEYS) {
          const row = homeRows.find((r) => r.key === def.key);
          nextHome[def.key] = row
            ? parseJsonString(row.valueJson, def.defaultValue)
            : def.defaultValue;
        }
        setHomeValues(nextHome);
      } catch {
        toast.error("Không tải được cấu hình.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const handleUiChange = (key: string, v: string) => {
    setUiValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleIntChange = (key: string, v: string) => {
    setIntValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleNewsChange = (key: string, v: string) => {
    setNewsValues((prev) => ({ ...prev, [key]: v }));
  };

  const handleHomeChange = (key: string, v: string) => {
    setHomeValues((prev) => ({ ...prev, [key]: v }));
  };

  const saveUi = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items: UpsertSiteSettingItem[] = UI_KEYS.map((def) => ({
        group: UI_GROUP,
        key: def.key,
        valueJson: JSON.stringify(uiValues[def.key] ?? ""),
      }));
      await putAdminSiteSettings(items);
      toast.success("Đã lưu cấu hình giao diện.");
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const saveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items: UpsertSiteSettingItem[] = INTEGRATION_KEYS.map((def) => ({
        group: INTEGRATIONS_GROUP,
        key: def.key,
        valueJson: JSON.stringify(intValues[def.key] ?? ""),
      }));
      await putAdminSiteSettings(items);
      toast.success("Đã lưu Zalo / tích hợp. Khách cần tải lại storefront để áp dụng.");
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const saveNewsPage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items: UpsertSiteSettingItem[] = NEWS_PAGE_KEYS.map((def) => ({
        group: NEWS_PAGE_GROUP,
        key: def.key,
        valueJson: JSON.stringify(newsValues[def.key] ?? ""),
      }));
      await putAdminSiteSettings(items);
      toast.success("Đã lưu cấu hình trang tin.");
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const saveHomePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items: UpsertSiteSettingItem[] = HOME_PAGE_KEYS.map((def) => ({
        group: HOME_PAGE_GROUP,
        key: def.key,
        valueJson: JSON.stringify(homeValues[def.key] ?? ""),
      }));
      await putAdminSiteSettings(items);
      toast.success("Đã lưu cấu hình trang chủ.");
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-400">Đang tải cấu hình…</p>;
  }

  return (
    <div className="max-w-2xl space-y-6 text-slate-100">
      <div>
        <h1 className="text-xl font-semibold">Cấu hình site</h1>
        <p className="mt-1 text-sm text-slate-400">
          Cấu hình này được áp dụng cho giao diện storefront (giao diện, Zalo, trang chủ, trang tin).
        </p>
      </div>

      <div className="flex gap-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setTab("ui")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "ui"
              ? "border-[var(--site-primary,#dc2626)] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Giao diện
        </button>
        <button
          type="button"
          onClick={() => setTab("integrations")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "integrations"
              ? "border-[var(--site-primary,#dc2626)] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Zalo &amp; tích hợp
        </button>
        <button
          type="button"
          onClick={() => setTab("news")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "news"
              ? "border-[var(--site-primary,#dc2626)] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Trang tin
        </button>
        <button
          type="button"
          onClick={() => setTab("home")}
          className={`border-b-2 px-3 py-2 text-sm font-medium ${
            tab === "home"
              ? "border-[var(--site-primary,#dc2626)] text-white"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          Trang chủ
        </button>
      </div>

      {tab === "ui" && (
        <form onSubmit={saveUi} className="space-y-4">
          {UI_KEYS.map((def) => (
            <label key={def.key} className="block text-sm">
              <span className="mb-1 block text-slate-300">{def.label}</span>
              {def.type === "color" ? (
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={uiValues[def.key]?.startsWith("#") ? uiValues[def.key] : def.defaultValue}
                    onChange={(e) => handleUiChange(def.key, e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded border border-slate-600 bg-slate-900"
                  />
                  <input
                    type="text"
                    value={uiValues[def.key] ?? ""}
                    onChange={(e) => handleUiChange(def.key, e.target.value)}
                    className="flex-1 rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  />
                </div>
              ) : (
                <input
                  type={def.type === "url" ? "url" : "text"}
                  value={uiValues[def.key] ?? ""}
                  onChange={(e) => handleUiChange(def.key, e.target.value)}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  placeholder={def.defaultValue}
                />
              )}
            </label>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--site-primary,#dc2626)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu giao diện"}
          </button>
        </form>
      )}

      {tab === "integrations" && (
        <form onSubmit={saveIntegrations} className="space-y-4">
          <p className="text-sm text-slate-400">
            Giá trị lưu trong DB (nhóm <code className="rounded bg-slate-800 px-1">Integrations</code>
            ). Ưu tiên hơn biến <code className="rounded bg-slate-800 px-1">VITE_ZALO_*</code> trên
            build.
          </p>
          {INTEGRATION_KEYS.map((def) => (
            <label key={def.key} className="block text-sm">
              <span className="mb-1 block text-slate-300">{def.label}</span>
              {def.hint && (
                <span className="mb-1 block text-xs text-slate-500">{def.hint}</span>
              )}
              <input
                type={def.type === "url" ? "url" : "text"}
                value={intValues[def.key] ?? ""}
                onChange={(e) => handleIntChange(def.key, e.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                placeholder={def.defaultValue}
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--site-primary,#dc2626)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu Zalo / tích hợp"}
          </button>
        </form>
      )}

      {tab === "news" && (
        <form onSubmit={saveNewsPage} className="space-y-4">
          <p className="text-sm text-slate-400">
            Cấu hình mặc định cho trang blog/tin. Người dùng đăng nhập có thể ghi đè layout qua storefront (lưu
            bảng UserNewsPagePreferences).
          </p>
          {NEWS_PAGE_KEYS.map((def) => (
            <label key={def.key} className="block text-sm">
              <span className="mb-1 block text-slate-300">{def.label}</span>
              <input
                type="text"
                value={newsValues[def.key] ?? ""}
                onChange={(e) => handleNewsChange(def.key, e.target.value)}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                placeholder={def.defaultValue}
              />
            </label>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--site-primary,#dc2626)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu trang tin"}
          </button>
        </form>
      )}

      {tab === "home" && (
        <form onSubmit={saveHomePage} className="space-y-4">
          <p className="text-sm text-slate-400">
            Bật/tắt từng khối, đổi thứ tự, tab sản phẩm mặc định và 3 ô ảnh giữa trang. Không cần migration — lưu
            trong <code className="rounded bg-slate-800 px-1">SiteSettings</code> nhóm HomePage.
          </p>
          {HOME_PAGE_KEYS.map((def) => (
            <label key={def.key} className="block text-sm">
              <span className="mb-1 block text-slate-300">{def.label}</span>
              {def.type === "textarea" ? (
                <textarea
                  value={homeValues[def.key] ?? ""}
                  onChange={(e) => handleHomeChange(def.key, e.target.value)}
                  rows={def.key === "home_mid_promo_json" ? 10 : 4}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 font-mono text-xs text-slate-100"
                  placeholder={def.defaultValue}
                />
              ) : (
                <input
                  type="text"
                  value={homeValues[def.key] ?? ""}
                  onChange={(e) => handleHomeChange(def.key, e.target.value)}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 text-slate-100"
                  placeholder={def.defaultValue}
                />
              )}
            </label>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--site-primary,#dc2626)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Đang lưu…" : "Lưu trang chủ"}
          </button>
        </form>
      )}
    </div>
  );
}
