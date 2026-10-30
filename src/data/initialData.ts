import { Category, Product, BannerSlide, Coupon, StoreSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-saree',
    nameEn: 'Saree',
    nameBn: 'শাড়ি',
    slug: 'saree',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    productCount: 18,
    order: 1
  },
  {
    id: 'cat-womens-fashion',
    nameEn: "Women's Fashion",
    nameBn: 'মহিলাদের ফ্যাশন',
    slug: 'womens-fashion',
    icon: 'Shirt',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    productCount: 24,
    order: 2
  },
  {
    id: 'cat-jewellery',
    nameEn: 'Jewellery',
    nameBn: 'জুয়েলারি ও গহনা',
    slug: 'jewellery',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    productCount: 15,
    order: 3
  },
  {
    id: 'cat-cosmetics',
    nameEn: 'Cosmetics & Beauty',
    nameBn: 'কসমেটিকস ও রূপচর্চা',
    slug: 'cosmetics-beauty',
    icon: 'Flower2',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
    productCount: 20,
    order: 4
  },
  {
    id: 'cat-bags',
    nameEn: 'Bags & Accessories',
    nameBn: 'ব্যাগ ও এক্সেসরিজ',
    slug: 'bags-accessories',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    productCount: 12,
    order: 5
  },
  {
    id: 'cat-mens-fashion',
    nameEn: "Men's Fashion",
    nameBn: 'পুরুষদের ফ্যাশন',
    slug: 'mens-fashion',
    icon: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
    productCount: 14,
    order: 6
  },
  {
    id: 'cat-electronics',
    nameEn: 'Electronics',
    nameBn: 'ইলেকট্রনিক্স',
    slug: 'electronics',
    icon: 'Laptop',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    productCount: 8,
    order: 7
  },
  {
    id: 'cat-home-living',
    nameEn: 'Home & Living',
    nameBn: 'হোম ও লিভিং',
    slug: 'home-living',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    productCount: 11,
    order: 8
  },
  {
    id: 'cat-kids-baby',
    nameEn: 'Kids & Baby',
    nameBn: 'বাচ্চাদের পণ্য',
    slug: 'kids-baby',
    icon: 'Smile',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80',
    productCount: 9,
    order: 9
  },
  {
    id: 'cat-gifts',
    nameEn: 'Gifts',
    nameBn: 'উপহার সামগ্রী',
    slug: 'gifts',
    icon: 'Gift',
    image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80',
    productCount: 16,
    order: 10
  },
  {
    id: 'cat-grocery',
    nameEn: 'Grocery & Daily Needs',
    nameBn: 'মুদি ও নিত্যপ্রয়োজনীয়',
    slug: 'grocery-daily-needs',
    icon: 'Apple',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    productCount: 10,
    order: 11
  },
  {
    id: 'cat-other',
    nameEn: 'Other Products',
    nameBn: 'অন্যান্য পণ্য',
    slug: 'other-products',
    icon: 'Package',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    productCount: 6,
    order: 12
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    sku: 'JAM-SILK-01',
    nameEn: 'Royal Crimson Dhakai Jamdani Silk Saree',
    nameBn: 'রয়েল ক্রিমসন ঢাকাই জামদানি সিল্ক শাড়ি',
    descriptionEn: 'Exquisite hand-woven Dhakai Jamdani saree with intricate gold and deep pink zari buta work. Woven by master artisans of Sonargaon with premium mulberry silk.',
    descriptionBn: 'সোনারগাঁয়ের দক্ষ তাঁতিদের হাতে বোনা খাঁটি ঢাকাই জামদানি সিল্ক শাড়ি। সূক্ষ্ম জরি ও মিনাকারি কাজের অপূর্ব অলঙ্করণ, যা যেকোনো উৎসব বা বিয়েতে আপনাকে এনে দেবে অনন্য আভিজাত্য।',
    categoryId: 'cat-saree',
    categoryNameEn: 'Saree',
    categoryNameBn: 'শাড়ি',
    regularPrice: 7500,
    discountPrice: 5850,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['12 Haath (Free Size)'],
    colors: [
      { name: 'Burgundy Crimson', hex: '#7A1238' },
      { name: 'Royal Gold', hex: '#D9A441' },
      { name: 'Blush Rose', hex: '#E78895' }
    ],
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscountPercent: 22,
    status: 'active',
    rating: 4.9,
    reviewCount: 38,
    isDemo: true,
    tags: ['jamdani', 'saree', 'silk', 'traditional']
  },
  {
    id: 'prod-002',
    sku: 'KAT-BEN-02',
    nameEn: 'Pure Katan Silk Bridal Banarasi Saree',
    nameBn: 'বিশুদ্ধ কাতান সিল্ক ব্রাইডাল বেনারসি শাড়ি',
    descriptionEn: 'Traditional bridal masterpiece with heavy golden zari pallu and body jaal work. Ideal for brides, receptions and Eid festivities.',
    descriptionBn: 'বউভাত, বিয়ে ও বিশেষ উৎসবের জন্য নিখুঁত গর্জিয়াস বেনারসি কাতান শাড়ি। ঘন সোনালী জরি বুনন এবং রাজকীয় লাল-মেরুন শেড।',
    categoryId: 'cat-saree',
    categoryNameEn: 'Saree',
    categoryNameBn: 'শাড়ি',
    regularPrice: 12500,
    discountPrice: 9900,
    stock: 5,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['12 Haath With Blouse Piece'],
    colors: [
      { name: 'Bridal Maroon', hex: '#630324' },
      { name: 'Deep Pink', hex: '#BE0750' }
    ],
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    rating: 5.0,
    reviewCount: 24,
    isDemo: true,
    tags: ['katan', 'bridal', 'saree']
  },
  {
    id: 'prod-003',
    sku: 'JWL-KUN-03',
    nameEn: 'Handcrafted Kundan Meenakari Choker & Jhumka Set',
    nameBn: 'হস্তশিল্প কুন্দন মীনাকারি চোকার ও ঝুমকা সেট',
    descriptionEn: '22K micro gold plated choker necklace with royal emerald and ruby cut crystals, matching pearl drop jhumka and maang tikka.',
    descriptionBn: '২২ ক্যারেট মাইক্রো গোল্ড প্লেটেড কুন্দন ও মুক্তার চোকার সেট। সাথে ম্যাচিং ঝুমকা ও টিকলি। আভিজাত্যপূর্ণ লুক এনে দেবে যেকোনো পোশাকে।',
    categoryId: 'cat-jewellery',
    categoryNameEn: 'Jewellery',
    categoryNameBn: 'জুয়েলারি ও গহনা',
    regularPrice: 3800,
    discountPrice: 2850,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Adjustable Dori'],
    colors: [
      { name: 'Antique Gold & Ruby', hex: '#D9A441' },
      { name: 'Emerald Green', hex: '#005A36' }
    ],
    isFeatured: true,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscountPercent: 25,
    status: 'active',
    rating: 4.8,
    reviewCount: 42,
    isDemo: true,
    tags: ['jewellery', 'kundan', 'necklace']
  },
  {
    id: 'prod-004',
    sku: 'BAG-LEA-04',
    nameEn: 'Luxury Quilted Leather Tote & Crossbody Bag',
    nameBn: 'লাক্সারি কুইল্টেড লেদার টোট ও ক্রসবাডি ব্যাগ',
    descriptionEn: 'Premium vegan leather shoulder tote with gold-tone hardware, secure zippered compartments, and detachable shoulder strap.',
    descriptionBn: 'উচ্চমানের নরম প্রিমিয়াম চামড়ার টোট ব্যাগ। সাথে গোল্ডেন চেইন এবং দীর্ঘস্থায়ী মেটাল জিপার। ক্যাজুয়াল ও পার্টি উভয় ব্যবহারের জন্য আদর্শ।',
    categoryId: 'cat-bags',
    categoryNameEn: 'Bags & Accessories',
    categoryNameBn: 'ব্যাগ ও এক্সেসরিজ',
    regularPrice: 3200,
    discountPrice: 2450,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Standard Medium'],
    colors: [
      { name: 'Burgundy Wine', hex: '#7A1238' },
      { name: 'Classic Black', hex: '#1C1C1C' },
      { name: 'Nude Blush', hex: '#D7B49E' }
    ],
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    rating: 4.7,
    reviewCount: 19,
    isDemo: true,
    tags: ['bag', 'handbag', 'leather']
  },
  {
    id: 'prod-005',
    sku: 'COS-LIP-05',
    nameEn: 'Velvet Matte Liquid Lipstick Trio Gift Box',
    nameBn: 'ভেলভেট ম্যাট লিকুইড লিপস্টিক ট্রায়ো গিফট বক্স',
    descriptionEn: 'Long-lasting 16-hour waterproof matte liquid lipsticks infused with Vitamin E and Jojoba oil. Smudge-proof and lightweight on Asian skin tones.',
    descriptionBn: '১৬ ঘণ্টা দীর্ঘস্থায়ী ওয়াটারপ্রুফ ভেলভেট ম্যাট লিপস্টিক সেট। ভিটামিন ই ও জোজোবা অয়েল সমৃদ্ধ, যা ঠোঁটকে রাখে নরম ও প্রাণবন্ত।',
    categoryId: 'cat-cosmetics',
    categoryNameEn: 'Cosmetics & Beauty',
    categoryNameBn: 'কসমেটিকস ও রূপচর্চা',
    regularPrice: 1850,
    discountPrice: 1390,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Set of 3 (3 x 4.5ml)'],
    colors: [
      { name: 'Crimson Rose', hex: '#BE0750' },
      { name: 'Berry Plum', hex: '#7A1238' },
      { name: 'Warm Terracotta', hex: '#C15C3D' }
    ],
    isFeatured: false,
    isBestSeller: true,
    isFlashSale: true,
    flashSaleDiscountPercent: 25,
    status: 'active',
    rating: 4.9,
    reviewCount: 56,
    isDemo: true,
    tags: ['cosmetics', 'lipstick', 'beauty']
  },
  {
    id: 'prod-006',
    sku: 'WFA-ANA-06',
    nameEn: 'Designer Embroidered Georgette Anarkali Suit',
    nameBn: 'ডিজাইনার এমব্রয়ডার্ড জর্জেট আনারকলি স্যুট',
    descriptionEn: 'Floor-length georgette Anarkali dress featuring heavy resham embroidery, zardozi neckline, crepe inner lining, with churidar and chiffon dupatta.',
    descriptionBn: 'ফ্লোর লেন্থ পিওর জর্জেট আনারকলি স্যুট। সুতো ও জরি দিয়ে নিখুঁত কারুকাজ করা। সাথে পাচ্ছেন আরামদায়ক ইনার ও গর্জিয়াস শিফন ওড়না।',
    categoryId: 'cat-womens-fashion',
    categoryNameEn: "Women's Fashion",
    categoryNameBn: 'মহিলাদের ফ্যাশন',
    regularPrice: 5600,
    discountPrice: 4400,
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['M (38)', 'L (40)', 'XL (42)', 'XXL (44)'],
    colors: [
      { name: 'Wine Burgundy', hex: '#7A1238' },
      { name: 'Teal Blue', hex: '#0E6251' },
      { name: 'Mustard Gold', hex: '#D9A441' }
    ],
    isFeatured: true,
    isNewArrival: true,
    status: 'active',
    rating: 4.8,
    reviewCount: 17,
    isDemo: true,
    tags: ['anarkali', 'dress', 'salwar']
  },
  {
    id: 'prod-007',
    sku: 'MEN-PAN-07',
    nameEn: 'Premium Jacquard Cotton Embroidered Panjabi',
    nameBn: 'প্রিমিয়াম জ্যাকার্ড কটন এমব্রয়ডার্ড পাঞ্জাবি',
    descriptionEn: 'Luxury jacquard woven 100% fine cotton Panjabi with hand-embroidered mandarin collar and metallic buttons. Ideal for Friday prayers and celebratory occasions.',
    descriptionBn: 'উচ্চমানের জ্যাকার্ড সুতি কাপড়ে তৈরি আভিজাত্যপূর্ণ পাঞ্জাবি। কলার ও প্লেকেটে নিখুঁত সুতোর সূচিশিল্প। অত্যন্ত আরামদায়ক ও ট্রেন্ডি।',
    categoryId: 'cat-mens-fashion',
    categoryNameEn: "Men's Fashion",
    categoryNameBn: 'পুরুষদের ফ্যাশন',
    regularPrice: 2950,
    discountPrice: 2250,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Ivory White', hex: '#F9F6F0' },
      { name: 'Deep Maroon', hex: '#6D0B2B' },
      { name: 'Midnight Navy', hex: '#1B263B' }
    ],
    isFeatured: false,
    isBestSeller: true,
    status: 'active',
    rating: 4.7,
    reviewCount: 31,
    isDemo: true,
    tags: ['panjabi', 'menswear', 'eid']
  },
  {
    id: 'prod-008',
    sku: 'GFT-BOX-08',
    nameEn: 'Luxury Scented Soy Candle & Aroma Diffuser Gift Set',
    nameBn: 'লাক্সারি সুগন্ধি সয় ক্যান্ডেল ও অ্যারোমা ডিফিউজার গিফট সেট',
    descriptionEn: 'Hand-poured natural soy wax candle scented with French vanilla and Kashmiri saffron, accompanied by glass reed diffuser and brass snuffer.',
    descriptionBn: 'ফরাসি ভ্যানিলা ও কাশ্মিরি জাফরানের স্নিগ্ধ সুবাসে তৈরি প্রাকৃতিক সয় ক্যান্ডেল ও ডিফিউজার সেট। ভালোবাসার মানুষকে উপহার দেওয়ার শ্রেষ্ঠ সামগ্রী।',
    categoryId: 'cat-gifts',
    categoryNameEn: 'Gifts',
    categoryNameBn: 'উপহার সামগ্রী',
    regularPrice: 2200,
    discountPrice: 1650,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80'
    ],
    sizes: ['Deluxe Gift Box'],
    colors: [
      { name: 'Gold & Amber', hex: '#D9A441' }
    ],
    isFeatured: true,
    isNewArrival: false,
    status: 'active',
    rating: 4.9,
    reviewCount: 14,
    isDemo: true,
    tags: ['gifts', 'candle', 'fragrance']
  }
];

