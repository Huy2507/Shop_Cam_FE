import type { NewsPageLayout, NewsVisualTemplate } from "../types/siteUi";
import api from "./axiosConfig";

export interface NewsPagePreferenceBody {
  layout?: NewsPageLayout;
  pageSize?: number;
  showFeatured?: boolean;
  gridColumns?: 2 | 3 | 4;
  visualTemplate?: NewsVisualTemplate;
}

/** Lưu tùy chọn trang tin cho user đã đăng nhập (cookie JWT). */
export async function putNewsPagePreference(body: NewsPagePreferenceBody): Promise<void> {
  await api.put("/api/Users/me/news-page-preference", body);
}
