import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Product,
  Category,
  CartItem,
  BannerSlide,
  Coupon,
  StoreSettings,
  UserProfile,
  Order,
  Language,
  StoreNotification
} from '../types';
import {
  initializeStoreData,
  saveProduct,
  deleteProductById,
  saveCategory,
  deleteCategoryById,
  createOrder,
  fetchAllOrders,
  updateOrderStatus,
  saveBanner,
  deleteBannerById,
  saveStoreSettings,
  saveCoupon,
  deleteCouponByCode
} from '../services/firestoreService';
import { auth, testConnection } from '../config/firebase';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { INITIAL_SETTINGS } from '../data/initialData';

interface ShopContextType {
  // Store Data
  products: Product[];
  categories: Category[];
  banners: BannerSlide[];
  coupons: Coupon[];
  settings: StoreSettings;
  orders: Order[];
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Language & Currency
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (en: string, bn: string) => string;
  formatPrice: (amount: number) => string;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string; // 'all' or categoryId
  setSelectedCategory: (catId: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  priceFilter: [number, number];
  setPriceFilter: (range: [number, number]) => void;
  filteredProducts: Product[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  totalCartCount: number;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Recently Viewed
  recentlyViewedIds: string[];
  addToRecentlyViewed: (productId: string) => void;

  // Auth & Admin
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginGuest: (name: string, phone: string) => void;
  logout: () => Promise<void>;

  // Modals & Navigation
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
  activeStaticPage: 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'return' | null;
  setActiveStaticPage: (page: 'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'return' | null) => void;
  trackingSearchTerm: string;
  setTrackingSearchTerm: (t: string) => void;

  // Admin Actions
  handleSaveProduct: (prod: Product) => Promise<void>;
  handleDeleteProduct: (prodId: string) => Promise<void>;
  handleSaveCategory: (cat: Category) => Promise<void>;
  handleDeleteCategory: (catId: string) => Promise<void>;
  handleSaveBanner: (ban: BannerSlide) => Promise<void>;
  handleDeleteBanner: (banId: string) => Promise<void>;
  handleSaveSettings: (sett: StoreSettings) => Promise<void>;
  handleSaveCoupon: (coup: Coupon) => Promise<void>;
  handleDeleteCoupon: (code: string) => Promise<void>;
  handleUpdateOrderStatus: (orderId: string, status: any, courier?: string, tracking?: string, note?: string) => Promise<void>;
  handlePlaceOrder: (order: Order) => Promise<Order>;

  // Customer Notifications
  notifications: StoreNotification[];
  markNotificationAsRead: (id: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const ADMIN_EMAIL = 'nasirislammahimbd@gmail.com';

export const ShopProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Store Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Localization
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('preyoshi_lang') as Language) || 'bn';
  });

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 20000]);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('preyoshi_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('preyoshi_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('preyoshi_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auth State
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('preyoshi_profile');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // UI Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [activeStaticPage, setActiveStaticPage] = useState<'about' | 'contact' | 'faq' | 'privacy' | 'terms' | 'return' | null>(null);
  const [trackingSearchTerm, setTrackingSearchTerm] = useState<string>('');
  const [notifications, setNotifications] = useState<StoreNotification[]>([]);

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('preyoshi_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('preyoshi_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('preyoshi_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('preyoshi_recent', JSON.stringify(recentlyViewedIds));
  }, [recentlyViewedIds]);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      await testConnection();
      const initial = await initializeStoreData();
      setCategories(initial.categories);
      setProducts(initial.products);
      setBanners(initial.banners);
      setCoupons(initial.coupons);
      if (initial.settings && Object.keys(initial.settings).length > 0) {
        setSettings(initial.settings);
      }

      // Load locally stored orders on this device
      const savedOrdersStr = localStorage.getItem('preyoshi_orders');
      if (savedOrdersStr) {
        try {
          setOrders(JSON.parse(savedOrdersStr));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to load store data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const isAdminUser = user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const profile: UserProfile = {
          uid: user.uid,
          name: user.displayName || 'Customer',
          email: user.email || '',
          role: isAdminUser ? 'admin' : 'customer'
        };
        setUserProfile(profile);
        localStorage.setItem('preyoshi_profile', JSON.stringify(profile));

        // Reload orders if admin
        if (isAdminUser) {
          fetchAllOrders().then(setOrders).catch(() => {});
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Admin status check
  const isAdmin = useMemo(() => {
    if (userProfile?.role === 'admin') return true;
    if (currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
    return false;
  }, [currentUser, userProfile]);

  const isSuperAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // Translations
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (en: string, bn: string): string => {
    return language === 'bn' ? bn : en;
  };

  const formatPrice = (amount: number): string => {
    if (language === 'bn') {
      const bnNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const formatted = amount.toLocaleString('en-US');
      const bnFormatted = formatted.replace(/[0-9]/g, digit => bnNumerals[Number(digit)]);
      return `৳${bnFormatted}`;
    }
    return `৳${amount.toLocaleString()}`;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, selectedSize?: string, selectedColor?: string) => {
    const size = selectedSize || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const color = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0].name : undefined);
    const cartItemId = `${product.id}_${size || 'def'}_${color || 'def'}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === cartItemId);
      const priceToUse = product.discountPrice || product.regularPrice;

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          productNameEn: product.nameEn,
          productNameBn: product.nameBn,
          price: priceToUse,
          regularPrice: product.regularPrice,
          quantity: Math.min(product.stock, quantity),
          selectedSize: size,
          selectedColor: color,
          image: product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          maxStock: product.stock
        };
        return [...prev, newItem];
      }
    });

    // Automatically open cart drawer for rich UX feedback
    setActiveModal('cart');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity: Math.min(item.maxStock, newQty)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Recently Viewed
  const addToRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  };

  // Auth Functions
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setActiveModal(null);
    } catch (error) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const loginGuest = (name: string, phone: string) => {
    const profile: UserProfile = {
      uid: `guest-${Date.now()}`,
      name,
      email: `${phone.replace(/[^0-9]/g, '')}@guest.preyoshi.com`,
      phone,
      role: 'customer'
    };
    setUserProfile(profile);
    localStorage.setItem('preyoshi_profile', JSON.stringify(profile));
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('preyoshi_profile');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        // Category filter
        if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }
        // Price filter
        const price = p.discountPrice || p.regularPrice;
        if (price < priceFilter[0] || price > priceFilter[1]) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchEn = p.nameEn.toLowerCase().includes(q) || p.descriptionEn.toLowerCase().includes(q);
          const matchBn = p.nameBn.toLowerCase().includes(q) || p.descriptionBn.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchTags = p.tags?.some(tag => tag.toLowerCase().includes(q));
          if (!matchEn && !matchBn && !matchSku && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.regularPrice;
        const priceB = b.discountPrice || b.regularPrice;
        if (sortBy === 'price-asc') return priceA - priceB;
        if (sortBy === 'price-desc') return priceB - priceA;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
        return 0; // default order
      });
  }, [products, selectedCategory, priceFilter, searchQuery, sortBy]);

  // Admin Handlers
  const handleSaveProduct = async (prod: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === prod.id);
      const next = idx > -1 ? [...prev] : [prod, ...prev];
      if (idx > -1) next[idx] = prod;
      localStorage.setItem('preyoshi_products', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await saveProduct(prod);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== prodId);
      localStorage.setItem('preyoshi_products', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await deleteProductById(prodId);
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    setCategories(prev => {
      const idx = prev.findIndex(c => c.id === cat.id);
      const next = idx > -1 ? [...prev] : [...prev, cat];
      if (idx > -1) next[idx] = cat;
      localStorage.setItem('preyoshi_categories', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await saveCategory(cat);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    setCategories(prev => {
      const next = prev.filter(c => c.id !== catId);
      localStorage.setItem('preyoshi_categories', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await deleteCategoryById(catId);
    }
  };

  const handleSaveBanner = async (ban: BannerSlide) => {
    setBanners(prev => {
      const idx = prev.findIndex(b => b.id === ban.id);
      const next = idx > -1 ? [...prev] : [...prev, ban];
      if (idx > -1) next[idx] = ban;
      localStorage.setItem('preyoshi_banners', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await saveBanner(ban);
    }
  };

  const handleDeleteBanner = async (banId: string) => {
    setBanners(prev => {
      const next = prev.filter(b => b.id !== banId);
      localStorage.setItem('preyoshi_banners', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await deleteBannerById(banId);
    }
  };

  const handleSaveSettings = async (sett: StoreSettings) => {
    setSettings(sett);
    localStorage.setItem('preyoshi_settings', JSON.stringify(sett));
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await saveStoreSettings(sett);
    }
  };

  const handleSaveCoupon = async (coup: Coupon) => {
    setCoupons(prev => {
      const idx = prev.findIndex(c => c.code === coup.code);
      const next = idx > -1 ? [...prev] : [...prev, coup];
      if (idx > -1) next[idx] = coup;
      localStorage.setItem('preyoshi_coupons', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await saveCoupon(coup);
    }
  };

  const handleDeleteCoupon = async (code: string) => {
    setCoupons(prev => {
      const next = prev.filter(c => c.code !== code);
      localStorage.setItem('preyoshi_coupons', JSON.stringify(next));
      return next;
    });
    if (currentUser && currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      await deleteCouponByCode(code);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    status: any,
    courier?: string,
    tracking?: string,
    note?: string
  ) => {
    await updateOrderStatus(orderId, status, courier, tracking, note);
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const timeline = [...(o.statusTimeline || [])];
          timeline.push({
            status,
            timestamp: new Date().toISOString(),
            note: note || `Status updated to ${status}`
          });
          return {
            ...o,
            status,
            courierName: courier || o.courierName,
            trackingNumber: tracking || o.trackingNumber,
            statusTimeline: timeline
          };
        }
        return o;
      })
    );
  };

  const handlePlaceOrder = async (order: Order): Promise<Order> => {
    const saved = await createOrder(order);
    // Reduce local product stock immediately
    setProducts(prev =>
      prev.map(p => {
        const cartItem = order.items.find(i => i.productId === p.id);
        if (cartItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - cartItem.quantity)
          };
        }
        return p;
      })
    );
    setOrders(prev => [saved, ...prev]);
    clearCart();
    setLastPlacedOrder(saved);
    return saved;
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        banners,
        coupons,
        settings,
        orders,
        isLoading,
        refreshData: loadData,
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatPrice,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceFilter,
        setPriceFilter,
        filteredProducts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        totalCartCount,
        wishlist,
        toggleWishlist,
        isWishlisted,
        recentlyViewedIds,
        addToRecentlyViewed,
        currentUser,
        userProfile,
        isAdmin,
        isSuperAdmin,
        loginWithGoogle,
        loginGuest,
        logout,
        activeModal,
        setActiveModal,
        selectedProduct,
        setSelectedProduct,
        lastPlacedOrder,
        setLastPlacedOrder,
        activeStaticPage,
        setActiveStaticPage,
        trackingSearchTerm,
        setTrackingSearchTerm,
        handleSaveProduct,
        handleDeleteProduct,
        handleSaveCategory,
        handleDeleteCategory,
        handleSaveBanner,
        handleDeleteBanner,
        handleSaveSettings,
        handleSaveCoupon,
        handleDeleteCoupon,
        handleUpdateOrderStatus,
        handlePlaceOrder,
        notifications,
        markNotificationAsRead
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
