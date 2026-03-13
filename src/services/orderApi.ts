import api from "./axiosConfig";

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  items: CreateOrderItemPayload[];
}

export interface CreateOrderResponse {
  orderId: string;
  code: string;
  totalAmount: number;
}

/**
 * Gửi request tạo đơn hàng sang BE.
 * API: POST /api/orders
 */
export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await api.post<CreateOrderResponse>("/api/orders", payload);
  return res.data;
}

