/**
 * API storefront: banner, sản phẩm, tin tức, catalog, PDP.
 */

import type {
  Banner,
  CatalogResponse,
  CategoryMenu,
  NewsDetail,
  NewsItem,
  Product,
  ProductDetail,
  ProductReviewsResponse,
} from "../types/home";
import { resolveMediaUrl } from "@utils/mediaUrl";
import api from "./axiosConfig";

const HOME_API_BASE = "/api/home";

const mapBanner = (x: Banner): Banner => ({ ...x, urlimg: resolveMediaUrl(x.urlimg) });
const mapProduct = (x: Product): Product => ({ ...x, imageUrl: resolveMediaUrl(x.imageUrl) });
const mapNewsItem = (x: NewsItem): NewsItem => ({ ...x, imageUrl: resolveMediaUrl(x.imageUrl) });
const mapNewsDetail = (x: NewsDetail): NewsDetail => ({ ...x, imageUrl: resolveMediaUrl(x.imageUrl) });

/** Lấy banner chính (Banner.urlimg từ BE) */
export async function getBanners(): Promise<Banner[]> {
  const res = await api.get<Banner[]>(`${HOME_API_BASE}/banners`);
  return res.data.map(mapBanner);
}

/** Lấy banner khuyến mãi bên phải */
export async function getPromoBanners(): Promise<Banner[]> {
  const res = await api.get<Banner[]>(`${HOME_API_BASE}/promo-banners`);
  return res.data.map(mapBanner);
}

export interface SideAdItem {
  code: string;
  name: string;
  position: "left" | "right";
  imageUrl: string;
  link?: string | null;
  openInNewTab: boolean;
}

export async function getSideAds(position?: "left" | "right"): Promise<SideAdItem[]> {
  const res = await api.get<SideAdItem[]>(`${HOME_API_BASE}/side-ads`, {
    params: { position: position || undefined },
  });
  return res.data.map((x) => ({ ...x, imageUrl: resolveMediaUrl(x.imageUrl) }));
}

/** Lấy danh mục menu từ BE */
export async function getMenuCategories(): Promise<CategoryMenu[]> {
  const res = await api.get<CategoryMenu[]>(`${HOME_API_BASE}/categories`);
  return res.data;
}

/** Lấy danh sách sản phẩm (filter: best | hot | combo) — trang chủ */
export async function getProducts(filter?: string): Promise<Product[]> {
  const res = await api.get<Product[]>(`${HOME_API_BASE}/products`, {
    params: { filter },
  });
  return res.data.map(mapProduct);
}

/** Lấy sản phẩm mới (isNew) */
export async function getNewProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>(`${HOME_API_BASE}/new-products`);
  return res.data.map(mapProduct);
}

export interface NewsFeedResponse {
  items: NewsItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Danh sách tin có phân trang (mặc định page=1, pageSize=10 — khớp block trang chủ). */
export async function getNews(params?: {
  page?: number;
  pageSize?: number;
}): Promise<NewsFeedResponse> {
  const res = await api.get<NewsFeedResponse>(`${HOME_API_BASE}/news`, {
    params: {
      page: params?.page ?? 1,
      pageSize: params?.pageSize ?? 10,
    },
  });
  return { ...res.data, items: res.data.items.map(mapNewsItem) };
}

/** Chi tiết tin */
export async function getNewsById(id: string): Promise<NewsDetail> {
  const res = await api.get<NewsDetail>(`${HOME_API_BASE}/news/${id}`);
  return mapNewsDetail(res.data);
}

/** Chi tiết sản phẩm (PDP) */
export async function getProductById(id: string): Promise<ProductDetail> {
  const res = await api.get<ProductDetail>(`${HOME_API_BASE}/product/${id}`);
  return { ...res.data, imageUrl: resolveMediaUrl(res.data.imageUrl) };
}

/** Sản phẩm liên quan */
export async function getRelatedProducts(productId: string): Promise<Product[]> {
  const res = await api.get<Product[]>(
    `${HOME_API_BASE}/product/${productId}/related`,
  );
  return res.data.map(mapProduct);
}

export interface CatalogParams {
  q?: string;
  category?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "name";
  /** best | hot | combo — đồng bộ với tab trang chủ */
  tab?: string;
  page?: number;
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
}

/** Danh mục / tìm kiếm có phân trang */
export async function getCatalog(params: CatalogParams): Promise<CatalogResponse> {
  const res = await api.get<CatalogResponse>(`${HOME_API_BASE}/catalog`, {
    params: {
      q: params.q || undefined,
      category: params.category || undefined,
      sort: params.sort || undefined,
      tab: params.tab || undefined,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 12,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    },
  });
  return { ...res.data, items: res.data.items.map(mapProduct) };
}

export async function getProductReviews(
  productId: string,
  params?: { page?: number; pageSize?: number },
): Promise<ProductReviewsResponse> {
  const res = await api.get<ProductReviewsResponse>(
    `${HOME_API_BASE}/product/${productId}/reviews`,
    { params: { page: params?.page ?? 1, pageSize: params?.pageSize ?? 10 } },
  );
  return res.data;
}

export interface CreateProductReviewPayload {
  authorName: string;
  rating: number;
  comment: string;
}

export async function createProductReview(
  productId: string,
  payload: CreateProductReviewPayload,
): Promise<ProductReviewsResponse["items"][number]> {
  const res = await api.post(`${HOME_API_BASE}/product/${productId}/reviews`, {
    authorName: payload.authorName,
    rating: payload.rating,
    comment: payload.comment,
  });
  return res.data;
}
