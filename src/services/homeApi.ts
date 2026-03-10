/**
 * API service cho trang chủ - Banner, Products, News.
 * Không còn mock fallback: nếu BE lỗi sẽ ném exception để UI hiển thị skeleton + thông báo.
 */

import type { Banner, NewsItem, Product } from "../types/home";
import api from "./axiosConfig";

const HOME_API_BASE = "/api/home";

/** Lấy banner chính (Banner.urlimg từ BE) */
export async function getBanners(): Promise<Banner[]> {
  const res = await api.get<Banner[]>(`${HOME_API_BASE}/banners`);
  return res.data;
}

/** Lấy banner khuyến mãi bên phải */
export async function getPromoBanners(): Promise<Banner[]> {
  const res = await api.get<Banner[]>(`${HOME_API_BASE}/promo-banners`);
  return res.data;
}

/** Lấy danh sách sản phẩm (filter: best | hot | combo) */
export async function getProducts(filter?: string): Promise<Product[]> {
  const res = await api.get<Product[]>(`${HOME_API_BASE}/products`, {
    params: { filter },
  });
  return res.data;
}

/** Lấy sản phẩm mới (isNew) */
export async function getNewProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>(`${HOME_API_BASE}/new-products`);
  return res.data;
}

/** Lấy tin tức (News.title từ BE) */
export async function getNews(): Promise<NewsItem[]> {
  const res = await api.get<NewsItem[]>(`${HOME_API_BASE}/news`);
  return res.data;
}
