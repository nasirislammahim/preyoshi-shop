import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  User,
  ShoppingBag,
  Heart,
  Bell,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Truck,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { PrintInvoiceModal } from './PrintInvoiceModal';
import { Order } from '../types';

export const CustomerProfileModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    currentUser,
    userProfile,
    loginWithGoogle,
    loginGuest,
    logout,
    orders,
    wishlist,
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    setTrackingSearchTerm,
    t,
    isAdmin
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile'>('orders');
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  // Guest login form state
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  if (activeModal !== 'profile') return null;

  // Filter orders for this user
  const myOrders = orders.filter(
    o =>
      (currentUser && o.userId === currentUser.uid) ||
      (userProfile && (o.customerPhone === userProfile.phone || o.customerName === userProfile.name))
  );

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
        <div className="fixed inset-0" onClick={() => setActiveModal(null)} />

        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-[#F8E8E9]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FFF9F2]">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#7A1238]" />
              <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
                {userProfile ? userProfile.name : t('Customer Account', 'গ্রাহক একাউন্ট')}
              </h2>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-6">
            {/* If not logged in, prompt Google or Guest login */}
            {!currentUser && !userProfile ? (
              <div className="space-y-6 py-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#F8E8E9] text-[#7A1238] flex items-center justify-center mx-auto">
                    <User className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-800">
                    {t('Sign in to Preyoshi Shop', 'প্রেয়সী শপে লগইন করুন')}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {t(
                      'Access your saved orders, live order tracking, and customized wishlist across devices.',
                      'আপনার পূর্ববর্তী অর্ডার, ট্র্যাকিং এবং পছন্দের তালিকা সহজে দেখতে লগইন করুন।'
                    )}
                  </p>
                </div>

                {/* Google Sign In */}
                <button
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-stone-300 hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-xs transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{t('Continue with Google', 'গুগল দিয়ে সাইন ইন করুন')}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-stone-200 w-full" />
                  <span className="bg-white px-3 text-[11px] text-stone-400 uppercase tracking-wider absolute">
                    {t('Or Quick Guest Access', 'অথবা গেস্ট লগইন')}
                  </span>
                </div>

                {/* Guest Login Form */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (!guestName || !guestPhone) return;
                    loginGuest(guestName, guestPhone);
                  }}
                  className="space-y-3 p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9]"
                >
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    placeholder={t('Your Name', 'আপনার নাম')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                  <input
                    type="tel"
                    required
                    value={guestPhone}
                    onChange={e => setGuestPhone(e.target.value)}
                    placeholder={t('Phone Number (01XXXXXXXXX)', 'মোবাইল নম্বর')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition shadow"
                  >
                    {t('Continue as Guest', 'গেস্ট হিসেবে প্রবেশ করুন')}
                  </button>
                </form>
              </div>
            ) : (
              <div>
                {/* Profile Tabs */}
                <div className="flex border-b border-stone-200 mb-4 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-2.5 px-3 border-b-2 transition ${
                      activeTab === 'orders'
                        ? 'border-[#7A1238] text-[#7A1238]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {t('My Orders', 'আমার অর্ডারসমূহ')} ({myOrders.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`pb-2.5 px-3 border-b-2 transition ${
                      activeTab === 'wishlist'
                        ? 'border-[#7A1238] text-[#7A1238]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {t('Wishlist', 'পছন্দের তালিকা')} ({wishlist.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-2.5 px-3 border-b-2 transition ${
                      activeTab === 'profile'
                        ? 'border-[#7A1238] text-[#7A1238]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {t('Profile & Addresses', 'প্রোফাইল')}
                  </button>
                </div>

                {/* 1. ORDERS TAB */}
                {activeTab === 'orders' && (
                  <div className="space-y-3">
                    {myOrders.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400 space-y-2">
                        <ShoppingBag className="w-8 h-8 mx-auto text-stone-300" />
                        <p>{t('No previous orders found.', 'কোনো পূর্ববর্তী অর্ডার পাওয়া যায়নি।')}</p>
                      </div>
                    ) : (
                      myOrders.map(o => (
                        <div
                          key={o.id}
                          className="p-4 rounded-2xl border border-stone-200 bg-[#FFF9F2]/30 space-y-2.5 text-xs"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                            <div>
                              <span className="font-mono font-bold text-[#7A1238] text-sm">
                                {o.orderNumber}
                              </span>
                              <span className="text-[10px] text-stone-400 block">
                                {new Date(o.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-[#7A1238] text-white">
                              {o.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center text-stone-700">
                            <span>
                              {o.items.length} items • {o.district}
                            </span>
                            <span className="font-bold text-[#7A1238]">
                              {formatPrice(o.grandTotal)}
                            </span>
                          </div>

                          <div className="flex gap-2 pt-1">
                            <button
                              onClick={() => {
                                setTrackingSearchTerm(o.orderNumber);
                                setActiveModal('orderTracking');
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold"
                            >
                              <Truck className="w-3 h-3 text-[#7A1238]" />
                              <span>{t('Track', 'ট্র্যাক')}</span>
                            </button>
                            <button
                              onClick={() => setSelectedInvoice(o)}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-700 text-[11px] font-semibold"
                            >
                              <Printer className="w-3 h-3" />
                              <span>{t('Invoice', 'ইনভয়েস')}</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 2. WISHLIST TAB */}
                {activeTab === 'wishlist' && (
                  <div className="space-y-3">
                    {wishlistedProducts.length === 0 ? (
                      <div className="p-8 text-center text-xs text-stone-400">
                        {t('No items in your wishlist yet.', 'আপনার পছন্দের তালিকায় কোনো পণ্য নেই।')}
                      </div>
                    ) : (
                      wishlistedProducts.map(p => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-3 rounded-2xl border border-stone-200 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.nameEn}
                              className="w-12 h-14 object-cover rounded-xl"
                            />
                            <div>
                              <h4 className="font-semibold text-xs text-stone-900">
                                {t(p.nameEn, p.nameBn)}
                              </h4>
                              <p className="font-bold text-xs text-[#7A1238] mt-0.5">
                                {formatPrice(p.discountPrice || p.regularPrice)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="px-3 py-1.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24]"
                            >
                              {t('Add to Cart', 'ব্যাগে যোগ')}
                            </button>
                            <button
                              onClick={() => toggleWishlist(p.id)}
                              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* 3. PROFILE DETAILS TAB */}
                {activeTab === 'profile' && (
                  <div className="space-y-4 text-xs text-stone-700">
                    <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] space-y-2">
                      <p>
                        <strong>Name:</strong> {userProfile?.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {userProfile?.email}
                      </p>
                      {userProfile?.phone && (
                        <p>
                          <strong>Phone:</strong> {userProfile?.phone}
                        </p>
                      )}
                      <p>
                        <strong>Account Role:</strong>{' '}
                        <span className="uppercase font-mono font-bold text-[#7A1238]">
                          {userProfile?.role}
                        </span>
                      </p>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => setActiveModal('admin')}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D9A441] text-[#7A1238] font-bold text-xs shadow-sm hover:brightness-105"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Open Admin Dashboard</span>
                      </button>
                    )}

                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('Sign Out', 'লগআউট')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedInvoice && (
        <PrintInvoiceModal order={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      )}
    </>
  );
};
