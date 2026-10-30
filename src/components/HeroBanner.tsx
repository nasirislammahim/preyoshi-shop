import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Flame,
  ArrowRight
} from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { banners, language, t, setSelectedCategory } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Active banners
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  // Auto advance carousel
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % activeBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  // Flash Sale Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 34, seconds: 22 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (activeBanners.length === 0) return null;

  const slide = activeBanners[currentSlide] || activeBanners[0];

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 pt-3 sm:pt-4 pb-6">
      {/* 1. Main Slider Container */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl min-h-[360px] sm:min-h-[440px] md:min-h-[480px] bg-stone-900 border border-[#D9A441]/30">
        {/* Background Image with Dark Vignette */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform scale-102"
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#550A24]/95 via-[#7A1238]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Slide Content */}
        <div className="relative z-10 flex flex-col justify-center h-full max-w-2xl p-6 sm:p-10 md:p-14 text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9A441] text-[#550A24] font-bold text-xs uppercase tracking-wider mb-3 w-fit shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {language === 'bn'
                ? slide.badgeBn || 'প্রিমিয়াম কালেকশন'
                : slide.badgeEn || 'PREMIUM BANGLADESH COLLECTION'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black font-serif-luxury tracking-wide text-[#FFF9F2] leading-tight mb-3">
            {language === 'bn' ? slide.titleBn : slide.titleEn}
          </h1>

          {/* Subtitle */}
          <p className="text-stone-200 text-xs sm:text-sm md:text-base font-normal leading-relaxed mb-6 max-w-lg">
            {language === 'bn' ? slide.subtitleBn : slide.subtitleEn}
          </p>

          {/* Action Button & Flash Banner */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                if (slide.linkCategoryId) {
                  setSelectedCategory(slide.linkCategoryId);
                }
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#BE0750] to-[#7A1238] hover:from-[#d61361] hover:to-[#931442] text-white font-bold text-sm shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5 cursor-pointer border border-[#D9A441]/40"
            >
              <span>
                {language === 'bn'
                  ? slide.buttonTextBn || 'এখনই কিনুন'
                  : slide.buttonTextEn || 'Shop Now'}
              </span>
              <ArrowRight className="w-4 h-4 text-[#D9A441]" />
            </button>

            {/* Flash Sale Mini Badge with Live Countdown */}
            <div className="hidden sm:flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/20 text-xs text-[#FFF9F2]">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="font-semibold">{t('Flash Sale Ends:', 'অফার শেষ:')}</span>
              <span className="font-mono font-bold text-[#D9A441]">
                {String(timeLeft.hours).padStart(2, '0')}h :{' '}
                {String(timeLeft.minutes).padStart(2, '0')}m :{' '}
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Prev / Next Controls */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentSlide(prev => (prev === 0 ? activeBanners.length - 1 : prev - 1))
              }
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition border border-white/20 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-6 bg-[#D9A441]' : 'w-2 bg-white/40'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentSlide(prev => (prev + 1) % activeBanners.length)}
              className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition border border-white/20 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 2. Customer Trust Highlights Bar */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#F8E8E9] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8E8E9] text-[#7A1238] flex items-center justify-center shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-800">
              {t('Fast 64-District Delivery', '৬৪ জেলায় দ্রুত ডেলিভারি')}
            </h4>
            <p className="text-[11px] text-stone-500">
              {t('Steadfast, Pathao & eCourier', 'স্টেডফাস্ট ও পাঠাও কুরিয়ার')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#F8E8E9] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8E8E9] text-[#BE0750] flex items-center justify-center shrink-0">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-800">
              {t('Cash on Delivery (COD)', 'ক্যাশ অন ডেলিভারি (COD)')}
            </h4>
            <p className="text-[11px] text-stone-500">
              {t('Pay after checking your parcel', 'পণ্য হাতে পেয়ে মূল্য পরিশোধ')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#F8E8E9] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8E8E9] text-[#D9A441] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-800">
              {t('100% Authentic Quality', '১০০% খাঁটি ও গুণগত মান')}
            </h4>
            <p className="text-[11px] text-stone-500">
              {t('Handpicked premium items', 'বাছাইকৃত সেরা কালেকশন')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#F8E8E9] shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-[#F8E8E9] text-[#550A24] flex items-center justify-center shrink-0">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-stone-800">
              {t('Easy 7-Day Exchange', 'সহজ ৭ দিনে এক্সচেঞ্জ সুবিধা')}
            </h4>
            <p className="text-[11px] text-stone-500">
              {t('Hassle-free customer care', 'গ্রাহক সেবায় আমরা সর্বদা')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
