export interface Banner {
  id: string;
  urlimg: string;
  title?: string;
  link?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  info?: string;
  imageUrl: string;
  isNew?: boolean;
  outOfStock?: boolean;
  badge?: string;
  /** Tên danh mục (catalog / PDP). */
  categoryName?: string;
}

/** Chi tiết sản phẩm — trang PDP. */
export interface ProductDetail extends Product {
  description?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
  excerpt?: string;
  link?: string;
}

export interface NewsDetail extends NewsItem {
  body?: string;
  publishedAt?: string;
}

/** Phản hồi GET /api/home/catalog */
export interface CatalogResponse {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ProductReviewsResponse {
  items: ProductReview[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  averageRating: number | null;
}
