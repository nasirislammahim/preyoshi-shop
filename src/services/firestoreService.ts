import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';
import {
  Product,
  Category,
  Order,
  Review,
  Coupon,
  BannerSlide,
  StoreSettings,
  UserProfile,
  StoreNotification,
  OrderStatus
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS
} from '../data/initialData';

const LOCAL_STORAGE_KEYS = {
  PRODUCTS: 'preyoshi_products',
  CATEGORIES: 'preyoshi_categories',
  BANNERS: 'preyoshi_banners',
  COUPONS: 'preyoshi_coupons',
  SETTINGS: 'preyoshi_settings',
  ORDERS: 'preyoshi_orders',
  NOTIFICATIONS: 'preyoshi_notifications',
  REVIEWS: 'preyoshi_reviews'
};

// Seed or load initial data helper
export async function initializeStoreData(): Promise<{
  categories: Category[];
  products: Product[];
  banners: BannerSlide[];
  coupons: Coupon[];
  settings: StoreSettings;
}> {
  let categories: Category[] = [];
  let products: Product[] = [];
  let banners: BannerSlide[] = [];
  let coupons: Coupon[] = [];
  let settings: StoreSettings = INITIAL_SETTINGS;

  try {
    // 1. Fetch Categories
    const catSnap = await getDocs(collection(db, 'categories'));
    if (!catSnap.empty) {
      categories = catSnap.docs.map(d => d.data() as Category);
    } else {
      categories = [...INITIAL_CATEGORIES];
    }

    // 2. Fetch Products
    const prodSnap = await getDocs(collection(db, 'products'));
    if (!prodSnap.empty) {
      products = prodSnap.docs.map(d => d.data() as Product);
    } else {
      products = [...INITIAL_PRODUCTS];
    }

    // 3. Fetch Banners
    const banSnap = await getDocs(collection(db, 'banners'));
    if (!banSnap.empty) {
      banners = banSnap.docs.map(d => d.data() as BannerSlide);
    } else {
      banners = [...INITIAL_BANNERS];
    }

    // 4. Fetch Coupons
    const coupSnap = await getDocs(collection(db, 'coupons'));
    if (!coupSnap.empty) {
      coupons = coupSnap.docs.map(d => d.data() as Coupon);
    } else {
      coupons = [...INITIAL_COUPONS];
    }

    // 5. Fetch Settings
    const setSnap = await getDoc(doc(db, 'settings', 'store-settings'));
    if (setSnap.exists()) {
      settings = setSnap.data() as StoreSettings;
    } else {
      settings = INITIAL_SETTINGS;
    }
  } catch (err) {
    console.warn('Using cached or initial datasets due to connection / permissions:', err);
    // Fallback to local storage or bundled defaults
    const localProds = localStorage.getItem(LOCAL_STORAGE_KEYS.PRODUCTS);
    products = localProds ? JSON.parse(localProds) : INITIAL_PRODUCTS;

    const localCats = localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES);
    categories = localCats ? JSON.parse(localCats) : INITIAL_CATEGORIES;

    const localBanners = localStorage.getItem(LOCAL_STORAGE_KEYS.BANNERS);
    banners = localBanners ? JSON.parse(localBanners) : INITIAL_BANNERS;

    const localCoupons = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPONS);
    coupons = localCoupons ? JSON.parse(localCoupons) : INITIAL_COUPONS;

    const localSettings = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
    settings = localSettings ? JSON.parse(localSettings) : INITIAL_SETTINGS;
  }

  return { categories, products, banners, coupons, settings };
}

// Product Operations
export async function saveProduct(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Saved product to local state.');
    return;
  }
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (error) {
    console.warn('Could not sync product to Firestore:', error);
  }
}

export async function deleteProductById(productId: string): Promise<void> {
  const path = `products/${productId}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Deleted product from local state.');
    return;
  }
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    console.warn('Could not delete product from Firestore:', error);
  }
}

// Category Operations
export async function saveCategory(category: Category): Promise<void> {
  const path = `categories/${category.id}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Saved category to local state.');
    return;
  }
  try {
    await setDoc(doc(db, 'categories', category.id), category);
  } catch (error) {
    console.warn('Could not sync category to Firestore:', error);
  }
}

