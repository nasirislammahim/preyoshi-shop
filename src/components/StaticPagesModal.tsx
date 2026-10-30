import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Phone, Mail, MapPin, MessageCircle, Facebook, HelpCircle, Shield, FileText, RotateCcw } from 'lucide-react';

export const StaticPagesModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    activeStaticPage,
    setActiveStaticPage,
    t,
    language
  } = useShop();

  if (activeModal !== 'staticPage' || !activeStaticPage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={() => {
          setActiveModal(null);
          setActiveStaticPage(null);
        }}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-[#F8E8E9]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-[#FFF9F2]">
          <h2 className="text-base font-bold text-[#7A1238] font-serif-luxury">
            {activeStaticPage === 'about' && t('About Preyoshi Shop', 'প্রেয়সী শপ সম্পর্কে')}
            {activeStaticPage === 'contact' && t('Contact Us & Support', 'যোগাযোগ ও কাস্টমার কেয়ার')}
            {activeStaticPage === 'faq' && t('Frequently Asked Questions (FAQ)', 'সাধারণ জিজ্ঞাসা (FAQ)')}
            {activeStaticPage === 'return' && t('Return & Refund Policy', 'রিটার্ন ও রিফান্ড নীতিমালা')}
            {activeStaticPage === 'privacy' && t('Privacy Policy', 'গোপনীয়তা নীতিমালা')}
            {activeStaticPage === 'terms' && t('Terms & Conditions', 'শর্তাবলী ও নিয়মাবলী')}
          </h2>
          <button
            onClick={() => {
              setActiveModal(null);
              setActiveStaticPage(null);
            }}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-4">
          {/* ABOUT US */}
          {activeStaticPage === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-[#F8E8E9]">
                <h3 className="font-bold text-[#7A1238] text-base mb-1">
                  PREYOSHI SHOP (প্রেয়সী শপ)
                </h3>
                <p className="text-xs text-[#D9A441] font-semibold italic">
                  Your Style ♥ Our Priority
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Brand Identity & Creative Direction by{' '}
                  <strong className="text-stone-800">Nurtaz Agency</strong>
                </p>
              </div>

              <p>
                {t(
                  'Welcome to PREYOSHI SHOP, a premium e-commerce sanctuary rooted in Bangladesh. We believe that timeless elegance, handwoven traditions, and contemporary high-fashion should be effortlessly accessible to every discerning shopper.',
                  'প্রেয়সী শপে আপনাকে স্বাগতম। আমরা বিশ্বাস করি, ঐতিহ্যের আভিজাত্য আর আধুনিক ফ্যাশনের মেলবন্ধন প্রতিটি মানুষের জীবনের বিশেষ মুহূর্তগুলোকে আরও সুন্দর করে তোলে।'
                )}
              </p>

              <p>
                {t(
                  'From the legendary hand-loomed Jamdani sarees of Sonargaon and opulent bridal Banarasi Katan silks to artisanal Kundan jewellery, designer leather accessories, and luxury cosmetics, our curated catalog embodies unmatched luxury craftsmanship.',
                  'সোনারগাঁয়ের নিখুঁত ঢাকাই জামদানি, ব্রাইডাল কাতান বেনারসি শাড়ি, রাজকীয় কুন্দন গহনা থেকে শুরু করে আধুনিক ডিজাইনার ব্যাগ ও প্রসাধন সামগ্রী—আমাদের প্রতিটি পণ্য অত্যন্ত যত্ন ও বিশুদ্ধতার সাথে বাছাই করা।'
                )}
              </p>
            </div>
          )}

          {/* CONTACT US */}
          {activeStaticPage === 'contact' && (
            <div className="space-y-4">
              <p>
                {t(
                  'Have a question about our collection, shipping, or custom bridal orders? Our friendly Dhaka support team is here to help you 24/7.',
                  'পণ্য, ডেলিভারি বা যেকোনো তথ্যের জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।'
                )}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <a
                  href="tel:+8801711234567"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#FFF9F2]/50 hover:bg-[#FFF9F2] transition"
                >
                  <div className="p-2.5 rounded-xl bg-[#7A1238] text-white">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">Customer Helpline</span>
                    <strong className="text-xs text-stone-800">+880 1711-234567</strong>
                  </div>
                </a>

                <a
                  href="https://wa.me/8801711234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#FFF9F2]/50 hover:bg-[#FFF9F2] transition"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">WhatsApp Care</span>
                    <strong className="text-xs text-stone-800">+880 1711-234567</strong>
                  </div>
                </a>

                <a
                  href="https://www.facebook.com/Preyoshishop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl border border-stone-200 bg-[#FFF9F2]/50 hover:bg-[#FFF9F2] transition sm:col-span-2"
                >
                  <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-[11px] text-stone-400">Official Facebook Page</span>
                    <strong className="text-xs text-blue-700">facebook.com/Preyoshishop</strong>
                  </div>
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <MapPin className="w-4 h-4 text-[#7A1238]" />
                  <span>Flagship Office & Showroom</span>
                </div>
                <p className="text-xs text-stone-600">
                  House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh
                </p>
              </div>
            </div>
          )}

          {/* FAQ */}
          {activeStaticPage === 'faq' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">
                  {t('1. How long does delivery take?', '১. ডেলিভারি পেতে কতদিন সময় লাগে?')}
                </h4>
                <p className="text-stone-600 text-xs">
                  {t(
                    'Inside Dhaka city: 24 to 48 hours. Outside Dhaka across all 64 districts: 2 to 4 business days via Steadfast or Pathao courier.',
                    'ঢাকার ভিতরে ২৪ থেকে ৪৮ ঘণ্টা এবং ঢাকার বাইরে ২ থেকে ৪ কার্যদিবসের মধ্যে কুরিয়ারের মাধ্যমে পৌঁছে দেওয়া হয়।'
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">
                  {t('2. Is Cash on Delivery available?', '২. ক্যাশ অন ডেলিভারি কি উপলব্ধ?')}
                </h4>
                <p className="text-stone-600 text-xs">
                  {t(
                    'Yes, Cash on Delivery is available across all 64 districts in Bangladesh. You inspect your package before paying the courier rider.',
                    'হ্যাঁ, বাংলাদেশের ৬৪টি জেলাতেই ক্যাশ অন ডেলিভারি সুবিধা আছে। পার্সেল হাতে পেয়ে দেখে মূল্য পরিশোধ করতে পারবেন।'
                  )}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-900 mb-1">
                  {t('3. What are the delivery charges?', '৩. ডেলিভারি চার্জ কত?')}
                </h4>
                <p className="text-stone-600 text-xs">
                  {t(
                    'Inside Dhaka delivery is ৳70. Outside Dhaka delivery is ৳130. Orders above ৳2,000 enjoy 100% FREE delivery!',
                    'ঢাকার ভিতরে ৳৭০, ঢাকার বাইরে ৳১৩০। তবে ৳২,০০০ টাকার বেশি অর্ডারে সম্পূর্ণ ফ্রি ডেলিভারি!'
                  )}
                </p>
              </div>
            </div>
          )}

          {/* RETURN POLICY */}
          {activeStaticPage === 'return' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-2">
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>7-Day Return & Exchange Guarantee on All Products</span>
              </div>
              <p>
                {t(
                  'If you receive an item with manufacturing defects, incorrect size, or damage during courier transit, contact us within 7 days of delivery for an instant replacement or refund.',
                  'পণ্য হাতে পাওয়ার পর যদি কোনো ত্রুটি, ভুল সাইজ বা ক্ষতি দেখতে পান, তবে ৭ দিনের মধ্যে আমাদের জানালে দ্রুত এক্সচেঞ্জ বা রিফান্ড প্রদান করা হবে।'
                )}
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                <li>Products must remain unworn, unwashed, with tags intact.</li>
                <li>Cosmetics and personal care items must be in unopened seal.</li>
                <li>Refunds are credited to bKash, Nagad or bank within 3 working days.</li>
              </ul>
            </div>
          )}

          {/* PRIVACY POLICY */}
          {activeStaticPage === 'privacy' && (
            <div className="space-y-3 text-xs">
              <p>
                At PREYOSHI SHOP, we take your privacy and personal data seriously. All customer phone numbers, delivery addresses, and purchase histories are stored strictly with zero-trust database encryption and role-based security isolation.
              </p>
              <p>
                We never sell, distribute, or share customer data with third parties except licensed logistics partners for physical parcel delivery.
              </p>
            </div>
          )}

          {/* TERMS */}
          {activeStaticPage === 'terms' && (
            <div className="space-y-3 text-xs">
              <p>
                By placing an order on PREYOSHI SHOP, customers agree to provide authentic contact and address information. Order submissions are legally binding commercial purchases.
              </p>
              <p>
                Preyoshi Shop reserves the right to verify high-value orders via customer telephone call before courier dispatch.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
