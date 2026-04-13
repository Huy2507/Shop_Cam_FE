import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createAdminProduct,
  getAdminCategoriesLookup,
  getAdminProduct,
  uploadAdminImage,
  updateAdminProduct,
  type AdminCategoryLookup,
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

export default function AdminProductFormPage() {
  const { productId } = useParams();
  const isEdit = Boolean(productId);
  const navigate = useNavigate();
  const [form, setForm] = useState<AdminUpsertProduct>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [categories, setCategories] = useState<AdminCategoryLookup[]>([]);

  useEffect(() => {
    void getAdminCategoriesLookup().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!productId) return;
    void (async () => {
      try {
        const d = await getAdminProduct(productId);
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
      } catch {
        toast.error("Không tải được sản phẩm.");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

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
      if (productId) {
        await updateAdminProduct(productId, payload);
        toast.success("Đã cập nhật.");
      } else {
        await createAdminProduct(payload);
        toast.success("Đã tạo sản phẩm.");
      }
      navigate("/products");
    } catch {
      toast.error("Lưu thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-slate-400">Đang tải…</p>;

  return (
    <div className="max-w-3xl space-y-4 text-slate-100">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h1>
        <button type="button" onClick={() => navigate("/products")} className="rounded border border-slate-600 px-4 py-2">
          Quay lại
        </button>
      </div>
      <form onSubmit={(e) => void handleSubmit(e)} className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block text-sm md:col-span-2"><span className="text-slate-400">Tên *</span><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm"><span className="text-slate-400">Giá *</span><input required type="number" min={0} step={1000} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm"><span className="text-slate-400">Giảm giá</span><input type="number" min={0} value={form.discount ?? ""} onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value === "" ? null : Number(e.target.value) }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm md:col-span-2"><span className="text-slate-400">URL ảnh *</span><input required type="url" value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm md:col-span-2">
          <span className="text-slate-400">Upload ảnh</span>
          <input
            type="file"
            accept="image/*"
            className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
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
        </label>
        <label className="block text-sm"><span className="text-slate-400">Danh mục</span><select value={form.productCategoryId ?? ""} onChange={(e) => setForm((f) => ({ ...f, productCategoryId: e.target.value || null }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"><option value="">— Không —</option>{categories.map((c) => <option key={c.productCategoryId} value={c.productCategoryId}>{c.name}</option>)}</select></label>
        <label className="block text-sm"><span className="text-slate-400">Badge</span><input value={form.badge ?? ""} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm md:col-span-2"><span className="text-slate-400">Info</span><input value={form.info ?? ""} onChange={(e) => setForm((f) => ({ ...f, info: e.target.value }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <label className="block text-sm md:col-span-2"><span className="text-slate-400">Mô tả dài</span><textarea rows={4} value={form.description ?? ""} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="mt-1 w-full rounded border border-slate-600 bg-slate-900 px-3 py-2" /></label>
        <div className="flex gap-4 text-sm md:col-span-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.isNew} onChange={(e) => setForm((f) => ({ ...f, isNew: e.target.checked }))} />Sản phẩm mới</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.outOfStock} onChange={(e) => setForm((f) => ({ ...f, outOfStock: e.target.checked }))} />Hết hàng</label>
        </div>
        <div className="md:col-span-2 flex justify-end gap-2 pt-2">
          <button type="button" onClick={() => navigate("/products")} className="rounded border border-slate-600 px-4 py-2 text-slate-300">Hủy</button>
          <button type="submit" disabled={saving} className="rounded bg-[var(--site-primary,#dc2626)] px-4 py-2 text-white disabled:opacity-50">{saving ? "Đang lưu…" : "Lưu"}</button>
        </div>
      </form>
    </div>
  );
}

