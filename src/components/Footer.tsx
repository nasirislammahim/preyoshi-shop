import React from 'react';
import { useShop } from '../context/ShopContext';
import {
  Facebook,
  Phone,
  Mail,
  MapPin,
  Heart,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Footer: React.FC = () => {
  const {
    t,
    language,
    setSelectedCategory,
    setActiveModal,
    setActiveStaticPage
  } = useShop();

  return (
    <footer className="mt-16 bg-[#550A24] text-stone-300 text-xs border-t-4 border-[#D9A441]">
      {/* 1. Main Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand Info & Nurtaz Agency (2 cols wide) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#7A1238] to-[#BE0750] border border-[#D9A441] flex items-center justify-center text-white font-serif-luxury font-bold text-base shadow">
                P
              </div>
              <div>
                <span className="text-xl font-black text-[#FFF9F2] font-serif-luxury tracking-wider block">
                  PREYOSHI SHOP
                </span>
                <span className="text-xs text-[#D9A441] font-semibold font-bangla block">
                  প্রেয়সী শপ
                </span>
              </div>
            </div>

            <p className="text-stone-300 text-xs leading-relaxed max-w-sm">
              {t(
                'Luxury & traditional e-commerce sanctuary based in Bangladesh. Dedicated to handpicked Jamdani sarees, bridal katan silks, fine royal jewellery, and high-fashion lifestyle accessories.',
                'ঐতিহ্য আর আধুনিকতার মেলবন্ধনে সাজানো প্রিমিয়াম শাড়ি, জুয়েলারি, ব্যাগ ও রূপচর্চা পণ্যের নির্ভরযোগ্য অনলাইন স্টোর।'
              )}
            </p>

            <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-[11px] text-stone-300 space-y-0.5">
              <p>
                <span className="text-[#D9A441] font-bold">Tagline:</span> Your Style ♥ Our Priority
              </p>
              <p>
                <span className="text-[#D9A441] font-bold">Brand Designer:</span> Nurtaz Agency
              </p>
              <p>
                <span className="text-[#D9A441] font-bold">Country:</span> Bangladesh (৳ BDT)
              </p>
            </div>

            {/* Social Media & Channels */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://www.facebook.com/Preyoshishop/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1877F2] text-white hover:brightness-110 transition font-semibold text-[11px]"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook Page</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <a
                href="https://wa.me/8801711234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white hover:brightness-110 transition font-semibold text-[11px]"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9A441] font-serif-luxury uppercase tracking-wider">
              {t('Top Categories', 'জনপ্রিয় ক্যাটাগরি')}
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-saree')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Saree (Jamdani & Katan)', 'শাড়ি (জামদানি ও কাতান)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-jewellery')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Jewellery & Chokers', 'জুয়েলারি ও গহনা')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-womens-fashion')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t("Women's Anarkali & Gowns", 'মহিলাদের ফ্যাশন')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-bags')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Leather Bags & Clutches', 'ব্যাগ ও এক্সেসরিজ')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-cosmetics')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Cosmetics & Beauty', 'কসমেটিকস ও রূপচর্চা')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedCategory('cat-mens-fashion')}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Men’s Panjabi Collection', 'পুরুষদের পাঞ্জাবি')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Tracking */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9A441] font-serif-luxury uppercase tracking-wider">
              {t('Customer Support', 'গ্রাহক সেবা')}
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button
                  onClick={() => setActiveModal('orderTracking')}
                  className="hover:text-[#D9A441] transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{t('Track Your Order', 'অর্ডার ট্র্যাক করুন')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStaticPage('contact');
                    setActiveModal('staticPage');
                  }}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Contact Us', 'যোগাযোগ ও সাপোর্ট')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStaticPage('faq');
                    setActiveModal('staticPage');
                  }}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Frequently Asked Questions', 'সাধারণ জিজ্ঞাসা (FAQ)')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStaticPage('return');
                    setActiveModal('staticPage');
                  }}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Return & Refund Policy', '৭ দিনে রিটার্ন পলিসি')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStaticPage('privacy');
                    setActiveModal('staticPage');
                  }}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveStaticPage('terms');
                    setActiveModal('staticPage');
                  }}
                  className="hover:text-[#D9A441] transition cursor-pointer"
                >
                  {t('Terms & Conditions', 'শর্তাবলী ও নিয়ম')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Store Contact & Bangladesh Office */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#D9A441] font-serif-luxury uppercase tracking-wider">
              {t('Dhaka Storefront', 'ঠিকানা ও অফিস')}
            </h4>
            <div className="space-y-2 text-stone-300 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <span>House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D9A441] shrink-0" />
                <span>+880 1711-234567</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D9A441] shrink-0" />
                <span>preyoshishop.bd@gmail.com</span>
              </p>
            </div>

            <div className="pt-2">
              <PWAInstallButton variant="badge" />
            </div>
          </div>
        </div>

        {/* 2. Payment Partners Strip */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-300">
            <span className="font-semibold text-[#D9A441] mr-1">
              {t('Accepted Payment Methods in Bangladesh:', 'পেমেন্ট মাধ্যম সমূহ:')}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 font-bold text-white border border-white/10">
              Cash on Delivery (COD)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#BE0750] font-bold text-white">
              bKash (বিকাশ)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#F7931E] font-bold text-white">
              Nagad (নগদ)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-[#8C3494] font-bold text-white">
              Rocket (রকেট)
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-stone-300">
              Shurjopay
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/10 text-stone-300">
              Visa / Mastercard
            </span>
          </div>

          <div className="text-[11px] text-stone-400 text-center md:text-right">
            Fast Courier Partners: <strong>Steadfast Courier</strong>, <strong>Pathao</strong>, <strong>eCourier</strong>
          </div>
        </div>

        {/* 3. Demo Disclaimer & Copyright */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-stone-400">
          <div>
            © {new Date().getFullYear()} PREYOSHI SHOP (প্রেয়সী শপ). All rights reserved. Designed by{' '}
            <strong className="text-stone-300">Nurtaz Agency</strong>.
          </div>
          <div className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-amber-300/80 font-mono">
            Notice: Sample items are marked as DEMO DATA for initial store review.
          </div>
        </div>
      </div>
    </footer>
  );
};
