import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "../types/home";
import type { CartItem } from "../types/cart";

// Key cố định dùng để lưu giỏ hàng vào localStorage.
const CART_STORAGE_KEY = "shopcam_cart";

/**
 * Đọc giỏ hàng từ localStorage.
 * Trả về mảng rỗng nếu không có hoặc dữ liệu bị lỗi.
 */
function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Nếu JSON bị lỗi hoặc trình duyệt chặn localStorage thì trả về danh sách rỗng.
    return [];
  }
}

/**
 * Ghi danh sách giỏ hàng hiện tại xuống localStorage.
 * Bắt lỗi nhẹ nhàng để không chặn luồng UI.
 */
function saveCartToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Trường hợp private mode / đầy quota: bỏ qua, vẫn giữ state trong memory.
  }
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  /** Thêm sản phẩm vào giỏ (nếu đã tồn tại thì cộng dồn số lượng). */
  addItem: (product: Product, quantity: number) => void;
  /** Xoá hẳn một dòng sản phẩm khỏi giỏ. */
  removeItem: (productId: string) => void;
  /** Cập nhật lại số lượng hiện tại; nếu quantity < 1 thì tự động xoá dòng đó. */
  updateQuantity: (productId: string, quantity: number) => void;
  /** Xoá toàn bộ giỏ hàng (dùng sau khi đặt hàng thành công). */
  clearCart: () => void;
  /** Mở modal thêm vào giỏ (từ ProductCard gọi với product). */
  openAddToCartModal: (product: Product) => void;
  closeAddToCartModal: () => void;
  /** Product đang hiển thị trong modal (null = modal đóng). */
  modalProduct: Product | null;
}

// Context chia sẻ state giỏ hàng cho toàn bộ ứng dụng.
const CartContext = createContext<CartContextValue | null>(null);

/**
 * CartProvider bọc quanh App để:
 * - lưu trữ danh sách giỏ hàng
 * - đồng bộ với localStorage
 * - quản lý việc mở/đóng modal thêm vào giỏ.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  // Mỗi khi items thay đổi, đồng bộ lại xuống localStorage.
  useEffect(() => {
    saveCartToStorage(items);
  }, [items]);

  /**
   * Thêm sản phẩm vào giỏ.
   * - Nếu đã có sản phẩm đó: cộng dồn quantity.
   * - Nếu chưa có: push một CartItem mới.
   */
  const addItem = useCallback((product: Product, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      const next = existing
        ? prev.map((i) =>
            i.productId === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              discount: product.discount,
              imageUrl: product.imageUrl,
              quantity,
            },
          ];
      return next;
    });
  }, []);

  // Xoá một dòng khỏi giỏ bằng productId.
  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  /**
   * Cập nhật số lượng 1 item.
   * - Nếu quantity < 1: coi như xoá khỏi giỏ.
   */
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    );
  }, []);

  // Xoá sạch toàn bộ giỏ hàng.
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Tổng số sản phẩm trong giỏ (cộng toàn bộ quantity).
  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  // Tổng tiền phải thanh toán, đã tính đến giảm giá nếu có.
  const totalAmount = useMemo(() => {
    return items.reduce((sum, i) => {
      const price = i.discount != null && i.discount > 0 ? i.price - i.discount : i.price;
      return sum + price * i.quantity;
    }, 0);
  }, [items]);

  // Khi người dùng bấm "Thêm vào giỏ" ở ProductCard: mở modal với sản phẩm tương ứng.
  const openAddToCartModal = useCallback((product: Product) => {
    setModalProduct(product);
  }, []);

  // Đóng modal thêm vào giỏ.
  const closeAddToCartModal = useCallback(() => {
    setModalProduct(null);
  }, []);

  // Gom toàn bộ state + hàm handler lại để truyền xuống qua Context.
  const value = useMemo<CartContextValue>(
    () => ({
      items,
      totalCount,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openAddToCartModal,
      closeAddToCartModal,
      modalProduct,
    }),
    [
      items,
      totalCount,
      totalAmount,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openAddToCartModal,
      closeAddToCartModal,
      modalProduct,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
