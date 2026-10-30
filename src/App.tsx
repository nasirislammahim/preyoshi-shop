import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { Footer } from './components/Footer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomerProfileModal } from './components/CustomerProfileModal';
import { StaticPagesModal } from './components/StaticPagesModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import {
  Sparkles,
  Flame,
  ArrowRight,
  Filter,
  SlidersHorizontal,
  Star,
  CheckCircle,
  Truck,
  ShieldCheck,
  HeartHandshake,
  Clock,
  Layers
} from 'lucide-react';

const StorefrontContent: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    filteredProducts,
    sortBy,
    setSortBy,
    priceFilter,
    setPriceFilter,
    recentlyViewedIds,
    language,
    t,
    formatPrice,
    setActiveModal,
    setActiveStaticPage
  } = useShop();

  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Curated product slices
  const flashSaleProducts = products.filter(p => p.isFlashSale && p.stock > 0);
  const newArrivals = products.filter(p => p.isNewArrival);
  const bestSellers = products.filter(p => p.isBestSeller);
  const recentlyViewed = products.filter(p => recentlyViewedIds.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F2] text-stone-900 selection:bg-[#BE0750] selection:text-white">
      {/* 1. Header Navigation */}
      <Header />

      {/* 2. Main Content */}
      <main className="flex-1">
        {/* If searching or specific category selected, show clean catalog view */}
        {searchQuery ? (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#F8E8E9]">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#7A1238] font-serif-luxury">
                  {t('Search Results for:', 'অনুসন্ধান ফলাফল:')}{' '}
                  <span className="text-stone-900 font-sans">"{searchQuery}"</span>
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  {t(
                    `Found ${filteredProducts.length} matching products`,
                    `${filteredProducts.length} টি পণ্য পাওয়া গেছে`
                  )}
                </p>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-medium">{t('Sort By:', 'বাছাই:')}</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="featured">Featured (জনপ্রিয়)</option>
                  <option value="price-asc">Price: Low to High (কম থেকে বেশি)</option>
                  <option value="price-desc">Price: High to Low (বেশি থেকে কম)</option>
                  <option value="rating">Top Rated (সর্বোচ্চ রেটিং)</option>
                  <option value="newest">Newest First (নতুন)</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-[#F8E8E9] space-y-3">
                <p className="text-stone-500 text-sm">
                  {t('No products match your search.', 'আপনার অনুসন্ধানের সাথে কোনো পণ্য মেলেনি।')}
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-[#7A1238] text-white text-xs font-semibold"
                >
                  {t('Clear Search', 'অনুসন্ধান মুছুন')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Promotional Hero Banner */}
            <HeroBanner />

            {/* 3. Featured Categories Bar */}
            <section className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#7A1238] font-serif-luxury tracking-wide">
                    {t('Shop by Category', 'ক্যাটাগরি অনুযায়ী কেনাকাটা')}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t('Explore our curated luxury collections', 'পছন্দের ক্যাটাগরি বেছে নিন')}
                  </p>
                </div>
              </div>

              {/* Category Carousel / Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4">
                {categories.slice(0, 12).map(cat => (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`group flex flex-col items-center p-3 rounded-2xl border transition-all duration-300 cursor-pointer text-center ${
                      selectedCategory === cat.id
                        ? 'bg-[#7A1238] border-[#7A1238] text-white shadow-md'
                        : 'bg-white border-[#F8E8E9] hover:border-[#D9A441] hover:shadow-lg'
                    }`}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-stone-100 mb-2 border border-stone-200 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=80'}
                        alt={cat.nameEn}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span
                      className={`text-xs font-bold leading-tight ${
                        selectedCategory === cat.id
                          ? 'text-white'
                          : 'text-stone-800 group-hover:text-[#7A1238]'
                      }`}
                    >
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 ${
                        selectedCategory === cat.id ? 'text-stone-200' : 'text-stone-400'
                      }`}
                    >
                      {cat.productCount || 12}+ {t('Items', 'পণ্য')}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Flash Sale Section */}
            {flashSaleProducts.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="rounded-3xl bg-gradient-to-r from-[#7A1238] via-[#BE0750] to-[#550A24] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-amber-400 text-[#550A24] shadow-md animate-pulse">
                        <Flame className="w-6 h-6 fill-[#550A24]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-xl sm:text-2xl font-black font-serif-luxury tracking-wide text-white">
                            {t('Flash Sale — Limited Quantities', 'ফ্ল্যাশ সেল — সীমিত স্টক')}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full bg-white text-[#7A1238] font-extrabold text-[10px] uppercase">
                            Up to 30% OFF
                          </span>
                        </div>
                        <p className="text-xs text-stone-200 mt-0.5">
                          {t(
                            'Special markdown on authentic Jamdani and bridal jewellery.',
                            'খাঁটি জামদানি ও ব্রাইডাল গহনায় বিশেষ ছাড়।'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                      <Clock className="w-4 h-4 text-amber-300" />
                      <span>{t('Hurry, offer valid today!', 'অফারটি আজকের জন্যই প্রযোজ্য!')}</span>
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                    {flashSaleProducts.slice(0, 4).map(prod => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. Main Catalog & Filters Section */}
            <section className="max-w-7xl mx-auto px-4 py-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-[#F8E8E9]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#7A1238] font-serif-luxury tracking-wide">
                    {selectedCategory === 'all'
                      ? t('Exclusive Catalog', 'আমাদের আকর্ষণীয় কালেকশন')
                      : categories.find(c => c.id === selectedCategory)?.nameEn || 'Collection'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {t(
                      'Handpicked with love for style and comfort across Bangladesh',
                      'সেরা কোয়ালিটি ও সাশ্রয়ী মূল্যে আপনার পছন্দের পণ্য'
                    )}
                  </p>
                </div>

                {/* Filter and Sort Controls */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setFilterMenuOpen(prev => !prev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs font-semibold text-stone-700 hover:border-[#7A1238] transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#7A1238]" />
                    <span>{t('Price Filter', 'মূল্য ফিল্টার')}</span>
                  </button>

                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white font-medium text-stone-700 cursor-pointer"
                  >
                    <option value="featured">Featured (জনপ্রিয়)</option>
                    <option value="bestseller">Best Sellers (সেরা বিক্রয়)</option>
                    <option value="newest">New Arrivals (নতুন)</option>
                    <option value="price-asc">Price: Low to High (কম মূল্য)</option>
                    <option value="price-desc">Price: High to Low (বেশি মূল্য)</option>
                    <option value="rating">Highest Rated (শীর্ষ রেটিং)</option>
                  </select>
                </div>
              </div>

              {/* Price Filter Dropdown bar */}
              {filterMenuOpen && (
                <div className="mb-6 p-4 rounded-2xl bg-white border border-[#D9A441]/40 shadow-xs flex flex-wrap items-center gap-4 text-xs animate-fade-in">
                  <span className="font-bold text-stone-700">{t('Price Range:', 'মূল্য পরিসীমা:')}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPriceFilter([0, 2000])}
                      className={`px-3 py-1 rounded-lg border ${
                        priceFilter[1] === 2000 ? 'bg-[#7A1238] text-white font-bold' : 'bg-stone-50'
                      }`}
                    >
                      Under ৳2,000
                    </button>
                    <button
                      onClick={() => setPriceFilter([2000, 5000])}
                      className={`px-3 py-1 rounded-lg border ${
                        priceFilter[0] === 2000 && priceFilter[1] === 5000
                          ? 'bg-[#7A1238] text-white font-bold'
                          : 'bg-stone-50'
                      }`}
                    >
                      ৳2,000 - ৳5,000
                    </button>
                    <button
                      onClick={() => setPriceFilter([5000, 15000])}
                      className={`px-3 py-1 rounded-lg border ${
                        priceFilter[0] === 5000 ? 'bg-[#7A1238] text-white font-bold' : 'bg-stone-50'
                      }`}
                    >
                      ৳5,000 - ৳15,000+
                    </button>
                    <button
                      onClick={() => setPriceFilter([0, 50000])}
                      className="px-2 py-1 text-stone-500 hover:text-stone-800 underline text-[11px]"
                    >
                      Reset Filter
                    </button>
                  </div>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {filteredProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </section>

            {/* 6. Promotional Mid-Page Banner Showcase */}
            <section className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setSelectedCategory('cat-saree')}
                  className="group relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] p-6 sm:p-8 flex flex-col justify-end text-white cursor-pointer shadow-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=900&q=80"
                    alt="Bridal Katan"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#D9A441] tracking-widest">
                      BRIDAL & KATAN SILK
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif-luxury">
                      {t('Regal Wedding Banarasi Silks', 'রাজকীয় ব্রাইডাল বেনারসি শাড়ি')}
                    </h3>
                    <p className="text-xs text-stone-200">
                      {t('Intricate golden zari jaal hand-embroidery', 'ঘন সোনালী জরির অপূর্ব নকশা')}
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedCategory('cat-jewellery')}
                  className="group relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] p-6 sm:p-8 flex flex-col justify-end text-white cursor-pointer shadow-lg"
                >
                  <img
                    src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80"
                    alt="Artisanal Jewellery"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-[#D9A441] tracking-widest">
                      KUNDAN & MEENAKARI
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black font-serif-luxury">
                      {t('Royal Choker Sets & Jhumkas', 'কুন্দন চোকার সেট ও ঝুমকা')}
                    </h3>
                    <p className="text-xs text-stone-200">
                      {t('22K micro gold-plated handcrafted allure', '২২ ক্যারেট মাইক্রো গোল্ড প্লেটেড অলঙ্কার')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 7. New Arrivals */}
            {newArrivals.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-[#7A1238] font-serif-luxury tracking-wide">
                      {t('New Arrivals 2026', 'নতুন আগমনী সম্ভার')}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {t('Freshly added styles tailored for your elegance', 'নতুন ডিজাইনের ট্রেন্ডি কালেকশন')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                  {newArrivals.slice(0, 4).map(prod => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              </section>
            )}

            {/* 8. Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900 font-serif-luxury mb-4">
                  {t('Recently Viewed by You', 'আপনার সম্প্রতি দেখা পণ্যসমূহ')}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {recentlyViewed.slice(0, 4).map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {/* 9. Customer Testimonials */}
            <section className="max-w-7xl mx-auto px-4 py-12">
              <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A441]">
                  TESTIMONIALS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#7A1238] font-serif-luxury">
                  {t('Loved by Customers Across Bangladesh', 'গ্রাহকদের ভালোবাসায় প্রেয়সী শপ')}
                </h2>
                <p className="text-xs text-stone-500">
                  {t(
                    'Real stories and reviews from verified buyers across 64 districts',
                    'দেশের বিভিন্ন প্রান্তের ক্রেতাদের মূল্যবান অভিজ্ঞতা'
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 rounded-3xl bg-white border border-[#F8E8E9] shadow-xs space-y-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "ঢাকা জামদানি শাড়িটি অর্ডার করেছিলাম। ফেব্রিকের কোয়ালিটি এবং জরির কাজ ছবিতে যেমন দেখেছি ঠিক তেমনই পেয়েছি। ২ দিনের মধ্যে ক্যাশ অন ডেলিভারিতে হাতে পেয়েছি!"
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-stone-900 block">সাদিয়া আফরিন</strong>
                      <span className="text-[11px] text-stone-400">ধানমন্ডি, ঢাকা</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#F8E8E9] shadow-xs space-y-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "Preyoshi Shop's Kundan choker set exceeded my expectations for my sister's wedding. Excellent packaging and instant customer support over WhatsApp."
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-stone-900 block">Nusrat Jahan</strong>
                      <span className="text-[11px] text-stone-400">Chittagong</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-white border border-[#F8E8E9] shadow-xs space-y-3">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-stone-700 italic leading-relaxed">
                    "খুলনায় ৩ দিনের মাথায় কুরিয়ারে পেয়েছি। লেদার ব্যাগটির ফিনিশিং খুব চমৎকার। প্রেয়সী শপের সার্ভিস সত্যিই প্রশংসনীয়।"
                  </p>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-stone-900 block">ফারহানা ইয়াসমিন</strong>
                      <span className="text-[11px] text-stone-400">খুলনা</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                      ✓ Verified
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* 10. Footer */}
      <Footer />

      {/* 11. Interactive Modals */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <OrderTrackingModal />
      <AdminDashboard />
      <CustomerProfileModal />
      <StaticPagesModal />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}
