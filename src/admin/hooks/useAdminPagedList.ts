import { useCallback, useEffect, useState } from "react";
import type { PagedResult } from "../types/paged";
import { ADMIN_PAGE_SIZES } from "../types/paged";

type AsyncLoader<T> = (args: {
  page: number;
  pageSize: number;
  search: string;
}) => Promise<PagedResult<T>>;

/**
 * State phân trang + tìm kiếm: mỗi lần đổi trang / pageSize / search (submit) gọi lại loader.
 */
export function useAdminPagedList<T>(load: AsyncLoader<T>) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [data, setData] = useState<PagedResult<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await load({ page, pageSize, search });
      setData(result);
    } catch {
      setError("Không tải được dữ liệu.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [load, page, pageSize, search]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const setPageSizeSafe = (n: number) => {
    const v = ADMIN_PAGE_SIZES.includes(n as (typeof ADMIN_PAGE_SIZES)[number])
      ? n
      : 20;
    setPageSize(v);
    setPage(1);
  };

  const submitSearch = () => {
    setSearch(searchInput.trim());
    setPage(1);
  };

  return {
    page,
    setPage,
    pageSize,
    setPageSize: setPageSizeSafe,
    search,
    searchInput,
    setSearchInput,
    submitSearch,
    data,
    loading,
    error,
    reload: fetchData,
  };
}
