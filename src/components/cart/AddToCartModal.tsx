import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../../contexts/CartContext";

// Format giá về VND để hiển thị trong modal.
const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

/**
 * Modal xác nhận thêm sản phẩm vào giỏ: chọn số lượng và bấm Xác nhận.
 * Hiển thị khi CartContext.modalProduct != null (mở từ nút "Thêm vào giỏ" ở ProductCard).
 */
export default function AddToCartModal() {
  const { modalProduct, closeAddToCartModal, addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Mỗi lần mở modal cho sản phẩm mới thì reset quantity về 1.
  useEffect(() => {
    if (modalProduct) setQuantity(1);
  }, [modalProduct]);

  if (!modalProduct) return null;

  // Tính lại đơn giá hiển thị trong modal (ưu tiên giá đã trừ discount).
  const hasDiscount = modalProduct.discount != null && modalProduct.discount > 0;
  const unitPrice = hasDiscount
    ? modalProduct.price - (modalProduct.discount ?? 0)
    : modalProduct.price;
  const lineTotal = unitPrice * quantity;

  // Khi xác nhận: thêm vào giỏ với số lượng đã chọn rồi đóng modal.
  const handleConfirm = () => {
    addItem(modalProduct, quantity);
    closeAddToCartModal();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-to-cart-title"
      onClick={closeAddToCartModal}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h2 id="add-to-cart-title" className="text-lg font-semibold text-slate-800">
            Thêm vào giỏ hàng
          </h2>
          <button
            type="button"
            onClick={closeAddToCartModal}
            className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-4 p-4">
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={modalProduct.imageUrl}
              alt={modalProduct.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-medium text-slate-800">
              {modalProduct.name}
            </p>
            <p className="mt-1 text-base font-bold text-red-600">
              {formatPrice(unitPrice)}
              {hasDiscount && (
                <span className="ml-2 text-sm font-normal text-slate-400 line-through">
                  {formatPrice(modalProduct.price)}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 py-3">
          <p className="mb-2 text-sm font-medium text-slate-700">Số lượng</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Giảm số lượng"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="min-w-[2rem] text-center font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              aria-label="Tăng số lượng"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <span className="text-sm text-slate-600">
            Tạm tính: <strong className="text-red-600">{formatPrice(lineTotal)}</strong>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={closeAddToCartModal}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Huỷ
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
