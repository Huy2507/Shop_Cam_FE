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
}

export interface NewsItem {
  id: string;
  title: string;
  imageUrl: string;
  excerpt?: string;
  link?: string;
}
