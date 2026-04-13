/**
 * Cấu hình Zalo: ưu tiên API (admin), sau đó biến môi trường VITE_*.
 */

const trim = (v: string | undefined | null) =>
  typeof v === "string" ? v.trim() : "";

export type ZaloApiFields = {
  zaloOaId?: string | null;
  zaloChatUrl?: string | null;
  zaloWelcomeMessage?: string | null;
};

let apiOverride: ZaloApiFields = {};

/** Gọi sau khi tải GET /api/home/ui-config để storefront dùng cấu hình từ DB. */
export function applyZaloConfigFromApi(cfg: ZaloApiFields): void {
  apiOverride = {
    zaloOaId: cfg.zaloOaId,
    zaloChatUrl: cfg.zaloChatUrl,
    zaloWelcomeMessage: cfg.zaloWelcomeMessage,
  };
}

export function getZaloOfficialAccountId(): string | undefined {
  const id =
    trim(apiOverride.zaloOaId ?? undefined) || trim(import.meta.env.VITE_ZALO_OA_ID);
  return id || undefined;
}

/** Link mở chat. Có OA id → zalo.me/&lt;id&gt;; không thì link trực tiếp từ API/env. */
export function getZaloChatUrl(): string | undefined {
  const oa = getZaloOfficialAccountId();
  if (oa) return `https://zalo.me/${oa}`;
  const url =
    trim(apiOverride.zaloChatUrl ?? undefined) ||
    trim(import.meta.env.VITE_ZALO_CHAT_URL);
  return url || undefined;
}

export function getZaloWelcomeMessage(): string {
  return (
    trim(apiOverride.zaloWelcomeMessage ?? undefined) ||
    trim(import.meta.env.VITE_ZALO_WELCOME_MESSAGE) ||
    "Shop Cam xin chào! Bạn cần tư vấn sản phẩm nào ạ?"
  );
}