export const INITIAL_BANNERS: BannerSlide[] = [
  {
    id: 'banner-01',
    titleEn: 'Exquisite Festive & Wedding Collection',
    titleBn: 'উৎসব ও বিয়ের জমকালো কালেকশন',
    subtitleEn: 'Discover hand-woven Dhakai Jamdani, Katan Banarasi & Royal Jewellery crafted for your most memorable moments.',
    subtitleBn: 'বাঙালিয়ানার ঐতিহ্য আর আধুনিক আভিজাত্যের অপূর্ব মেলবন্ধন। প্রিমিয়াম শাড়ি ও জুয়েলারিতে পান বিশেষ মূল্যছাড়।',
    badgeEn: 'PREMIUM BANGLADESH COLLECTION',
    badgeBn: 'বিশেষ আকর্ষণ',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85',
    linkCategoryId: 'cat-saree',
    buttonTextEn: 'Shop Saree Collection',
    buttonTextBn: 'শাড়ি কালেকশন দেখুন',
    isActive: true,
    order: 1
  },
  {
    id: 'banner-02',
    titleEn: 'Kundan & Royal Meenakari Jewellery',
    titleBn: 'রাজকীয় কুন্দন ও মীনাকারি জুয়েলারি',
    subtitleEn: 'Adorn yourself with timeless handcrafted chokers, earrings, and bridal sets at unmatched luxury craftsmanship.',
    subtitleBn: 'প্রতিটি গহনায় রয়েছে আভিজাত্য আর কারুশিল্পের অপূর্ব ছোঁয়া। ব্রাইডাল ও পার্টি কালেকশন এখন সহজলভ্য।',
    badgeEn: 'LIMITED EDITION DESIGNS',
    badgeBn: 'সীমিত সংস্করণ',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=85',
    linkCategoryId: 'cat-jewellery',
    buttonTextEn: 'Explore Jewellery',
    buttonTextBn: 'জুয়েলারি দেখুন',
    isActive: true,
    order: 2
  },
  {
    id: 'banner-03',
    titleEn: 'Preyoshi Designer Handbags & Clutches',
    titleBn: 'লাক্সারি হ্যান্ডব্যাগ ও পার্টি ক্লাচ',
    subtitleEn: 'Elevate your everyday poise with handcrafted genuine and vegan leather silhouettes tailored for elegance.',
    subtitleBn: 'আপনার স্টাইলকে পূর্ণতা দিতে নিয়ে এলাম চমৎকার ডিজাইনার লেদার ব্যাগ কালেকশন।',
    badgeEn: 'NEW ARRIVALS 2026',
    badgeBn: 'নতুন আগমন',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=85',
    linkCategoryId: 'cat-bags',
    buttonTextEn: 'Discover Bags',
    buttonTextBn: 'ব্যাগ দেখুন',
    isActive: true,
    order: 3
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'PREYOSHI10',
    description: '10% discount on all orders above ৳1,500',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 1500,
    maxDiscount: 500,
    isActive: true
  },
  {
    code: 'EIDSPECIAL',
    description: 'Flat ৳250 off on orders above ৳2,000',
    discountType: 'fixed',
    discountValue: 250,
    minOrderAmount: 2000,
    isActive: true
  },
  {
    code: 'WELCOME50',
    description: 'Flat ৳50 off for your welcome order',
    discountType: 'fixed',
    discountValue: 50,
    minOrderAmount: 500,
    isActive: true
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  id: 'store-settings',
  shopNameEn: 'PREYOSHI SHOP',
  shopNameBn: 'প্রেয়সী শপ',
  taglineEn: 'Your Style ♥ Our Priority',
  taglineBn: 'আপনার স্টাইল ♥ আমাদের অগ্রাধিকার',
  phone: '+880 1711-234567',
  whatsapp: '+880 1711-234567',
  email: 'preyoshishop.bd@gmail.com',
  addressEn: 'House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
  addressBn: 'বাড়ি ৪২, রোড ১১, ব্লক ডি, বনানী, ঢাকা-১২১৩, বাংলাদেশ',
  facebookUrl: 'https://www.facebook.com/Preyoshishop/',
  insideDhakaDelivery: 70,
  outsideDhakaDelivery: 130,
  ownDeliveryCharge: 60,
  courierDeliveryCharge: 120,
  freeDeliveryThreshold: 2000,
  codEnabled: true,
  bkashEnabled: true,
  bkashMerchantNumber: '01711234567',
  nagadEnabled: true,
  nagadMerchantNumber: '01711234567',
  rocketEnabled: true,
  rocketMerchantNumber: '01711234567',
  shurjopayEnabled: false
};