export async function deleteCategoryById(categoryId: string): Promise<void> {
  const path = `categories/${categoryId}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Deleted category from local state.');
    return;
  }
  try {
    await deleteDoc(doc(db, 'categories', categoryId));
  } catch (error) {
    console.warn('Could not delete category from Firestore:', error);
  }
}

// Order Operations
export async function createOrder(order: Order): Promise<Order> {
  const path = `orders/${order.id}`;
  try {
    // 1. Record Order document in Firestore
    await setDoc(doc(db, 'orders', order.id), order);

    // Also save alias under orderNumber so direct getDoc(doc(db, 'orders', orderNumber)) works for guest lookup
    try {
      if (order.orderNumber && order.orderNumber !== order.id) {
        await setDoc(doc(db, 'orders', order.orderNumber), order);
      }
    } catch {
      // non-blocking
    }

    // 2. Save order to local storage for immediate guest/customer tracking
    try {
      const existingStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      const existing: Order[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [order, ...existing.filter(o => o.id !== order.id)];
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch {
      // non-blocking
    }

    // 3. If authenticated admin placed order, sync stock to Firestore
    if (auth.currentUser) {
      for (const item of order.items) {
        try {
          const prodRef = doc(db, 'products', item.productId);
          const pDoc = await getDoc(prodRef);
          if (pDoc.exists()) {
            const currentStock = pDoc.data().stock ?? 0;
            await updateDoc(prodRef, {
              stock: Math.max(0, currentStock - item.quantity),
              updatedAt: new Date().toISOString()
            });
          }
        } catch {
          // ignore non-admin stock update
        }
      }
    }

    // 4. Also store notification for the user
    if (order.userId) {
      const notif: StoreNotification = {
        id: `notif-${Date.now()}`,
        userId: order.userId,
        title: `Order Placed: ${order.orderNumber}`,
        message: `Your order for ৳${order.grandTotal.toLocaleString()} has been placed successfully. Payment Method: ${order.paymentMethod.toUpperCase()}.`,
        isRead: false,
        type: 'order',
        orderId: order.id,
        createdAt: new Date().toISOString()
      };
      try {
        await setDoc(doc(db, 'notifications', notif.id), notif);
      } catch {
        // non-blocking
      }
    }

    return order;
  } catch (error) {
    console.warn('Firestore createOrder encountered an error, falling back to local order:', error);
    // Still save to local storage so user does not lose order
    try {
      const existingStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
      const existing: Order[] = existingStr ? JSON.parse(existingStr) : [];
      const updated = [order, ...existing.filter(o => o.id !== order.id)];
      localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(updated));
    } catch {
      // non-blocking
    }
    return order;
  }
}

export async function fetchAllOrders(): Promise<Order[]> {
  const path = 'orders';
  if (!auth.currentUser) {
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return localStr ? JSON.parse(localStr) : [];
  }
  try {
    const snap = await getDocs(collection(db, 'orders'));
    const orders = snap.docs.map(d => d.data() as Order);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Could not fetch all orders from Firestore:', error);
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    return localStr ? JSON.parse(localStr) : [];
  }
}

export async function fetchOrdersByUserId(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), where('userId', '==', userId));
    const snap = await getDocs(q);
    const orders = snap.docs.map(d => d.data() as Order);
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Could not fetch user orders from Firestore:', error);
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    const localOrders: Order[] = localStr ? JSON.parse(localStr) : [];
    return localOrders.filter(o => o.userId === userId);
  }
}

export async function fetchOrderByIdOrPhone(searchTerm: string): Promise<Order | null> {
  const trimmed = searchTerm.trim();
  const path = 'orders';

  // 1. Check local storage first (instant & offline safe)
  try {
    const localStr = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    if (localStr) {
      const localOrders: Order[] = JSON.parse(localStr);
      const match = localOrders.find(
        o =>
          o.id?.toLowerCase() === trimmed.toLowerCase() ||
          o.orderNumber?.toLowerCase() === trimmed.toLowerCase() ||
          o.customerPhone === trimmed
      );
      if (match) return match;
    }
  } catch {
    // continue
  }

  // 2. Direct document lookup by ID or orderNumber (allowed by Firestore rules: allow get: if true;)
  try {
    const directDoc = await getDoc(doc(db, 'orders', trimmed));
    if (directDoc.exists()) {
      return directDoc.data() as Order;
    }
  } catch {
    // continue
  }

  // 3. Query by orderNumber or customerPhone ONLY if user is authenticated (rules allow list only when signed in / admin)
  if (auth.currentUser) {
    try {
      const qOrderNum = query(collection(db, 'orders'), where('orderNumber', '==', trimmed));
      const snapOrderNum = await getDocs(qOrderNum);
      if (!snapOrderNum.empty) {
        return snapOrderNum.docs[0].data() as Order;
      }

      const qPhone = query(collection(db, 'orders'), where('customerPhone', '==', trimmed));
      const snapPhone = await getDocs(qPhone);
      if (!snapPhone.empty) {
        return snapPhone.docs[0].data() as Order;
      }
    } catch {
      // ignore query permission errors
    }
  }

  return null;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  courierName?: string,
  trackingNumber?: string,
  note?: string
): Promise<void> {
  const path = `orders/${orderId}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Updated order status in local state.');
    return;
  }
  try {
    const orderRef = doc(db, 'orders', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) {
      console.warn('Order document not found in Firestore for update');
      return;
    }

    const orderData = snap.data() as Order;
    const timeline = orderData.statusTimeline || [];
    timeline.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${newStatus}`
    });

    const updates: Partial<Order> = {
      status: newStatus,
      statusTimeline: timeline,
      updatedAt: new Date().toISOString()
    };

    if (courierName) updates.courierName = courierName;
    if (trackingNumber) updates.trackingNumber = trackingNumber;

    await updateDoc(orderRef, updates);

    // If order is cancelled, optionally restock products
    if (newStatus === 'Cancelled' && orderData.status !== 'Cancelled') {
      for (const item of orderData.items) {
        try {
          const prodRef = doc(db, 'products', item.productId);
          const pDoc = await getDoc(prodRef);
          if (pDoc.exists()) {
            await updateDoc(prodRef, {
              stock: (pDoc.data().stock ?? 0) + item.quantity,
              updatedAt: new Date().toISOString()
            });
          }
        } catch {
          // ignore restock errors
        }
      }
    }
  } catch (error) {
    console.warn('Could not sync status update to Firestore:', error);
  }
}

// Banner & Settings Operations
export async function saveBanner(banner: BannerSlide): Promise<void> {
  const path = `banners/${banner.id}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Saved banner to local state.');
    return;
  }
  try {
    await setDoc(doc(db, 'banners', banner.id), banner);
  } catch (error) {
    console.warn('Could not sync banner to Firestore:', error);
  }
}

