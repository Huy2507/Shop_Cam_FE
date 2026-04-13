/**
 * API quản trị (cần cookie JWT).
 */

import api from "@services/axiosConfig";
import type { PagedResult } from "../types/paged";

export interface AdminSummary {
  productsCount: number;
  ordersCount: number;
  usersCount: number;
  reviewsCount: number;
  categoriesCount: number;
  newsCount: number;
}

export interface SiteSettingRow {
  group: string;
  key: string;
  valueJson: string;
  description: string | null;
  updatedAt: string;
}

/** Tổng quan dashboard. */
export async function getAdminSummary(): Promise<AdminSummary> {
  const res = await api.get<AdminSummary>("/api/admin/summary");
  return res.data;
}

/** Cấu hình theo nhóm (vd UI). */
export async function getAdminSiteSettings(
  group: string,
): Promise<SiteSettingRow[]> {
  const res = await api.get<SiteSettingRow[]>("/api/admin/site-settings", {
    params: { group },
  });
  return res.data;
}

export interface UpsertSiteSettingItem {
  group: string;
  key: string;
  valueJson: string;
}

/** Lưu nhiều key cấu hình (whitelist BE). */
export async function putAdminSiteSettings(
  items: UpsertSiteSettingItem[],
): Promise<void> {
  await api.put("/api/admin/site-settings", { items });
}

function asPaged<T>(raw: unknown): PagedResult<T> {
  const r = raw as Record<string, unknown>;
  const items = (r.items ?? r.Items) as T[];
  return {
    items: Array.isArray(items) ? items : [],
    totalCount: Number(r.totalCount ?? r.TotalCount ?? 0),
    page: Number(r.page ?? r.Page ?? 1),
    pageSize: Number(r.pageSize ?? r.PageSize ?? 20),
    totalPages: Number(r.totalPages ?? r.TotalPages ?? 0),
  };
}

// --- Products ---

export interface AdminProductListItem {
  productId: string;
  name: string;
  price: number;
  discount?: number | null;
  imageUrl: string;
  isNew: boolean;
  outOfStock: boolean;
  productCategoryId?: string | null;
  categoryName?: string | null;
}

export interface AdminUpsertProduct {
  name: string;
  price: number;
  discount?: number | null;
  info?: string | null;
  description?: string | null;
  imageUrl: string;
  isNew: boolean;
  outOfStock: boolean;
  badge?: string | null;
  productCategoryId?: string | null;
}

export interface AdminProductDetail extends AdminUpsertProduct {
  productId: string;
  categoryName?: string | null;
}

export async function getAdminProductsPaged(params: {
  page: number;
  pageSize: number;
  search?: string;
  categoryId?: string;
}): Promise<PagedResult<AdminProductListItem>> {
  const res = await api.get("/api/admin/products", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
      categoryId: params.categoryId || undefined,
    },
  });
  return asPaged<AdminProductListItem>(res.data);
}

export async function getAdminProduct(id: string): Promise<AdminProductDetail> {
  const res = await api.get<AdminProductDetail>(`/api/admin/products/${id}`);
  return res.data;
}

export async function createAdminProduct(
  body: AdminUpsertProduct,
): Promise<{ id: string }> {
  const res = await api.post<{ id: string }>("/api/admin/products", body);
  return res.data;
}

export async function updateAdminProduct(
  id: string,
  body: AdminUpsertProduct,
): Promise<void> {
  await api.put(`/api/admin/products/${id}`, body);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await api.delete(`/api/admin/products/${id}`);
}

// --- Categories ---

export interface AdminCategoryListItem {
  productCategoryId: string;
  name: string;
  slug?: string | null;
  productCount: number;
}

export interface AdminCategoryLookup {
  productCategoryId: string;
  name: string;
}

export interface AdminUpsertCategory {
  name: string;
  slug?: string | null;
}

export async function getAdminCategoriesLookup(): Promise<AdminCategoryLookup[]> {
  const res = await api.get<AdminCategoryLookup[]>(
    "/api/admin/categories/lookup",
  );
  return res.data;
}

export async function getAdminCategoriesPaged(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PagedResult<AdminCategoryListItem>> {
  const res = await api.get("/api/admin/categories", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
    },
  });
  return asPaged<AdminCategoryListItem>(res.data);
}

export async function getAdminCategory(id: string): Promise<{
  productCategoryId: string;
  name: string;
  slug?: string | null;
}> {
  const res = await api.get(`/api/admin/categories/${id}`);
  return res.data;
}

export async function createAdminCategory(
  body: AdminUpsertCategory,
): Promise<{ id: string }> {
  const res = await api.post<{ id: string }>("/api/admin/categories", body);
  return res.data;
}

export async function updateAdminCategory(
  id: string,
  body: AdminUpsertCategory,
): Promise<void> {
  await api.put(`/api/admin/categories/${id}`, body);
}

export async function deleteAdminCategory(id: string): Promise<void> {
  await api.delete(`/api/admin/categories/${id}`);
}

// --- Banners ---

export interface AdminBannerListItem {
  homeBannerId: string;
  urlImg: string;
  title?: string | null;
  link?: string | null;
  isMain: boolean;
  displayOrder: number;
}

export interface AdminUpsertBanner {
  urlImg: string;
  title?: string | null;
  link?: string | null;
  isMain: boolean;
  displayOrder: number;
}

export async function getAdminBannersPaged(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PagedResult<AdminBannerListItem>> {
  const res = await api.get("/api/admin/banners", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
    },
  });
  return asPaged<AdminBannerListItem>(res.data);
}

export async function getAdminBanner(id: string): Promise<AdminBannerListItem> {
  const res = await api.get<AdminBannerListItem>(`/api/admin/banners/${id}`);
  return res.data;
}

export async function createAdminBanner(
  body: AdminUpsertBanner,
): Promise<{ id: string }> {
  const res = await api.post<{ id: string }>("/api/admin/banners", body);
  return res.data;
}

export async function updateAdminBanner(
  id: string,
  body: AdminUpsertBanner,
): Promise<void> {
  await api.put(`/api/admin/banners/${id}`, body);
}

export async function deleteAdminBanner(id: string): Promise<void> {
  await api.delete(`/api/admin/banners/${id}`);
}

// --- Orders (read) ---

export interface AdminOrderListItem {
  orderId: string;
  code: string;
  customerName: string;
  phone: string;
  email?: string | null;
  totalAmount: number;
  createdAt: string;
}

export interface AdminOrderDetail {
  orderId: string;
  code: string;
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  note?: string | null;
  totalAmount: number;
  createdAt: string;
  items: {
    orderItemId: string;
    productId: string;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
}

export async function getAdminOrdersPaged(params: {
  page: number;
  pageSize: number;
  search?: string;
}): Promise<PagedResult<AdminOrderListItem>> {
  const res = await api.get("/api/admin/orders", {
    params: {
      page: params.page,
      pageSize: params.pageSize,
      search: params.search || undefined,
    },
  });
  return asPaged<AdminOrderListItem>(res.data);
}

export async function getAdminOrder(id: string): Promise<AdminOrderDetail> {
  const res = await api.get<AdminOrderDetail>(`/api/admin/orders/${id}`);
  return res.data;
}
