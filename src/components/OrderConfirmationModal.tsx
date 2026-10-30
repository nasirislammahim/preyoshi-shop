import React, { useEffect, useState } from 'react';
import { useShop } from '../context/ShopContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Printer,
  Truck,
  ShoppingBag,
  Sparkles,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import { PrintInvoiceModal } from './PrintInvoiceModal';

export const OrderConfirmationModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    lastPlacedOrder,
    formatPrice,
    language,
    t,
    setTrackingSearchTerm
  } = useShop();

  const [showPrintInvoice, setShowPrintInvoice] = useState(false);

  useEffect(() => {
    if (activeModal === 'orderConfirmation' && lastPlacedOrder) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#7A1238', '#BE0750', '#D9A441', '#FFF9F2']
        });
      } catch {
        // non-blocking
      }
    }
  }, [activeModal, lastPlacedOrder]);

  if (activeModal !== 'orderConfirmation' || !lastPlacedOrder) return null;

  const handleTrackOrder = () => {
    setTrackingSearchTerm(lastPlacedOrder.orderNumber);
    setActiveModal('orderTracking');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
        <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-[#F8E8E9]">
          {/* Confetti & Success Emblem */}
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#7A1238] font-serif-luxury">
            {t('Thank You! Order Confirmed', 'ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত হয়েছে')}
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            {t(
              'Your order has been placed with Preyoshi Shop and is now being processed.',
              'আপনার অর্ডারটি প্রেয়সী শপে সফলভাবে গৃহীত হয়েছে এবং প্রক্রিয়াকরণ শুরু হয়েছে।'
            )}
          </p>

          {/* Order Details Card */}
          <div className="mt-5 p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center pb-2 border-b border-stone-200">
              <span className="text-stone-500">{t('Order Number:', 'অর্ডার নম্বর:')}</span>
              <span className="font-mono font-bold text-[#7A1238] text-sm">
                {lastPlacedOrder.orderNumber}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500">{t('Customer:', 'গ্রাহক:')}</span>
              <span className="font-semibold text-stone-800">
                {lastPlacedOrder.customerName} ({lastPlacedOrder.customerPhone})
              </span>
            </div>

            <div className="flex justify-between items-start">
              <span className="text-stone-500 shrink-0">{t('Delivery To:', 'ঠিকানা:')}</span>
              <span className="font-medium text-stone-700 text-right max-w-[220px]">
                {lastPlacedOrder.deliveryAddress}, {lastPlacedOrder.upazila}, {lastPlacedOrder.district}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-stone-500">{t('Payment Method:', 'পেমেন্ট:')}</span>
              <span className="font-semibold text-stone-800 uppercase">
                {lastPlacedOrder.paymentMethod} (৳{lastPlacedOrder.grandTotal.toLocaleString()})
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-stone-200 font-bold text-sm text-[#7A1238]">
              <span>{t('Grand Total:', 'সর্বমোট:')}</span>
              <span>{formatPrice(lastPlacedOrder.grandTotal)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => setShowPrintInvoice(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl border border-[#7A1238] text-[#7A1238] hover:bg-[#F8E8E9] text-xs font-semibold transition"
            >
              <Printer className="w-4 h-4" />
              <span>{t('Print Invoice', 'ইনভয়েস প্রিন্ট')}</span>
            </button>

            <button
              onClick={handleTrackOrder}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#BE0750] text-white hover:bg-[#931442] text-xs font-semibold shadow transition"
            >
              <Truck className="w-4 h-4 text-[#D9A441]" />
              <span>{t('Track Parcel', 'অর্ডার ট্র্যাক করুন')}</span>
            </button>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="mt-3 text-xs text-stone-500 hover:text-stone-800 underline"
          >
            {t('Continue Shopping', 'আরও কেনাকাটা করুন')}
          </button>
        </div>
      </div>

      {showPrintInvoice && (
        <PrintInvoiceModal
          order={lastPlacedOrder}
          onClose={() => setShowPrintInvoice(false)}
        />
      )}
    </>
  );
};
