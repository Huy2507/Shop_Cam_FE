import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminCategoriesLookup,
  getAdminProduct,
  getAdminProductsPaged,
  updateAdminProduct,
  type AdminCategoryLookup,
  type AdminProductListItem,
  type AdminUpsertProduct,
} from "../services/adminApi";

const emptyForm: AdminUpsertProduct = {
  name: "",
  price: 0,
  discount: null,
  info: "",
  description: "",
  imageUrl: "",
  isNew: false,
  outOfStock: false,
  badge: "",
  productCategoryId: null,
};

export default function AdminProductsPage() {
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminProductsPaged({
        page: args.page,
        pageSize: args.pageSize,
        search: args.search || undefined,
      });
    },
    [],
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

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminUpsertProduct>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<AdminCategoryLookup[]>([]);

  useEffect(() => {
    void getAdminCategoriesLookup().then(setCategories).catch(() => {});
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (id: string) => {
    try {
      const d = await getAdminProduct(id);
      setEditingId(id);
      setForm({
        name: d.name,
        price: d.price,
        discount: d.discount ?? null,
        info: d.info ?? "",
        description: d.description ?? "",
        imageUrl: d.imageUrl,
        isNew: d.isNew,
        outOfStock: d.outOfStock,
        badge: d.badge ?? "",
        productCategoryId: d.productCategoryId ?? null,
      });
      setModalOpen(true);
    } catch {
      toast.error("Không tải được sản phẩm.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: AdminUpsertProduct = {
        ...form,
        info: form.info?.trim() || null,
        description: form.description?.trim() || null,
        badge: form.badge?.trim() || null,
        discount: form.discount === null || form.discount === undefined ? null : Number(form.discount),
      };
      if (editingId) {
        await updateAdminProduct(editingId, payload);
        toast.success("Đã cập nhật.");
      } else {
        await createAdminProduct(payload);
        toast.success("Đã tạo sản phẩm.");
      }
      setModalOpen(false);
      void reload();
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

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
          onClick={openCreate}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
        >
          + Thêm sản phẩm
        </button>
      </div>

      <AdminListToolbar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={submitSearch}
        pageSize={pageSize}
        onPageSizeChange={setPageSize}
        disabled={loading}
      />

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900">
            <tr>
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
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row) => (
                <tr key={row.productId} className="hover:bg-slate-900/80">
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {row.price.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-slate-400">{row.categoryName ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{row.isNew ? "✓" : ""}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void openEdit(row.productId)}
                      className="mr-2 text-sky-400 hover:underline"
                    >
                      Sửa
                    </button>
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
                <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Sửa sản phẩm" : "Thêm sản phẩm"}
            </h2>
            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
              <label className="block text-sm">
                <span className="text-slate-400">Tên *</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Giá *</span>
                <input
                  required
                  type="number"
                  min={0}
                  step={1000}
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Giảm giá</span>
                <input
                  type="number"
                  min={0}
                  value={form.discount ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      discount: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">URL ảnh *</span>
                <input
                  required
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Danh mục</span>
                <select
                  value={form.productCategoryId ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      productCategoryId: e.target.value || null,
                    }))
                  }
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                >
                  <option value="">— Không —</option>
                  {categories.map((c) => (
                    <option key={c.productCategoryId} value={c.productCategoryId}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Mô tả ngắn / Info</span>
                <input
                  value={form.info ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, info: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Mô tả dài</span>
                <textarea
                  rows={3}
                  value={form.description ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-400">Badge</span>
                <input
                  value={form.badge ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <div className="flex gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))}
                  />
                  Sản phẩm mới
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.outOfStock}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, outOfStock: e.target.checked }))
                    }
                  />
                  Hết hàng
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded border border-slate-600 px-4 py-2 text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white disabled:opacity-50"
                >
                  {saving ? "Đang lưu…" : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
