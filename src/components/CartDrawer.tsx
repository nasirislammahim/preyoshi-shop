import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    formatPrice,
    settings,
    coupons,
    t
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (activeModal !== 'cart') return null;

  const freeDeliveryThreshold = settings.freeDeliveryThreshold || 2000;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponInput.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError(t('Invalid coupon code.', 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড।'));
      return;
    }

    if (cartSubtotal < found.minOrderAmount) {
      setCouponError(
        t(
          `Minimum order amount for this coupon is ${formatPrice(found.minOrderAmount)}`,
          `এই কুপনের জন্য সর্বনিম্ন অর্ডার মূল্য ${formatPrice(found.minOrderAmount)} হতে হবে`
        )
      );
      return;
    }

    let calculatedDiscount = 0;
    if (found.discountType === 'percentage') {
      calculatedDiscount = Math.round((cartSubtotal * found.discountValue) / 100);
      if (found.maxDiscount && calculatedDiscount > found.maxDiscount) {
        calculatedDiscount = found.maxDiscount;
      }
    } else {
      calculatedDiscount = found.discountValue;
    }

    setAppliedCoupon({ code: found.code, discount: calculatedDiscount });
    setCouponInput('');
  };

  const finalTotal = Math.max(0, cartSubtotal - (appliedCoupon ? appliedCoupon.discount : 0));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => setActiveModal(null)}
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-[#F8E8E9]">
        {/* 1. Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FFF9F2]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#7A1238]" />
            <h2 className="text-base font-bold text-stone-900">
              {t('Shopping Bag', 'শপিং ব্যাগ')} ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Free Delivery Progress Bar */}
        <div className="px-6 py-3 bg-[#F8E8E9]/60 border-b border-[#F8E8E9] text-xs">
          <div className="flex items-center justify-between mb-1.5 font-semibold text-[#7A1238]">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              {amountNeededForFreeDelivery === 0
                ? t('🎉 You unlocked FREE Delivery!', '🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পেয়েছেন!')
                : t(
                    `Add ${formatPrice(amountNeededForFreeDelivery)} more for FREE Delivery!`,
                    `আর মাত্র ${formatPrice(amountNeededForFreeDelivery)} এর কেনাকাটায় ফ্রি ডেলিভারি!`
                  )}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#BE0750] to-[#7A1238] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 3. Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F8E8E9] text-[#7A1238] flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-stone-800 text-base">
                  {t('Your bag is empty', 'আপনার শপিং ব্যাগটি খালি')}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  {t(
                    'Explore our exclusive sarees, jewellery, and luxury collections today.',
                    'আমাদের আকর্ষণীয় শাড়ি, জুয়েলারি ও অন্যান্য পণ্য দেখুন।'
                  )}
                </p>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 rounded-full bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition shadow"
              >
                {t('Start Shopping', 'কেনাকাটা শুরু করুন')}
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3.5 p-3 rounded-2xl border border-stone-100 bg-[#FFF9F2]/40 shadow-2xs"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.image}
                  alt={item.productNameEn}
                  className="w-16 h-20 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-200/60"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                    {t(item.productNameEn, item.productNameBn)}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                    {item.selectedSize && <span>{item.selectedSize}</span>}
                    {item.selectedSize && item.selectedColor && <span>•</span>}
                    {item.selectedColor && <span>{item.selectedColor}</span>}
                  </div>
                  <div className="mt-1 font-bold text-xs text-[#7A1238]">
                    {formatPrice(item.price)}
                  </div>

                  {/* Stepper & Delete */}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-stone-300 bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-rose-600 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-[#FFF9F2] space-y-3">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value)}
                  placeholder={t('Enter Coupon (e.g. PREYOSHI10)', 'কুপন কোড (যেমন: PREYOSHI10)')}
                  className="w-full pl-8 pr-2 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono uppercase"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition"
              >
                {t('Apply', 'প্রয়োগ')}
              </button>
            </form>

            {couponError && <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>}

            {appliedCoupon && (
              <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <span>
                  {t('Coupon Applied:', 'কুপন প্রযোজ্য:')} {appliedCoupon.code}
                </span>
                <span>-{formatPrice(appliedCoupon.discount)}</span>
              </div>
            )}

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-1">
              <div className="flex justify-between">
                <span>{t('Subtotal', 'সাবটোটাল')}</span>
                <span className="font-semibold text-stone-800">{formatPrice(cartSubtotal)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>{t('Discount', 'মূল্যছাড়')}</span>
                  <span>-{formatPrice(appliedCoupon.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-stone-500">
                <span>{t('Estimated Delivery', 'আনুমানিক ডেলিভারি')}</span>
                <span>{amountNeededForFreeDelivery === 0 ? t('FREE', 'ফ্রি') : t('Calculated at checkout', 'চেকআউটে নির্ধারিত')}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#7A1238] pt-2 border-t border-stone-200">
                <span>{t('Total', 'সর্বমোট')}</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => setActiveModal('checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#7A1238] to-[#BE0750] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:brightness-105 transition cursor-pointer"
            >
              <span>{t('Proceed to Checkout', 'চেকআউটে এগিয়ে যান')}</span>
              <ArrowRight className="w-4 h-4 text-[#D9A441]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
