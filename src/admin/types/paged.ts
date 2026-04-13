/** Khớp PagedResult&lt;T&gt; từ API admin. */
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const ADMIN_PAGE_SIZES = [10, 20, 50, 100] as const;
