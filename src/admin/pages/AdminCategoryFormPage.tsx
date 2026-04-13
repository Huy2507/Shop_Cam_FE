import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAdminCategory,
  getAdminCategory,
  updateAdminCategory,
  type AdminUpsertCategory,
} from "../services/adminApi";

export default function AdminCategoryFormPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminUpsertCategory>({ name: "", slug: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!categoryId) return;
    void (async () => {
      try {
        const c = await getAdminCategory(categoryId);
        setForm({ name: c.name, slug: c.slug ?? "" });
      } catch {
        toast.error("Không tải được danh mục.");
      }
    })();
  }, [categoryId]);

  return (
    <div className="max-w-xl space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">{categoryId ? "Sửa danh mục" : "Thêm danh mục"}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const body = { name: form.name.trim(), slug: form.slug?.trim() || null };
            if (categoryId) await updateAdminCategory(categoryId, body);
            else await createAdminCategory(body);
            toast.success("Đã lưu.");
            navigate("/categories");
          } catch {
            toast.error("Lưu thất bại.");
          } finally {
            setSaving(false);
          }
        }}
        className="space-y-3"
      >
        <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Tên" />
        <input value={form.slug ?? ""} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Slug" />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate("/categories")} className="rounded border border-slate-600 px-4 py-2">Hủy</button>
          <button type="submit" disabled={saving} className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white">{saving ? "…" : "Lưu"}</button>
        </div>
      </form>
    </div>
  );
}

