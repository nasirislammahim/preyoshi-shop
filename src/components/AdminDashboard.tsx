import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Layers,
  Tag,
  Image as ImageIcon,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  AlertTriangle,
  Printer,
  Plus,
  Trash2,
  Edit,
  Save,
  Search,
  Filter,
  DollarSign,
  Users,
  ShieldCheck,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { Order, Product, Category, Coupon, BannerSlide, OrderStatus, StoreSettings } from '../types';
import { PrintInvoiceModal } from './PrintInvoiceModal';
import { INITIAL_SETTINGS } from '../data/initialData';

export const AdminDashboard: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    isAdmin,
    isSuperAdmin,
    currentUser,
    loginWithGoogle,
    products,
    categories,
    orders,
    banners,
    coupons,
    settings,
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
    formatPrice,
    t,
    refreshData
  } = useShop();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'coupons' | 'banners' | 'settings'
  >('overview');

  // Orders Tab state
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [editingOrderCourier, setEditingOrderCourier] = useState<{
    id: string;
    courier: string;
    tracking: string;
  } | null>(null);

  // Products Tab state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');

  // Categories Tab state
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  // Coupons Tab state
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAddingCoupon, setIsAddingCoupon] = useState<boolean>(false);

  // Banners Tab state
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);
  const [isAddingBanner, setIsAddingBanner] = useState<boolean>(false);

  // Settings Tab state - guaranteed non-undefined initial state
  const [tempSettings, setTempSettings] = useState<StoreSettings>(() => ({
    ...INITIAL_SETTINGS,
    ...(settings && Object.keys(settings).length > 0 ? settings : {})
  }));
  const [settingsSavedMessage, setSettingsSavedMessage] = useState<string>('');

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setTempSettings({
        ...INITIAL_SETTINGS,
        ...settings
      });
    }
  }, [settings]);

  if (activeModal !== 'admin') return null;

  // Overview Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const confirmedCount = orders.filter(o => o.status === 'Confirmed').length;
  const processingCount = orders.filter(o => o.status === 'Processing').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
  const cancelledCount = orders.filter(o => o.status === 'Cancelled').length;

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearchQuery.trim()) {
      const q = orderSearchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchPhone = o.customerPhone.includes(q);
      if (!matchNum && !matchName && !matchPhone) return false;
    }
    return true;
  });

  // Filtered Products
  const filteredProductList = products.filter(p => {
    if (productCatFilter !== 'all' && p.categoryId !== productCatFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchEn = p.nameEn.toLowerCase().includes(q);
      const matchBn = p.nameBn.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      if (!matchEn && !matchBn && !matchSku) return false;
    }
    return true;
  });

  // Handle Save Temp Settings
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveSettings(tempSettings);
    setSettingsSavedMessage(t('Settings updated successfully!', 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'));
    setTimeout(() => setSettingsSavedMessage(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[94vh] border border-[#F8E8E9]">
        {/* Admin Top Header */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-gradient-to-r from-[#550A24] to-[#7A1238] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold font-serif-luxury tracking-wide">
                  PREYOSHI SHOP CONTROL PANEL
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-[#D9A441] text-[#550A24] text-[10px] font-black uppercase">
                  ADMIN
                </span>
              </div>
              <p className="text-[11px] text-stone-300">
                {currentUser?.email?.toLowerCase() === 'nasirislammahimbd@gmail.com'
                  ? `Authenticated: ${currentUser.email} (Cloud Firestore Connected)`
                  : 'Demo / Preview Mode (Local Storage). Sign in with Google to sync to live database.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!currentUser && (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#7A1238] font-bold text-xs hover:bg-stone-100 transition shadow-sm cursor-pointer"
                title="Sign in with your Google Admin account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#BE0750]" />
                <span className="hidden sm:inline">Sign In with Google</span>
              </button>
            )}
            <button
              onClick={() => refreshData()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition"
              title="Refresh Store Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-stone-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Admin Dashboard Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-48 sm:w-56 bg-[#FFF9F2] border-r border-[#F8E8E9] p-3 flex flex-col gap-1 overflow-y-auto shrink-0 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'overview'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#D9A441]" />
              <span>{t('Overview', 'সারসংক্ষেপ')}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition ${
                activeTab === 'orders'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-[#BE0750]" />
                <span>{t('Orders', 'অর্ডারসমূহ')}</span>
              </div>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#BE0750] text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'products'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <Package className="w-4 h-4 text-amber-600" />
              <span>{t('Products', 'পণ্য ব্যবস্থাপনা')}</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'categories'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-600" />
              <span>{t('Categories', 'ক্যাটাগরি')}</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'coupons'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>{t('Coupons', 'কুপন কোড')}</span>
            </button>

            <button
              onClick={() => setActiveTab('banners')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'banners'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>{t('Banners', 'ব্যানার স্লাইডার')}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                activeTab === 'settings'
                  ? 'bg-[#7A1238] text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-200/50'
              }`}
            >
              <Settings className="w-4 h-4 text-stone-600" />
              <span>{t('Settings', 'স্টোর সেটিংস')}</span>
            </button>
          </div>

          {/* Main Tab View */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 bg-white">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] shadow-xs">
                    <div className="flex items-center justify-between text-[#7A1238] mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {t('Total Revenue', 'মোট বিক্রয়')}
                      </span>
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900">
                      {formatPrice(totalRevenue)}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {orders.filter(o => o.status !== 'Cancelled').length} confirmed orders
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
                    <div className="flex items-center justify-between text-amber-700 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {t('Pending Orders', 'অপেক্ষমান')}
                      </span>
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900">{pendingCount}</p>
                    <p className="text-[10px] text-amber-600 mt-0.5">Requires confirmation</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 shadow-xs">
                    <div className="flex items-center justify-between text-blue-700 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {t('In Courier / Transit', 'কুরিয়ারে আছে')}
                      </span>
                      <Truck className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900">{shippedCount}</p>
                    <p className="text-[10px] text-blue-600 mt-0.5">Out for delivery</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-xs">
                    <div className="flex items-center justify-between text-emerald-700 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {t('Delivered', 'সম্পন্ন')}
                      </span>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-stone-900">{deliveredCount}</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Delivered to customers</p>
                  </div>
                </div>

                {/* Pipeline breakdown */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80">
                  <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-3">
                    {t('Order Status Pipeline', 'অর্ডার স্ট্যাটাস পাইপলাইন')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Pending</span>
                      <strong className="text-sm text-stone-800">{pendingCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Confirmed</span>
                      <strong className="text-sm text-blue-700">{confirmedCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Processing</span>
                      <strong className="text-sm text-amber-700">{processingCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Shipped</span>
                      <strong className="text-sm text-purple-700">{shippedCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Delivered</span>
                      <strong className="text-sm text-emerald-700">{deliveredCount}</strong>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Cancelled</span>
                      <strong className="text-sm text-rose-700">{cancelledCount}</strong>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview Table */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-stone-900">
                      {t('Recent Orders', 'সাম্প্রতিক অর্ডারসমূহ')}
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-[#7A1238] hover:underline"
                    >
                      {t('View All Orders', 'সকল অর্ডার দেখুন')} →
                    </button>
                  </div>

                  <div className="rounded-2xl border border-stone-200 overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#FFF9F2] text-stone-700 uppercase font-bold border-b border-stone-200">
                        <tr>
                          <th className="py-2.5 px-3">Order #</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3">Grand Total</th>
                          <th className="py-2.5 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-stone-50">
                            <td className="py-2 px-3 font-mono font-bold text-[#7A1238]">
                              {o.orderNumber}
                            </td>
                            <td className="py-2 px-3 font-medium text-stone-800">
                              {o.customerName}
                            </td>
                            <td className="py-2 px-3 text-stone-600">{o.district}</td>
                            <td className="py-2 px-3 font-bold">{formatPrice(o.grandTotal)}</td>
                            <td className="py-2 px-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-100 text-stone-800">
                                {o.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ORDERS MANAGEMENT TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4 animate-fade-in">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={e => setOrderSearchQuery(e.target.value)}
                      placeholder={t('Search by Order #, Customer Name, Phone...', 'অর্ডার #, নাম, ফোন দিয়ে খুঁজুন...')}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-stone-400" />
                    <select
                      value={orderStatusFilter}
                      onChange={e => setOrderStatusFilter(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-medium"
                    >
                      <option value="all">All Statuses ({orders.length})</option>
                      <option value="Pending">Pending ({pendingCount})</option>
                      <option value="Confirmed">Confirmed ({confirmedCount})</option>
                      <option value="Processing">Processing ({processingCount})</option>
                      <option value="Shipped">Shipped ({shippedCount})</option>
                      <option value="Delivered">Delivered ({deliveredCount})</option>
                      <option value="Cancelled">Cancelled ({cancelledCount})</option>
                    </select>
                  </div>
                </div>

                {/* Orders List Table */}
                <div className="rounded-2xl border border-stone-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FFF9F2] text-stone-700 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-3">Order / Date</th>
                        <th className="py-3 px-3">Customer & Address</th>
                        <th className="py-3 px-3">Items</th>
                        <th className="py-3 px-3">Payment</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Courier / Tracking</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-stone-400">
                            No orders found matching filter.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id} className="hover:bg-stone-50/80">
                            <td className="py-3 px-3 align-top font-mono">
                              <span className="font-bold text-[#7A1238] block text-sm">
                                {ord.orderNumber}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top">
                              <p className="font-bold text-stone-900">{ord.customerName}</p>
                              <p className="font-mono text-stone-600">{ord.customerPhone}</p>
                              <p className="text-[11px] text-stone-500 max-w-[180px] truncate">
                                {ord.deliveryAddress}, {ord.district}
                              </p>
                            </td>

                            <td className="py-3 px-3 align-top">
                              <span className="font-bold text-stone-800">
                                {ord.items.length} items
                              </span>
                              <span className="block font-bold text-[#7A1238]">
                                {formatPrice(ord.grandTotal)}
                              </span>
                            </td>

                            <td className="py-3 px-3 align-top">
                              <span className="px-2 py-0.5 rounded-sm bg-stone-100 text-stone-800 font-mono text-[10px] uppercase block w-fit">
                                {ord.paymentMethod}
                              </span>
                              {ord.paymentTrxId && (
                                <span className="text-[10px] font-mono text-amber-700 block mt-0.5">
                                  Trx: {ord.paymentTrxId}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 align-top">
                              <select
                                value={ord.status}
                                onChange={e =>
                                  handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)
                                }
                                className={`px-2 py-1 rounded-lg text-xs font-bold border transition ${
                                  ord.status === 'Delivered'
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                    : ord.status === 'Cancelled'
                                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                                    : ord.status === 'Shipped'
                                    ? 'bg-purple-50 border-purple-300 text-purple-800'
                                    : 'bg-amber-50 border-amber-300 text-amber-800'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>

                            <td className="py-3 px-3 align-top">
                              {editingOrderCourier?.id === ord.id ? (
                                <div className="space-y-1 w-36">
                                  <input
                                    type="text"
                                    value={editingOrderCourier.courier}
                                    onChange={e =>
                                      setEditingOrderCourier(prev =>
                                        prev ? { ...prev, courier: e.target.value } : null
                                      )
                                    }
                                    placeholder="Courier Name"
                                    className="w-full px-1.5 py-0.5 text-[11px] border rounded"
                                  />
                                  <input
                                    type="text"
                                    value={editingOrderCourier.tracking}
                                    onChange={e =>
                                      setEditingOrderCourier(prev =>
                                        prev ? { ...prev, tracking: e.target.value } : null
                                      )
                                    }
                                    placeholder="Tracking #"
                                    className="w-full px-1.5 py-0.5 text-[11px] border rounded font-mono"
                                  />
                                  <button
                                    onClick={async () => {
                                      await handleUpdateOrderStatus(
                                        ord.id,
                                        ord.status,
                                        editingOrderCourier.courier,
                                        editingOrderCourier.tracking
                                      );
                                      setEditingOrderCourier(null);
                                    }}
                                    className="px-2 py-0.5 bg-[#7A1238] text-white text-[10px] rounded"
                                  >
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <div
                                  onClick={() =>
                                    setEditingOrderCourier({
                                      id: ord.id,
                                      courier: ord.courierName || '',
                                      tracking: ord.trackingNumber || ''
                                    })
                                  }
                                  className="cursor-pointer hover:bg-stone-100 p-1 rounded"
                                  title="Click to edit courier & tracking"
                                >
                                  <p className="font-semibold text-stone-800">
                                    {ord.courierName || 'Click to set courier'}
                                  </p>
                                  {ord.trackingNumber && (
                                    <p className="font-mono text-[10px] text-stone-500">
                                      #{ord.trackingNumber}
                                    </p>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="py-3 px-3 align-top text-right space-x-1">
                              <button
                                onClick={() => setSelectedInvoiceOrder(ord)}
                                className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white"
                                title="Print Invoice"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="text"
                      value={productSearch}
                      onChange={e => setProductSearch(e.target.value)}
                      placeholder="Search products by title or SKU..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                    />
                  </div>

                  <button
                    onClick={() => {
                      const newProd: Product = {
                        id: `prod-${Date.now()}`,
                        sku: `SKU-${Date.now().toString().slice(-4)}`,
                        nameEn: '',
                        nameBn: '',
                        descriptionEn: '',
                        descriptionBn: '',
                        categoryId: categories[0]?.id || 'cat-saree',
                        regularPrice: 1500,
                        discountPrice: 1200,
                        stock: 10,
                        images: [
                          'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
                        ],
                        sizes: ['Free Size'],
                        colors: [{ name: 'Default', hex: '#7A1238' }],
                        status: 'active',
                        rating: 5,
                        reviewCount: 0,
                        isFeatured: false,
                        isDemo: false
                      };
                      setEditingProduct(newProd);
                      setIsAddingProduct(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition shadow cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('Add New Product', 'নতুন পণ্য যুক্ত করুন')}</span>
                  </button>
                </div>

                {/* Products List Table */}
                <div className="rounded-2xl border border-stone-200 overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#FFF9F2] text-stone-700 uppercase font-bold border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-3">Product</th>
                        <th className="py-3 px-3">SKU</th>
                        <th className="py-3 px-3">Category</th>
                        <th className="py-3 px-3">Price</th>
                        <th className="py-3 px-3">Stock</th>
                        <th className="py-3 px-3">Badges</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProductList.map(p => (
                        <tr key={p.id} className="hover:bg-stone-50">
                          <td className="py-2.5 px-3 flex items-center gap-2.5">
                            <img
                              src={p.images[0]}
                              alt={p.nameEn}
                              className="w-10 h-12 object-cover rounded-md border"
                            />
                            <div>
                              <p className="font-semibold text-stone-900">{p.nameEn}</p>
                              <p className="text-[11px] text-stone-500 font-bangla">{p.nameBn}</p>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-stone-600">{p.sku}</td>
                          <td className="py-2.5 px-3 text-stone-600">
                            {categories.find(c => c.id === p.categoryId)?.nameEn || p.categoryId}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-[#7A1238]">
                              ৳{(p.discountPrice || p.regularPrice).toLocaleString()}
                            </span>
                            {p.discountPrice && (
                              <span className="text-[10px] text-stone-400 block line-through">
                                ৳{p.regularPrice.toLocaleString()}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.stock <= 0
                                  ? 'bg-rose-100 text-rose-700'
                                  : p.stock <= 5
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.stock} in stock
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                  Featured
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">
                                  Best
                                </span>
                              )}
                              {p.isDemo && (
                                <span className="px-1.5 py-0.2 rounded bg-stone-900 text-amber-300 text-[9px] font-mono">
                                  DEMO
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right space-x-1">
                            <button
                              onClick={() => {
                                setEditingProduct({ ...p });
                                setIsAddingProduct(false);
                              }}
                              className="p-1 rounded text-stone-600 hover:text-stone-900 hover:bg-stone-100"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete product ${p.nameEn}?`)) {
                                  handleDeleteProduct(p.id);
                                }
                              }}
                              className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit / Add Product Modal */}
                {editingProduct && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4 border border-[#F8E8E9]">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <h3 className="font-bold text-base text-[#7A1238]">
                          {isAddingProduct ? 'Add Product' : 'Edit Product'}
                        </h3>
                        <button
                          onClick={() => setEditingProduct(null)}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            English Name *
                          </label>
                          <input
                            type="text"
                            value={editingProduct.nameEn}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, nameEn: e.target.value } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Bengali Name *
                          </label>
                          <input
                            type="text"
                            value={editingProduct.nameBn}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, nameBn: e.target.value } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 font-bangla"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            SKU *
                          </label>
                          <input
                            type="text"
                            value={editingProduct.sku}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, sku: e.target.value } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 font-mono uppercase"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Regular Price (৳) *
                          </label>
                          <input
                            type="number"
                            value={editingProduct.regularPrice}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, regularPrice: Number(e.target.value) } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Discount Price (৳)
                          </label>
                          <input
                            type="number"
                            value={editingProduct.discountPrice || ''}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev
                                  ? {
                                      ...prev,
                                      discountPrice: e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    }
                                  : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Category *
                          </label>
                          <select
                            value={editingProduct.categoryId}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, categoryId: e.target.value } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>
                                {c.nameEn} ({c.nameBn})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Stock Quantity *
                          </label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, stock: Number(e.target.value) } : null
                              )
                            }
                            className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Primary Image URL
                        </label>
                        <input
                          type="url"
                          value={editingProduct.images[0] || ''}
                          onChange={e =>
                            setEditingProduct(prev =>
                              prev ? { ...prev, images: [e.target.value] } : null
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Description (English)
                        </label>
                        <textarea
                          rows={2}
                          value={editingProduct.descriptionEn}
                          onChange={e =>
                            setEditingProduct(prev =>
                              prev ? { ...prev, descriptionEn: e.target.value } : null
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          Description (Bengali)
                        </label>
                        <textarea
                          rows={2}
                          value={editingProduct.descriptionBn}
                          onChange={e =>
                            setEditingProduct(prev =>
                              prev ? { ...prev, descriptionBn: e.target.value } : null
                            )
                          }
                          className="w-full px-2.5 py-1.5 text-xs rounded-xl border border-stone-300 font-bangla"
                        />
                      </div>

                      <div className="flex gap-4 pt-2">
                        <label className="flex items-center gap-1.5 text-xs">
                          <input
                            type="checkbox"
                            checked={editingProduct.isFeatured || false}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, isFeatured: e.target.checked } : null
                              )
                            }
                            className="accent-[#7A1238]"
                          />
                          Featured Product
                        </label>
                        <label className="flex items-center gap-1.5 text-xs">
                          <input
                            type="checkbox"
                            checked={editingProduct.isBestSeller || false}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, isBestSeller: e.target.checked } : null
                              )
                            }
                            className="accent-[#7A1238]"
                          />
                          Best Seller
                        </label>
                        <label className="flex items-center gap-1.5 text-xs">
                          <input
                            type="checkbox"
                            checked={editingProduct.isFlashSale || false}
                            onChange={e =>
                              setEditingProduct(prev =>
                                prev ? { ...prev, isFlashSale: e.target.checked } : null
                              )
                            }
                            className="accent-[#7A1238]"
                          />
                          Flash Sale
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-3 border-t">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!editingProduct.nameEn || !editingProduct.sku) return;
                            await handleSaveProduct(editingProduct);
                            setEditingProduct(null);
                          }}
                          className="px-5 py-2 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24]"
                        >
                          Save Product
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-stone-900">
                    Product Categories ({categories.length})
                  </h3>
                  <button
                    onClick={() => {
                      const newCat: Category = {
                        id: `cat-${Date.now()}`,
                        nameEn: '',
                        nameBn: '',
                        slug: '',
                        order: categories.length + 1
                      };
                      setEditingCategory(newCat);
                      setIsAddingCategory(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-[#FFF9F2]/40 flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-stone-800 text-xs">{c.nameEn}</h4>
                        <p className="text-[11px] text-[#7A1238] font-bangla">{c.nameBn}</p>
                        <span className="text-[10px] text-stone-400 font-mono">slug: {c.slug}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingCategory(c);
                            setIsAddingCategory(false);
                          }}
                          className="p-1 rounded text-stone-500 hover:text-stone-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete category ${c.nameEn}?`)) {
                              handleDeleteCategory(c.id);
                            }
                          }}
                          className="p-1 rounded text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingCategory && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3">
                      <h4 className="font-bold text-sm text-[#7A1238]">
                        {isAddingCategory ? 'Add Category' : 'Edit Category'}
                      </h4>
                      <input
                        type="text"
                        placeholder="English Name"
                        value={editingCategory.nameEn}
                        onChange={e =>
                          setEditingCategory(prev =>
                            prev
                              ? {
                                  ...prev,
                                  nameEn: e.target.value,
                                  slug: e.target.value.toLowerCase().replace(/\s+/g, '-')
                                }
                              : null
                          )
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border"
                      />
                      <input
                        type="text"
                        placeholder="Bengali Name"
                        value={editingCategory.nameBn}
                        onChange={e =>
                          setEditingCategory(prev =>
                            prev ? { ...prev, nameBn: e.target.value } : null
                          )
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border font-bangla"
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1.5 text-xs text-stone-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (!editingCategory.nameEn) return;
                            await handleSaveCategory(editingCategory);
                            setEditingCategory(null);
                          }}
                          className="px-4 py-1.5 bg-[#7A1238] text-white text-xs rounded-lg font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-stone-900">Discount Coupons</h3>
                  <button
                    onClick={() => {
                      const newC: Coupon = {
                        code: 'DISCOUNT',
                        description: 'Special promo offer',
                        discountType: 'percentage',
                        discountValue: 10,
                        minOrderAmount: 1000,
                        isActive: true
                      };
                      setEditingCoupon(newC);
                      setIsAddingCoupon(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {coupons.map(c => (
                    <div
                      key={c.code}
                      className="p-4 rounded-2xl border border-stone-200 bg-white space-y-2 shadow-2xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-sm text-[#7A1238] bg-[#F8E8E9] px-2 py-0.5 rounded">
                          {c.code}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{c.description}</p>
                      <p className="text-xs font-semibold text-stone-800">
                        Discount:{' '}
                        {c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}{' '}
                        (Min: ৳{c.minOrderAmount})
                      </p>
                      <div className="flex justify-end gap-2 pt-2 border-t">
                        <button
                          onClick={() => {
                            if (confirm(`Delete coupon ${c.code}?`)) {
                              handleDeleteCoupon(c.code);
                            }
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingCoupon && (
                  <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white rounded-2xl p-5 w-full max-w-sm space-y-3">
                      <h4 className="font-bold text-sm text-[#7A1238]">Create Coupon</h4>
                      <input
                        type="text"
                        placeholder="Coupon Code"
                        value={editingCoupon.code}
                        onChange={e =>
                          setEditingCoupon(prev =>
                            prev ? { ...prev, code: e.target.value.toUpperCase() } : null
                          )
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border font-mono uppercase"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={editingCoupon.description}
                        onChange={e =>
                          setEditingCoupon(prev =>
                            prev ? { ...prev, description: e.target.value } : null
                          )
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editingCoupon.discountType}
                          onChange={e =>
                            setEditingCoupon(prev =>
                              prev
                                ? {
                                    ...prev,
                                    discountType: e.target.value as 'percentage' | 'fixed'
                                  }
                                : null
                            )
                          }
                          className="px-2 py-1.5 text-xs rounded-lg border bg-white"
                        >
                          <option value="percentage">Percentage (%)</option>
                          <option value="fixed">Fixed Amount (৳)</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Value"
                          value={editingCoupon.discountValue}
                          onChange={e =>
                            setEditingCoupon(prev =>
                              prev ? { ...prev, discountValue: Number(e.target.value) } : null
                            )
                          }
                          className="px-2 py-1.5 text-xs rounded-lg border"
                        />
                      </div>
                      <input
                        type="number"
                        placeholder="Min Order Amount (৳)"
                        value={editingCoupon.minOrderAmount}
                        onChange={e =>
                          setEditingCoupon(prev =>
                            prev ? { ...prev, minOrderAmount: Number(e.target.value) } : null
                          )
                        }
                        className="w-full px-3 py-1.5 text-xs rounded-lg border"
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingCoupon(null)}
                          className="px-3 py-1.5 text-xs text-stone-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            if (!editingCoupon.code) return;
                            await handleSaveCoupon(editingCoupon);
                            setEditingCoupon(null);
                          }}
                          className="px-4 py-1.5 bg-[#7A1238] text-white text-xs rounded-lg font-semibold"
                        >
                          Save Coupon
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. BANNERS TAB */}
            {activeTab === 'banners' && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-stone-900">Homepage Promotional Banners</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {banners.map(b => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-stone-200 overflow-hidden bg-white shadow-xs flex flex-col"
                    >
                      <img src={b.imageUrl} alt={b.titleEn} className="h-32 w-full object-cover" />
                      <div className="p-3.5 space-y-1">
                        <h4 className="font-bold text-xs text-stone-900">{b.titleEn}</h4>
                        <p className="text-[11px] text-stone-600 line-clamp-1">{b.subtitleEn}</p>
                        <span className="text-[10px] text-stone-400 font-mono">
                          Order: {b.order} • Status: {b.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSettingsSubmit} className="space-y-5 max-w-xl animate-fade-in">
                <h3 className="text-sm font-bold text-stone-900">
                  Store & Delivery Settings (Bangladesh)
                </h3>

                {settingsSavedMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    ✓ {settingsSavedMessage}
                  </div>
                )}

                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] space-y-3">
                  <h4 className="text-xs font-bold text-[#7A1238] uppercase">Delivery Charges (৳)</h4>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Inside Dhaka Delivery (৳)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.insideDhakaDelivery ?? 70}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            insideDhakaDelivery: Number(e.target.value)
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Outside Dhaka Delivery (৳)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.outsideDhakaDelivery ?? 130}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            outsideDhakaDelivery: Number(e.target.value)
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Own Delivery Charge (৳)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.ownDeliveryCharge ?? 60}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            ownDeliveryCharge: Number(e.target.value)
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Free Delivery Threshold (৳)
                      </label>
                      <input
                        type="number"
                        value={tempSettings.freeDeliveryThreshold ?? 2000}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            freeDeliveryThreshold: Number(e.target.value)
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] space-y-3">
                  <h4 className="text-xs font-bold text-[#7A1238] uppercase">
                    Payment Gateway Merchant Numbers
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        bKash Merchant / Personal Number
                      </label>
                      <input
                        type="text"
                        value={tempSettings.bkashMerchantNumber ?? ''}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            bkashMerchantNumber: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Nagad Merchant / Personal Number
                      </label>
                      <input
                        type="text"
                        value={tempSettings.nagadMerchantNumber ?? ''}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            nagadMerchantNumber: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-1">
                        Rocket Merchant / Personal Number
                      </label>
                      <input
                        type="text"
                        value={tempSettings.rocketMerchantNumber ?? ''}
                        onChange={e =>
                          setTempSettings(prev => ({
                            ...prev,
                            rocketMerchantNumber: e.target.value
                          }))
                        }
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition shadow cursor-pointer"
                >
                  Save Store Settings
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {selectedInvoiceOrder && (
        <PrintInvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
