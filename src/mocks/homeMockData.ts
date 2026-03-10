import type { Banner, NewsItem, Product } from "../types/home";

export const mockBanners: Banner[] = [
  {
    id: "1",
    urlimg: "https://picsum.photos/1200/400?random=1",
    title: "CYBER MONDAY ONLINE SALE",
    link: "#",
  },
];

export const mockPromoBanners: Banner[] = [
  {
    id: "p1",
    urlimg: "https://picsum.photos/280/120?random=lg",
    title: "CHUYÊN TRANG LG KHUYẾN MÃI ĐẾN 50%",
  },
  {
    id: "p2",
    urlimg: "https://picsum.photos/280/120?random=samsung",
    title: "SAMSUNG SIÊU SALE THÁNG 6",
  },
  {
    id: "p3",
    urlimg: "https://picsum.photos/280/120?random=deal",
    title: "Gian hàng SAMSUNG SĂN DEAL CỰC KHỦNG",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Camera bóng đèn chuẩn HD 960P (Sao chép)",
    price: 1125000,
    discount: 330000,
    info: "MUA 2 GIẢM 100K",
    imageUrl: "https://picsum.photos/220/220?random=cam1",
    badge: "Giảm -29%",
    outOfStock: false,
  },
  {
    id: "2",
    name: "Camera bóng đèn chuẩn HD 960P (Sao chép)",
    price: 1125000,
    discount: 330000,
    info: "MUA 2 GIẢM 100K",
    imageUrl: "https://picsum.photos/220/220?random=cam2",
    badge: "Giảm -29%",
    outOfStock: true,
  },
  {
    id: "3",
    name: "Camera WiFi Hikvision 2MP",
    price: 850000,
    discount: 0,
    imageUrl: "https://picsum.photos/220/220?random=cam3",
    outOfStock: false,
  },
  {
    id: "4",
    name: "Camera Dome IP 1080P",
    price: 1500000,
    discount: 450000,
    info: "MUA 2 GIẢM 100K",
    imageUrl: "https://picsum.photos/220/220?random=cam4",
    badge: "Giảm -30%",
    outOfStock: false,
  },
  {
    id: "5",
    name: "Camera Yoosee Giá Rẻ",
    price: 450000,
    discount: 90000,
    imageUrl: "https://picsum.photos/220/220?random=cam5",
    badge: "Giảm -20%",
    isNew: true,
    outOfStock: false,
  },
];

export const mockNews: NewsItem[] = [
  {
    id: "n1",
    title: "Camera quan sát có ghi âm được không? Loại nào rẻ nhất?",
    imageUrl: "https://picsum.photos/400/250?random=news1",
    excerpt: "Hướng dẫn chọn camera có ghi âm",
  },
  {
    id: "n2",
    title: "Camera quan sát có ghi âm được không? Loại nào rẻ nhất?",
    imageUrl: "https://picsum.photos/200/200?random=news2",
  },
  {
    id: "n3",
    title: "Lắp đặt camera an ninh cho gia đình",
    imageUrl: "https://picsum.photos/200/200?random=news3",
  },
  {
    id: "n4",
    title: "So sánh camera WiFi và camera có dây",
    imageUrl: "https://picsum.photos/200/200?random=news4",
  },
  {
    id: "n5",
    title: "Bảo mật camera IP - Những điều cần biết",
    imageUrl: "https://picsum.photos/200/200?random=news5",
  },
  {
    id: "n6",
    title: "Camera thông minh tích hợp AI",
    imageUrl: "https://picsum.photos/200/200?random=news6",
  },
];

export const mockCategories = [
  "Đầu ghi Camera",
  "Phụ Kiện Camera",
  "Thiết bị chống trộm",
  "Máy Chấm Công",
  "Thiết Bị Mạng",
  "Thiết Bị Gia Đình",
  "Camera Yoosee",
  "Trọn Bộ Camera Hikvision IP",
  "Trọn Bộ Camera Hikvision HDTVI",
];
