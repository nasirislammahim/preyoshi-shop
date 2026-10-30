import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { fetchOrderByIdOrPhone } from '../services/firestoreService';
import { Order, OrderStatus } from '../types';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  Check,
  AlertTriangle,
  Printer
} from 'lucide-react';
import { PrintInvoiceModal } from './PrintInvoiceModal';

export const OrderTrackingModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    trackingSearchTerm,
    setTrackingSearchTerm,
    formatPrice,
    language,
    t
  } = useShop();

  const [searchInput, setSearchInput] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (trackingSearchTerm) {
      setSearchInput(trackingSearchTerm);
      handleSearch(trackingSearchTerm);
    }
  }, [trackingSearchTerm]);

  if (activeModal !== 'orderTracking') return null;

  const handleSearch = async (termToSearch?: string) => {
    const query = (termToSearch || searchInput).trim();
    if (!query) return;

    setIsSearching(true);
    setSearchError('');
    setTrackedOrder(null);

    try {
      const order = await fetchOrderByIdOrPhone(query);
      if (order) {
        setTrackedOrder(order);
      } else {
        setSearchError(
          t(
            'No order found matching this Order Number or Phone Number.',
            'এই অর্ডার নম্বর বা ফোন নম্বরের কোনো অর্ডার খুঁজে পাওয়া যায়নি।'
          )
        );
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setSearchError(t('Failed to search order. Please try again.', 'অনুসন্ধান ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'));
    } finally {
      setIsSearching(false);
    }
  };

  const statusSteps: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = trackedOrder ? statusSteps.indexOf(trackedOrder.status) : 0;
  const isCancelled = trackedOrder?.status === 'Cancelled';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
        <div className="fixed inset-0" onClick={() => setActiveModal(null)} />

        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-[#F8E8E9] flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FFF9F2]">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#7A1238]" />
              <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
                {t('Track Your Order', 'অর্ডার ট্র্যাকিং')}
              </h2>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6">
            {/* Search Input Bar */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSearch();
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder={t(
                    'Enter Order Number (PRY-...) or Phone (017...)',
                    'অর্ডার নম্বর (PRY-...) বা ফোন নম্বর দিন'
                  )}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs font-mono uppercase bg-white"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition disabled:opacity-50"
              >
                {isSearching ? t('Searching...', 'খোঁজা হচ্ছে...') : t('Track', 'ট্র্যাক করুন')}
              </button>
            </form>

            {searchError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center">
                {searchError}
              </div>
            )}

            {/* Tracked Order Details */}
            {trackedOrder && (
              <div className="space-y-6 animate-fade-in">
                {/* Status Header */}
                <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <span className="text-[11px] text-stone-500 font-mono">
                      Order: <strong className="text-stone-800">{trackedOrder.orderNumber}</strong>
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                      {trackedOrder.customerName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-700'
                          : trackedOrder.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-[#D9A441]/20 text-[#7A1238]'
                      }`}
                    >
                      {trackedOrder.status}
                    </span>

                    <button
                      onClick={() => setShowInvoice(true)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-white"
                      title="Print Invoice"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Timeline */}
                {isCancelled ? (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800 text-xs">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="font-bold">{t('Order Cancelled', 'অর্ডার বাতিল করা হয়েছে')}</p>
                      <p className="text-[11px] text-rose-600 mt-0.5">
                        {t('This order has been cancelled. Please contact customer care for details.', 'এই অর্ডারটি বাতিল করা হয়েছে। বিস্তারিত জানতে গ্রাহক সেবায় যোগাযোগ করুন।')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-stone-200 -translate-y-1/2 z-0" />
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#7A1238] to-[#BE0750] -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`
                        }}
                      />

                      {statusSteps.map((step, idx) => {
                        const isCompleted = idx <= currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                          <div key={step} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                                isCompleted
                                  ? 'bg-[#7A1238] text-white ring-4 ring-[#F8E8E9]'
                                  : 'bg-white border-2 border-stone-300 text-stone-400'
                              } ${isCurrent ? 'scale-110' : ''}`}
                            >
                              {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] font-semibold mt-2 whitespace-nowrap ${
                                isCurrent
                                  ? 'text-[#7A1238] font-bold'
                                  : isCompleted
                                  ? 'text-stone-800'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Courier & Tracking Details */}
                {(trackedOrder.courierName || trackedOrder.trackingNumber) && (
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-stone-500">{t('Courier Partner:', 'কুরিয়ার:')}</span>
                      <span className="font-semibold text-stone-800">
                        {trackedOrder.courierName || 'Steadfast Courier'}
                      </span>
                    </div>
                    {trackedOrder.trackingNumber && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">{t('Tracking Number:', 'ট্র্যাকিং আইডি:')}</span>
                        <span className="font-mono font-bold text-[#BE0750]">
                          {trackedOrder.trackingNumber}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Order Items Preview */}
                <div className="border border-stone-200 rounded-2xl p-4 space-y-2 text-xs">
                  <h4 className="font-bold text-stone-800 uppercase text-[10px] tracking-wider mb-2">
                    {t('Ordered Items', 'অর্ডারের পণ্যসমূহ')}
                  </h4>
                  {trackedOrder.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-stone-700">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.image}
                          alt={item.productNameEn}
                          className="w-8 h-10 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium truncate max-w-[200px]">
                            {t(item.productNameEn, item.productNameBn)}
                          </p>
                          <p className="text-[10px] text-stone-400">
                            Qty: {item.quantity} • {item.selectedSize || ''}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#7A1238]">
                    <span>{t('Grand Total:', 'সর্বমোট:')}</span>
                    <span>{formatPrice(trackedOrder.grandTotal)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showInvoice && trackedOrder && (
        <PrintInvoiceModal order={trackedOrder} onClose={() => setShowInvoice(false)} />
      )}
    </>
  );
};
