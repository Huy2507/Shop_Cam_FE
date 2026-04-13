import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import {
  deleteAdminProduct,
  getAdminCategoriesLookup,
  getAdminProductsPaged,
  type AdminCategoryLookup,
  type AdminProductListItem,
} from "../services/adminApi";

export default function AdminProductsPage() {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [productCode, setProductCode] = useState("");
  const [isNewFilter, setIsNewFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminProductsPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
        categoryId: categoryId || undefined,
        productCode: productCode || undefined,
        isNew: isNewFilter === "" ? undefined : isNewFilter === "true",
        outOfStock: stockFilter === "" ? undefined : stockFilter === "true",
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
      })
    },
    [categoryId, productCode, isNewFilter, stockFilter, minPrice, maxPrice],
  );

  const {
    page,
    setPage,
    pageSize,
    setPageSize,
    searchInput,
    setSearchInput,
    submitSearch,
    data,
    loading,
    reload,
  } = useAdminPagedList<AdminProductListItem>(load);

  const [categories, setCategories] = useState<AdminCategoryLookup[]>([]);

  useEffect(() => {
    void getAdminCategoriesLookup().then(setCategories).catch(() => {});
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Xóa sản phẩm "${name}"?`)) return;
    try {
      await deleteAdminProduct(id);
      toast.success("Đã xóa.");
      void reload();
    } catch {
      toast.error("Không xóa được (có thể đã có trong đơn hàng).");
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Sản phẩm</h1>
        <button
          type="button"
          onClick={() => setAdvancedOpen((x) => !x)}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
        >
          Bộ lọc nâng cao
        </button>
        <Link
          to="/products/new"
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      <AdminListToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={submitSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        disabled={loading}
      />
      {advancedOpen && (
        <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-800 p-3 md:grid-cols-3">
          <input value={productCode} onChange={(e) => setProductCode(e.target.value)} placeholder="Mã sản phẩm" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Tất cả danh mục</option>{categories.map((c) => <option key={c.productCategoryId} value={c.productCategoryId}>{c.name}</option>)}</select>
          <select value={isNewFilter} onChange={(e) => setIsNewFilter(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Mới: tất cả</option><option value="true">Mới</option><option value="false">Không mới</option></select>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="rounded border border-slate-700 bg-slate-900 px-3 py-2"><option value="">Tồn kho: tất cả</option><option value="false">Còn hàng</option><option value="true">Hết hàng</option></select>
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Giá từ" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Giá đến" className="rounded border border-slate-700 bg-slate-900 px-3 py-2" />
          <div className="md:col-span-3 flex justify-end gap-2">
            <button type="button" onClick={() => { setCategoryId(""); setProductCode(""); setIsNewFilter(""); setStockFilter(""); setMinPrice(""); setMaxPrice(""); }} className="rounded border border-slate-700 px-3 py-2">Xóa lọc</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
              <th className="px-3 py-2 text-left text-slate-400">STT</th>
              <th className="px-3 py-2 text-left text-slate-400">Code</th>
              <th className="px-3 py-2 text-left text-slate-400">Tên</th>
              <th className="px-3 py-2 text-right text-slate-400">Giá</th>
              <th className="px-3 py-2 text-left text-slate-400">Danh mục</th>
              <th className="px-3 py-2 text-center text-slate-400">Mới</th>
              <th className="px-3 py-2 text-right text-slate-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row, idx) => (
                <tr key={row.productId} className="hover:bg-slate-900/80">
                  <td className="px-3 py-2 tabular-nums">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-3 py-2 font-mono text-sky-300">{row.productCode || "—"}</td>
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.price.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-slate-400">{row.categoryName ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{row.isNew ? "✓" : ""}</td>
                  <td className="px-3 py-2 text-right">
                    <Link to={`/products/${row.productId}/edit`} className="mr-2 text-sky-400 hover:underline">
                      Sửa
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.productId, row.name)}
                      className="text-red-400 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && data && data.items.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-slate-500">
                  Không có dữ liệu.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && (
        <AdminPaginationFooter
          page={page}
          totalPages={data.totalPages}
          totalCount={data.totalCount}
          onPageChange={setPage}
          disabled={loading}
        />
      )}

    </div>
  );
}
