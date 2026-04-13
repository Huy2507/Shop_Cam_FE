import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAdminBanner,
  getAdminBanner,
  uploadAdminImage,
  updateAdminBanner,
  type AdminUpsertBanner,
} from "../services/adminApi";

const empty: AdminUpsertBanner = { urlImg: "", title: "", link: "", isMain: false, displayOrder: 0 };

export default function AdminBannerFormPage() {
  const { bannerId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminUpsertBanner>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bannerId) return;
    void (async () => {
      const b = await getAdminBanner(bannerId);
      setForm({ urlImg: b.urlImg, title: b.title ?? "", link: b.link ?? "", isMain: b.isMain, displayOrder: b.displayOrder });
    })();
  }, [bannerId]);

  return (
    <div className="max-w-xl space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">{bannerId ? "Sửa banner" : "Thêm banner"}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const body = { ...form, urlImg: form.urlImg.trim(), title: form.title?.trim() || null, link: form.link?.trim() || null };
            if (bannerId) await updateAdminBanner(bannerId, body);
            else await createAdminBanner(body);
            toast.success("Đã lưu.");
            navigate("/banners");
          } catch {
            toast.error("Lưu thất bại.");
          } finally { setSaving(false); }
        }}
        className="space-y-3"
      >
        <input required value={form.urlImg} onChange={(e) => setForm((f) => ({ ...f, urlImg: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Image URL" />
        <input
          type="file"
          accept="image/*"
          className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const r = await uploadAdminImage(file);
              setForm((f) => ({ ...f, urlImg: r.url }));
              toast.success("Upload ảnh thành công.");
            } catch {
              toast.error("Upload ảnh thất bại.");
            }
          }}
        />
        <input value={form.title ?? ""} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Tiêu đề" />
        <input value={form.link ?? ""} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Link" />
        <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Thứ tự" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isMain} onChange={(e) => setForm((f) => ({ ...f, isMain: e.target.checked }))} />Banner chính</label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate("/banners")} className="rounded border border-slate-600 px-4 py-2">Hủy</button>
          <button type="submit" disabled={saving} className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white">{saving ? "…" : "Lưu"}</button>
        </div>
      </form>
    </div>
  );
}

