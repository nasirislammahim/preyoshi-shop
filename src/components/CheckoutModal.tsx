import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { BANGLADESH_DIVISIONS } from '../data/bangladeshLocations';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  User,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Order, PaymentMethod, DeliveryType } from '../types';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    cartSubtotal,
    formatPrice,
    settings,
    coupons,
    language,
    t,
    currentUser,
    userProfile,
    handlePlaceOrder
  } = useShop();

  const isOnline = useOnlineStatus();

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('Dhaka');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka');
  const [selectedUpazila, setSelectedUpazila] = useState('Dhanmondi');
  const [areaVillage, setAreaVillage] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  // Delivery & Payment
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('courier');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [trxId, setTrxId] = useState('');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Pre-fill user profile if available
  useEffect(() => {
    if (userProfile) {
      if (userProfile.name) setCustomerName(userProfile.name);
      if (userProfile.phone) setCustomerPhone(userProfile.phone);
      if (userProfile.email) setCustomerEmail(userProfile.email);
      if (userProfile.division) setSelectedDivision(userProfile.division);
      if (userProfile.district) setSelectedDistrict(userProfile.district);
      if (userProfile.address) setDeliveryAddress(userProfile.address);
    } else if (currentUser) {
      if (currentUser.displayName) setCustomerName(currentUser.displayName);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [userProfile, currentUser]);

  if (activeModal !== 'checkout' || cart.length === 0) return null;

  // Cascading division -> districts
  const currentDivData = BANGLADESH_DIVISIONS.find(d => d.name === selectedDivision) || BANGLADESH_DIVISIONS[0];
  const currentDistricts = currentDivData.districts;
  const currentDistData = currentDistricts.find(d => d.name === selectedDistrict) || currentDistricts[0];
  const currentThanas = currentDistData?.thanas || [];

  // Delivery Charge Calculation
  const isInsideDhaka = selectedDistrict.toLowerCase() === 'dhaka';
  const freeThreshold = settings.freeDeliveryThreshold || 2000;
  const isFreeDelivery = cartSubtotal >= freeThreshold;

  let deliveryCharge = 0;
  if (isFreeDelivery) {
    deliveryCharge = 0;
  } else if (deliveryType === 'own') {
    deliveryCharge = settings.ownDeliveryCharge || 60;
  } else {
    deliveryCharge = isInsideDhaka
      ? settings.insideDhakaDelivery || 70
      : settings.outsideDhakaDelivery || 130;
  }

  // Coupon handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      setCouponError(t('Invalid or expired coupon code.', 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড।'));
      return;
    }

    if (cartSubtotal < found.minOrderAmount) {
      setCouponError(
        t(
          `Minimum order value for this coupon is ${formatPrice(found.minOrderAmount)}`,
          `এই কুপনের জন্য সর্বনিম্ন অর্ডার মূল্য ${formatPrice(found.minOrderAmount)}`
        )
      );
      return;
    }

    let discountAmt = 0;
    if (found.discountType === 'percentage') {
      discountAmt = Math.round((cartSubtotal * found.discountValue) / 100);
      if (found.maxDiscount && discountAmt > found.maxDiscount) {
        discountAmt = found.maxDiscount;
      }
    } else {
      discountAmt = found.discountValue;
    }

    setAppliedCoupon({ code: found.code, discount: discountAmt });
  };

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartSubtotal + deliveryCharge - discountAmount);

  // Submit Order
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isOnline) {
      setFormError(
        t(
          'You are currently offline. Please reconnect to place an order.',
          'আপনি বর্তমানে অফলাইনে আছেন। অর্ডার সম্পন্ন করতে ইন্টারনেট সংযোগ নিশ্চিত করুন।'
        )
      );
      return;
    }

    // Phone validation
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 11) {
      setFormError(
        t(
          'Please enter a valid 11-digit Bangladeshi mobile number (e.g. 017XXXXXXXX).',
          'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)।'
        )
      );
      return;
    }

    if (!customerName.trim()) {
      setFormError(t('Please enter your full name.', 'অনুগ্রহ করে আপনার পুরো নাম দিন।'));
      return;
    }

    if (!deliveryAddress.trim()) {
      setFormError(t('Please enter full delivery address.', 'অনুগ্রহ করে সম্পূর্ণ ঠিকানা লিখুন।'));
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && !trxId.trim()) {
      setFormError(
        t(
          `Please provide the ${paymentMethod.toUpperCase()} Transaction ID (TrxID) for verification.`,
          `পেমেন্ট নিশ্চিত করার জন্য অনুগ্রহ করে ${paymentMethod.toUpperCase()} ট্রানজেকশন আইডি (TrxID) দিন।`
        )
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `PRY-${Date.now().toString().slice(-6)}`;
      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        userId: currentUser?.uid || userProfile?.uid || undefined,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        division: selectedDivision,
        district: selectedDistrict,
        upazila: selectedUpazila,
        areaVillage: areaVillage.trim(),
        deliveryAddress: deliveryAddress.trim(),
        orderNotes: orderNotes.trim() || undefined,
        items: cart,
        subtotal: cartSubtotal,
        deliveryCharge,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        grandTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'unpaid' : 'pending_verification',
        paymentTrxId: trxId.trim() || undefined,
        deliveryType,
        courierName: isInsideDhaka ? 'Preyoshi Express / Pathao' : 'Steadfast Courier',
        status: 'Pending',
        statusTimeline: [
          {
            status: 'Pending',
            timestamp: new Date().toISOString(),
            note: 'Order placed by customer via Preyoshi Shop'
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await handlePlaceOrder(newOrder);
      setActiveModal('orderConfirmation');
    } catch (err) {
      console.error('Failed to submit order:', err);
      setFormError(
        t(
          'Failed to submit order. Please check stock or contact support.',
          'অর্ডার সাবমিট করতে সমস্যা হয়েছে। স্টক যাচাই করুন অথবা আমাদের সাথে যোগাযোগ করুন।'
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="fixed inset-0" onClick={() => !isSubmitting && setActiveModal(null)} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] border border-[#F8E8E9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FFF9F2]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#7A1238]" />
            <h2 className="text-base font-bold text-stone-900 font-serif-luxury">
              {t('Secure Bangladesh Checkout', 'নিরাপদ চেকআউট')}
            </h2>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            disabled={isSubmitting}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 space-y-6">
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Delivery Details (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Customer Contact */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9] space-y-3">
                <h3 className="text-xs font-bold text-[#7A1238] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#BE0750]" />
                  <span>{t('Customer Information', 'গ্রাহকের তথ্য')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {t('Full Name *', 'সম্পূর্ণ নাম *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="e.g. Mahim Islam"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      {t('Mobile Number (01XXXXXXXXX) *', 'মোবাইল নম্বর (১১ ডিজিট) *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="01711234567"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('Email Address (Optional)', 'ইমেইল এড্রেস (ঐচ্ছিক)')}
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>

              {/* Delivery Address Cascading Selector */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9] space-y-3">
                <h3 className="text-xs font-bold text-[#7A1238] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#BE0750]" />
                  <span>{t('Delivery Address (Bangladesh)', 'ডেলিভারি ঠিকানা')}</span>
                </h3>

                {/* Division, District, Thana Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      {t('Division', 'বিভাগ')}
                    </label>
                    <select
                      value={selectedDivision}
                      onChange={e => {
                        const newDiv = e.target.value;
                        setSelectedDivision(newDiv);
                        const match = BANGLADESH_DIVISIONS.find(d => d.name === newDiv);
                        if (match && match.districts.length > 0) {
                          setSelectedDistrict(match.districts[0].name);
                          setSelectedUpazila(match.districts[0].thanas[0] || '');
                        }
                      }}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    >
                      {BANGLADESH_DIVISIONS.map(d => (
                        <option key={d.name} value={d.name}>
                          {language === 'bn' ? d.nameBn : d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      {t('District', 'জেলা')}
                    </label>
                    <select
                      value={selectedDistrict}
                      onChange={e => {
                        const newDist = e.target.value;
                        setSelectedDistrict(newDist);
                        const distData = currentDistricts.find(d => d.name === newDist);
                        if (distData && distData.thanas.length > 0) {
                          setSelectedUpazila(distData.thanas[0]);
                        }
                      }}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    >
                      {currentDistricts.map(d => (
                        <option key={d.name} value={d.name}>
                          {language === 'bn' ? d.nameBn : d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      {t('Thana / Upazila', 'থানা / উপজেলা')}
                    </label>
                    <select
                      value={selectedUpazila}
                      onChange={e => setSelectedUpazila(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                    >
                      {currentThanas.map(th => (
                        <option key={th} value={th}>
                          {th}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    {t('Area / Village / Road / Ward', 'এলাকা / গ্রাম / রোড / ওয়ার্ড')}
                  </label>
                  <input
                    type="text"
                    value={areaVillage}
                    onChange={e => setAreaVillage(e.target.value)}
                    placeholder="e.g. Block D, Road 11"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    {t('Full Detailed Delivery Address *', 'সম্পূর্ণ ডেলিভারি ঠিকানা *')}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    placeholder={t(
                      'House number, Flat/Apartment, Holding, Landmark...',
                      'বাড়ি নং, ফ্ল্যাট নং, হোল্ডিং নং বা পরিচিত স্থান...'
                    )}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                    {t('Order Notes / Delivery instructions (Optional)', 'বিশেষ নির্দেশনা (ঐচ্ছিক)')}
                  </label>
                  <input
                    type="text"
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    placeholder="e.g. Call before delivery"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-stone-200 bg-white"
                  />
                </div>
              </div>

              {/* Delivery Type Option */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9] space-y-2">
                <h3 className="text-xs font-bold text-[#7A1238] uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#BE0750]" />
                  <span>{t('Delivery Method', 'ডেলিভারির ধরণ')}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      deliveryType === 'courier'
                        ? 'border-[#7A1238] bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'courier'}
                      onChange={() => setDeliveryType('courier')}
                      className="mt-0.5 accent-[#7A1238]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-stone-800">
                        {t('Standard Courier Delivery', 'কুরিয়ার ডেলিভারি')}
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        {isInsideDhaka
                          ? t('Inside Dhaka: ৳70', 'ঢাকার ভিতর: ৳৭০')
                          : t('Outside Dhaka: ৳130', 'ঢাকার বাইরে: ৳১৩০')}
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                      deliveryType === 'own'
                        ? 'border-[#7A1238] bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      checked={deliveryType === 'own'}
                      onChange={() => setDeliveryType('own')}
                      className="mt-0.5 accent-[#7A1238]"
                    />
                    <div>
                      <span className="block text-xs font-bold text-stone-800">
                        {t('Preyoshi Own Delivery', 'নিজস্ব হোম ডেলিভারি')}
                      </span>
                      <span className="block text-[11px] text-stone-500">
                        {t('Fast direct delivery: ৳60', 'দ্রুত হোম ডেলিভারি: ৳৬০')}
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Payment (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              {/* Order Items Preview */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9]">
                <h3 className="text-xs font-bold text-[#7A1238] uppercase tracking-wider mb-3">
                  {t('Order Items', 'অর্ডারের পণ্যসমূহ')} ({cart.length})
                </h3>
                <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-2.5 text-xs text-stone-700">
                      <img
                        src={item.image}
                        alt={item.productNameEn}
                        className="w-10 h-12 object-cover rounded-md border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {t(item.productNameEn, item.productNameBn)}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-bold text-stone-900">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon section */}
              <div className="p-3.5 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-300 bg-white font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-3 py-1.5 rounded-xl bg-[#7A1238] text-white text-xs font-semibold"
                  >
                    {t('Apply', 'প্রয়োগ')}
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-rose-600 mt-1">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[10px] text-emerald-600 font-semibold mt-1">
                    ✓ {appliedCoupon.code} applied (-{formatPrice(appliedCoupon.discount)})
                  </p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2]/60 border border-[#F8E8E9] space-y-3">
                <h3 className="text-xs font-bold text-[#7A1238] uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#BE0750]" />
                  <span>{t('Payment Method (Bangladesh)', 'পেমেন্ট পদ্ধতি')}</span>
                </h3>

                <div className="space-y-2">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'cod'
                        ? 'border-[#7A1238] bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#7A1238]"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-stone-800">
                        {t('Cash on Delivery (COD)', 'ক্যাশ অন ডেলিভারি (হাতে পেয়ে মূল্য পরিশোধ)')}
                      </span>
                      <span className="block text-[10px] text-stone-500">
                        {t('Pay in cash when parcel arrives', 'পার্সেল পাওয়ার পর মূল্য পরিশোধ করুন')}
                      </span>
                    </div>
                  </label>

                  {/* bKash */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'bkash'
                        ? 'border-[#BE0750] bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="mt-0.5 accent-[#BE0750]"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-[#BE0750]">bKash (বিকাশ)</span>
                      <span className="block text-[10px] text-stone-500">
                        Merchant: {settings.bkashMerchantNumber || '01711234567'}
                      </span>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'nagad'
                        ? 'border-amber-600 bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'nagad'}
                      onChange={() => setPaymentMethod('nagad')}
                      className="mt-0.5 accent-amber-600"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-amber-700">Nagad (নগদ)</span>
                      <span className="block text-[10px] text-stone-500">
                        Merchant: {settings.nagadMerchantNumber || '01711234567'}
                      </span>
                    </div>
                  </label>

                  {/* Rocket */}
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      paymentMethod === 'rocket'
                        ? 'border-purple-600 bg-white shadow-xs'
                        : 'border-stone-200 bg-white/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'rocket'}
                      onChange={() => setPaymentMethod('rocket')}
                      className="mt-0.5 accent-purple-600"
                    />
                    <div className="flex-1">
                      <span className="block text-xs font-bold text-purple-700">Rocket (রকেট)</span>
                      <span className="block text-[10px] text-stone-500">
                        Merchant: {settings.rocketMerchantNumber || '01711234567'}
                      </span>
                    </div>
                  </label>
                </div>

                {/* TrxID Input if digital payment selected */}
                {(paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 text-xs text-stone-700">
                    <p className="font-semibold text-amber-800">
                      {t(
                        `Please send ৳${grandTotal.toLocaleString()} to our merchant number and enter Transaction ID:`,
                        `অনুগ্রহ করে আমাদের নম্বরে ৳${grandTotal.toLocaleString()} সেন্ড মানি বা পেমেন্ট করে TrxID দিন:`
                      )}
                    </p>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={e => setTrxId(e.target.value)}
                      placeholder="Transaction ID (e.g. 9JA7B5KX)"
                      className="w-full px-3 py-1.5 rounded-lg border border-amber-300 bg-white font-mono uppercase text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Total Calculation breakdown */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9A441]/40 shadow-xs space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{t('Subtotal', 'সাবটোটাল')}</span>
                  <span className="font-semibold">{formatPrice(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>{t('Delivery Charge', 'ডেলিভারি চার্জ')}</span>
                  <span className="font-semibold">
                    {deliveryCharge === 0 ? (
                      <span className="text-emerald-600 font-bold">{t('FREE', 'ফ্রি')}</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>{t('Discount', 'মূল্যছাড়')}</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-[#7A1238] pt-2 border-t border-stone-200">
                  <span>{t('Grand Total', 'সর্বমোট প্রদেয়')}</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7A1238] to-[#BE0750] text-white font-bold text-sm shadow-xl hover:shadow-2xl hover:brightness-105 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('Placing Order...', 'অর্ডার সম্পন্ন হচ্ছে...')}</span>
                ) : (
                  <span>
                    {t('Confirm Order (ক্যাশ অন ডেলিভারি)', 'অর্ডার নিশ্চিত করুন')} • {formatPrice(grandTotal)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
