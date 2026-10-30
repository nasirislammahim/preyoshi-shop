import React from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProduct,
    setActiveModal,
    t
  } = useShop();

  const isSaved = wishlist.includes(product.id);
  const discountPercent =
    product.discountPrice && product.regularPrice > product.discountPrice
      ? Math.round(((product.regularPrice - product.discountPrice) / product.regularPrice) * 100)
      : null;

  const currentPrice = product.discountPrice || product.regularPrice;
  const isOutOfStock = product.stock <= 0;

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveModal('productDetail');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-2xl bg-white border border-[#F8E8E9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
    >
      {/* 1. Image Container */}
      <div className="relative aspect-4/5 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'}
          alt={language === 'bn' ? product.nameBn : product.nameEn}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-[#BE0750] text-white font-bold text-[10px] tracking-wide shadow-xs">
              -{discountPercent}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-[#7A1238] text-[#D9A441] font-bold text-[9px] uppercase tracking-wider shadow-xs">
              {t('New', 'নতুন')}
            </span>
          )}
          {product.isDemo && (
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-900/80 text-amber-300 font-mono text-[8px] uppercase tracking-wider backdrop-blur-xs">
              DEMO DATA
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition z-10 shadow-sm cursor-pointer ${
            isSaved
              ? 'bg-[#BE0750] text-white'
              : 'bg-white/80 text-stone-700 hover:text-[#BE0750] hover:bg-white'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Quick Actions overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-xs text-xs font-semibold text-stone-800 hover:bg-white shadow transition"
          >
            <Eye className="w-3.5 h-3.5 text-[#7A1238]" />
            <span>{t('View', 'বিস্তারিত')}</span>
          </button>

          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7A1238] text-white hover:bg-[#550A24] text-xs font-semibold shadow transition"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>{t('Add to Cart', 'ব্যাগে যোগ')}</span>
            </button>
          )}
        </div>

        {/* Stock Out Overlay if zero stock */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-2 z-10">
            <span className="px-3 py-1 rounded-full bg-rose-600 text-white font-bold text-xs tracking-wider uppercase">
              {t('Out of Stock', 'স্টক শেষ')}
            </span>
          </div>
        )}
      </div>

      {/* 2. Details Info */}
      <div className="flex flex-col flex-1 p-3.5 sm:p-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
          <span className="truncate text-stone-500 font-medium">
            {language === 'bn' ? product.categoryNameBn || 'কালেকশন' : product.categoryNameEn || 'Collection'}
          </span>
          <div className="flex items-center gap-1 text-amber-500 shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-stone-700 text-[10px]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-stone-400 text-[9px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Product Title */}
        <h3 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#7A1238] transition mb-2">
          {language === 'bn' ? product.nameBn : product.nameEn}
        </h3>

        {/* Price Row & Quick Cart button on Mobile */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-stone-100">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-bold text-[#7A1238]">
              {formatPrice(currentPrice)}
            </span>
            {product.discountPrice && (
              <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                {formatPrice(product.regularPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`sm:hidden p-2 rounded-xl transition ${
              isOutOfStock
                ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
                : 'bg-[#7A1238] text-white hover:bg-[#550A24]'
            }`}
            aria-label="Quick Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#D9A441]" />
          </button>
        </div>
      </div>
    </div>
  );
};
