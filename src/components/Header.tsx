import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  ShieldCheck,
  Truck,
  Phone,
  Sparkles,
  Menu,
  X,
  Flame,
  Globe
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalCartCount,
    cartSubtotal,
    wishlist,
    currentUser,
    userProfile,
    isAdmin,
    language,
    toggleLanguage,
    t,
    formatPrice,
    setActiveModal,
    setActiveStaticPage
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFF9F2] shadow-sm border-b border-[#F8E8E9]">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#7A1238] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
            <span className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#D9A441]">
              <Sparkles className="w-3.5 h-3.5" />
              {t('PREYOSHI EXCLUSIVE:', 'প্রেয়সী স্পেশাল:')}
            </span>
            <span className="text-stone-200 truncate">
              {t(
                'Luxury Fashion & Traditional Heritage • Cash on Delivery in 64 Districts',
                'সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা • জেনুইন কোয়ালিটি নিশ্চয়তা'
              )}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-stone-200">
            <a
              href="tel:+8801711234567"
              className="hover:text-[#D9A441] transition flex items-center gap-1"
            >
              <Phone className="w-3 h-3 text-[#D9A441]" />
              <span className="hidden md:inline">+880 1711-234567</span>
              <span className="md:hidden">Call</span>
            </a>

            <button
              onClick={() => setActiveModal('orderTracking')}
              className="hover:text-[#D9A441] transition flex items-center gap-1 cursor-pointer"
            >
              <Truck className="w-3 h-3 text-[#D9A441]" />
              <span>{t('Track Order', 'অর্ডার ট্র্যাক')}</span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#BE0750] text-white hover:bg-[#931442] transition font-semibold cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3 h-3 text-[#D9A441]" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Admin Access Indicator / Button */}
            <button
              onClick={() => setActiveModal('admin')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded transition cursor-pointer ${
                isAdmin
                  ? 'bg-[#D9A441] text-[#7A1238] font-bold'
                  : 'text-stone-300 hover:text-white'
              }`}
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('Admin', 'অ্যাডমিন')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          {/* Mobile menu hamburger */}
          <button
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-2 -ml-2 text-stone-700 hover:text-[#7A1238]"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Official Brand Identity & Logo */}
          <div
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            {/* Custom Brand Logo Emblem */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-[#7A1238] via-[#BE0750] to-[#550A24] p-0.5 shadow-md flex items-center justify-center shrink-0 border border-[#D9A441]/40 transition group-hover:scale-105">
              <div className="w-full h-full rounded-[14px] flex flex-col items-center justify-center bg-[#7A1238] text-center p-0.5">
                <span className="font-serif-luxury text-base font-bold text-[#D9A441] leading-none">
                  P
                </span>
                <span className="text-[7px] text-[#F8E8E9] font-bangla font-semibold leading-none">
                  প্রেয়সী
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D9A441] flex items-center justify-center text-[8px] text-[#7A1238] font-bold shadow-xs">
                ♥
              </div>
            </div>

            {/* Typography */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-[#7A1238] font-serif-luxury uppercase">
                  PREYOSHI
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#BE0750] font-bangla">
                  শপ
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-[#D9A441] font-semibold uppercase -mt-0.5">
                Your Style ♥ Our Priority
              </span>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative">
            <div className="w-full relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t(
                  'Search sarees, jewellery, cosmetics, bags...',
                  'শাড়ি, গহনা, কসমেটিকস, ব্যাগ খুঁজুন...'
                )}
                className="w-full pl-10 pr-10 py-2.5 rounded-full bg-white border border-[#D9A441]/40 focus:border-[#BE0750] focus:ring-2 focus:ring-[#BE0750]/20 text-sm outline-hidden shadow-xs transition"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 text-stone-400 hover:text-stone-700 text-xs font-semibold"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(prev => !prev)}
              className="md:hidden p-2 text-stone-700 hover:text-[#7A1238] rounded-full hover:bg-[#F8E8E9]"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* PWA Install Button */}
            <div className="hidden lg:block">
              <PWAInstallButton />
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => setActiveModal('profile')}
              className="relative p-2 text-stone-700 hover:text-[#BE0750] rounded-full hover:bg-[#F8E8E9] transition cursor-pointer"
              title={t('Wishlist', 'পছন্দের তালিকা')}
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#BE0750] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setActiveModal('cart')}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-full bg-gradient-to-r from-[#7A1238] to-[#BE0750] text-white shadow-md hover:shadow-lg hover:brightness-105 transition cursor-pointer"
              title={t('View Cart', 'শপিং ব্যাগ')}
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#D9A441] text-[#7A1238] text-[10px] font-black flex items-center justify-center shadow-xs">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-stone-200 uppercase tracking-wider">
                  {t('Cart', 'ব্যাগ')}
                </span>
                <span className="text-xs font-bold text-[#FFF9F2]">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
            </button>

            {/* User Profile / Auth */}
            <button
              onClick={() => setActiveModal('profile')}
              className="flex items-center gap-1.5 p-2 text-stone-700 hover:text-[#7A1238] rounded-full hover:bg-[#F8E8E9] transition cursor-pointer"
              title={currentUser ? currentUser.displayName || 'Profile' : 'Sign In'}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
              {userProfile && (
                <span className="hidden xl:inline text-xs font-medium text-stone-700 max-w-[80px] truncate">
                  {userProfile.name}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input dropdown */}
        {mobileSearchOpen && (
          <div className="mt-2.5 pb-1 md:hidden">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t(
                  'Search sarees, jewellery, cosmetics...',
                  'শাড়ি, গহনা, রূপচর্চা খুঁজুন...'
                )}
                className="w-full pl-9 pr-9 py-2 rounded-full bg-white border border-[#D9A441] text-xs outline-hidden shadow-xs"
                autoFocus
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. Category Navigation Strip */}
      <div className="border-t border-[#F8E8E9] bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs sm:text-sm font-medium">
            {/* All Products */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full shrink-0 transition cursor-pointer ${
                selectedCategory === 'all' && !searchQuery
                  ? 'bg-[#7A1238] text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-[#7A1238] hover:bg-[#F8E8E9]'
              }`}
            >
              {t('All Products', 'সকল পণ্য')}
            </button>

            {/* Flash Sale Tag */}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('flash');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full shrink-0 bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs shadow-xs hover:brightness-110 transition cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-pulse" />
              <span>{t('Flash Sale', 'ফ্ল্যাশ সেল')}</span>
            </button>

            {/* Categories */}
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-full shrink-0 transition whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-[#BE0750] text-white font-semibold shadow-xs'
                      : 'text-stone-700 hover:text-[#7A1238] hover:bg-[#F8E8E9]'
                  }`}
                >
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FFF9F2] h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#F8E8E9]">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#7A1238] text-white flex items-center justify-center font-serif-luxury font-bold text-sm">
                  P
                </div>
                <div>
                  <span className="font-bold text-[#7A1238] text-base block font-serif-luxury">
                    PREYOSHI SHOP
                  </span>
                  <span className="text-[10px] text-[#BE0750] block font-bangla">
                    প্রেয়সী শপ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-stone-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile PWA Install Button */}
            <div className="mt-4">
              <PWAInstallButton className="w-full justify-center" />
            </div>

            {/* Mobile Category List */}
            <div className="mt-5 space-y-1">
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-2">
                {t('Categories', 'ক্যাটাগরি সমূহ')}
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === 'all'
                    ? 'bg-[#7A1238] text-white'
                    : 'text-stone-700 hover:bg-[#F8E8E9]'
                }`}
              >
                {t('All Products', 'সকল পণ্য')}
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                    selectedCategory === c.id
                      ? 'bg-[#BE0750] text-white'
                      : 'text-stone-700 hover:bg-[#F8E8E9]'
                  }`}
                >
                  {language === 'bn' ? c.nameBn : c.nameEn}
                </button>
              ))}
            </div>

            {/* Information links */}
            <div className="mt-6 pt-5 border-t border-[#F8E8E9] space-y-2 text-xs text-stone-600">
              <button
                onClick={() => {
                  setActiveStaticPage('contact');
                  setActiveModal('staticPage');
                  setMobileMenuOpen(false);
                }}
                className="block py-1 hover:text-[#7A1238]"
              >
                {t('Contact Us & Store Location', 'যোগাযোগ ও ঠিকানা')}
              </button>
              <button
                onClick={() => {
                  setActiveStaticPage('faq');
                  setActiveModal('staticPage');
                  setMobileMenuOpen(false);
                }}
                className="block py-1 hover:text-[#7A1238]"
              >
                {t('Frequently Asked Questions', 'সাধারণ জিজ্ঞাসা (FAQ)')}
              </button>
              <button
                onClick={() => {
                  setActiveStaticPage('return');
                  setActiveModal('staticPage');
                  setMobileMenuOpen(false);
                }}
                className="block py-1 hover:text-[#7A1238]"
              >
                {t('Return & Refund Policy', 'রিটার্ন ও রিফান্ড পলিসি')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