export async function deleteBannerById(bannerId: string): Promise<void> {
  const path = `banners/${bannerId}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Deleted banner from local state.');
    return;
  }
  try {
    await deleteDoc(doc(db, 'banners', bannerId));
  } catch (error) {
    console.warn('Could not delete banner from Firestore:', error);
  }
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const path = 'settings/store-settings';
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Saved settings to local state.');
    return;
  }
  try {
    await setDoc(doc(db, 'settings', 'store-settings'), settings);
  } catch (error) {
    console.warn('Could not sync store settings to Firestore:', error);
  }
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  const path = `coupons/${coupon.code}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Saved coupon to local state.');
    return;
  }
  try {
    await setDoc(doc(db, 'coupons', coupon.code), coupon);
  } catch (error) {
    console.warn('Could not sync coupon to Firestore:', error);
  }
}

export async function deleteCouponByCode(code: string): Promise<void> {
  const path = `coupons/${code}`;
  if (!auth.currentUser) {
    console.info('Unauthenticated edit: Deleted coupon from local state.');
    return;
  }
  try {
    await deleteDoc(doc(db, 'coupons', code));
  } catch (error) {
    console.warn('Could not delete coupon from Firestore:', error);
  }
}

// Reviews
export async function submitProductReview(review: Review): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    await setDoc(doc(db, 'reviews', review.id), review);
    // Update product rating summary
    const prodRef = doc(db, 'products', review.productId);
    const pSnap = await getDoc(prodRef);
    if (pSnap.exists()) {
      const prod = pSnap.data() as Product;
      const currentRating = prod.rating || 5;
      const count = prod.reviewCount || 0;
      const newCount = count + 1;
      const newRating = Number(((currentRating * count + review.rating) / newCount).toFixed(1));
      await updateDoc(prodRef, {
        rating: newRating,
        reviewCount: newCount
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchReviewsForProduct(productId: string): Promise<Review[]> {
  const path = 'reviews';
  try {
    const q = query(collection(db, 'reviews'), where('productId', '==', productId));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Review);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
