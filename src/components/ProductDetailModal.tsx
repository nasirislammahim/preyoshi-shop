import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Heart,
  Check,
  Share2,
  MessageSquare
} from 'lucide-react';
import { submitProductReview, fetchReviewsForProduct } from '../services/firestoreService';
import { Review } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    activeModal,
    setActiveModal,
    language,
    formatPrice,
    addToCart,
    wishlist,
    toggleWishlist,
    t,
    currentUser,
    userProfile,
    addToRecentlyViewed
  } = useShop();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState<boolean>(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newReviewerName, setNewReviewerName] = useState<string>('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setSelectedImage(selectedProduct.images[0] || '');
      setSelectedSize(selectedProduct.sizes?.[0] || '');
      setSelectedColor(selectedProduct.colors?.[0]?.name || '');
      setQuantity(1);
      setShowReviewForm(false);
      setReviewSuccess(false);
      addToRecentlyViewed(selectedProduct.id);

      // Fetch reviews
      setIsLoadingReviews(true);
      fetchReviewsForProduct(selectedProduct.id)
        .then(res => setReviews(res))
        .catch(() => setReviews([]))
        .finally(() => setIsLoadingReviews(false));
    }
  }, [selectedProduct]);

  if (activeModal !== 'productDetail' || !selectedProduct) {
    return null;
  }

  const isSaved = wishlist.includes(selectedProduct.id);
  const currentPrice = selectedProduct.discountPrice || selectedProduct.regularPrice;
  const isOutOfStock = selectedProduct.stock <= 0;
  const savings =
    selectedProduct.discountPrice && selectedProduct.regularPrice > selectedProduct.discountPrice
      ? selectedProduct.regularPrice - selectedProduct.discountPrice
      : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity, selectedSize, selectedColor);
    setActiveModal('checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setReviewSubmitting(true);

    const reviewerName =
      newReviewerName.trim() ||
      userProfile?.name ||
      currentUser?.displayName ||
      'Verified Customer';

    const reviewObj: Review = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct.id,
      userId: currentUser?.uid || `guest-${Date.now()}`,
      userName: reviewerName,
      rating: newRating,
      comment: newComment.trim(),
      verifiedPurchase: true,
      createdAt: new Date().toISOString()
    };

    try {
      await submitProductReview(reviewObj);
      setReviews(prev => [reviewObj, ...prev]);
      setReviewSuccess(true);
      setNewComment('');
      setTimeout(() => setShowReviewForm(false), 2000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => {
          setActiveModal(null);
          setSelectedProduct(null);
        }}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] border border-[#F8E8E9]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-stone-100 bg-[#FFF9F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7A1238]">
              {language === 'bn' ? selectedProduct.categoryNameBn : selectedProduct.categoryNameEn}
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 font-mono">
              SKU: {selectedProduct.sku}
            </span>
          </div>

          <button
            onClick={() => {
              setActiveModal(null);
              setSelectedProduct(null);
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {/* 1. Left Column: Image Gallery */}
            <div className="flex flex-col gap-3">
              <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-xs">
                <img
                  src={selectedImage || selectedProduct.images[0]}
                  alt={language === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {selectedProduct.discountPrice && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#BE0750] text-white font-bold text-xs shadow-md">
                    {t('Special Offer', 'বিশেষ ছাড়')}
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition shadow cursor-pointer ${
                    isSaved
                      ? 'bg-[#BE0750] text-white'
                      : 'bg-white/85 text-stone-700 hover:text-[#BE0750]'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {selectedProduct.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        selectedImage === img
                          ? 'border-[#7A1238] shadow-sm'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Right Column: Details & Purchasing */}
            <div className="flex flex-col">
              {/* Reviews Summary */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.round(selectedProduct.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-stone-800">
                  {selectedProduct.rating.toFixed(1)}
                </span>
                <span className="text-xs text-stone-400">
                  ({selectedProduct.reviewCount} {t('customer reviews', 'গ্রাহক রিভিউ')})
                </span>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug mb-3">
                {language === 'bn' ? selectedProduct.nameBn : selectedProduct.nameEn}
              </h1>

              {/* Price & Savings */}
              <div className="flex items-baseline gap-3 p-3.5 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] mb-4">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#7A1238]">
                  {formatPrice(currentPrice)}
                </span>
                {selectedProduct.discountPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {formatPrice(selectedProduct.regularPrice)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="ml-auto text-xs font-semibold text-[#BE0750] bg-[#F8E8E9] px-2.5 py-1 rounded-full">
                    {t('Save', 'বাঁচবে')} {formatPrice(savings)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2 mb-5">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isOutOfStock
                      ? 'bg-rose-500'
                      : selectedProduct.stock <= 5
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-emerald-500'
                  }`}
                />
                <span className="text-xs font-medium text-stone-700">
                  {isOutOfStock
                    ? t('Currently Out of Stock', 'বর্তমানে স্টক নেই')
                    : selectedProduct.stock <= 5
                    ? t(`Only ${selectedProduct.stock} items left in stock!`, `দ্রুত অর্ডার করুন! আর মাত্র ${selectedProduct.stock}টি বাকি।`)
                    : t('In Stock (Ready to ship)', 'স্টকে আছে (ডেলিভারির জন্য প্রস্তুত)')}
                </span>
              </div>

              {/* Variants: Sizes */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('Select Size / Option:', 'সাইজ / অপশন নির্বাচন করুন:')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                          selectedSize === size
                            ? 'bg-[#7A1238] border-[#7A1238] text-white shadow-xs'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-[#BE0750]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variants: Colors */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                    {t('Select Color:', 'রং নির্বাচন করুন:')}{' '}
                    <span className="font-normal text-stone-500">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {selectedProduct.colors.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition cursor-pointer ${
                          selectedColor === col.name
                            ? 'border-[#7A1238] bg-[#F8E8E9] text-[#7A1238]'
                            : 'border-stone-200 bg-white text-stone-700'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {selectedColor === col.name && <Check className="w-3 h-3 text-[#7A1238]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {t('Quantity:', 'পরিমাণ:')}
                </label>
                <div className="flex items-center rounded-xl border border-stone-300 bg-stone-50 overflow-hidden">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-stone-900 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(selectedProduct.stock, prev + 1))}
                    disabled={quantity >= selectedProduct.stock}
                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-40 transition font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Add to Cart & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm shadow-md transition cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-[#BE0750] text-white hover:bg-[#931442]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#D9A441]" />
                  <span>{t('Add to Cart', 'ব্যাগে যোগ করুন')}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer ${
                    isOutOfStock
                      ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#7A1238] to-[#550A24] text-[#FFF9F2] hover:brightness-110 border border-[#D9A441]/40'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
                  <span>{t('Buy Now (Cash on Delivery)', 'এখনই অর্ডার করুন (ক্যাশ অন ডেলিভারি)')}</span>
                </button>
              </div>

              {/* Delivery & Assurance Notes */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <Truck className="w-4 h-4 text-[#7A1238]" />
                  <span>
                    {t(
                      'Inside Dhaka ৳70 (24-48 hrs) • Outside Dhaka ৳130 (2-4 days)',
                      'ঢাকার ভিতর ৳৭০ (২৪-৪৮ ঘণ্টা) • ঢাকার বাইরে ৳১৩০ (২-৪ দিন)'
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-800 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {t(
                      'Cash on Delivery available across all 64 districts of Bangladesh',
                      'বাংলাদেশের সকল ৬৪ জেলায় ক্যাশ অন ডেলিভারি সুবিধা'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Description Section */}
          <div className="pt-6 border-t border-stone-200">
            <h3 className="text-base font-bold text-stone-900 mb-2">
              {t('Product Details & Specifications', 'পণ্যের বিস্তারিত বিবরণ')}
            </h3>
            <p className="text-stone-700 text-sm leading-relaxed whitespace-pre-line">
              {language === 'bn' ? selectedProduct.descriptionBn : selectedProduct.descriptionEn}
            </p>
          </div>

          {/* 4. Customer Reviews & Ratings Section */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {t('Customer Reviews & Ratings', 'গ্রাহক মতামত ও রেটিং')}
                </h3>
                <p className="text-xs text-stone-500">
                  {t('Real verified customer feedback', 'বাস্তব যাচাইকৃত গ্রাহকদের অভিজ্ঞতা')}
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#7A1238] text-[#7A1238] hover:bg-[#F8E8E9] text-xs font-semibold transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{showReviewForm ? t('Close', 'বন্ধ') : t('Write a Review', 'রিভিউ দিন')}</span>
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9] mb-5 space-y-3"
              >
                <h4 className="text-sm font-bold text-[#7A1238]">
                  {t('Share Your Experience', 'আপনার মূল্যবান মতামত শেয়ার করুন')}
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-stone-700">
                    {t('Rating:', 'রেটিং:')}
                  </span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= newRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={newReviewerName}
                    onChange={e => setNewReviewerName(e.target.value)}
                    placeholder={t('Your Name (Optional)', 'আপনার নাম (ঐচ্ছিক)')}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder={t(
                      'How was the quality, fabric, and delivery experience?',
                      'পণ্যের গুণগত মান, ফেব্রিক ও ডেলিভারি কেমন লেগেছে?'
                    )}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                {reviewSuccess && (
                  <p className="text-xs text-emerald-600 font-semibold">
                    {t(
                      'Thank you! Your review has been submitted successfully.',
                      'ধন্যবাদ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।'
                    )}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#7A1238] text-white text-xs font-semibold hover:bg-[#550A24] transition disabled:opacity-50"
                >
                  {reviewSubmitting
                    ? t('Submitting...', 'জমা হচ্ছে...')
                    : t('Submit Review', 'রিভিউ পোস্ট করুন')}
                </button>
              </form>
            )}

            {/* Existing Reviews List */}
            {isLoadingReviews ? (
              <p className="text-xs text-stone-400">{t('Loading reviews...', 'রিভিউ লোড হচ্ছে...')}</p>
            ) : reviews.length === 0 ? (
              <div className="p-4 rounded-xl bg-stone-50 text-center text-xs text-stone-500">
                {t(
                  'No reviews yet for this product. Be the first to review!',
                  'এই পণ্যে এখনো কোনো রিভিউ নেই। আপনিই প্রথম রিভিউ দিন!'
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map(r => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-white border border-stone-100 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-800">{r.userName}</span>
                        {r.verifiedPurchase && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 text-[10px] font-semibold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" />
                            {t('Verified Buyer', 'যাচাইকৃত ক্রেতা')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < r.rating ? 'fill-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-normal">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
