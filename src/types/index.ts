export type Language = 'en' | 'bn';

export type UserRole = 'customer' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  division?: string;
  district?: string;
  upazila?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductStatus = 'active' | 'draft' | 'out_of_stock';

export interface ProductVariant {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  nameEn: string;
  nameBn: string;
  sku: string;
  descriptionEn: string;
  descriptionBn: string;
  categoryId: string;
  categoryNameEn?: string;
  categoryNameBn?: string;
  regularPrice: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  variants?: ProductVariant[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  flashSaleDiscountPercent?: number;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  isDemo?: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  nameEn: string;
  nameBn: string;
  slug: string;
  icon?: string;
  image?: string;
  productCount?: number;
  order?: number;
}

export interface CartItem {
  id: string; // unique item id in cart (productId + variant + size + color)
  productId: string;
  productNameEn: string;
  productNameBn: string;
  price: number;
  regularPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  image: string;
  maxStock: number;
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'shurjopay';
export type PaymentStatus = 'unpaid' | 'pending_verification' | 'paid' | 'refunded';
export type DeliveryType = 'courier' | 'own';

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  division: string;
  district: string;
  upazila: string;
  areaVillage: string;
  deliveryAddress: string;
  orderNotes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  couponCode?: string;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTrxId?: string;
  deliveryType: DeliveryType;
  courierName?: string;
  trackingNumber?: string;
  status: OrderStatus;
  isDemo?: boolean;
  statusTimeline: OrderStatusEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
}

export interface BannerSlide {
  id: string;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  badgeEn?: string;
  badgeBn?: string;
  imageUrl: string;
  linkCategoryId?: string;
  buttonTextEn?: string;
  buttonTextBn?: string;
  isActive: boolean;
  order: number;
}

export interface StoreNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'order' | 'promo' | 'system';
  createdAt: string;
  orderId?: string;
}

export interface StoreSettings {
  id: string;
  shopNameEn: string;
  shopNameBn: string;
  taglineEn: string;
  taglineBn: string;
  phone: string;
  whatsapp: string;
  email: string;
  addressEn: string;
  addressBn: string;
  facebookUrl: string;
  insideDhakaDelivery: number;
  outsideDhakaDelivery: number;
  ownDeliveryCharge: number;
  courierDeliveryCharge: number;
  freeDeliveryThreshold: number;
  codEnabled: boolean;
  bkashEnabled: boolean;
  bkashMerchantNumber: string;
  nagadEnabled: boolean;
  nagadMerchantNumber: string;
  rocketEnabled: boolean;
  rocketMerchantNumber: string;
  shurjopayEnabled: boolean;
}
