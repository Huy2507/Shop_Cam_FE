import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategoriesPaged,
  updateAdminCategory,
  type AdminCategoryListItem,
  type AdminUpsertCategory,
} from "../services/adminApi";

export default function AdminCategoriesPage() {
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminCategoriesPaged({
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
  } = useAdminPagedList<AdminCategoryListItem>(load);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminUpsertCategory>({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: "", slug: "" });
    setModalOpen(true);
  };

  const openEdit = (row: AdminCategoryListItem) => {
    setEditingId(row.productCategoryId);
    setForm({ name: row.name, slug: row.slug ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: AdminUpsertCategory = {
        name: form.name.trim(),
        slug: form.slug?.trim() || null,
      };
      if (editingId) {
        await updateAdminCategory(editingId, body);
        toast.success("Đã cập nhật.");
      } else {
        await createAdminCategory(body);
        toast.success("Đã tạo danh mục.");
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
    if (!window.confirm(`Xóa danh mục "${name}"?`)) return;
    try {
      await deleteAdminCategory(id);
      toast.success("Đã xóa.");
      void reload();
    } catch {
      toast.error("Không xóa được (còn sản phẩm).");
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Danh mục</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600"
        >
          + Thêm danh mục
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
              <th className="px-3 py-2 text-left text-slate-400">Slug</th>
              <th className="px-3 py-2 text-right text-slate-400">Số SP</th>
              <th className="px-3 py-2 text-right text-slate-400">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  Đang tải…
                </td>
              </tr>
            )}
            {!loading &&
              data?.items.map((row) => (
                <tr key={row.productCategoryId}>
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  <td className="px-3 py-2 text-slate-400">{row.slug ?? "—"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.productCount}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(row)}
                      className="mr-2 text-sky-400 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.productCategoryId, row.name)}
                      className="text-red-400 hover:underline"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            {!loading && data && data.items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
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
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Sửa danh mục" : "Thêm danh mục"}
            </h2>
            <label className="mb-3 block text-sm">
              <span className="text-slate-400">Tên *</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              />
            </label>
            <label className="mb-4 block text-sm">
              <span className="text-slate-400">Slug</span>
              <input
                value={form.slug ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded border border-slate-600 px-4 py-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white disabled:opacity-50"
              >
                {saving ? "…" : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
