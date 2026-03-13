/**
 * Một dòng trong giỏ hàng: thông tin sản phẩm thu gọn + số lượng.
 * Lưu vào localStorage nên chỉ dùng dữ liệu serializable.
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  discount?: number;
  imageUrl: string;
  quantity: number;
}
