import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import AdminListToolbar from "../components/AdminListToolbar";
import AdminPaginationFooter from "../components/AdminPaginationFooter";
import { useAdminPagedList } from "../hooks/useAdminPagedList";
import {
  createAdminBanner,
  deleteAdminBanner,
  getAdminBanner,
  getAdminBannersPaged,
  updateAdminBanner,
  type AdminBannerListItem,
  type AdminUpsertBanner,
} from "../services/adminApi";

const empty: AdminUpsertBanner = {
  urlImg: "",
  title: "",
  link: "",
  isMain: false,
  displayOrder: 0,
};

export default function AdminBannersPage() {
  const load = useCallback(
    async (args: { page: number; pageSize: number; search: string }) => {
      return getAdminBannersPaged({
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
  } = useAdminPagedList<AdminBannerListItem>(load);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdminUpsertBanner>(empty);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditingId(null);
    setForm(empty);
    setModalOpen(true);
  };

  const openEdit = async (id: string) => {
    try {
      const b = await getAdminBanner(id);
      setEditingId(id);
      setForm({
        urlImg: b.urlImg,
        title: b.title ?? "",
        link: b.link ?? "",
        isMain: b.isMain,
        displayOrder: b.displayOrder,
      });
      setModalOpen(true);
    } catch {
      toast.error("Không tải được banner.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body: AdminUpsertBanner = {
        urlImg: form.urlImg.trim(),
        title: form.title?.trim() || null,
        link: form.link?.trim() || null,
        isMain: form.isMain,
        displayOrder: Number(form.displayOrder) || 0,
      };
      if (editingId) {
        await updateAdminBanner(editingId, body);
        toast.success("Đã cập nhật.");
      } else {
        await createAdminBanner(body);
        toast.success("Đã tạo banner.");
      }
      setModalOpen(false);
      void reload();
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xóa banner này?")) return;
    try {
      await deleteAdminBanner(id);
      toast.success("Đã xóa.");
      void reload();
    } catch {
      toast.error("Xóa thất bại.");
    }
  };

  return (
    <div className="space-y-4 text-slate-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Banner trang chủ</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-sm text-white hover:bg-emerald-600"
        >
          + Thêm banner
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
              <th className="px-3 py-2 text-left text-slate-400">Ảnh</th>
              <th className="px-3 py-2 text-left text-slate-400">Tiêu đề</th>
              <th className="px-3 py-2 text-center text-slate-400">Chính</th>
              <th className="px-3 py-2 text-right text-slate-400">Thứ tự</th>
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
                <tr key={row.homeBannerId}>
                  <td className="px-3 py-2">
                    <img
                      src={row.urlImg}
                      alt=""
                      className="h-12 w-20 rounded object-cover"
                    />
                  </td>
                  <td className="px-3 py-2">{row.title ?? "—"}</td>
                  <td className="px-3 py-2 text-center">{row.isMain ? "✓" : ""}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{row.displayOrder}</td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => void openEdit(row.homeBannerId)}
                      className="mr-2 text-sky-400 hover:underline"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.homeBannerId)}
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
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Sửa banner" : "Thêm banner"}
            </h2>
            <div className="space-y-3 text-sm">
              <label className="block">
                <span className="text-slate-400">URL ảnh *</span>
                <input
                  required
                  type="url"
                  value={form.urlImg}
                  onChange={(e) => setForm((f) => ({ ...f, urlImg: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-slate-400">Tiêu đề</span>
                <input
                  value={form.title ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-slate-400">Link</span>
                <input
                  type="url"
                  value={form.link ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="block">
                <span className="text-slate-400">Thứ tự</span>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                  }
                  className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isMain}
                  onChange={(e) => setForm((f) => ({ ...f, isMain: e.target.checked }))}
                />
                Banner chính
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
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
