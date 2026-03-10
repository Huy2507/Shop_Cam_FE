/**
 * API service cho trang chủ - Banner, Products, News.
 * Hiện dùng mock data. Khi BE có API thật, thay bằng axios gọi endpoint.
 */

import type { Banner, NewsItem, Product } from "../types/home";
import {
  mockBanners,
  mockNews,
  mockProducts,
  mockPromoBanners,
} from "../mocks/homeMockData";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

/** Lấy banner chính (Banner.urlimg từ admin) */
export async function getBanners(): Promise<Banner[]> {
  // TODO: Khi có BE: return (await api.get(`${API_BASE}/banners`)).data;
  return Promise.resolve(mockBanners);
}

/** Lấy banner khuyến mãi bên phải */
export async function getPromoBanners(): Promise<Banner[]> {
  // TODO: Khi có BE: return (await api.get(`${API_BASE}/banners/promo`)).data;
  return Promise.resolve(mockPromoBanners);
}

/** Lấy danh sách sản phẩm (filter: best | hot | combo) */
export async function getProducts(filter?: string): Promise<Product[]> {
  // TODO: Khi có BE: return (await api.get(`${API_BASE}/products`, { params: { filter } })).data;
  return Promise.resolve(mockProducts);
}

/** Lấy sản phẩm mới (isNew) */
export async function getNewProducts(): Promise<Product[]> {
  // TODO: Khi có BE: return (await api.get(`${API_BASE}/products/new`)).data;
  const withNew = mockProducts.filter((p) => p.isNew);
  return Promise.resolve(withNew.length > 0 ? withNew : mockProducts.slice(0, 5));
}

/** Lấy tin tức (News.title từ admin) */
export async function getNews(): Promise<NewsItem[]> {
  // TODO: Khi có BE: return (await api.get(`${API_BASE}/news`)).data;
  return Promise.resolve(mockNews);
}
