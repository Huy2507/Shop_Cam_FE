import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAdminSideAd,
  getAdminSideAd,
  uploadAdminImage,
  updateAdminSideAd,
  type AdminUpsertSideAd,
} from "../services/adminApi";

const empty: AdminUpsertSideAd = {
  name: "",
  position: "left",
  imageUrl: "",
  link: "",
  openInNewTab: true,
  displayOrder: 0,
  startTime: "",
  endTime: "",
  isActive: true,
};

export default function AdminSideAdFormPage() {
  const { sideAdId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminUpsertSideAd>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sideAdId) return;
    void (async () => {
      const ad = await getAdminSideAd(sideAdId);
      setForm({
        name: ad.name,
        position: ad.position,
        imageUrl: ad.imageUrl,
        link: ad.link ?? "",
        openInNewTab: ad.openInNewTab,
        displayOrder: ad.displayOrder,
        startTime: ad.startTime ?? "",
        endTime: ad.endTime ?? "",
        isActive: ad.isActive,
      });
    })();
  }, [sideAdId]);

  return (
    <div className="max-w-xl space-y-4 text-slate-100">
      <h1 className="text-xl font-semibold">{sideAdId ? "Sửa quảng cáo" : "Thêm quảng cáo"}</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setSaving(true);
          try {
            const body: AdminUpsertSideAd = {
              ...form,
              name: form.name.trim(),
              imageUrl: form.imageUrl.trim(),
              link: form.link?.trim() || null,
              startTime: form.startTime || null,
              endTime: form.endTime || null,
            };
            if (sideAdId) await updateAdminSideAd(sideAdId, body);
            else await createAdminSideAd(body);
            toast.success("Đã lưu.");
            navigate("/side-ads");
          } catch {
            toast.error("Lưu thất bại.");
          } finally {
            setSaving(false);
          }
        }}
        className="space-y-3"
      >
        <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Tên" />
        <select value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value as "left" | "right" }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"><option value="left">left</option><option value="right">right</option></select>
        <input required value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Image URL" />
        <input
          type="file"
          accept="image/*"
          className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
              const r = await uploadAdminImage(file);
              setForm((f) => ({ ...f, imageUrl: r.url }));
              toast.success("Upload ảnh thành công.");
            } catch {
              toast.error("Upload ảnh thất bại.");
            }
          }}
        />
        <input value={form.link ?? ""} onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Link" />
        <input type="number" value={form.displayOrder} onChange={(e) => setForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))} className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" placeholder="Thứ tự" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.openInNewTab} onChange={(e) => setForm((f) => ({ ...f, openInNewTab: e.target.checked }))} />Mở tab mới</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />Đang bật</label>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => navigate("/side-ads")} className="rounded border border-slate-600 px-4 py-2">Hủy</button>
          <button type="submit" disabled={saving} className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white">{saving ? "…" : "Lưu"}</button>
        </div>
      </form>
    </div>
  );
}

