import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";
import { createOrder } from "../../services/orderApi";
import { formatVnd } from "@utils/formatVnd";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal "Đặt hàng":
 * - Thu thập thông tin khách hàng (tên, sdt, email, địa chỉ, ghi chú)
 * - Gửi đơn hàng lên BE (POST /api/orders)
 * - Nếu thành công: clear giỏ và hiển thị mã đơn
 */
export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      customerName.trim().length > 0 &&
      phone.trim().length > 0 &&
      address.trim().length > 0 &&
      !isSubmitting
    );
  }, [items.length, customerName, phone, address, isSubmitting]);

  if (!open) return null;

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    onClose();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        address: address.trim(),
        note: note.trim() || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };
      const res = await createOrder(payload);
      clearCart();
      onClose();
      navigate("/dat-hang-thanh-cong", {
        state: {
          code: res.code,
          orderId: res.orderId,
          totalAmount: res.totalAmount ?? totalAmount,
        },
      });
    } catch {
      setError(t("common.storefront.errors.createOrder"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="checkout-title" className="text-lg font-semibold text-slate-800">
            {t("common.storefront.order")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label={t("common.storefront.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t("common.storefront.fullName")} *</label>
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder={t("common.storefront.fullNameExample")}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t("common.storefront.phone")} *</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                placeholder="0901234567"
              />
            </div>
          </div>

          <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">{t("common.storefront.email")}</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder="a@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("common.storefront.address")} *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder={t("common.storefront.addressPlaceholder")}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">{t("common.storefront.note")}</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              placeholder={t("common.storefront.notePlaceholder")}
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            {t("common.storefront.totalPayment")}:{" "}
            <strong className="text-red-600">{formatVnd(totalAmount)}</strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            disabled={isSubmitting}
          >
            {t("common.storefront.cancel")}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSubmitting ? t("common.storefront.submitting") : t("common.storefront.confirmOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}

