import React, { useState, useEffect, lazy, Suspense, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';
import './App.css';
import { englishContent, urduContent } from './translations';


// Lazy-loaded components
const TestimonialSlider = lazy(() => import('./components/TestimonialSlider'));
const BeforeAfterSlider = lazy(() => import('./components/BeforeAfterSlider'));
const VideoSection = lazy(() => import('./components/VideoSection'));
const HerbalPowerSection = lazy(() => import('./components/HerbalPowerSection'));
const FAQSection = lazy(() => import('./components/FAQSection'));

const { FiPhone, FiShoppingCart, FiCheck, FiStar, FiShield, FiTruck, FiClock, FiHeart, FiZap, FiAward, FiGlobe, FiChevronUp } = FiIcons;

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-pulse flex space-x-4">
      <div className="rounded-full bg-red-200 h-12 w-12"></div>
      <div className="flex-1 space-y-4 py-1">
        <div className="h-4 bg-red-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-red-200 rounded"></div>
          <div className="h-4 bg-red-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    quantity: '1'
  });
  const [language, setLanguage] = useState('en'); // 'en' for English, 'ur' for Urdu
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  // Get current product from URL
  const { slug: rawSlug } = useParams();
  
  // Normalize slug - map alternative URLs to canonical slugs
  const slugAliases = {
    'slim-n-shape-herbal-tea': 'slim-n-shape-tea'
  };
  const slug = slugAliases[rawSlug] || rawSlug;

  // Product configurations
  const productConfigs = {
    'sultan-shahi-gold-majoon': {
      title: 'Sultan Shahi Gold Majoon',
      subtitle: 'Traditional Herbal Strength & Vitality Tonic for Men',
      badge: 'BEST SELLER',
      heroImage: 'https://i.ibb.co/Zw5CjYC/Sultan-Shahi-Gold-Majoon-Hero-Section.png',
      solution: 'Sultan Shahi Gold Majoon is the royal solution you\'ve been looking for!',
      benefitsTitle: 'Benefits of Sultan Shahi Gold Majoon',
      // Benefits section description
      benefitsDescription: 'A complete Unani herbal vitality tonic trusted for decades, crafted to restore masculine strength, stamina, and confidence naturally.',
      // Updated benefits list with images
      benefitsList: [
        {
          text: 'Eliminates chronic weakness',
          image: 'https://i.ibb.co/1jx5X7X/Eliminates-chronic-weakness.png'
        },
        {
          text: 'Boosts stamina, timing, and reproductive health',
          image: 'https://i.ibb.co/hFyKVZz9/Boosts-stamina-timing-and-reproductive-health.png'
        },
        {
          text: 'Strengthens nerves, muscles, and internal systems',
          image: 'https://i.ibb.co/7tWyx7vg/Strengthens-nerves-muscles-and-internal-systems.png'
        },
        {
          text: 'Speeds up recovery from illness or physical exhaustion',
          image: 'https://i.ibb.co/Lh92pV43/Speeds-up-recovery-from-illness-or-physical-exhaustion.png'
        },
        {
          text: 'Supports male hormone balance & vitality',
          image: 'https://i.ibb.co/gMRDws7h/Supports-male-hormone-balance-vitality.png'
        },
        {
          text: 'Enhances confidence & performance',
          image: 'https://i.ibb.co/1fScTTLs/Enhances-confidence-performance.png'
        },
        {
          text: 'Safe for long-term use — married men & newlyweds',
          image: 'https://i.ibb.co/6Rj8YXnm/Safe-for-long-term-use-married-men-newlyweds.png'
        },
        {
          text: 'Improves energy, mood & mental clarity',
          image: 'https://i.ibb.co/hJt68ky3/Improves-energy-mood-mental-clarity.png'
        },
        {
          text: 'Natural ingredients with Unani validation, no steroids or chemicals',
          image: 'https://i.ibb.co/m53TsVnf/Natural-ingredients-with-Unani-validation-no-steroids-or-chemicals.png'
        }
      ],
      // Hero section features
      features: [
        'Eliminate Weakness from the Root',
        'Boost Stamina & Timing Naturally',
        'Restore Hormonal Balance & Energy',
        'Trusted Herbal Formula Since 2002'
      ],
      // Special pricing for hero section
      specialPriceAmount: '5,000',
      // Common Problems section
      problemsTitle: '🧠 Common Problems Men Face Today',
      problemsSubtitle: 'Millions of men silently struggle with these issues — but you don’t have to.',
      problemsList: [
        'Premature Ejaculation (P.E)',
        'Erectile Dysfunction (E.D)',
        'Low Libido or Drive',
        'Low Testosterone Levels',
        'Weakness, Fatigue & Stress',
        'Poor Confidence & Marital Issues'
      ],
      // Urdu overrides for Problems section (only apply when language === 'ur')
      i18n: {
        ur: {
          problemsTitle: '🧠 آج کل مردوں کے عام مسائل',
          problemsSubtitle: 'لاکھوں مرد ان مسائل سے خاموشی سے گزرتے ہیں — لیکن آپ کو ایسا کرنے کی ضرورت نہیں۔',
          problemsList: [
            'قبل از وقت انزال (P.E)',
            'ایریکٹائل ڈس فنکشن / نامردی (E.D)',
            'کم جنسی خواہش (لو لیبیڈو)',
            'کم ٹیسٹوسٹیرون کی سطح',
            'کمزوری، تھکاوٹ اور تناؤ',
            'اعتماد کی کمی اور ازدواجی مسائل'
          ],
          // Solution line shown below the problems grid
          solution: '✨ سلطان شاہی گولڈ معجون وہ شاہانہ حل ہے جس کی آپ تلاش کر رہے تھے!'
          ,
          // Benefits (UR) — only for this product
          benefitsTitle: 'سلطان شاہی گولڈ معجون کے فوائد',
          benefitsList: [
            {
              text: 'لمبی عرصے کی کمزوری کا خاتمہ',
              image: 'https://i.ibb.co/1jx5X7X/Eliminates-chronic-weakness.png'
            },
            {
              text: 'اسٹیمنا، ٹائمنگ اور تولیدی صحت میں اضافہ',
              image: 'https://i.ibb.co/hFyKVZz9/Boosts-stamina-timing-and-reproductive-health.png'
            },
            {
              text: 'اعصاب، پٹھوں اور اندرونی نظام کو مضبوط بنائے',
              image: 'https://i.ibb.co/7tWyx7vg/Strengthens-nerves-muscles-and-internal-systems.png'
            },
            {
              text: 'بیماری یا جسمانی کمزوری کے بعد جلد بحالی',
              image: 'https://i.ibb.co/Lh92pV43/Speeds-up-recovery-from-illness-or-physical-exhaustion.png'
            },
            {
              text: 'مردانہ ہارمونز کے توازن اور طاقت میں مدد',
              image: 'https://i.ibb.co/gMRDws7h/Supports-male-hormone-balance-vitality.png'
            },
            {
              text: 'اعتماد اور کارکردگی میں واضح بہتری',
              image: 'https://i.ibb.co/1fScTTLs/Enhances-confidence-performance.png'
            },
            {
              text: 'طویل مدت کے لیے محفوظ — شادی شدہ اور نئے شادی شدہ حضرات کے لیے مفید',
              image: 'https://i.ibb.co/6Rj8YXnm/Safe-for-long-term-use-married-men-newlyweds.png'
            },
            {
              text: 'توانائی، موڈ اور ذہنی یکسوئی میں اضافہ',
              image: 'https://i.ibb.co/hJt68ky3/Improves-energy-mood-mental-clarity.png'
            },
            {
              text: 'قدرتی اجزاء — یونانی تحقیق کے ساتھ، بغیر اسٹرائیڈز اور کیمیکلز کے',
              image: 'https://i.ibb.co/m53TsVnf/Natural-ingredients-with-Unani-validation-no-steroids-or-chemicals.png'
            }
          ],
          // Dosage & Usage (UR) — only for this product
          dosageSection: {
            title: '💊 خوراک اور استعمال کی ہدایات',
            image: 'https://i.ibb.co/xqrd7C54/Dosage-Usage-Instructions.png',
            content: {
              dosage: {
                title: 'خوراک',
                text: 'نیم گرم دودھ کے ساتھ روزانہ رات کو 1/2 سے 1 چائے کا چمچ لیں۔'
              },
              duration: {
                title: 'کورس کی مدت',
                text: 'مکمل اور دیرپا نتائج کے لیے 1–3 ماہ تک مسلسل استعمال کریں۔'
              },
              bestResults: {
                title: 'بہترین نتائج',
                points: [
                  'کورس کے دوران ٹھنڈے مشروبات، تمباکو نوشی اور تلی ہوئی/چکنی اشیاء سے پرہیز کریں۔',
                  'ہلکی غذا اختیار کریں اور تیز بحالی کے لیے صحت مند طرزِ زندگی اپنائیں۔'
                ]
              }
            }
          },
          // FAQ (UR) — only for this product
          faqTitle: '❓ اکثر پوچھے گئے سوالات (FAQs) – سلطان شاہی گولڈ معجون',
          faqSubtitle: 'سلطان شاہی گولڈ معجون – ہربل مردانہ قوت اور توانائی کے ٹانک کے بارے میں عام سوالات کے مستند جوابات',
          faqs: [
            {
              question: 'سلطان شاہی گولڈ معجون کس لیے استعمال ہوتا ہے؟',
              answer: 'یہ خاص طور پر اُن مردوں کے لیے بنایا گیا ہے جو جنسی کمزوری، کم اسٹیمنا، قبل از وقت تھکن، ہارمونل بے ترتیبی اور قبل از وقت بڑھاپے کی علامات کا شکار ہوں۔'
            },
            {
              question: 'کیا اس کا استعمال محفوظ ہے؟',
              answer: 'جی ہاں، یہ 100% قدرتی یونانی ہربل فارمولا ہے۔ اس میں کوئی اسٹرائیڈز یا نقصان دہ کیمیکلز شامل نہیں، لمبے عرصے کے لیے محفوظ ہے۔'
            },
            {
              question: 'نتائج آنے میں کتنا وقت لگتا ہے؟',
              answer: 'زیادہ تر صارفین 2–3 ہفتوں میں بہتری محسوس کرتے ہیں، تاہم مکمل نتائج کے لیے 1–3 ماہ کورس تجویز کیا جاتا ہے۔'
            },
            {
              question: 'سفارش کردہ خوراک کیا ہے؟',
              answer: 'روزانہ رات کو نیم گرم دودھ کے ساتھ 1/2 سے 1 چائے کا چمچ لیں۔'
            },
            {
              question: 'کیا کوئی سائیڈ ایفیکٹس ہیں؟',
              answer: 'نہیں۔ چونکہ یہ مکمل طور پر ہربل اور کلینکلی ٹیسٹڈ ہے اس لیے تجویز کردہ طریقے سے لینے پر کوئی سائیڈ ایفیکٹ نہیں۔'
            },
            {
              question: 'کیا نئے شادی شدہ افراد اسے استعمال کر سکتے ہیں؟',
              answer: 'یقیناً! اسٹیمنا، ٹائمنگ اور اعتماد بڑھانے کے لیے یہ خاص طور پر مفید ہے۔'
            },
            {
              question: 'کیا شوگر یا بلڈ پریشر کے مریض اسے استعمال کر سکتے ہیں؟',
              answer: 'یہ قدرتی ہربل فارمولا ہے، تاہم دائمی مریض اپنے ڈاکٹر یا ہربل ایکسپرٹ سے مشورہ کر کے استعمال کریں۔'
            },
            {
              question: 'کیا نتائج دیرپا ہوتے ہیں؟',
              answer: 'یہ جسم کے قدرتی نظام کو مضبوط کرتا ہے۔ صحت مند طرزِ زندگی کے ساتھ نتائج طویل عرصے تک قائم رہ سکتے ہیں۔'
            },
            {
              question: 'قیمت اور پیکنگ کیا ہے؟',
              answer: 'سلطان شاہی گولڈ معجون 300 گرام کی ایئر ٹائٹ جار میں دستیاب ہے۔ قیمت 5,000 روپے ہے۔'
            },
            {
              question: 'میں آرڈر کیسے کر سکتا/سکتی ہوں؟',
              answer: 'آپ واٹس ایپ یا فون کال (0332-8888935) پر آرڈر دے سکتے ہیں۔ پورے پاکستان میں فری ڈیلیوری اور کیش آن ڈیلیوری موجود ہے۔'
            }
          ]
        }
      },
      // Problems section image for center layout
      problemsImage: 'https://i.ibb.co/bM37d7tt/Common-Problems-Men-Face-Today.png',
      // Video section
      videoId: 'esXcBkknfnc',
      videoTitle: 'See Sultan Shahi Gold Majoon in Action',
      videoSubtitle: 'Watch how Sultan Shahi Gold Majoon has transformed the lives of men across Pakistan',
      // Custom cover image for video poster (only for this product)
      videoCover: 'https://i.ibb.co/F4WwQ9Jb/See-Sultan-Shahi-Gold-Majoon-in-Action.png',
      // Feature image (not hero) to display in a dedicated section
      featureImage: 'https://i.ibb.co/qTywxNG/Sultan-Shahi-Gold-Majoon.png',
      // Before & After section
      beforeAfterTitle: '🏆 Real Results, Real Men',
      beforeAfterSubtitle: 'See the difference Sultan Shahi Gold Majoon has made in the lives of men across Pakistan',
      beforeAfterLabels: {
        beforeTitle: 'Before',
        afterTitle: 'After',
        beforeDesc: '',
        afterDesc: '',
        weeksPrefix: '',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          duration: 4,
          before: 'https://i.ibb.co/MDQ1fk1S/Before-4-Weeks-of-Use.jpg',
          after: 'https://i.ibb.co/9k1d7w2k/After-4-Weeks-of-Use.png',
          summary: '',
          beforeDetails: 'Low energy, poor confidence, marital issues',
          afterDetails: 'Renewed vigor, strong performance, happy relationship'
        },
        {
          id: 2,
          duration: 8,
          before: 'https://i.ibb.co/mVycHTBS/Before-8-Weeks-of-Use.jpg',
          after: 'https://i.ibb.co/CKV28Vr7/After-8-Weeks-of-Use.png',
          summary: '',
          beforeDetails: 'Low energy, poor confidence, marital issues',
          afterDetails: 'Renewed vigor, strong performance, happy relationship'
        }
      ],
      // Testimonials section
      testimonials: [
        {
          id: 1,
          name: 'Ahmed K.',
          age: 35,
          location: 'Karachi',
          rating: 5,
          text: 'Sultan Shahi Gold Majoon ne meri zindagi badal di. 3 weeks mein energy aur stamina mein kaafi improvement aya. Highly recommended!'
        },
        {
          id: 2,
          name: 'Muhammad S.',
          age: 42,
          location: 'Lahore',
          rating: 5,
          text: 'Bohot effective product hai. Natural ingredients aur koi side effects nahi. Confidence level bhi badha hai significantly.'
        },
        {
          id: 3,
          name: 'Ali R.',
          age: 28,
          location: 'Islamabad',
          rating: 4,
          text: 'Pehle skeptical tha lekin results dekh kar convinced ho gaya. Energy levels maintain rehte hain throughout the day.'
        }
      ],
      // FAQs section
      faqTitle: '❓ Frequently Asked Questions (FAQs) – Sultan Shahi Gold Majoon',
      faqSubtitle: 'Get answers to the most common questions about Sultan Shahi Gold Majoon – Herbal Male Strength & Vitality Tonic',
      faqs: [
        {
          question: 'What is Sultan Shahi Gold Majoon used for?',
          answer: 'It is specially designed for men suffering from sexual weakness, low stamina, premature exhaustion, hormonal imbalance, and early aging symptoms.'
        },
        {
          question: 'Is it safe to use?',
          answer: 'Yes, it is a 100% natural Unani herbal formula. It does not contain steroids or harmful chemicals and is safe for long-term use.'
        },
        {
          question: 'How long does it take to see results?',
          answer: 'Most users notice improvements within 2–3 weeks, but for complete results a 1–3 month course is recommended.'
        },
        {
          question: 'What is the recommended dosage?',
          answer: 'Take ½ to 1 teaspoon daily at night with lukewarm milk.'
        },
        {
          question: 'Are there any side effects?',
          answer: 'No, since it\'s completely herbal and clinically tested, there are no side effects when taken as recommended.'
        },
        {
          question: 'Can newly married men use it?',
          answer: 'Absolutely, it\'s especially beneficial for boosting stamina, timing, and confidence.'
        },
        {
          question: 'Can people with diabetes or blood pressure use it?',
          answer: 'It\'s a natural herbal formula, but those with chronic health conditions should consult a doctor or herbal expert before use.'
        },
        {
          question: 'Are the results permanent?',
          answer: 'It strengthens the body\'s natural systems. With a healthy lifestyle, results can last for the long term.'
        },
        {
          question: 'What is the price and packaging?',
          answer: 'Sultan Shahi Gold Majoon comes in a 300g airtight jar. The price is Rs. 5,000/-.'
        },
        {
          question: 'How can I order it?',
          answer: 'You can place an order via WhatsApp or phone call (0332-8888935). Free delivery and Cash on Delivery are available across Pakistan.'
        }
      ],
      // Dosage & Usage Instructions section
      dosageSection: {
        title: '💊 Dosage & Usage Instructions',
        image: 'https://i.ibb.co/xqrd7C54/Dosage-Usage-Instructions.png',
        content: {
          dosage: {
            title: 'Dosage',
            text: 'Take ½ to 1 teaspoon daily at night with lukewarm milk.'
          },
          duration: {
            title: 'Course Duration',
            text: 'Use continuously for 1–3 months for full and long-lasting results.'
          },
          bestResults: {
            title: 'Best Results',
            points: [
              'Avoid cold drinks, smoking, and oily/fried foods during the course.',
              'Follow a light diet and maintain a healthy lifestyle for faster recovery.'
            ]
          }
        }
      },
      // Pricing section
      pricing: {
        title: 'Affordable Packages',
        subtitle: 'Choose the pack that works best for you:',
        packages: [
          {
            title: '1 Pack – Rs. 5,000',
            headerTitle: '1 Pack',
            price: 5000,
            features: [
              'Sultan Shahi Gold Majoon',
              'Cash on Delivery',
              'Free Delivery',
              'Free Consultation'
            ]
          },
          {
            title: '2 Packs – Rs. 9,000',
            headerTitle: '2 Packs',
            price: 9000,
            saveAmount: 1000,
            features: [
              '2x Sultan Shahi Gold Majoon',
              'Cash on Delivery',
              'Free Delivery',
              '24/7 Support'
            ]
          },
          {
            title: '3 Packs – Rs. 13,000 (Best Value)',
            headerTitle: '3 Packs',
            price: 13000,
            saveAmount: 2000,
            features: [
              '3x Sultan Shahi Gold Majoon',
              'Cash on Delivery',
              'Free Delivery',
              'Free Consultation'
            ]
          }
        ]
      },
      // Herbal Power Section with big image
      herbalSection: {
        title: 'Herbal Power. Backed by Science',
        subtitle: 'Royal blend of premium ingredients for ultimate strength and vitality',
        showIngredients: false,
        bigImage: 'https://i.ibb.co/zVpRS04t/Sultan-Shahi-Gold-Majoon-Ingredients.png'
      }
    },
    'b-maxman-royal-special-treatment': {
      title: 'B-Maxman Royal Special Treatment',
      subtitle: 'Premium herbal formula for enhanced performance and vitality',
      badge: 'BEST SELLER',
      solution: 'B-Maxman Royal Special Treatment is the ultimate solution you\'ve been looking for!',
      benefitsTitle: language === 'en' ? 'Benefits of B-Maxman Royal Special Treatment' : 'بی میکس مین رائل سپیشل ٹریٹمنٹ کے فوائد',
      // Herbal Power Section with 2-column layout
      herbalSection: {
        title: '🌿 Herbal Power. Backed by Science.',
        subtitle: 'A potent blend of 30+ world-renowned herbal ingredients, trusted for centuries',
        showIngredients: true,
        twoColumnLayout: true
      },
      i18n: {
        ur: {
          // Problems section line override (Urdu only for this product)
          solution: 'بی میکس مین رائل اسپیشل ٹریٹمنٹ وہ بہترین حل ہے جس کی آپ تلاش کر رہے تھے!',
          // Herbal Power Section (Urdu)
          herbalSection: {
            title: '🌿 جڑی بوٹیوں کی طاقت۔ سائنس سے ثابت شدہ۔',
            subtitle: '۳۰+ عالمی شہرت یافتہ جڑی بوٹیوں کا طاقتور امتزاج، صدیوں سے قابل اعتماد'
          }
        }
      }
    },
    'b-maxtime-super-active': {
      title: 'B-Maxtime Super Active',
      subtitle: 'Instant Power, Lasting Confidence',
      badge: 'BEST SELLER',
      solution: 'B-Maxtime Super Active is the natural solution you\'ve been looking for!',
      benefitsTitle: language === 'en' ? 'Benefits of B-Maxtime Super Active' : 'بی میکس ٹائم سپر ایکٹو کے فوائد',
      // Page hero image (only for this product)
      heroImage: 'https://i.ibb.co/HLKYt3XP/Slim-n-Shape-Herbal-Tea.png',
      // Video section cover (only for this product)
      videoCover: 'https://i.ibb.co/wFpDYw3b/B-Maxtime-Super-Active-Video.png',
      // Hero overrides (page specific)
      specialPriceAmount: '1,200 (10 Capsules)',
      features: [
        'Boost quick stamina & vitality',
        'Restore lost passion & libido',
        '100% Herbal & Safe Formula',
        'Instant results with lasting control',
        'Trusted by thousands of men'
      ],
      // Video Section headings (EN)
      videoTitle: 'See B-Maxtime Super Active in Action',
      videoSubtitle: 'Watch how B-Maxtime Super Active has transformed the lives of men across Pakistan',
      // Before & After (Real Results) - overrides
      beforeAfterTitle: 'Real Results, Real People',
      beforeAfterSubtitle: 'See the difference B-Maxtime Super Active has made in the lives of men across Pakistan.',
      beforeAfterLabels: {
        beforeTitle: 'Before B-Maxtime Super Active',
        afterTitle: 'After B-Maxtime Super Active',
        beforeDesc: 'Low stamina, poor confidence, weak performance',
        afterDesc: 'Increased energy, boosted confidence, visible performance',
        weeksPrefix: '',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          duration: 4,
          // Using default images from component when URLs are not provided
          before: 'https://i.ibb.co/1t6zhmrX/4-weeks-of-use-Before-B-Maxtime-Super-Active.png',
          after: 'https://i.ibb.co/fVYdKZm5/4-weeks-of-use-After-B-Maxtime-Super-Active.png',
          summary: 'Before: Low stamina, poor confidence, weak performance | After: Increased energy, boosted confidence, visible performance'
        },
        {
          id: 2,
          duration: 8,
          before: 'https://i.ibb.co/sJjY6ZbM/8-weeks-of-use-Before-B-Maxtime-Super-Active.png',
          after: 'https://i.ibb.co/3y3DdwwN/8-weeks-of-use-After-B-Maxtime-Super-Active.png',
          summary: 'Before: Fatigue, lack of focus, relationship stress | After: Full vitality, strong stamina, happy lifestyle'
        }
      ],
      // Herbal Power / Ingredients (3-column custom)
      herbalSection: {
        title: 'Ingredients / Backed by Science',
        subtitle: undefined,
        showIngredients: false,
        customColumns: [
          {
            title: 'Catuba Bark',
            description: 'Brazilian aphrodisiac – boosts libido, reduces fatigue, improves mood & memory.'
          },
          {
            title: 'Damiana',
            description: 'Mayan herb – enhances blood flow, supports erection, relieves depression & nervousness.'
          },
          {
            title: 'Yohimbe Bark',
            description: 'African powerhouse – sustains erection, boosts stamina, enhances circulation & libido.'
          }
        ]
      },
      // Common Problems (EN)
      problemsTitle: 'Common Problems in Men',
      problemsSubtitle: undefined,
      problemsList: [
        'Weak erection & low stamina',
        'Premature ejaculation',
        'Erectile dysfunction (E.D)',
        'Low desire & poor performance',
        'Lack of confidence',
        'Fatigue & reduced vigor'
      ],
      // Benefits (EN) + Image for 2-column layout
      benefitsImage: '/images/B-Maxtime Super Active.png',
      benefitsList: [
        'Quick stamina & long-lasting performance',
        'Strong erections with full control',
        'Blissful, electrifying experience',
        'Improved blood circulation',
        '100% Herbal & No Side Effects',
        'Safe for Diabetic & BP Patients'
      ],
      // Dosage & Usage (EN)
      usage: {
        title: 'Dosage & Usage Instructions',
        dosage: { text: 'Take 1 capsule with warm milk 2 hours before activity.' },
        course: undefined,
        best: undefined
      },
      // Product-specific testimonials (EN; slider uses English text)
      testimonials: [
        {
          id: 1,
          name: 'Ahsan R.',
          age: 34,
          location: 'Lahore',
          rating: 5,
          text: '3 weeks me noticeable farq. Energy zyada, control behtareen. B-Maxtime Super Active ne meri confidence wapas dila di.'
        },
        {
          id: 2,
          name: 'Imran K.',
          age: 41,
          location: 'Karachi',
          rating: 5,
          text: 'Initially skeptical tha, lekin 4th week tak stamina aur mood dono improved. No side effects — highly recommend.'
        },
        {
          id: 3,
          name: 'Usman S.',
          age: 29,
          location: 'Islamabad',
          rating: 4,
          text: 'Quick boost milta hai aur lasting control bhi. Partner bhi khush — overall great experience.'
        }
      ],
      // Pricing (EN) - Affordable Packages for this product only
      pricing: {
        title: 'Affordable Packages',
        subtitle: 'Choose the pack that works best for you:',
        packages: [
          {
            title: '1 Pack (10 Capsules) – Rs. 1200',
            headerTitle: '1 Pack',
            price: 1200,
            features: [
              '10 Capsules',
              'Cash on Delivery',
              'Free Consultation'
            ]
          },
          {
            title: '2 Packs – Rs. 2000',
            headerTitle: '2 Packs',
            price: 2000,
            features: [
              '20 Capsules',
              'Cash on Delivery',
              'Free Consultation'
            ]
          },
          {
            title: '3 Packs – Rs. 3000',
            headerTitle: '3 Packs',
            price: 3000,
            features: [
              '30 Capsules',
              'Cash on Delivery',
              'Free Consultation'
            ]
          }
        ]
      },
      // FAQ (EN) — only for this product
      faqTitle: 'FAQs – B-Maxtime Super Active',
      faqSubtitle: undefined,
      faqs: [
        { question: 'What is B-Maxtime Super Active used for?', answer: 'These capsules naturally boost stamina, energy, and overall performance.' },
        { question: 'Any side effects?', answer: 'It is a 100% herbal and safe formula with no harmful side effects.' },
        { question: 'How to take it?', answer: 'Take 1–2 capsules daily with water, as per doctor’s advice or on-pack instructions.' },
        { question: 'How soon will I see results?', answer: 'With regular use, noticeable results usually appear within 3–4 weeks.' },
        { question: 'Is it suitable for all age groups?', answer: 'It is safe for adults 18 years and above.' },
        { question: 'Can I use it with other medicines?', answer: 'If you are under medical treatment, please consult your doctor before use.' },
        { question: 'Are the results permanent?', answer: 'Regular use helps naturally improve lifestyle and stamina; consistency is important to maintain results.' },
        { question: 'Is B-Maxtime Super Active available in Pakistan?', answer: 'Yes, it is available nationwide with delivery across Pakistan.' },
        { question: 'How long does one bottle last?', answer: 'One bottle contains capsules that typically last around 30 days on average.' },
        { question: 'How can I place an order?', answer: 'Click the “Order Now” button on the website or call our helpline to place your order.' }
      ],
      // Urdu translations (UR) — only for this product
      i18n: {
        ur: {
          herbalSection: {
            title: 'اجزاء / سائنسی طور پر ثابت شدہ',
            subtitle: undefined,
            customColumns: [
              {
                title: 'کاٹوبا بارک',
                description: 'برازیلی جڑی بوٹی — خواہش بڑھائے، تھکاوٹ کم کرے، موڈ اور یادداشت بہتر کرے۔'
              },
              {
                title: 'ڈیمِیانا',
                description: 'مایان جڑی بوٹی — خون کی روانی بہتر، اریکشن میں مدد، ڈپریشن اور گھبراہٹ میں کمی۔'
              },
              {
                title: 'یوہِمبے بارک',
                description: 'افریقی طاقت — مضبوط اریکشن برقرار، اسٹیمنا میں اضافہ، دورانِ خون اور خواہش بہتر۔'
              }
            ]
          },
          // Benefits (UR)
          benefitsList: [
            'فوراً اسٹیمنا اور طویل کارکردگی',
            'مضبوط اریکشن مکمل کنٹرول کے ساتھ',
            'خوشگوار اور بجلی جیسا طاقتور تجربہ',
            'خون کی روانی میں بہتری',
            '۱۰۰٪ ہربل اور بغیر کسی سائیڈ ایفیکٹس کے',
            'شوگر اور بلڈ پریشر کے مریضوں کے لیے محفوظ'
          ],
          // Pricing (UR) for this product only
          pricing: {
            title: 'سستی پیکجز',
            subtitle: 'اپنے لیے بہترین پیکج منتخب کریں:',
            packages: [
              { title: '1 پیک (10 کیپسول) – 1200 روپے', headerTitle: '1 پیک', price: 1200 },
              { title: '2 پیکس – 2000 روپے', headerTitle: '2 پیکس', price: 2000 },
              { title: '3 پیکس – 3000 روپے', headerTitle: '3 پیکس', price: 3000 }
            ]
          },
          // FAQ (UR) — only for this product
          faqTitle: 'FAQs – بی میکس ٹائم سوپر ایکٹو',
          faqSubtitle: 'بی میکس ٹائم سوپر ایکٹو کے بارے میں عام سوالات کے مستند جوابات',
          faqs: [
            { question: 'بی میکس ٹائم سوپر ایکٹو کس چیز کے لیے استعمال ہوتا ہے؟', answer: 'یہ کیپسولز اسٹیمنا، توانائی اور مجموعی کارکردگی کو قدرتی طور پر بہتر بناتے ہیں۔' },
            { question: 'کیا اس پروڈکٹ کے کوئی ضمنی اثرات ہیں؟', answer: 'یہ 100% ہربل اور محفوظ فارمولا ہے، کوئی نقصان دہ سائیڈ ایفیکٹس نہیں۔' },
            { question: 'اسے کیسے لینا چاہیے؟', answer: 'روزانہ 1–2 کیپسول پانی کے ساتھ، ڈاکٹر یا ہدایات کے مطابق استعمال کریں۔' },
            { question: 'کتنے عرصے میں نتائج نظر آتے ہیں؟', answer: 'باقاعدہ استعمال کے 3–4 ہفتوں میں نمایاں نتائج سامنے آنا شروع ہو جاتے ہیں۔' },
            { question: 'کیا یہ ہر عمر کے لیے موزوں ہے؟', answer: 'یہ 18 سال سے اوپر کے بالغ افراد کے لیے محفوظ ہے۔' },
            { question: 'اگر میں دوا استعمال کر رہا ہوں تو کیا اسے لے سکتا ہوں؟', answer: 'اگر آپ کسی طبی علاج پر ہیں تو استعمال سے پہلے اپنے ڈاکٹر سے مشورہ کریں۔' },
            { question: 'کیا یہ پروڈکٹ مستقل نتائج دیتی ہے؟', answer: 'باقاعدہ استعمال طرزِ زندگی اور اسٹیمنا کو قدرتی طور پر بہتر بناتا ہے؛ نتائج برقرار رکھنے کے لیے تسلسل ضروری ہے۔' },
            { question: 'کیا بی میکس ٹائم سوپر ایکٹو پاکستان میں دستیاب ہے؟', answer: 'جی ہاں، یہ پاکستان بھر میں ڈیلیوری کے ساتھ دستیاب ہے۔' },
            { question: 'ایک پیک کتنے دن چلتا ہے؟', answer: 'ایک پیک میں 10 کیپسول ہوتے ہیں جو استعمال کے مطابق عموماً 10 دن کے لیے کافی ہوتے ہیں۔' },
            { question: 'آرڈر کیسے کرنا ہے؟', answer: 'ویب سائٹ پر “Order Now” بٹن دبائیں یا ہیلپ لائن پر کال کر کے آرڈر کریں۔' }
          ],
          // Dosage & Usage (UR)
          usage: {
            title: 'خوراک اور استعمال کی ہدایات',
            dosage: { text: 'عمل سے 2 گھنٹے پہلے نیم گرم دودھ کے ساتھ 1 کیپسول لیں۔' },
            course: undefined,
            best: undefined
          },
          problemsTitle: 'مردوں کے عام مسائل',
          problemsSubtitle: undefined,
          problemsList: [
            'کمزور ایریکشن اور کم اسٹیمنا',
            'قبل از وقت انزال',
            'نامردی (E.D)',
            'خواہش میں کمی اور ناقص کارکردگی',
            'خود اعتمادی کی کمی',
            'تھکن اور کمزور طاقت'
          ],
          solution: 'بی میکس ٹائم سپر ایکٹو وہ قدرتی حل ہے جس کی آپ تلاش کر رہے تھے!'
        }
      }
    },
    'slim-n-shape-garcinia': {
      title: 'Slim N Shape Garcinia',
      subtitle: 'Natural weight loss solution with Garcinia Cambogia extract',
      badge: 'WEIGHT LOSS',
      solution: 'Slim N Shape Garcinia helps you achieve your weight loss goals naturally!',
      benefitsTitle: language === 'en' ? 'Benefits of Slim N Shape Garcinia' : 'سلیم این شیپ گارسنیا کے فوائد'
    },
    'slim-n-shape-garcinia-cambogia-capsules': {
      title: 'Slim n Shape Fit Booster',
      subtitle: 'Best Herbal Weight Loss Capsules in Pakistan | Natural Belly Fat Burner | Metabolism Booster for Men & Women',
      badge: 'WEIGHT LOSS',
      solution: '🔑 Slim n Shape Fit Booster is the natural solution you\'ve been looking for!',
      benefitsTitle: 'Benefits of Slim n Shape Fit Booster',
      features: [
        'Burn Belly Fat Naturally',
        'Control Appetite & Cravings',
        'Boost Energy & Metabolism'
      ],
      // Product-specific Benefits list (images are placeholders; will be updated later)
      benefitsList: [
        {
          text: '🔥 Accelerates fat burn & metabolism naturally',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Natural belly fat burner and metabolism booster - Slim n Shape Fit Booster',
          title: 'Accelerates Natural Fat Burn & Metabolism - Slim n Shape Fit Booster',
          seoDescription: 'Herbal Fit Booster capsules that naturally accelerate fat burning and boost metabolism for safe weight loss'
        },
        {
          text: '🍽 Reduces hunger & controls cravings effectively',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Appetite suppressant and craving control with Fit Booster',
          title: 'Reduces Hunger & Controls Cravings - Slim n Shape Fit Booster',
          seoDescription: 'Natural appetite control that helps reduce hunger and manage food cravings effectively'
        },
        {
          text: '💖 Supports healthy cholesterol & blood pressure',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Supports healthy cholesterol and blood pressure levels',
          title: 'Supports Healthy Cholesterol & Blood Pressure',
          seoDescription: 'Fit Booster may support healthy lipid profile and blood pressure as part of a balanced lifestyle'
        },
        {
          text: '🧠 Improves focus & balances emotional eating',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Improves focus and helps balance emotional eating habits',
          title: 'Improves Focus & Balances Emotional Eating',
          seoDescription: 'Natural support to improve focus and reduce stress-related emotional eating'
        },
        {
          text: '🦴 Boosts bone & nerve strength',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Boosts bone and nerve strength support',
          title: 'Boosts Bone & Nerve Strength',
          seoDescription: 'Supports overall wellness that contributes to bone and nerve strength'
        },
        {
          text: '🌿 100% natural weight loss with no side effects',
          image: '/images/Slim n Shape Garcinia.png',
          alt: '100% natural herbal weight loss with no known side effects',
          title: '100% Natural Weight Loss - No Side Effects',
          seoDescription: 'Herbal, chemical-free formula designed for safe and natural weight loss'
        },
        {
          text: '✅ Helps men & women burn belly fat safely',
          image: '/images/Slim n Shape Garcinia.png',
          alt: 'Safe belly fat burner for men and women',
          title: 'Safe Belly Fat Burner for Men & Women',
          seoDescription: 'Suitable for both men and women to burn belly fat safely with natural ingredients'
        }
      ],
      benefitsImage: 'https://i.ibb.co/KpmMN1kL/Benefits-of-Slim-n-Shape-Garcinia-Cambogia.png',
      // Product-specific hero image
      heroImage: 'https://i.ibb.co/GfYCr9z9/Slim-n-Shape-Garcinia-Cambogia-Capsules.png',
      specialPriceAmount: '2,500',
      problemsTitle: 'Common Problems People Face Today',
      problemsSubtitle: 'Millions of men & women in Pakistan silently struggle with these issues — but you don’t have to:',
      problemsList: [
        'Stubborn Belly Fat',
        'Slow Metabolism',
        'Overeating & Cravings',
        'Stress-Related Eating',
        'High Appetite Levels',
        'Low Energy & Weak Digestion'
      ],
      // Video section overrides
      videoId: 'GG04kBQ_1NA',
      videoTitle: 'See Slim n Shape in Action',
      videoSubtitle: 'Watch how Slim n Shape Fit Booster has helped people across Pakistan lose weight naturally and safely.',
      videoCover: 'https://i.ibb.co/YFS4t88Y/Slim-n-Shape-Garcinia-Cambogia-Video.png',
      videoIframeTitle: 'Slim n Shape Fit Booster Video'
      ,
      // Before & After overrides (Real Results)
      beforeAfterTitle: 'Real Results, Real People',
      beforeAfterSubtitle: undefined,
      beforeAfterLabels: {
        beforeTitle: 'Before',
        afterTitle: 'After',
        beforeDesc: '',
        afterDesc: '',
        weeks: 'weeks of use',
        weeksPrefix: '📅 After ',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          duration: 4,
          before: 'https://i.ibb.co/ZpTfzQCK/4-weeks-of-use-Before-Slim-n-Shape-Garcinia-Cambogia-Capsules.png',
          after: 'https://i.ibb.co/7DRv6vx/4-weeks-of-use-After-Slim-n-Shape-Garcinia-Cambogia-Capsules.png',
          summary: 'Reduced belly fat, controlled cravings, higher energy.'
        },
        {
          id: 2,
          duration: 8,
          before: 'https://i.ibb.co/cc2J72BT/8-weeks-of-use-Before-Slim-n-Shape-Garcinia-Cambogia-Capsules.png',
          after: 'https://i.ibb.co/bM5RDKqr/8-weeks-of-use-After-Slim-n-Shape-Garcinia-Cambogia-Capsules.png',
          summary: 'Noticeable weight loss, boosted confidence, healthier lifestyle.'
        }
      ]
      ,
      // Herbal power section overrides (Why Garcinia Works)
      herbalSection: {
        title: 'Why Fit Booster Works (Backed by Science)',
        subtitle: 'Slim n Shape Fit Booster is powered by natural herbal extracts, one of the most effective natural fat burners in the world. Its active compounds:',
        bullets: [
          'Blocks fat production',
          'Suppresses appetite naturally',
          'Enhances metabolism & energy',
          'Improves digestion & bowel movement',
          'Reduces stress-related eating'
        ],
        badgesLine: '🌿 100% Herbal | ✅ Scientifically Proven | 🔒 Safe & Effective',
        showIngredients: false
      }
      ,
      // Product-specific Testimonials (English-only in slider)
      testimonials: [
        {
          id: 101,
          name: 'Sara A.',
          age: 29,
          location: 'Lahore',
          rating: 5,
          text: '"I lost stubborn belly fat and felt active all day – no crash diets, no weakness!"'
        },
        {
          id: 102,
          name: 'Ali R.',
          age: 34,
          location: 'Karachi',
          rating: 5,
          text: '"My cravings reduced in just 2 weeks and I feel lighter & more energetic!"'
        },
        {
          id: 103,
          name: 'Hira K.',
          age: 31,
          location: 'Islamabad',
          rating: 5,
          text: '"Finally found a herbal solution that works without side effects."'
        }
      ]
      ,
      // Usage overrides (Dosage & Usage Instructions)
      usage: {
        title: 'Dosage & Usage Instructions',
        dosage: {
          text: '1 capsule in the morning (empty stomach). 2 capsules at night (with Slim n Shape Herbal Tea for best results)'
        },
        course: {
          text: '3 month course recommended for full results'
        },
        best: {
          text: 'Follow a light diet & moderate activity. Avoid oily & junk food'
        }
      }
      ,
      // Pricing overrides (Affordable Packages)
      pricing: {
        subtitle: 'Choose the pack that works best for you:',
        packages: [
          {
            title: '1 Month Pack – Rs. 2,500',
            headerTitle: '1 Month Pack',
            price: 2500,
            features: [
              '90 Herbal Capsules',
              'Free Delivery',
              'Cash on Delivery',
              'Free Herbal Consultation'
            ]
          },
          {
            title: '2 Month Pack – Rs. 4,500 (Save Rs. 500)',
            headerTitle: '2 Month Pack',
            price: 4500,
            saveAmount: 500,
            features: [
              '180 Herbal Capsules',
              'Free Delivery',
              'Cash on Delivery',
              '24/7 Support'
            ]
          },
          {
            title: '3 Month Pack – Rs. 6,500 (Best Value – Save Rs. 1,000)',
            headerTitle: '3 Month Pack',
            price: 6500,
            saveAmount: 1000,
            features: [
              '270 Herbal Capsules',
              'Free Delivery',
              'Cash on Delivery',
              'Free Herbal Consultation'
            ]
          }
        ]
      }
      ,
      // Product-specific FAQs (used by FAQSection overrides)
      faqTitle: 'Slim n Shape Fit Booster – FAQs',
      faqSubtitle: 'Get answers to the most common questions about Slim n Shape Fit Booster',
      faqs: [
        {
          question: 'Is Slim n Shape safe for men & women?',
          answer: '✅ Yes, it’s 100% herbal, safe & side-effect free. Both men and women can use it safely.'
        },
        {
          question: 'How fast can I see results?',
          answer: '📅 Visible results usually start in 3–4 weeks with regular use. Best results with a 3-month course.'
        },
        {
          question: 'Do I need to diet strictly?',
          answer: '❌ No strict crash diets are required — just follow a light balanced diet & moderate activity.'
        },
        {
          question: 'Does it help with belly fat specifically?',
          answer: '🔥 Yes, Slim n Shape is specially formulated to target stubborn belly fat and overall body fat.'
        },
        {
          question: 'Are there any side effects?',
          answer: '🌿 No. It’s made from 100% natural herbal ingredients and is clinically tested for safety.'
        },
        {
          question: 'Can people with diabetes, BP, or cholesterol issues use this?',
          answer: '👍 Yes, Fit Booster may help support healthy cholesterol & blood pressure levels, but always consult your doctor if you have medical conditions.'
        },
        {
          question: 'What age group can use Slim n Shape?',
          answer: '👨‍🦰👩‍🦱 It is recommended for adults 18 years and above. Not suitable for children.'
        },
        {
          question: 'How should I take it for best results?',
          answer: '💊 1 capsule in the morning (empty stomach) + 2 capsules at night (with Slim n Shape Herbal Tea for better results).'
        },
        {
          question: 'Can I use it with other herbal teas or medicines?',
          answer: '🌿 Yes, but if you are on strong medication or under treatment, consult your healthcare provider first.'
        },
        {
          question: 'Will I gain weight again after stopping?',
          answer: '⚡ No, as long as you maintain a balanced diet and active lifestyle, the results are long-lasting.'
        }
      ]
      ,
      // Urdu translations for this slug only
      i18n: {
        ur: {
          problemsTitle: 'لوگوں کو درپیش عام مسائل',
          problemsSubtitle: 'پاکستان میں مرد و خواتین خاموشی سے ان مسائل کا سامنا کرتے ہیں — مگر آپ کو ایسا کرنے کی ضرورت نہیں:',
          problemsList: [
            'ضدی پیٹ کی چربی',
            'سست میٹابولزم',
            'زیادہ کھانا اور خواہشات',
            'ذہنی دباؤ کی وجہ سے کھانا',
            'بھوک میں غیر معمولی اضافہ',
            'کم توانائی اور کمزور ہاضمہ'
          ],
          // Pricing (UR) - Slim n Shape Tea
          pricing: {
            title: 'سستی پیکجز',
            subtitle: 'اپنی صحت کے سفر کے لیے بہترین پیکج منتخب کریں:',
            popular: 'بہترین انتخاب',
            save: 'بچت',
            packages: [
              {
                title: '١ پیک',
                price: 999,
                features: [
                  '✔ 100 گرام ہربل ٹی',
                  '✔ فری ڈیلیوری',
                  '✔ کیش آن ڈیلیوری'
                ]
              },
              {
                title: '٢ پیک',
                price: 1999,
                features: [
                  '✔ 200 روپے کی بچت',
                  '✔ فری ڈیلیوری',
                  '✔ 24/7 سپورٹ'
                ]
              },
              {
                title: '٣ پیک — (بہترین انتخاب)',
                price: 2699,
                features: [
                  '✔ 300 روپے کی بچت',
                  '✔ فری ڈیلیوری',
                  '✔ کیش آن ڈیلیوری'
                ]
              }
            ]
          },
          herbalSection: {
            title: 'گارسنیا کمبوژیا کیوں مؤثر ہے (سائنس کی روشنی میں)',
            subtitle: 'سلیم ن شیپ گارسنیا کمبوژیا پر مبنی ہے، جو دنیا کی مؤثر قدرتی چربی گھلانے والی جڑی بوٹیوں میں سے ایک ہے۔ اس کا فعال مرکب ہائیڈروکسی سٹرک ایسڈ (HCA):',
            bullets: [
              'چربی بننے کے عمل کو روکتا ہے',
              'بھوک کو قدرتی طور پر کم کرتا ہے',
              'میٹابولزم اور توانائی میں اضافہ کرتا ہے',
              'ہاضمہ اور آنتوں کی حرکت بہتر بناتا ہے',
              'ذہنی دباؤ کی وجہ سے کھانے کی خواہش کم کرتا ہے'
            ]
          },
          benefitsTitle: 'سلیم ن شیپ گارسنیا کمبوژیا کے فوائد',
          benefitsList: [
            '🔥 قدرتی طور پر چربی گھلانے اور میٹابولزم تیز کرتا ہے',
            '🍽 بھوک کم کرے اور خواہشات پر مؤثر طریقے سے قابو پائے',
            '💖 صحت مند کولیسٹرول اور بلڈ پریشر کو سہارا دے',
            '🧠 توجہ بہتر بنائے اور جذباتی کھانے کو متوازن کرے',
            '🦴 ہڈیوں اور اعصاب کی مضبوطی میں مدد دے',
            '🌿 سو فیصد قدرتی وزن میں کمی، بغیر سائیڈ ایفیکٹس',
            '✅ مرد و خواتین کے لیے پیٹ کی چربی محفوظ طریقے سے کم کرے'
          ],
          usage: {
            title: 'خوراک اور استعمال کی ہدایات',
            dosage: { text: 'صبح خالی پیٹ 1 کیپسول، رات کو 2 کیپسول (بہتر نتائج کے لیے Slim n Shape Herbal Tea کے ساتھ)' },
            course: { text: 'مکمل نتائج کے لیے 3 ماہ کا کورس تجویز کیا جاتا ہے' },
            best: { text: 'ہلکی متوازن غذا اور معتدل سرگرمی رکھیں۔ تیل اور جنک فوڈ سے پرہیز کریں' }
          },
          faqTitle: 'اکثر پوچھے جانے والے سوالات',
          faqSubtitle: 'سلیم ن شیپ گارسنیا کمبوژیا کے بارے میں عام سوالات اور ان کے جوابات',
          faqs: [
            { question: 'کیا Slim n Shape مرد و خواتین دونوں کے لیے محفوظ ہے؟', answer: '✅ جی ہاں، یہ 100% ہربل ہے اور سائیڈ ایفیکٹس سے پاک ہے۔ مرد و خواتین دونوں باآسانی استعمال کر سکتے ہیں۔' },
            { question: 'نتائج کتنی جلدی ظاہر ہوتے ہیں؟', answer: '📅 باقاعدگی سے استعمال پر عموماً 3–4 ہفتوں میں نتائج نظر آنا شروع ہو جاتے ہیں۔ بہترین نتائج کے لیے 3 ماہ کا کورس کریں۔' },
            { question: 'کیا سخت ڈائیٹ ضروری ہے؟', answer: '❌ نہیں، کریش ڈائیٹ کی ضرورت نہیں۔ صرف ہلکی متوازن غذا اور معتدل سرگرمی کافی ہے۔' },
            { question: 'کیا یہ خاص طور پر پیٹ کی چربی پر اثر کرتا ہے؟', answer: '🔥 جی ہاں، Slim n Shape ضدی پیٹ کی چربی سمیت جسم کی مجموعی چربی کو ہدف بناتا ہے۔' },
            { question: 'کیا اس کے کوئی سائیڈ ایفیکٹس ہیں؟', answer: '🌿 نہیں۔ یہ قدرتی جڑی بوٹیوں پر مبنی ہے اور محفوظ استعمال کے لیے موزوں ہے۔' },
            { question: 'شوگر/بلڈ پریشر/کولیسٹرول والے لوگ استعمال کر سکتے ہیں؟', answer: '👍 عام طور پر موزوں ہے، مگر اگر آپ کو میڈیکل کنڈیشن ہے تو اپنے ڈاکٹر سے مشورہ ضرور کریں۔' },
            { question: 'کیا نئے شادی شدہ حضرات اسے استعمال کر سکتے ہیں؟', answer: '👨‍🦰👩‍🦱 جی ہاں، یہ 18 سال اور اس سے زائد عمر کے بالغ حضرات کے لیے تجویز کیا جاتا ہے۔' },
            { question: 'کیا اسے دوسری ہربل چائے یا دواؤں کے ساتھ لے سکتے ہیں؟', answer: '🌿 جی ہاں، عام طور پر ممکن ہے۔ لیکن اگر آپ طاقتور ادویات استعمال کرتے ہیں تو پہلے اپنے ڈاکٹر سے مشورہ کریں۔' },
            { question: 'استعمال بند کرنے کے بعد دوبارہ وزن بڑھے گا؟', answer: '⚡ نہیں، اگر آپ متوازن غذا اور ایکٹیو لائف اسٹائل برقرار رکھیں تو نتائج دیرپا رہتے ہیں۔' }
          ]
        }
      }
    },
    'sultan-shahi-gold-tila': {
      title: 'Sultan Shahi Gold Tila',
      subtitle: 'Herbal Massage Oil',
      badge: 'BEST SELLER',
      heroImage: 'https://i.ibb.co/SXW1B3f4/Sultan-Shahi-Gold-Tila-Hero-Section.png',
      solution: 'Premium herbal blend for men\'s strength, endurance & vitality',
      benefitsTitle: language === 'en' ? '✨ Benefits of Sultan Shahi Gold Tila' : 'سلطان شاہی گولڈ تلا کے فوائد',
      benefitsDescription: '🌿 Natural herbal massage oil for men showing improved firmness and vitality',
      benefitsList: [
        {
          text: '✔ Improves firmness & natural size',
          image: 'https://i.ibb.co/Q3kJmJXx/Improves-firmness-natural-size.png'
        },
        {
          text: '💪 Stamina & endurance booster for long-lasting performance',
          image: 'https://i.ibb.co/s9DYWy41/Stamina-endurance-booster-for-long-lasting-performance.png'
        },
        {
          text: '✔ Boosts strength & energy levels',
          image: 'https://i.ibb.co/8ncppSzY/Boosts-strength-energy-levels.png'
        },
        {
          text: '🧠 Stress relief & confidence enhancer for overall well-being',
          image: 'https://i.ibb.co/wGmnS6m/Stress-relief-confidence-enhancer-for-overall-well-being.png'
        },
        {
          text: '✔ Reduces stress & enhances self-confidence',
          image: 'https://i.ibb.co/1J0nzv0y/Reduces-stress-enhances-self-confidence.png'
        },
        {
          text: '❤️ Blood circulation support for improved male performance',
          image: 'https://i.ibb.co/TqK770Zs/Blood-circulation-support-for-improved-male-performance.png'
        },
        {
          text: '✔ Promotes better flow & tissue health',
          image: 'https://i.ibb.co/tp9QtTjb/Promotes-better-flow-tissue-health.png'
        },
        {
          text: '🌱 Skin & tissue nourishment for softness & regeneration',
          image: 'https://i.ibb.co/q3LcLTfs/Skin-tissue-nourishment-for-softness-regeneration.png'
        },
        {
          text: '✔ 100% natural, no side effects',
          image: 'https://i.ibb.co/84nZ4k7J/100-natural-no-side-effects.png'
        }
      ],
      problemsTitle: '🧠 Common Problems Men Face Today',
      problemsSubtitle: 'Millions of men silently struggle with these issues — but you don\'t have to.',
      problemsList: [
        'Lack of firmness & size issues',
        'Premature ejaculation (P.E)',
        'Weak stamina & low endurance',
        'Poor blood circulation',
        'Stress, fatigue & low energy',
        'Low confidence & relationship pressure',
        'Skin dryness & weak tissue health',
        'Hormonal imbalance affecting performance',
        'Slow recovery & aging-related weakness'
      ],
      problemsSolution: '🌿 Sultan Shahi Gold Tila is the premium herbal blend for men\'s strength, endurance & vitality.',
      // Video Section
      videoId: '6LQWLGuWyKQ',
      videoTitle: '🎥 See Sultan Shahi Gold Tila in Action',
      videoSubtitle: 'Watch how Sultan Shahi Gold Tila has enhanced the strength, stamina & confidence of men across Pakistan.',
      videoCover: 'https://i.ibb.co/M5GRjfkZ/Sultan-Shahi-Gold-Tila-in-Action.png',
      videoPrivacyNotice: '(Loading the video will enable YouTube cookies. We respect your privacy.)',
      videoCallToAction: '✨ Don\'t just take our word for it — see the real results for yourself!',
      // Testimonials Section
      testimonialsTitle: '⭐ What Our Customers Say',
      testimonialsSubtitle: 'Real feedback from satisfied customers across Pakistan',
      // Before & After section
      beforeAfterTitle: '🌟 Real Results, Real Men',
      beforeAfterSubtitle: 'See the difference Sultan Shahi Gold Tila has made in the lives of men across Pakistan.',
      beforeAfterLabels: {
        beforeTitle: 'Before Sultan Shahi Gold Tila',
        afterTitle: 'After Sultan Shahi Gold Tila',
        beforeDesc: '',
        afterDesc: '',
        weeksPrefix: '',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          duration: 4,
          before: 'https://i.ibb.co/zhgtTf4p/4-Weeks-of-Use-Before-Sultan-Shahi-Gold-Tila.png',
          after: 'https://i.ibb.co/PZkjBzqB/4-Weeks-of-Use-After-Sultan-Shahi-Gold-Tila.png',
          summary: '',
          beforeDetails: '😞 Low stamina, weak endurance, relationship stress',
          afterDetails: '💪 Improved firmness, boosted stamina, renewed confidence'
        },
        {
          id: 2,
          duration: 8,
          before: 'https://i.ibb.co/JjQG5M6q/8-Weeks-of-Use-Before-Sultan-Shahi-Gold-Tila.png',
          after: 'https://i.ibb.co/B20c8dcy/8-Weeks-of-Use-After-Sultan-Shahi-Gold-Tila.png',
          summary: '',
          beforeDetails: '😔 Poor blood circulation, lack of energy, intimacy issues',
          afterDetails: '🔥 Strong performance, high energy, happy relationship'
        }
      ],
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power. Backed by Science.',
        subtitle: 'A potent blend of natural herbs and essential oils, trusted for centuries to boost strength, stamina & vitality.',
        ingredients: [
          {
            name: '🌸 Ylang Ylang Oil',
            description: 'Improves blood flow & provides relaxation',
            image: 'https://i.ibb.co/mCc98QJN/Ylang-Ylang-Oil.png'
          },
          {
            name: '🌿 Ginger Oil',
            description: 'Enhances circulation & boosts energy',
            image: 'https://i.ibb.co/5gd9y6dy/Ginger-Oil.png'
          },
          {
            name: '💜 Lavender Oil',
            description: 'Refreshes & soothes tissues',
            image: 'https://i.ibb.co/8L7Y9pGJ/Lavender-Oil.png'
          },
          {
            name: '🐟 Fish Oil',
            description: 'Enhances flexibility & firmness',
            image: 'https://i.ibb.co/dsPj3jB1/Fish-Oil.png'
          },
          {
            name: '🥥 Egg Oil',
            description: 'Nourishes & strengthens tissues',
            image: 'https://i.ibb.co/9mmCGYC8/Egg-Oil.png'
          },
          {
            name: '🌰 Nutmeg Oil',
            description: 'Improves endurance & performance',
            image: 'https://i.ibb.co/FL0vvL2k/Nutmeg-Oil.png'
          },
          {
            name: '🌿 Reg Mahi',
            description: 'Traditionally known for strength & stamina',
            image: 'https://i.ibb.co/VYSz2ypt/Reg-Mahi.png'
          },
          {
            name: '🍃 Bair Boti',
            description: 'Supports skin & tissue repair',
            image: 'https://i.ibb.co/NdZ9xtjg/Bair-Boti.png'
          },
          {
            name: '🌱 Malkagni (Celastrus Paniculatus)',
            description: 'Boosts nerve health & increases energy',
            image: 'https://i.ibb.co/gMHLGBqT/Malkagni.png'
          }
        ],
        footer: '🌿 100% Natural • ⚗️ Scientifically Proven • 🛡️ Safe & Effective',
        footerDescription: 'Each ingredient is carefully selected & tested for maximum potency and safe results.'
      },
      pricing: {
        title: 'Special Pricing',
        subtitle: '🚚 Free Delivery | 💰 Cash on Delivery',
        packages: [
          {
            title: 'Single Pack',
            price: 2500,
            originalPrice: null,
            features: ['30ml Premium Oil', 'Free Delivery', 'Cash on Delivery']
          },
          {
            title: 'Double Pack',
            price: 4500,
            originalPrice: 5000,
            saveAmount: 500,
            features: ['2 x 30ml Premium Oil', 'Free Delivery', 'Cash on Delivery', 'Save Rs 500']
          },
          {
            title: 'Triple Pack',
            price: 6500,
            originalPrice: 7500,
            saveAmount: 1000,
            features: ['3 x 30ml Premium Oil', 'Free Delivery', 'Cash on Delivery', 'Save Rs 1,000']
          }
        ]
      },
      // Dosage & Usage Instructions section
      dosageSection: {
        title: '💧 Dosage & Usage Instructions',
        image: 'https://i.ibb.co/5hQ8VXNM/Dosage-Usage-Instructions.png',
        content: {
          dosage: {
            title: 'Dosage',
            points: [
              '👉 Take 5–6 drops of Sultan Shahi Gold Tila on your palm every night.',
              '👉 Gently massage for 5–10 minutes until fully absorbed.'
            ]
          },
          duration: {
            title: 'Course Duration',
            points: [
              '👉 Use daily for 1–3 months to achieve full and long-lasting results.'
            ]
          },
          bestResults: {
            title: 'Best Results',
            points: [
              '👉 Apply at night before sleep for maximum absorption.',
              '👉 Avoid cold drinks, smoking, and oily/fried foods during the course.',
              '👉 Maintain a light diet and healthy lifestyle to speed up recovery & strength.'
            ]
          }
        }
      },
      // Customer Reviews Section
      customerReviewsSection: {
        title: '⭐ What Our Customers Say',
        subtitle: 'Real feedback from satisfied customers across Pakistan',
        reviews: [
          {
            id: 1,
            name: 'Muhammad Ali',
            age: 32,
            location: 'Karachi',
            rating: 5,
            review: 'Amazing results in just 3 weeks! My confidence has improved significantly and my wife is very happy with the changes.',
            date: '2 weeks ago',
            verified: true
          },
          {
            id: 2,
            name: 'Ahmed Hassan',
            age: 28,
            location: 'Lahore',
            rating: 5,
            review: 'Natural ingredients and no side effects. I feel more energetic and my performance has improved dramatically.',
            date: '1 month ago',
            verified: true
          },
          {
            id: 3,
            name: 'Usman Khan',
            age: 35,
            location: 'Islamabad',
            rating: 4,
            review: 'Good product with visible results. Takes some time but definitely worth it. Highly recommend for married men.',
            date: '3 weeks ago',
            verified: true
          },
          {
            id: 4,
            name: 'Tariq Mahmood',
            age: 40,
            location: 'Faisalabad',
            rating: 5,
            review: 'Best herbal oil I have used. Natural formula and fast absorption. My stamina and endurance have improved a lot.',
            date: '2 months ago',
            verified: true
          }
        ],
        stats: {
          totalReviews: 1247,
          averageRating: 4.8,
          fiveStarPercentage: 89,
          recommendationRate: 96
        }
      },
      // Urdu translations
      i18n: {
        ur: {
          // Problems section
          problemsTitle: '🧠 آج مردوں کے عام مسائل',
          problemsSubtitle: 'لاکھوں مرد خاموشی سے ان مسائل کا شکار ہیں — لیکن آپ کو ایسا نہیں کرنا چاہیے۔',
          problemsList: [
            'مضبوطی اور سائز کے مسائل',
            'قبل از وقت انزال (P.E)',
            'کمزور اسٹیمنا اور کم برداشت',
            'خون کی ناکافی گردش',
            'تناؤ، تھکاوٹ اور کم توانائی',
            'کم اعتماد اور رشتے کا دباؤ',
            'جلد کی خشکی اور کمزور ٹشو',
            'ہارمونل عدم توازن جو کارکردگی کو متاثر کرتا ہے',
            'سست بحالی اور عمر کی کمزوری'
          ],
          problemsSolution: '🌿 سلطان شاہی گولڈ تلا مردوں کی طاقت، برداشت اور حیویت کے لیے پریمیم ہربل مرکب ہے۔',
          
          // Benefits section
          benefitsTitle: '✨ سلطان شاہی گولڈ تلا کے فوائد',
          benefitsDescription: '🌿 مردوں کے لیے قدرتی ہربل مساج آئل جو بہتر مضبوطی اور حیویت ظاہر کرتا ہے',
          benefitsList: [
            {
              text: '✔ مضبوطی اور قدرتی سائز بہتر بناتا ہے',
              image: 'https://i.ibb.co/Q3kJmJXx/Improves-firmness-natural-size.png'
            },
            {
              text: '💪 طویل المیعاد کارکردگی کے لیے اسٹیمنا اور برداشت بڑھاتا ہے',
              image: 'https://i.ibb.co/s9DYWy41/Stamina-endurance-booster-for-long-lasting-performance.png'
            },
            {
              text: '✔ طاقت اور توانائی کی سطح بڑھاتا ہے',
              image: 'https://i.ibb.co/8ncppSzY/Boosts-strength-energy-levels.png'
            },
            {
              text: '🧠 مجموعی بہبودی کے لیے تناؤ کا علاج اور اعتماد بڑھاتا ہے',
              image: 'https://i.ibb.co/wGmnS6m/Stress-relief-confidence-enhancer-for-overall-well-being.png'
            },
            {
              text: '✔ تناؤ کم کرتا ہے اور خود اعتمادی بڑھاتا ہے',
              image: 'https://i.ibb.co/1J0nzv0y/Reduces-stress-enhances-self-confidence.png'
            },
            {
              text: '❤️ بہتر مردانہ کارکردگی کے لیے خون کی گردش میں مدد',
              image: 'https://i.ibb.co/TqK770Zs/Blood-circulation-support-for-improved-male-performance.png'
            },
            {
              text: '✔ بہتر بہاؤ اور ٹشو کی صحت کو فروغ دیتا ہے',
              image: 'https://i.ibb.co/tp9QtTjb/Promotes-better-flow-tissue-health.png'
            },
            {
              text: '🌱 نرمی اور تجدید کے لیے جلد اور ٹشو کی پرورش',
              image: 'https://i.ibb.co/q3LcLTfs/Skin-tissue-nourishment-for-softness-regeneration.png'
            },
            {
              text: '✔ 100% قدرتی، کوئی سائیڈ ایفیکٹس نہیں',
              image: 'https://i.ibb.co/84nZ4k7J/100-natural-no-side-effects.png'
            }
          ],

          // Herbal Power section
          herbalSection: {
            title: '🌿 ہربل پاور۔ سائنس کی تصدیق۔',
            subtitle: 'قدرتی جڑی بوٹیوں اور ضروری تیلوں کا طاقتور مرکب، صدیوں سے طاقت، اسٹیمنا اور حیویت بڑھانے کے لیے قابل اعتماد۔',
            ingredients: [
              {
                name: '🌸 یلنگ یلنگ آئل',
                description: 'خون کا بہاؤ بہتر بناتا ہے اور آرام فراہم کرتا ہے',
                image: 'https://i.ibb.co/mCc98QJN/Ylang-Ylang-Oil.png'
              },
              {
                name: '🌿 ادرک کا تیل',
                description: 'گردش بہتر بناتا ہے اور توانائی بڑھاتا ہے',
                image: 'https://i.ibb.co/5gd9y6dy/Ginger-Oil.png'
              },
              {
                name: '💜 لیوینڈر آئل',
                description: 'ٹشوز کو تازگی اور سکون فراہم کرتا ہے',
                image: 'https://i.ibb.co/8L7Y9pGJ/Lavender-Oil.png'
              },
              {
                name: '🐟 مچھلی کا تیل',
                description: 'لچک اور مضبوطی بڑھاتا ہے',
                image: 'https://i.ibb.co/dsPj3jB1/Fish-Oil.png'
              },
              {
                name: '🥥 انڈے کا تیل',
                description: 'ٹشوز کو پرورش اور مضبوطی فراہم کرتا ہے',
                image: 'https://i.ibb.co/9mmCGYC8/Egg-Oil.png'
              },
              {
                name: '🌰 جائفل کا تیل',
                description: 'برداشت اور کارکردگی بہتر بناتا ہے',
                image: 'https://i.ibb.co/FL0vvL2k/Nutmeg-Oil.png'
              },
              {
                name: '🌿 ریگ ماہی',
                description: 'روایتی طور پر طاقت اور اسٹیمنا کے لیے مشہور',
                image: 'https://i.ibb.co/VYSz2ypt/Reg-Mahi.png'
              },
              {
                name: '🍃 بیر بوٹی',
                description: 'جلد اور ٹشو کی مرمت میں مدد کرتا ہے',
                image: 'https://i.ibb.co/NdZ9xtjg/Bair-Boti.png'
              },
              {
                name: '🌱 ملکانگنی (سیلاسٹرس پینیکولیٹس)',
                description: 'اعصابی صحت بڑھاتا ہے اور توانائی بڑھاتا ہے',
                image: 'https://i.ibb.co/gMHLGBqT/Malkagni.png'
              }
            ]
          },

          customerReviewsSection: {
            title: '⭐ ہمارے کسٹمرز کیا کہتے ہیں',
            subtitle: 'پورے پاکستان سے مطمئن کسٹمرز کی حقیقی رائے',
            reviews: [
              {
                id: 1,
                name: 'محمد علی',
                age: 32,
                location: 'کراچی',
                rating: 5,
                review: 'صرف 3 ہفتوں میں حیرت انگیز نتائج! میرا اعتماد نمایاں طور پر بہتر ہوا ہے اور میری بیوی تبدیلیوں سے بہت خوش ہے۔',
                date: '2 ہفتے پہلے',
                verified: true
              },
              {
                id: 2,
                name: 'احمد حسن',
                age: 28,
                location: 'لاہور',
                rating: 5,
                review: 'قدرتی اجزاء اور کوئی سائیڈ ایفیکٹس نہیں۔ میں زیادہ توانا محسوس کرتا ہوں اور میری کارکردگی نمایاں طور پر بہتر ہوئی ہے۔',
                date: '1 ماہ پہلے',
                verified: true
              },
              {
                id: 3,
                name: 'عثمان خان',
                age: 35,
                location: 'اسلام آباد',
                rating: 4,
                review: 'اچھا پروڈکٹ جس کے واضح نتائج ہیں۔ وقت لگتا ہے لیکن یقیناً قابل قدر ہے۔ شادی شدہ مردوں کے لیے انتہائی تجویز کردہ۔',
                date: '3 ہفتے پہلے',
                verified: true
              },
              {
                id: 4,
                name: 'طارق محمود',
                age: 40,
                location: 'فیصل آباد',
                rating: 5,
                review: 'بہترین ہربل تیل جو میں نے استعمال کیا ہے۔ قدرتی فارمولا اور تیزی سے جذب ہونے والا۔ میرا اسٹیمنا اور برداشت بہت بہتر ہوئی ہے۔',
                date: '2 ماہ پہلے',
                verified: true
              }
            ],
            stats: {
              totalReviews: 1247,
              averageRating: 4.8,
              fiveStarPercentage: 89,
              recommendationRate: 96
            }
          },
          
          dosageSection: {
            title: '💧 خوراک اور استعمال کی ہدایات',
            image: 'https://i.ibb.co/5hQ8VXNM/Dosage-Usage-Instructions.png',
            content: {
              dosage: {
                title: 'خوراک',
                points: [
                  '➤ ہر رات اپنی ہتھیلی پر سلطان شاہی گولڈ تلا کے 5-6 قطرے لیں۔',
                  '➤ مکمل طور پر جذب ہونے تک 5-10 منٹ تک آہستہ سے مساج کریں۔'
                ]
              },
              duration: {
                title: 'کورس کی مدت',
                points: [
                  '➤ مکمل اور دیرپا نتائج حاصل کرنے کے لیے 1-3 ماہ تک روزانہ استعمال کریں۔'
                ]
              },
              bestResults: {
                title: 'بہترین نتائج',
                points: [
                  '➤ زیادہ سے زیادہ جذب کے لیے سونے سے پہلے رات کو لگائیں۔',
                  '➤ کورس کے دوران ٹھنڈے مشروبات، سگریٹ نوشی، اور تیل/تلی ہوئی غذاؤں سے بچیں۔',
                  '➤ بحالی اور طاقت کو تیز کرنے کے لیے ہلکی غذا اور صحت مند طرز زندگی برقرار رکھیں۔'
                ]
              }
            }
          },

          // FAQ section
          faqTitle: '❓ اکثر پوچھے جانے والے سوالات (FAQs)',
          faqSubtitle: 'سلطان شاہی گولڈ تلا کے بارے میں عام سوالات کے جوابات حاصل کریں',
          faqs: [
            {
              question: 'سلطان شاہی گولڈ تلا کیا ہے؟',
              answer: '👉 یہ قدرتی جڑی بوٹیوں اور ضروری تیلوں سے بنا ایک پریمیم ہربل مساج آئل ہے، جو مردوں کی طاقت، اسٹیمنا اور اعتماد بہتر بنانے کے لیے ڈیزائن کیا گیا ہے۔'
            },
            {
              question: 'کیا سلطان شاہی گولڈ تلا استعمال کرنا محفوظ ہے؟',
              answer: '👉 جی ہاں، یہ 100% ہربل ہے، نقصان دہ کیمیکلز یا سٹیرائیڈز سے پاک ہے، اور بیرونی استعمال کے لیے محفوظ ہے۔'
            },
            {
              question: 'میں اسے کیسے استعمال کروں؟',
              answer: '👉 اپنی ہتھیلی پر 5-6 قطرے لگائیں اور مکمل طور پر جذب ہونے تک 5-10 منٹ تک آہستہ سے مساج کریں۔ بہترین نتائج کے لیے ہر رات استعمال کریں۔'
            },
            {
              question: 'نتائج دیکھنے میں کتنا وقت لگتا ہے؟',
              answer: '👉 زیادہ تر صارفین 3-4 ہفتوں میں بہتری محسوس کرتے ہیں، جبکہ مکمل نتائج باقاعدگی سے استعمال کے 1-3 ماہ میں ظاہر ہوتے ہیں۔'
            },
            {
              question: 'کیا اسے روزانہ استعمال کیا جا سکتا ہے؟',
              answer: '👉 جی ہاں، سلطان شاہی گولڈ تلا روزانہ استعمال کے لیے محفوظ ہے اور مستقل استعمال سے بہترین کام کرتا ہے۔'
            },
            {
              question: 'کیا اس کے کوئی سائیڈ ایفیکٹس ہیں؟',
              answer: '👉 نہیں، یہ قدرتی جڑی بوٹیوں اور تیلوں سے بنا ہے، جو بغیر جلن یا سائیڈ ایفیکٹس کے محفوظ استعمال کو یقینی بناتا ہے۔'
            },
            {
              question: 'کیا نئے شادی شدہ مرد اسے استعمال کر سکتے ہیں؟',
              answer: '👉 بالکل۔ اسٹیمنا، اعتماد اور کارکردگی بڑھانے کے لیے نئے شادی شدہ مردوں کے لیے انتہائی تجویز کردہ ہے۔'
            },
            {
              question: 'کیا یہ قبل از وقت انزال یا کمزور اسٹیمنا میں مدد کرتا ہے؟',
              answer: '👉 جی ہاں، قدرتی اجزاء خون کی گردش، برداشت اور کنٹرول بہتر بناتے ہیں جو بہتر کارکردگی کے لیے ضروری ہے۔'
            },
            {
              question: 'سلطان شاہی گولڈ تلا کی قیمت کیا ہے؟',
              answer: '👉 1 بوتل – 2500 روپے | 2 بوتلیں – 4500 روپے | 3 بوتلیں – 6500 روپے (مفت ڈیلیوری اور COD دستیاب)۔'
            },
            {
              question: 'میں سلطان شاہی گولڈ تلا کیسے آرڈر کر سکتا ہوں؟',
              answer: '👉 آپ 0332-8888935 پر کال/واٹس ایپ کے ذریعے یا ہماری ویب سائٹ www.tphint.com پر جا کر آرڈر کر سکتے ہیں۔ پورے پاکستان میں کیش آن ڈیلیوری دستیاب ہے۔'
            }
          ]
        }
      },
      // FAQ section
      faqTitle: '❓ Frequently Asked Questions (FAQs)',
      faqSubtitle: 'Get answers to the most common questions about Sultan Shahi Gold Tila',
      faqs: [
        {
          question: 'What is Sultan Shahi Gold Tila?',
          answer: '👉 It is a premium herbal massage oil made from natural herbs and essential oils, designed to improve men\'s strength, stamina, and confidence.'
        },
        {
          question: 'Is Sultan Shahi Gold Tila safe to use?',
          answer: '👉 Yes, it is 100% herbal, free from harmful chemicals or steroids, and safe for external use.'
        },
        {
          question: 'How do I use it?',
          answer: '👉 Apply 5–6 drops on your palm and gently massage for 5–10 minutes until fully absorbed. Use every night for best results.'
        },
        {
          question: 'How long does it take to see results?',
          answer: '👉 Most users notice improvements within 3–4 weeks, while full results appear in 1–3 months of regular use.'
        },
        {
          question: 'Can it be used daily?',
          answer: '👉 Yes, Sultan Shahi Gold Tila is safe for daily use and works best with consistent application.'
        },
        {
          question: 'Does it have any side effects?',
          answer: '👉 No, it is made from natural herbs and oils, ensuring safe usage without irritation or side effects.'
        },
        {
          question: 'Can newly married men use it?',
          answer: '👉 Absolutely. It is highly recommended for newly married men to boost stamina, confidence, and performance.'
        },
        {
          question: 'Does it help with premature ejaculation or weak stamina?',
          answer: '👉 Yes, the natural ingredients improve blood circulation, endurance, and control for better performance.'
        },
        {
          question: 'What is the price of Sultan Shahi Gold Tila?',
          answer: '👉 1 Bottle – Rs. 2500 | 2 Bottles – Rs. 4500 | 3 Bottles – Rs. 6500 (Free Delivery & COD Available).'
        },
        {
          question: 'How can I order Sultan Shahi Gold Tila?',
          answer: '👉 You can order via Call/WhatsApp at 0332-8888935 or visit our website www.tphint.com. Cash on Delivery is available all over Pakistan.'
        }
      ]
    },
    'g-max-passion': {
      title: 'G-Max Passion',
      subtitle: 'Natural Fertility & Hormonal Support for Women',
      description: 'Boost your reproductive health, hormonal balance, and energy naturally with our premium herbal formula.',
      badge: 'PREMIUM',
      heroImage: 'https://i.ibb.co/G37PNcPH/G-Max-Passion.png',
      // Video Section
      videoId: 'YOUR_YOUTUBE_VIDEO_ID',
      videoTitle: '🌸 See G-Max Passion in Action',
      videoSubtitle: 'Watch how G-Max Passion has helped women across Pakistan restore their natural balance, energy, and fertility.',
      videoCover: 'https://i.ibb.co/wF3KZHgg/G-Max-Passion-Video-Section.png',
      videoDescription: 'Don\'t just take our word for it — see the real stories and transformations of confident, healthy women who trusted G-Max Passion!',
      features: [
        '🌸 Supports conception & fertility',
        '⚖️ Balances hormones naturally',
        '✨ Enhances energy, vitality & emotional well-being',
        '🌿 100% natural & safe'
      ],
      specialPriceAmount: '2,500',
      // Pricing Packages
      pricingPackages: {
        title: '💰 Affordable Packages – G-Max Passion Health Booster',
        subtitle: '100% herbal formula — safe, effective & scientifically tested to balance hormones & boost fertility naturally.',
        packages: [
          {
            name: 'Single Pack',
            subtitle: '1 Bottle – 60 Capsules',
            price: 'Rs. 2,500',
            duration: '1-Month Course',
            savings: null,
            features: ['💵 Price: Rs. 2,500', '🕒 1-Month Course']
          },
          {
            name: 'Double Pack',
            subtitle: '2 Bottles – 120 Capsules',
            price: 'Rs. 4,500',
            duration: '2-Month Course',
            savings: 'Save Rs. 500',
            features: ['💵 Price: Rs. 4,500', '🕒 2-Month Course', '🎁 Save Rs. 500']
          },
          {
            name: 'Triple Pack',
            subtitle: '3 Bottles – 180 Capsules',
            price: 'Rs. 6,500',
            duration: '3-Month Course',
            savings: 'Save Rs. 1,000 + Free Delivery',
            features: ['💵 Price: Rs. 6,500', '🕒 3-Month Course', '🎁 Save Rs. 1,000 + Free Delivery'],
            recommended: true
          }
        ]
      },
      problemsTitle: '🌸 Common Problems Women Face Today',
      problemsSubtitle: 'Millions of women silently struggle with these reproductive and hormonal challenges — but you don\'t have to anymore.',
      problemsList: [
        'Hormonal Imbalance (Mood swings, irregular periods, PCOS symptoms)',
        'Infertility & Difficulty in Conception',
        'Low Energy & Constant Fatigue',
        'Weak Egg Quality & Poor Fertility Health',
        'Stress, Anxiety & Poor Sleep',
        'Menstrual Irregularities & Painful Periods',
        'Low Libido & Intimacy Issues',
        'Premature Aging & Hormonal Decline (Menopause symptoms)',
        'Weak Immune System & Frequent Infections',
        'Nutrient Deficiency Affecting Reproductive Health'
      ],
      solution: 'G-Max Passion naturally supports women\'s reproductive health, fertility, and hormonal balance.',
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power',
        subtitle: 'A powerful blend of natural herbs, vitamins, and minerals – scientifically validated for women\'s fertility, hormonal balance, and overall vitality.',
        badgesLine: '🌿 100% Natural | ⚗️ Scientifically Proven | 🛡️ Safe & Effective',
        footer: 'Each ingredient is carefully selected and tested for maximum potency',
        showIngredients: true,
        // Custom Ingredients for G-Max Passion
        ingredients: [
          {
            name: '⚡ Horny Goat Weed',
            description: 'Supports reproductive health, blood flow, and sexual wellness',
            image: 'https://i.ibb.co/TNdrLD0/Horny-Goat-Weed.png',
            alt: 'Horny Goat Weed herbal supplement for women\'s reproductive health and wellness',
            title: 'Horny Goat Weed - Supports reproductive health, blood flow, and sexual wellness',
            seoDescription: 'Horny Goat Weed extract that supports reproductive health, improves blood flow, and enhances sexual wellness for women'
          },
          {
            name: '🌸 Ashwagandha',
            description: 'Reduces stress, boosts energy, and supports emotional well-being',
            image: 'https://i.ibb.co/210D7HdN/Ashwagandha.png',
            alt: 'Ashwagandha adaptogenic herb for stress reduction and energy boost',
            title: 'Ashwagandha - Reduces stress, boosts energy, and supports emotional well-being',
            seoDescription: 'Pure Ashwagandha extract that reduces stress, boosts energy levels, and supports emotional well-being for women'
          },
          {
            name: '💖 Tribulus Terrestris',
            description: 'Enhances fertility, balances hormones, and improves sexual drive',
            image: 'https://i.ibb.co/1JPDgVLg/Tribulus-Terrestris.png',
            alt: 'Tribulus Terrestris herb for fertility enhancement and hormonal balance',
            title: 'Tribulus Terrestris - Enhances fertility, balances hormones, and improves sexual drive',
            seoDescription: 'Tribulus Terrestris extract that enhances fertility, balances hormones naturally, and improves sexual drive in women'
          },
          {
            name: '🍊 Vitamins & Minerals',
            description: 'B6, B12, C, Zinc, Folic Acid, Iron, Selenium - Support egg quality, hormone regulation, immunity, and overall reproductive health',
            image: 'https://i.ibb.co/cKznGzjS/Vitamins-Minerals.png',
            alt: 'Essential vitamins and minerals for women\'s reproductive health',
            title: 'Vitamins & Minerals - Support egg quality, hormone regulation, immunity, and reproductive health',
            seoDescription: 'Complete blend of B6, B12, C, Zinc, Folic Acid, Iron, and Selenium to support egg quality, hormone regulation, immunity, and reproductive health'
          }
        ]
      },
      benefitsTitle: language === 'en' ? '🌸 Benefits of G-Max Passion – Women\'s Fertility & Hormonal Support' : '🌸 جی میکس پاشن کے فوائد – خواتین کی زرخیزی اور ہارمونل سپورٹ',
      benefitsList: [
        {
          text: 'Promotes Conception & Fertility',
          image: 'https://i.ibb.co/LXZ1TPNc/Promotes-Conception-Fertility.png',
          alt: 'Promotes Conception Fertility',
          title: 'Promotes Conception & Fertility'
        },
        {
          text: 'Supports Hormonal Balance Naturally',
          image: 'https://i.ibb.co/HDJsJ5QL/Supports-Hormonal-Balance-Naturally.png',
          alt: 'Supports Hormonal Balance Naturally',
          title: 'Supports Hormonal Balance Naturally'
        },
        {
          text: 'Enhances Reproductive Health',
          image: 'https://i.ibb.co/Ngg8XgnW/Enhances-Reproductive-Health.png',
          alt: 'Enhances Reproductive Health',
          title: 'Enhances Reproductive Health'
        },
        {
          text: 'Boosts Energy & Vitality',
          image: 'https://i.ibb.co/ZCzFnMM/Boosts-Energy-Vitality.png',
          alt: 'Boosts Energy Vitality',
          title: 'Boosts Energy & Vitality'
        },
        {
          text: 'Reduces Stress & Anxiety',
          image: 'https://i.ibb.co/y3pMV7D/Reduces-Stress-Anxiety.png',
          alt: 'Reduces Stress Anxiety',
          title: 'Reduces Stress & Anxiety'
        },
        {
          text: 'Strengthens Uterus & Reproductive Organs',
          image: 'https://i.ibb.co/vCRvnvL6/Strengthens-Uterus-Reproductive-Organs.png',
          alt: 'Strengthens Uterus Reproductive Organs',
          title: 'Strengthens Uterus & Reproductive Organs'
        },
        {
          text: 'Improves Mood & Emotional Well-being',
          image: 'https://i.ibb.co/zVC2WxJH/Improves-Mood-Emotional-Well-being.png',
          alt: 'Improves Mood Emotional Well-being',
          title: 'Improves Mood & Emotional Well-being'
        },
        {
          text: '100% Herbal & Safe',
          image: 'https://i.ibb.co/G3x1wFdq/100-Herbal-Safe.png',
          alt: '100 Herbal Safe',
          title: '100% Herbal & Safe'
        }
      ],
      // Usage/Dosage Section
      usage: {
        title: '💊 Dosage & Usage Instructions – G-Max Passion Health Booster',
        dosage: {
          title: 'Dosage',
          text: 'Take 1 capsule twice daily.'
        },
        with: {
          title: 'With',
          text: 'Consume with lukewarm milk or water.'
        },
        timing: {
          title: 'Timing',
          text: 'After meals, morning and evening.'
        },
        course: {
          title: 'Course Duration',
          text: 'Use continuously for at least 30 to 90 days for complete results.'
        },
        note: {
          title: 'Note',
          text: 'Maintain a balanced diet, adequate water intake, and proper rest during usage.'
        }
      },
      // Active Herbal Composition Section
      activeComposition: {
        title: '🌿 Active Herbal Composition',
        subtitle: 'Each ingredient is carefully selected and scientifically validated for safety and effectiveness.',
        ingredients: [
          {
            name: 'Horny Goat Weed (Epimedium)',
            benefits: [
              'Improves blood flow and boosts reproductive function',
              'Acts as a natural aphrodisiac',
              'Supports energy, stamina, and mental clarity'
            ]
          },
          {
            name: 'Ashwagandha',
            benefits: [
              'Reduces stress and anxiety naturally',
              'Enhances energy, vitality, and overall hormonal balance',
              'Supports mental, physical, and emotional well-being'
            ]
          },
          {
            name: 'Tribulus Terrestris',
            benefits: [
              'Balances hormones and supports ovulation',
              'Enhances fertility and reproductive health',
              'Acts as a natural libido booster'
            ]
          },
          {
            name: 'Other Supportive Ingredients',
            benefits: [
              'Strengthens reproductive organs',
              'Supports uterine health and blood circulation',
              'Improves overall fertility outcomes'
            ]
          }
        ]
      },
      // Urdu translations
      i18n: {
        ur: {
          problemsTitle: '🌸 آج کل خواتین کو درپیش عام مسائل',
          problemsSubtitle: 'لاکھوں خواتین خاموشی سے ان تولیدی اور ہارمونل مسائل سے نبرد آزما ہیں — لیکن اب آپ کو نہیں۔',
          problemsList: [
            'ہارمونل عدم توازن (موڈ میں تبدیلی، بے قاعدہ ماہواری، پی سی او ایس کی علامات)',
            'بانجھ پن اور حمل میں دشواری',
            'کم توانائی اور مسلسل تھکاوٹ',
            'کمزور انڈے کا معیار اور خراب زرخیزی کی صحت',
            'تناؤ، پریشانی اور خراب نیند',
            'ماہواری کی بے قاعدگی اور تکلیف دہ ادوار',
            'کم لیبیڈو اور قربت کے مسائل',
            'قبل از وقت بڑھاپا اور ہارمونل کمی (رجونورتی کی علامات)',
            'کمزور مدافعتی نظام اور بار بار انفیکشن',
            'غذائی قلت جو تولیدی صحت کو متاثر کرتی ہے'
          ],
          solution: 'جی میکس پاشن قدرتی طور پر خواتین کی تولیدی صحت، زرخیزی اور ہارمونل توازن کو سپورٹ کرتا ہے۔',
          benefitsTitle: '🌸 جی میکس پاشن کے فوائد – خواتین کی زرخیزی اور ہارمونل سپورٹ',
          benefitsList: [
            {
              text: 'حمل اور زرخیزی کو فروغ دیتا ہے',
              image: 'https://i.ibb.co/LXZ1TPNc/Promotes-Conception-Fertility.png',
              alt: 'حمل اور زرخیزی',
              title: 'حمل اور زرخیزی کو فروغ دیتا ہے'
            },
            {
              text: 'قدرتی طور پر ہارمونل توازن کو سپورٹ کرتا ہے',
              image: 'https://i.ibb.co/HDJsJ5QL/Supports-Hormonal-Balance-Naturally.png',
              alt: 'ہارمونل توازن',
              title: 'قدرتی طور پر ہارمونل توازن کو سپورٹ کرتا ہے'
            },
            {
              text: 'تولیدی صحت کو بہتر بناتا ہے',
              image: 'https://i.ibb.co/Ngg8XgnW/Enhances-Reproductive-Health.png',
              alt: 'تولیدی صحت',
              title: 'تولیدی صحت کو بہتر بناتا ہے'
            },
            {
              text: 'توانائی اور قوت میں اضافہ کرتا ہے',
              image: 'https://i.ibb.co/ZCzFnMM/Boosts-Energy-Vitality.png',
              alt: 'توانائی اور قوت',
              title: 'توانائی اور قوت میں اضافہ کرتا ہے'
            },
            {
              text: 'تناؤ اور پریشانی کو کم کرتا ہے',
              image: 'https://i.ibb.co/y3pMV7D/Reduces-Stress-Anxiety.png',
              alt: 'تناؤ اور پریشانی',
              title: 'تناؤ اور پریشانی کو کم کرتا ہے'
            },
            {
              text: 'رحم اور تولیدی اعضاء کو مضبوط بناتا ہے',
              image: 'https://i.ibb.co/vCRvnvL6/Strengthens-Uterus-Reproductive-Organs.png',
              alt: 'رحم اور تولیدی اعضاء',
              title: 'رحم اور تولیدی اعضاء کو مضبوط بناتا ہے'
            },
            {
              text: 'موڈ اور جذباتی صحت کو بہتر بناتا ہے',
              image: 'https://i.ibb.co/zVC2WxJH/Improves-Mood-Emotional-Well-being.png',
              alt: 'موڈ اور جذباتی صحت',
              title: 'موڈ اور جذباتی صحت کو بہتر بناتا ہے'
            },
            {
              text: '100% جڑی بوٹیوں پر مبنی اور محفوظ',
              image: 'https://i.ibb.co/G3x1wFdq/100-Herbal-Safe.png',
              alt: 'جڑی بوٹیوں پر مبنی محفوظ',
              title: '100% جڑی بوٹیوں پر مبنی اور محفوظ'
            }
          ],
          usage: {
            title: '💊 خوراک اور استعمال کی ہدایات – جی میکس پاشن ہیلتھ بوسٹر',
            dosage: {
              title: 'Dosage',
              text: 'روزانہ 1 کیپسول دن میں دو بار استعمال کریں۔'
            },
            with: {
              title: 'With',
              text: 'نیم گرم دودھ یا پانی کے ساتھ لیں۔'
            },
            timing: {
              title: 'Timing',
              text: 'کھانے کے بعد صبح اور شام۔'
            },
            course: {
              title: 'Course Duration',
              text: 'کم از کم 30 سے 90 دن تک مسلسل استعمال کریں تاکہ مکمل نتائج حاصل ہوں۔'
            },
            note: {
              title: 'Note',
              text: 'استعمال کے دوران متوازن خوراک، پانی کا مناسب استعمال، اور آرام کا خیال رکھیں۔'
            }
          },
          activeComposition: {
            title: '🌿 فعال جڑی بوٹیوں کی ترکیب',
            subtitle: 'ہر جزو کو احتیاط سے منتخب کیا گیا ہے اور سائنسی طور پر حفاظت اور تاثیر کے لیے تصدیق شدہ ہے۔',
            ingredients: [
              {
                name: 'ہارنی گوٹ ویڈ (ایپی میڈیم)',
                benefits: [
                  'خون کی گردش کو بہتر بناتا ہے اور تولیدی فعل کو بڑھاتا ہے',
                  'قدرتی افروڈیزیک کے طور پر کام کرتا ہے',
                  'توانائی، برداشت اور ذہنی وضاحت کو سپورٹ کرتا ہے'
                ]
              },
              {
                name: 'اشوگندھا',
                benefits: [
                  'قدرتی طور پر تناؤ اور پریشانی کو کم کرتا ہے',
                  'توانائی، قوت اور مجموعی ہارمونل توازن کو بڑھاتا ہے',
                  'ذہنی، جسمانی اور جذباتی صحت کو سپورٹ کرتا ہے'
                ]
              },
              {
                name: 'ٹریبولس ٹیریسٹرس',
                benefits: [
                  'ہارمونز کو متوازن کرتا ہے اور بیضہ دانی کو سپورٹ کرتا ہے',
                  'زرخیزی اور تولیدی صحت کو بڑھاتا ہے',
                  'قدرتی لیبیڈو بوسٹر کے طور پر کام کرتا ہے'
                ]
              },
              {
                name: 'دیگر معاون اجزاء',
                benefits: [
                  'تولیدی اعضاء کو مضبوط بناتا ہے',
                  'رحم کی صحت اور خون کی گردش کو سپورٹ کرتا ہے',
                  'مجموعی زرخیزی کے نتائج کو بہتر بناتا ہے'
                ]
              }
            ]
          },
          faqTitle: 'اکثر پوچھے گئے سوالات – جی میکس پاشن',
          faqSubtitle: 'خواتین کے لیے جی میکس پاشن جڑی بوٹیوں پر مبنی زرخیزی سپلیمنٹ کے بارے میں عام سوالات کے جوابات حاصل کریں',
          faqs: [
            {
              question: 'جی میکس پاشن کیا ہے؟',
              answer: 'جی میکس پاشن ایک قدرتی زرخیزی اور ہارمونل توازن کا سپلیمنٹ ہے جو خواتین کے لیے تیار کیا گیا ہے تاکہ حمل، تولیدی صحت اور مجموعی قوت کو سپورٹ کیا جا سکے۔'
            },
            {
              question: 'کیا جی میکس پاشن استعمال کرنا محفوظ ہے؟',
              answer: 'جی ہاں، یہ 100% جڑی بوٹیوں پر مبنی ہے اور اس کے کوئی معلوم ضمنی اثرات نہیں ہیں۔ تمام اجزاء پودوں پر مبنی ہیں اور حفاظت کے لیے طبی طور پر جانچے گئے ہیں۔'
            },
            {
              question: 'جی میکس پاشن کون لے سکتی ہے؟',
              answer: 'یہ تمام خواتین لے سکتی ہیں جو حمل کی کوشش کر رہی ہیں، بشمول وہ جو زیادہ عمر کی ہیں یا ہارمونل عدم توازن کے مسائل رکھتی ہیں۔'
            },
            {
              question: 'نتائج دیکھنے میں کتنا وقت لگتا ہے؟',
              answer: 'نتائج مختلف ہو سکتے ہیں، لیکن زیادہ تر خواتین باقاعدہ استعمال کے 4 سے 8 ہفتوں کے اندر توانائی، سائیکل کی باقاعدگی اور زرخیزی کی صحت میں بہتری محسوس کرتی ہیں۔'
            },
            {
              question: 'جی میکس پاشن کیسے لینا چاہیے؟',
              answer: 'کھانے کے بعد گرم دودھ یا پانی کے ساتھ روزانہ دو بار 1 کیپسول لیں۔ بہترین نتائج کے لیے 30 سے 90 دن تک مسلسل استعمال کریں۔'
            },
            {
              question: 'کیا جی میکس پاشن دوسرے سپلیمنٹس کے ساتھ لیا جا سکتا ہے؟',
              answer: 'جی ہاں، اسے زیادہ تر ملٹی وٹامنز یا صحت کے سپلیمنٹس کے ساتھ لیا جا سکتا ہے، لیکن اگر آپ دوائیں لے رہی ہیں تو اپنے ڈاکٹر سے مشورہ کرنا بہتر ہے۔'
            },
            {
              question: 'کیا جی میکس پاشن پی سی او ایس یا بے قاعدہ ماہواری میں مدد کرتا ہے؟',
              answer: 'جی ہاں، جڑی بوٹیوں کا امتزاج ہارمونل توازن کو سپورٹ کرتا ہے، ماہواری کے چکر کو منظم کرنے میں مدد کرتا ہے، اور پی سی او ایس سے متعلق علامات کو کم کر سکتا ہے۔'
            },
            {
              question: 'کیا جی میکس پاشن تناؤ اور تھکاوٹ کے لیے مؤثر ہے؟',
              answer: 'جی ہاں، اشوگندھا اور ٹریبولس جیسے اجزاء تناؤ کو کم کرنے، موڈ کو بہتر بنانے اور قدرتی توانائی کی سطح کو بڑھانے میں مدد کرتے ہیں۔'
            }
          ]
        }
      },
      // FAQs Section
      faqs: [
        {
          question: 'What is G-Max Passion?',
          answer: 'G-Max Passion is a natural fertility and hormonal balance supplement formulated for women to support conception, reproductive health, and overall vitality.'
        },
        {
          question: 'Is G-Max Passion safe to use?',
          answer: 'Yes, it is 100% herbal with no known side effects. All ingredients are plant-based and clinically tested for safety.'
        },
        {
          question: 'Who can take G-Max Passion?',
          answer: 'It can be taken by all women trying to conceive, including those of advanced maternal age or with hormonal imbalance issues.'
        },
        {
          question: 'How long does it take to see results?',
          answer: 'Results may vary, but most women notice improvement in energy, cycle regularity, and fertility health within 4 to 8 weeks of regular use.'
        },
        {
          question: 'How should I take G-Max Passion?',
          answer: 'Take 1 capsule twice daily with warm milk or water after meals. Use consistently for 30 to 90 days for best results.'
        },
        {
          question: 'Can G-Max Passion be taken with other supplements?',
          answer: 'Yes, it can be taken with most multivitamins or health supplements, but it\'s recommended to consult your doctor if you are on medication.'
        },
        {
          question: 'Does G-Max Passion help with PCOS or irregular periods?',
          answer: 'Yes, the herbal blend supports hormonal balance, helps regulate menstrual cycles, and may reduce PCOS-related symptoms.'
        },
        {
          question: 'Is G-Max Passion effective for stress and fatigue?',
          answer: 'Yes, ingredients like Ashwagandha and Tribulus help reduce stress, enhance mood, and boost natural energy levels.'
        }
      ],
      faqsTitle: 'FAQs – G-Max Passion',
      faqSubtitle: 'Get answers to the most common questions about G-Max Passion herbal fertility supplement for women',
      // Testimonials Section
      testimonialsTitle: 'Real Results, Real Women',
      testimonialsSubtitle: 'See how G-Max Passion has transformed the lives of women across Pakistan',
      testimonialsDescription: 'Thousands of women have regained their energy, balanced hormones, and improved fertility with G-Max Passion. Real women, real transformation — naturally!',
      testimonialsFooter: '✨ Real stories. Real results. Experience the natural power of G-Max Passion for yourself.',
      testimonials: [
        {
          name: 'Ayesha, 29 – Lahore',
          text: 'After 6 months of trying, I finally conceived naturally with the help of G-Max Passion. My cycle is now regular and I feel more energetic than ever!',
          rating: 5
        },
        {
          name: 'Fatima, 34 – Karachi',
          text: 'I was struggling with hormonal imbalance and fatigue. Within 2 months of using G-Max Passion, my mood, sleep, and overall wellness improved a lot.',
          rating: 5
        },
        {
          name: 'Sadia, 38 – Islamabad',
          text: 'Doctors told me my fertility was low, but G-Max Passion gave me hope. Now I feel stronger, more confident, and my hormones are finally balanced.',
          rating: 5
        }
      ],
      // Before/After Section - Custom labels for G-Max Passion
      beforeAfterTitle: 'Real Results, Real Women',
      beforeAfterSubtitle: 'See how G-Max Passion has transformed the lives of women across Pakistan',
      beforeAfterLabels: {
        beforeTitle: 'Before G-Max Passion',
        afterTitle: 'After G-Max Passion',
        beforeDesc: 'Low energy, hormonal imbalance, fertility issues',
        afterDesc: 'Balanced hormones, improved energy, enhanced fertility',
        weeksPrefix: '',
        weeksSuffix: ' weeks of use'
      },
      beforeAfterSets: [
        {
          id: 1,
          before: 'https://i.ibb.co/2Yp0dppb/Before-G-Max-Passion-4-Weeks.png',
          after: 'https://i.ibb.co/KPspNss/After-G-Max-Passion-4-Weeks.png',
          duration: 4,
          beforeAlt: 'Before G-Max Passion 4 Weeks',
          afterAlt: 'After G-Max Passion 4 Weeks',
          beforeTitle: 'Before G-Max Passion - 4 Weeks',
          afterTitle: 'After G-Max Passion - 4 Weeks'
        },
        {
          id: 2,
          before: 'https://i.ibb.co/Cs1pM2rW/Before-G-Max-Passion-8-Weeks.png',
          after: 'https://i.ibb.co/PstmbgYQ/After-G-Max-Passion-8-Weeks.png',
          duration: 8,
          beforeAlt: 'Before G-Max Passion 8 Weeks',
          afterAlt: 'After G-Max Passion 8 Weeks',
          beforeTitle: 'Before G-Max Passion - 8 Weeks',
          afterTitle: 'After G-Max Passion - 8 Weeks'
        }
      ]
    },
    'malika-shahi-gold-health-booster': {
      title: 'Malika Shahi Gold Health Booster',
      subtitle: 'Premium Herbal Formula for Fertility, Hormonal Balance & Overall Wellness',
      description: 'Malika Shahi Gold is a premium herbal health booster specially formulated for women to support fertility, hormonal balance, energy, and overall wellness.',
      badge: 'PREMIUM',
      heroImage: 'https://i.ibb.co/JwdB46CD/Malka-Shahi-Gold-Health-Booster-Hero-Section.png',
      features: [
        '✨ Support Fertility & Reproductive Health',
        '✨ Balance Hormones Naturally',
        '✨ Boost Energy & Vitality',
        '✨ Relieve Stress & Anxiety',
        '✨ Enhance Confidence & Intimacy'
      ],
      specialPriceAmount: '5,000',
      // Common Problems Section
      problemsTitle: '🌸 Common Problems Women Face Today',
      problemsSubtitle: 'Millions of women silently struggle with these health challenges — but you don\'t have to anymore.',
      problemsList: [
        'Hormonal Imbalance (Mood swings, irregular periods, PCOS symptoms)',
        'Infertility & Difficulty in Conception',
        'Low Energy & Constant Fatigue',
        'Weak Egg Quality & Poor Fertility Health',
        'Stress, Anxiety & Poor Sleep',
        'Menstrual Irregularities & Painful Periods',
        'Low Libido & Intimacy Issues',
        'Premature Aging & Hormonal Decline (Menopause symptoms)',
        'Weak Immune System & Frequent Infections',
        'Nutrient Deficiency Affecting Reproductive Health'
      ],
      solution: '✨ Malika Shahi Gold Health Booster is designed to restore hormonal balance, boost fertility, and enhance women\'s overall health naturally!',
      // Video Section
      videoTitle: '🎥 See Malika Shahi Gold Health Booster in Action',
      videoSubtitle: 'Watch how Malika Shahi Gold has transformed the lives of women across Pakistan.',
      videoCover: 'https://i.ibb.co/HL5XXdW5/Malka-Shahi-Gold-Health-Booster-Video-Section.png',
      videoId: 'dQw4w9WgXcQ', // Replace with actual YouTube video ID
      videoFooter: '💖 Don\'t just take our word for it — see the real results for yourself!',
      // Pricing Packages
      pricing: {
        title: 'Affordable Packages',
        subtitle: 'Choose the best package for your health journey',
        packages: [
          {
            title: '1 Month Pack',
            price: '5,000',
            originalPrice: '',
            duration: '30 Days Supply',
            features: [
              '1 Bottle of Malika Shahi Gold Health Booster',
              'Free Delivery',
              'Cash on Delivery',
              '24/7 Customer Support'
            ]
          },
          {
            title: '2 Month Pack',
            price: '9,500',
            originalPrice: '10,000',
            duration: '60 Days Supply',
            features: [
              '2 Bottles of Malika Shahi Gold Health Booster',
              'Free Delivery',
              'Cash on Delivery',
              '24/7 Customer Support',
              '💡 Save Rs. 500'
            ]
          },
          {
            title: '3 Month Complete Course',
            price: '14,000',
            originalPrice: '15,000',
            duration: '90 Days Supply',
            features: [
              '3 Bottles of Malika Shahi Gold Health Booster',
              'Free Delivery',
              'Cash on Delivery',
              '24/7 Customer Support',
              '💡 Save Rs. 1,000 — Best Value!'
            ]
          }
        ]
      },
      // Order form prices
      orderFormPrices: {
        package1: { price: 5000, label: '1 Month Pack - Rs 5,000' },
        package2: { price: 9500, label: '2 Month Pack - Rs 9,500' },
        package3: { price: 14000, label: '3 Month Pack - Rs 14,000' }
      },
      // Before & After Results Section
      beforeAfterTitle: '💎 Real Results, Real Women',
      beforeAfterSubtitle: 'See the difference Malika Shahi Gold Health Booster has made in the lives of women across Pakistan',
      beforeAfterLabels: {
        beforeTitle: 'Before Malika Shahi Gold',
        afterTitle: 'After Malika Shahi Gold',
        beforeDesc: 'Irregular cycles, low energy, mood swings, stress',
        afterDesc: 'Balanced hormones, improved energy, better mood, reduced stress',
        weeksPrefix: '',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          before: 'https://i.ibb.co/v4q4kpxQ/4-Weeks-of-Use-Real-Women-Transformation.png',
          after: 'https://i.ibb.co/yBP2fps7/Real-Women-Real-Change-Wellness-Journey.png',
          duration: 4,
          beforeAlt: '4 Weeks of Use Real Women Transformation',
          afterAlt: 'Real Women Real Change Wellness Journey',
          beforeTitle: '4 Weeks of Use - Real Women Transformation',
          afterTitle: 'Real Women Real Change - Wellness Journey'
        },
        {
          id: 2,
          before: 'https://i.ibb.co/7tbcYtwD/8-Weeks-of-Use-Hormonal-Balance-Restored.png',
          after: 'https://i.ibb.co/bRXhCYWp/Empowered-Transformation-Balanced-Hormones-Confidence.png',
          duration: 8,
          beforeAlt: '8 Weeks of Use Hormonal Balance Restored',
          afterAlt: 'Empowered Transformation Balanced Hormones Confidence',
          beforeTitle: '8 Weeks of Use - Hormonal Balance Restored',
          afterTitle: 'Empowered Transformation - Balanced Hormones & Confidence'
        }
      ],
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power. Backed by Science',
        subtitle: 'A unique blend of natural herbs, vitamins, and minerals – trusted for women\'s fertility, hormonal balance & vitality.',
        showIngredients: true,
        twoColumnLayout: true,
        ingredients: [
          {
            name: 'L-Carnitine',
            icon: '⚡',
            benefit: 'Supports egg quality & energy production',
            image: 'https://i.ibb.co/B50Fzdyd/L-Carnitine.png',
            alt: 'L-Carnitine for egg quality and energy',
            title: 'L-Carnitine - Supports egg quality & energy production'
          },
          {
            name: 'L-Arginine',
            icon: '💖',
            benefit: 'Improves blood flow & reproductive health',
            image: 'https://i.ibb.co/k63vXthF/L-Arginine.png',
            alt: 'L-Arginine for reproductive health',
            title: 'L-Arginine - Improves blood flow & reproductive health'
          },
          {
            name: 'Acetyl-L-Carnitine',
            icon: '🌸',
            benefit: 'Protects eggs from oxidative stress',
            image: 'https://i.ibb.co/GfrKWVDH/Acetyl-L-Carnitine.png',
            alt: 'Acetyl-L-Carnitine for egg protection',
            title: 'Acetyl-L-Carnitine - Protects eggs from oxidative stress'
          },
          {
            name: 'Vitamin C',
            icon: '🍊',
            benefit: 'Boosts immunity & maintains hormonal balance',
            image: 'https://i.ibb.co/zhjLsT52/Vitamin-C.png',
            alt: 'Vitamin C for immunity and hormones',
            title: 'Vitamin C - Boosts immunity & maintains hormonal balance'
          },
          {
            name: 'Vitamin E',
            icon: '💎',
            benefit: 'Protects cells & improves fertility',
            image: 'https://i.ibb.co/0VFfX5KW/Vitamin-E.png',
            alt: 'Vitamin E for fertility',
            title: 'Vitamin E - Protects cells & improves fertility'
          },
          {
            name: 'Zinc',
            icon: '⚖️',
            benefit: 'Balances hormones & supports ovulation',
            image: 'https://i.ibb.co/tMVHc56S/Zinc.png',
            alt: 'Zinc for hormonal balance',
            title: 'Zinc - Balances hormones & supports ovulation'
          },
          {
            name: 'Folic Acid',
            icon: '🌱',
            benefit: 'Essential for healthy egg development & conception',
            image: 'https://i.ibb.co/yFjrXmWJ/Folic-Acid.png',
            alt: 'Folic Acid for egg development',
            title: 'Folic Acid - Essential for healthy egg development & conception'
          },
          {
            name: 'Vitamin B6 & B12',
            icon: '🧠',
            benefit: 'Improve mood, energy, and reproductive health',
            image: 'https://i.ibb.co/Vc48XYtp/Vitamin-B6-B12.png',
            alt: 'Vitamin B6 and B12 for mood and energy',
            title: 'Vitamin B6 & B12 - Improve mood, energy, and reproductive health'
          },
          {
            name: 'Selenium',
            icon: '🛡️',
            benefit: 'Antioxidant support for egg and reproductive health',
            image: 'https://i.ibb.co/FqsM6N5b/Selenium.png',
            alt: 'Selenium for reproductive health',
            title: 'Selenium - Antioxidant support for egg and reproductive health'
          },
          {
            name: 'Maca Root & Ashwagandha',
            icon: '🌸',
            benefit: 'Reduce stress, boost vitality & emotional well-being',
            image: 'https://i.ibb.co/bnPnqPj/Maca-Root-Ashwagandha.png',
            alt: 'Maca Root and Ashwagandha for stress relief',
            title: 'Maca Root & Ashwagandha - Reduce stress, boost vitality & emotional well-being'
          }
        ],
        badgesLine: '✅ 100% Natural  |  ✅ Clinically Researched  |  ✅ Safe & Effective for Long-Term Use'
      },
      // Benefits Section
      benefitsTitle: '🌸 Benefits of Malika Shahi Gold Health Booster',
      benefitsList: [
        {
          text: 'Promotes Conception & Fertility',
          image: 'https://i.ibb.co/ZR6NV9G2/Promotes-Conception-Fertility.png',
          alt: 'Promotes Conception Fertility',
          title: 'Promotes Conception & Fertility - Supports egg quality, ovulation, and healthy fertilization'
        },
        {
          text: 'Balances Hormones Naturally',
          image: 'https://i.ibb.co/RGKcXqjX/Balances-Hormones-Naturally.png',
          alt: 'Balances Hormones Naturally',
          title: 'Balances Hormones Naturally - Reduces irregular cycles and supports emotional stability'
        },
        {
          text: 'Improves Reproductive Health',
          image: 'https://i.ibb.co/v4HHb5mS/Improves-Reproductive-Health.png',
          alt: 'Improves Reproductive Health',
          title: 'Improves Reproductive Health - Strengthens female reproductive system & supports implantation'
        },
        {
          text: 'Boosts Energy & Vitality',
          image: 'https://i.ibb.co/6Rh1B2Kb/Boosts-Energy-Vitality.png',
          alt: 'Boosts Energy Vitality',
          title: 'Boosts Energy & Vitality - Enhances stamina, reduces fatigue, and promotes daily wellness'
        },
        {
          text: 'Reduces Stress & Anxiety',
          image: 'https://i.ibb.co/bRGnZ2Lp/Reduces-Stress-Anxiety.png',
          alt: 'Reduces Stress Anxiety',
          title: 'Reduces Stress & Anxiety - Adaptogenic herbs support mental clarity & relaxation'
        },
        {
          text: 'Supports Healthy Pregnancy',
          image: 'https://i.ibb.co/0jJwYS9y/Supports-Healthy-Pregnancy.png',
          alt: 'Supports Healthy Pregnancy',
          title: 'Supports Healthy Pregnancy - Provides essential nutrients for egg and embryo development'
        },
        {
          text: 'Improves Mood & Confidence',
          image: 'https://i.ibb.co/35kVFvWk/Improves-Mood-Confidence.png',
          alt: 'Improves Mood Confidence',
          title: 'Improves Mood & Confidence - Restores balance and enhances emotional well-being'
        },
        {
          text: 'Enhances Pleasure & Intimacy',
          image: 'https://i.ibb.co/wFzcyjXr/Enhances-Pleasure-Intimacy.png',
          alt: 'Enhances Pleasure Intimacy',
          title: 'Enhances Pleasure & Intimacy - Promotes natural desire, energy, and confidence'
        },
        {
          text: '100% Natural & Safe',
          image: 'https://i.ibb.co/Lhg4gk83/100-Natural-Safe.png',
          alt: '100 Natural Safe',
          title: '100% Natural & Safe - No harmful chemicals or artificial additives'
        }
      ],
      // Urdu translations
      i18n: {
        ur: {
          problemsTitle: '🌸 آج کل خواتین کو درپیش عام مسائل',
          problemsSubtitle: 'لاکھوں خواتین خاموشی سے ان صحت کے مسائل سے نبرد آزما ہیں — لیکن اب آپ کو نہیں۔',
          problemsList: [
            'ہارمونل عدم توازن (موڈ میں تبدیلی، بے قاعدہ ماہواری، پی سی او ایس کی علامات)',
            'بانجھ پن اور حمل میں دشواری',
            'کم توانائی اور مسلسل تھکاوٹ',
            'کمزور انڈے کا معیار اور خراب زرخیزی کی صحت',
            'تناؤ، پریشانی اور خراب نیند',
            'ماہواری کی بے قاعدگی اور تکلیف دہ ادوار',
            'کم لیبیڈو اور قربت کے مسائل',
            'قبل از وقت بڑھاپا اور ہارمونل کمی (رجونورتی کی علامات)',
            'کمزور مدافعتی نظام اور بار بار انفیکشن',
            'غذائی قلت جو تولیدی صحت کو متاثر کرتی ہے'
          ],
          solution: '✨ ملکہ شاہی گولڈ ہیلتھ بوسٹر ہارمونل توازن بحال کرنے، زرخیزی کو بڑھانے اور خواتین کی مجموعی صحت کو قدرتی طور پر بہتر بنانے کے لیے ڈیزائن کیا گیا ہے!',
          herbalSection: {
            title: '🌿 جڑی بوٹیوں کی طاقت۔ سائنس سے ثابت شدہ',
            subtitle: 'قدرتی جڑی بوٹیوں، وٹامنز اور معدنیات کا منفرد امتزاج – خواتین کی زرخیزی، ہارمونل توازن اور توانائی کے لیے قابل اعتماد۔',
            ingredients: [
              {
                name: 'ایل-کارنیٹائن',
                icon: '⚡',
                benefit: 'انڈے کے معیار اور توانائی کی پیداوار میں مدد کرتا ہے'
              },
              {
                name: 'ایل-آرجینین',
                icon: '💖',
                benefit: 'خون کی روانی اور تولیدی صحت کو بہتر بناتا ہے'
              },
              {
                name: 'ایسیٹائل-ایل-کارنیٹائن',
                icon: '🌸',
                benefit: 'انڈوں کو آکسیڈیٹیو تناؤ سے بچاتا ہے'
              },
              {
                name: 'وٹامن سی',
                icon: '🍊',
                benefit: 'قوت مدافعت بڑھاتا ہے اور ہارمونل توازن برقرار رکھتا ہے'
              },
              {
                name: 'وٹامن ای',
                icon: '💎',
                benefit: 'خلیات کی حفاظت کرتا ہے اور زرخیزی کو بہتر بناتا ہے'
              },
              {
                name: 'زنک',
                icon: '⚖️',
                benefit: 'ہارمونز کو متوازن کرتا ہے اور بیضہ دانی میں مدد کرتا ہے'
              },
              {
                name: 'فولک ایسڈ',
                icon: '🌱',
                benefit: 'صحت مند انڈے کی نشوونما اور حمل کے لیے ضروری'
              },
              {
                name: 'وٹامن بی 6 اور بی 12',
                icon: '🧠',
                benefit: 'موڈ، توانائی اور تولیدی صحت کو بہتر بناتے ہیں'
              },
              {
                name: 'سیلینیم',
                icon: '🛡️',
                benefit: 'انڈے اور تولیدی صحت کے لیے اینٹی آکسیڈنٹ سپورٹ'
              },
              {
                name: 'ماکا روٹ اور اشواگندھا',
                icon: '🌸',
                benefit: 'تناؤ کم کرتے ہیں، توانائی اور جذباتی صحت بڑھاتے ہیں'
              }
            ],
            badgesLine: '✅ 100% قدرتی  |  ✅ طبی طور پر تحقیق شدہ  |  ✅ طویل مدتی استعمال کے لیے محفوظ اور موثر'
          },
          benefitsTitle: '🌸 ملکہ شاہی گولڈ ہیلتھ بوسٹر کے فوائد',
          benefitsList: [
            {
              text: 'حمل اور زرخیزی کو فروغ دیتا ہے',
              image: 'https://i.ibb.co/ZR6NV9G2/Promotes-Conception-Fertility.png',
              alt: 'حمل اور زرخیزی',
              title: 'حمل اور زرخیزی کو فروغ دیتا ہے - انڈے کے معیار، بیضہ دانی اور صحت مند فرٹیلائزیشن میں مدد کرتا ہے'
            },
            {
              text: 'قدرتی طور پر ہارمونز کو متوازن کرتا ہے',
              image: 'https://i.ibb.co/RGKcXqjX/Balances-Hormones-Naturally.png',
              alt: 'ہارمونز متوازن',
              title: 'قدرتی طور پر ہارمونز کو متوازن کرتا ہے - بے قاعدہ ماہواری کو کم کرتا ہے اور جذباتی استحکام کو سپورٹ کرتا ہے'
            },
            {
              text: 'تولیدی صحت کو بہتر بناتا ہے',
              image: 'https://i.ibb.co/v4HHb5mS/Improves-Reproductive-Health.png',
              alt: 'تولیدی صحت',
              title: 'تولیدی صحت کو بہتر بناتا ہے - خواتین کے تولیدی نظام کو مضبوط بناتا ہے اور امپلانٹیشن میں مدد کرتا ہے'
            },
            {
              text: 'توانائی اور حیویت کو بڑھاتا ہے',
              image: 'https://i.ibb.co/6Rh1B2Kb/Boosts-Energy-Vitality.png',
              alt: 'توانائی اور حیویت',
              title: 'توانائی اور حیویت کو بڑھاتا ہے - برداشت بڑھاتا ہے، تھکاوٹ کم کرتا ہے اور روزانہ کی صحت کو فروغ دیتا ہے'
            },
            {
              text: 'تناؤ اور پریشانی کو کم کرتا ہے',
              image: 'https://i.ibb.co/bRGnZ2Lp/Reduces-Stress-Anxiety.png',
              alt: 'تناؤ اور پریشانی',
              title: 'تناؤ اور پریشانی کو کم کرتا ہے - اڈاپٹوجینک جڑی بوٹیاں ذہنی وضاحت اور آرام کو سپورٹ کرتی ہیں'
            },
            {
              text: 'صحت مند حمل کو سپورٹ کرتا ہے',
              image: 'https://i.ibb.co/0jJwYS9y/Supports-Healthy-Pregnancy.png',
              alt: 'صحت مند حمل',
              title: 'صحت مند حمل کو سپورٹ کرتا ہے - انڈے اور جنین کی نشوونما کے لیے ضروری غذائی اجزاء فراہم کرتا ہے'
            },
            {
              text: 'موڈ اور اعتماد کو بہتر بناتا ہے',
              image: 'https://i.ibb.co/35kVFvWk/Improves-Mood-Confidence.png',
              alt: 'موڈ اور اعتماد',
              title: 'موڈ اور اعتماد کو بہتر بناتا ہے - توازن بحال کرتا ہے اور جذباتی صحت کو بڑھاتا ہے'
            },
            {
              text: 'خوشی اور قربت کو بڑھاتا ہے',
              image: 'https://i.ibb.co/wFzcyjXr/Enhances-Pleasure-Intimacy.png',
              alt: 'خوشی اور قربت',
              title: 'خوشی اور قربت کو بڑھاتا ہے - قدرتی خواہش، توانائی اور اعتماد کو فروغ دیتا ہے'
            },
            {
              text: '100% قدرتی اور محفوظ',
              image: 'https://i.ibb.co/Lhg4gk83/100-Natural-Safe.png',
              alt: 'قدرتی محفوظ',
              title: '100% قدرتی اور محفوظ - کوئی نقصان دہ کیمیکل یا مصنوعی اضافی اجزاء نہیں'
            }
          ],
          faqTitle: 'اکثر پوچھے جانے والے سوالات',
          faqSubtitle: 'ملکہ شاہی گولڈ ہیلتھ بوسٹر کے بارے میں آپ کے عام سوالات کے جوابات',
          faqs: [
            {
              question: 'ملکہ شاہی گولڈ ہیلتھ بوسٹر کیا ہے؟',
              answer: 'ملکہ شاہی گولڈ ایک قدرتی جڑی بوٹیوں کا فارمولا ہے جو خاص طور پر خواتین کے ہارمونل توازن، زرخیزی اور مجموعی توانائی کو سپورٹ کرنے کے لیے بنایا گیا ہے۔'
            },
            {
              question: 'ملکہ شاہی گولڈ ہیلتھ بوسٹر کون استعمال کر سکتی ہے؟',
              answer: 'یہ تمام عمر کی بالغ خواتین کے لیے موزوں ہے، خاص طور پر وہ جو ہارمونل عدم توازن، بے قاعدہ ماہواری، کم توانائی، یا زرخیزی کے مسائل کا سامنا کر رہی ہیں۔'
            },
            {
              question: 'کیا یہ پی سی او ایس اور بے قاعدہ ماہواری میں مدد کرتا ہے؟',
              answer: 'جی ہاں، اس کا جڑی بوٹیوں کا امتزاج ہارمونز کو متوازن کرنے، ماہواری کے چکر کو منظم کرنے اور تولیدی صحت کو قدرتی طور پر بہتر بنانے میں مدد کرتا ہے۔'
            },
            {
              question: 'میں ملکہ شاہی گولڈ کیسے استعمال کروں؟',
              answer: 'کھانے کے بعد دودھ یا پانی کے ساتھ دن میں دو بار 1 کیپسول لیں۔ بہترین نتائج کے لیے کم از کم 2 سے 3 ماہ تک مسلسل استعمال کریں۔'
            },
            {
              question: 'کیا یہ دوسرے سپلیمنٹس یا ادویات کے ساتھ استعمال کرنا محفوظ ہے؟',
              answer: 'جی ہاں، یہ 100% جڑی بوٹیوں پر مبنی اور محفوظ ہے۔ تاہم، اگر آپ کسی طبی علاج سے گزر رہی ہیں تو استعمال سے پہلے اپنے ڈاکٹر سے مشورہ کرنا بہتر ہے۔'
            },
            {
              question: 'کیا اس کے کوئی ضمنی اثرات ہیں؟',
              answer: 'نہیں، کوئی ضمنی اثرات رپورٹ نہیں ہوئے۔ یہ خالص جڑی بوٹیوں کے اجزاء سے بنایا گیا ہے اور جی ایم پی سرٹیفائیڈ مینوفیکچرنگ معیارات کے ساتھ تیار کیا گیا ہے۔'
            },
            {
              question: 'کیا اسے بچے کی پیدائش کے بعد یا رجونورتی کے دوران استعمال کیا جا سکتا ہے؟',
              answer: 'جی ہاں، یہ زچگی کی بحالی یا رجونورتی کی منتقلی کے دوران ہارمونل توازن اور توانائی بحال کرنے میں مدد کرتا ہے۔'
            },
            {
              question: 'نتائج کب تک نظر آنا شروع ہوں گے؟',
              answer: 'زیادہ تر صارفین باقاعدہ استعمال کے 4-8 ہفتوں کے اندر توانائی، موڈ اور ہارمونل توازن میں نمایاں بہتری محسوس کرتی ہیں۔'
            }
          ]
        }
      },
      // FAQs Section
      faqsTitle: 'Frequently Asked Questions (FAQs)',
      faqSubtitle: 'Answers to your most common questions about Malka Shahi Gold Health Booster',
      faqs: [
        {
          question: 'What is Malka Shahi Gold Health Booster?',
          answer: 'Malka Shahi Gold is a natural herbal formula specially made to support women\'s hormonal balance, fertility, and overall vitality.'
        },
        {
          question: 'Who can use Malka Shahi Gold Health Booster?',
          answer: 'It is suitable for adult women of all ages, especially those facing hormonal imbalance, irregular periods, low energy, or fertility challenges.'
        },
        {
          question: 'Does it help with PCOS and irregular periods?',
          answer: 'Yes, its herbal blend helps balance hormones, regulate menstrual cycles, and improve reproductive health naturally.'
        },
        {
          question: 'How should I take Malka Shahi Gold?',
          answer: 'Take 1 capsule twice daily with milk or water after meals. For best results, use continuously for at least 2 to 3 months.'
        },
        {
          question: 'Is it safe to use with other supplements or medicines?',
          answer: 'Yes, it is 100% herbal and safe. However, if you\'re under medical treatment, it\'s best to consult your doctor before use.'
        },
        {
          question: 'Are there any side effects?',
          answer: 'No side effects have been reported. It\'s made from pure herbal ingredients with GMP-certified manufacturing standards.'
        },
        {
          question: 'Can it be used after childbirth or during menopause?',
          answer: 'Yes, it helps restore hormonal balance and vitality during postnatal recovery or menopause transition.'
        },
        {
          question: 'How long before I notice results?',
          answer: 'Most users report noticeable improvements in energy, mood, and hormonal balance within 4–8 weeks of regular use.'
        }
      ]
    },
    'sultan-shahi-gold-health-booster': {
      title: 'Sultan Shahi Gold Health Booster',
      subtitle: 'To Live Life Powerfully, Actively & Strongly',
      description: 'Experience renewed strength, stamina, and confidence with Sultan Shahi Gold — a powerful herbal health booster crafted for men of all ages. Naturally formulated with Ginseng, Ashwagandha, Safed Musli & Shilajit for lasting energy and peak performance.',
      badge: 'PREMIUM',
      heroImage: 'https://i.ibb.co/Ldw6wttM/Shahi-Sultan-Health-Booster.png',
      features: [
        '💪 Boosts Strength & Stamina',
        '🔥 Enhances Performance & Vitality',
        '🧠 Relieves Stress & Improves Focus',
        '🌿 100% Herbal, Safe & Effective'
      ],
      solution: 'Sultan Shahi Gold Health Booster is the ultimate solution for powerful living!',
      // About Product Section
      aboutProduct: {
        title: 'About Sultan Shahi Gold Health Booster',
        description: 'Sultan Shahi Gold Health Booster is an advanced herbal formula specially made to improve men\'s power, stamina, and overall health. It is enriched with natural ingredients like Ginseng, Ashwagandha, Macca Root, Saffron, Shilajit, Safed Musli, and Tribulus Terrestris — known for boosting testosterone levels, improving blood circulation, and enhancing reproductive health. This herbal blend promotes long-lasting energy, better physical strength, and improved performance for men aged 18 to 80.',
        keyFeatures: [
          '⚡ Boosts natural testosterone levels',
          '💪 Improves muscle strength and stamina',
          '🩸 Enhances blood circulation and heart health',
          '🧠 Reduces stress, anxiety, and fatigue',
          '🌿 100% herbal and clinically proven ingredients'
        ]
      },
      benefitsTitle: language === 'en' ? 'Benefits of Sultan Shahi Gold Health Booster' : 'سلطان شاہی گولڈ ہیلتھ بوسٹر کے فوائد',
      benefitsList: [
        {
          text: 'Ultimate Wellness - Energy, Stamina & Immunity Booster',
          image: 'https://i.ibb.co/XfkPHQ6p/Ultimate-Wellness-energy-stamina-immunity-booster.png',
          alt: 'Ultimate Wellness energy stamina immunity booster',
          title: 'Ultimate Wellness - Energy, Stamina & Immunity Booster'
        },
        {
          text: 'Energy & Strength Builder - Fight Fatigue, Build Power',
          image: 'https://i.ibb.co/Y7Mff1r3/Energy-Strength-Builder-fight-fatigue-build-power.png',
          alt: 'Energy Strength Builder fight fatigue build power',
          title: 'Energy & Strength Builder - Fight Fatigue, Build Power'
        },
        {
          text: 'Athletic Performance - Stronger Muscles, Faster Recovery',
          image: 'https://i.ibb.co/ZRvwxPRw/Athletic-Performance-stronger-muscles-faster-recovery.png',
          alt: 'Athletic Performance stronger muscles faster recovery',
          title: 'Athletic Performance - Stronger Muscles, Faster Recovery'
        },
        {
          text: 'Enhanced Libido - Natural Desire & Performance Boost',
          image: 'https://i.ibb.co/b5SWNLWZ/Enhanced-Libido-natural-desire-performance-boost.png',
          alt: 'Enhanced Libido natural desire performance boost',
          title: 'Enhanced Libido - Natural Desire & Performance Boost'
        },
        {
          text: 'Stress Relief - Balanced Hormones & Mood Lift',
          image: 'https://i.ibb.co/0Rcp6vpp/Stress-Relief-balanced-hormones-mood-lift.png',
          alt: 'Stress Relief balanced hormones mood lift',
          title: 'Stress Relief - Balanced Hormones & Mood Lift'
        },
        {
          text: 'Re-Young - Feel Youthful, Confident & Powerful',
          image: 'https://i.ibb.co/2bSvL4t/Re-Young-feel-youthful-confident-powerful.png',
          alt: 'Re Young feel youthful confident powerful',
          title: 'Re-Young - Feel Youthful, Confident & Powerful'
        }
      ],
      specialPriceAmount: '6,000',
      problemsTitle: 'Common Problems Men Face Today',
      problemsSubtitle: 'Millions of men silently face performance and vitality issues — but you don\'t have to anymore.',
      problemsList: [
        'Erectile Dysfunction (Inability to maintain erection)',
        'Premature Ejaculation (Early discharge issue)',
        'Penile Curvature / Peyronie\'s Disease',
        'Short Penis / Micropenis',
        'Poor Penile Blood Flow',
        'Lack of Erection Rigidity',
        'Reduced Penile Sensitivity',
        'Hypersensitivity / Over Sensitivity',
        'Penile Shrinkage / Wrinkling',
        'Thin Penile Skin',
        'Penile Pain / Strain',
        'Penile Inflammation'
      ],
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power. Backed by Science',
        subtitle: 'A unique blend of natural herbs, vitamins, and minerals – trusted for men\'s vitality, strength, and performance.',
        badgesLine: '✔ 100% Natural | 🌱 Scientifically Proven | 🔒 Safe & Effective',
        showIngredients: true
      },
      // Custom Ingredients (EN) — 7 items for this product only
      ingredients: [
        {
          name: 'Ginseng',
          description: 'Enhances stamina and overall vitality',
          image: 'https://i.ibb.co/nsXkZMQC/Ginseng.png'
        },
        {
          name: 'Ashwagandha',
          description: 'Reduces stress and boosts strength',
          image: 'https://i.ibb.co/210D7HdN/Ashwagandha.png'
        },
        {
          name: 'Macca Root',
          description: 'Supports reproductive health and energy',
          image: 'https://i.ibb.co/JjGfBtfJ/Macca-Root.png'
        },
        {
          name: 'Saffron',
          description: 'Improves blood circulation and hormonal balance',
          image: 'https://i.ibb.co/gLsBdgdQ/Saffron.png'
        },
        {
          name: 'Shilajit',
          description: 'Ultimate strength and stamina booster',
          image: 'https://i.ibb.co/zTgrVH1k/Shilajit.png'
        },
        {
          name: 'Safed Musli',
          description: 'Enhances sexual performance',
          image: 'https://i.ibb.co/4g15SC7c/Safed-Musli.png'
        },
        {
          name: 'Tribulus Terrestris',
          description: 'Boosts testosterone naturally',
          image: 'https://i.ibb.co/LVJ2SDN/Tribulus-Terrestris.png'
        }
      ],
      // Dosage & Usage Instructions (EN)
      dosageSection: {
        title: '💊 Dosage & Usage Instructions',
        content: {
          dosage: {
            title: 'Dosage',
            points: [
              'Take ½ teaspoon twice a day, every day, with a glass of milk or water after meals.'
            ]
          },
          duration: {
            title: 'Course Duration',
            points: [
              'Use regularly for 30–90 days for optimal results.'
            ]
          },
          bestResults: {
            title: 'For Best Results',
            points: [
              'Maintain a healthy lifestyle with balanced diet and exercise.',
              'Avoid excessive smoking, alcohol, and oily/fried foods during the course.',
              'Stay hydrated and get proper sleep for faster recovery.'
            ]
          }
        }
      },
      // Video Section headings (EN)
      videoTitle: 'See Sultan Shahi Gold Health Booster in Action',
      videoSubtitle: 'Real Energy, Real Confidence, Real Power',
      videoCover: 'https://i.ibb.co/Hpt0BJ92/Shahi-Sultan-Health-Booster-Video.png',
      // Urdu translations for this product only
      i18n: {
        ur: {
          solution: 'سلطان شاہی گولڈ ہیلتھ بوسٹر طاقتور زندگی گزارنے کا بہترین حل ہے!',
          problemsTitle: 'عام مسائل جن کا مرد آج کل سامنا کرتے ہیں',
          problemsSubtitle: 'لاکھوں مرد خاموشی سے ان مسائل کا شکار ہیں — لیکن آپ کو مزید پریشان ہونے کی ضرورت نہیں۔',
          problemsList: [
            'عضو مخصوص کی کمزوری (کھڑا نہ ہونا)',
            'قبل از وقت انزال (جلدی فارغ ہو جانا)',
            'عضو مخصوص کا ٹیڑھا پن (پیرونی کی بیماری)',
            'عضو مخصوص کا چھوٹا ہونا',
            'عضو مخصوص میں کمزور دوران خون',
            'ایریکشن میں سختی کی کمی',
            'سینسٹیویٹی کی کمی',
            'زیادہ سینسٹیویٹی / اوور سینسٹیویٹی',
            'عضو مخصوص میں سکڑاؤ یا جھریاں',
            'عضو مخصوص کی پتلی جلد',
            'عضو مخصوص میں درد یا کھنچاؤ',
            'عضو مخصوص کی سوزش'
          ],
          benefitsList: [
            {
              text: 'حتمی تندرستی - توانائی، طاقت اور قوت مدافعت بڑھانے والا',
              image: 'https://i.ibb.co/XfkPHQ6p/Ultimate-Wellness-energy-stamina-immunity-booster.png',
              alt: 'حتمی تندرستی توانائی طاقت قوت مدافعت',
              title: 'حتمی تندرستی - توانائی، طاقت اور قوت مدافعت بڑھانے والا'
            },
            {
              text: 'توانائی اور طاقت بنانے والا - تھکاوٹ سے لڑیں، طاقت بنائیں',
              image: 'https://i.ibb.co/Y7Mff1r3/Energy-Strength-Builder-fight-fatigue-build-power.png',
              alt: 'توانائی طاقت بنانے والا تھکاوٹ',
              title: 'توانائی اور طاقت بنانے والا - تھکاوٹ سے لڑیں، طاقت بنائیں'
            },
            {
              text: 'کھلاڑیوں کی کارکردگی - مضبوط پٹھے، تیز بحالی',
              image: 'https://i.ibb.co/ZRvwxPRw/Athletic-Performance-stronger-muscles-faster-recovery.png',
              alt: 'کھلاڑیوں کی کارکردگی مضبوط پٹھے',
              title: 'کھلاڑیوں کی کارکردگی - مضبوط پٹھے، تیز بحالی'
            },
            {
              text: 'بہتر جنسی خواہش - قدرتی خواہش اور کارکردگی میں اضافہ',
              image: 'https://i.ibb.co/b5SWNLWZ/Enhanced-Libido-natural-desire-performance-boost.png',
              alt: 'بہتر جنسی خواہش قدرتی',
              title: 'بہتر جنسی خواہش - قدرتی خواہش اور کارکردگی میں اضافہ'
            },
            {
              text: 'تناؤ سے نجات - متوازن ہارمونز اور موڈ میں بہتری',
              image: 'https://i.ibb.co/0Rcp6vpp/Stress-Relief-balanced-hormones-mood-lift.png',
              alt: 'تناؤ سے نجات متوازن ہارمونز',
              title: 'تناؤ سے نجات - متوازن ہارمونز اور موڈ میں بہتری'
            },
            {
              text: 'دوبارہ جوان - جوان، پراعتماد اور طاقتور محسوس کریں',
              image: 'https://i.ibb.co/2bSvL4t/Re-Young-feel-youthful-confident-powerful.png',
              alt: 'دوبارہ جوان پراعتماد طاقتور',
              title: 'دوبارہ جوان - جوان، پراعتماد اور طاقتور محسوس کریں'
            }
          ],
          herbalSection: {
            title: '🌿 جڑی بوٹیوں کی طاقت۔ سائنس سے ثابت شدہ۔',
            subtitle: 'قدرتی جڑی بوٹیوں، وٹامنز اور معدنیات کا منفرد امتزاج — مردوں کی طاقت، توانائی اور کارکردگی کے لیے قابل اعتماد۔',
            badgesLine: '✔ 100٪ قدرتی | 🌱 سائنسی طور پر ثابت شدہ | 🔒 محفوظ اور مؤثر'
          },
          ingredients: [
            {
              name: 'جنسینگ',
              description: 'طاقت اور عمومی توانائی بڑھاتا ہے',
              image: 'https://i.ibb.co/nsXkZMQC/Ginseng.png'
            },
            {
              name: 'اشوگندھا',
              description: 'تناؤ کم کرتا ہے اور طاقت بڑھاتا ہے',
              image: 'https://i.ibb.co/210D7HdN/Ashwagandha.png'
            },
            {
              name: 'میکا روٹ',
              description: 'تناسلی صحت اور توانائی میں مدد دیتا ہے',
              image: 'https://i.ibb.co/JjGfBtfJ/Macca-Root.png'
            },
            {
              name: 'زعفران',
              description: 'خون کی روانی اور ہارمونل توازن بہتر بناتا ہے',
              image: 'https://i.ibb.co/gLsBdgdQ/Saffron.png'
            },
            {
              name: 'شلاجیت',
              description: 'حتمی طاقت اور برداشت بڑھانے والا',
              image: 'https://i.ibb.co/zTgrVH1k/Shilajit.png'
            },
            {
              name: 'سفید مُصلی',
              description: 'جنسی کارکردگی کو بہتر بناتا ہے',
              image: 'https://i.ibb.co/4g15SC7c/Safed-Musli.png'
            },
            {
              name: 'ٹریبولس ٹیریسٹریس',
              description: 'قدرتی طور پر ٹیسٹوسٹیرون بڑھاتا ہے',
              image: 'https://i.ibb.co/LVJ2SDN/Tribulus-Terrestris.png'
            }
          ],
          dosageSection: {
            title: '💊 خوراک اور استعمال کی ہدایات',
            content: {
              dosage: {
                title: 'خوراک',
                points: [
                  'روزانہ آدھا چائے کا چمچ صبح اور شام، دودھ یا پانی کے ساتھ کھانے کے بعد لیں۔'
                ]
              },
              duration: {
                title: 'کورس کی مدت',
                points: [
                  'بہترین نتائج کے لیے 30 سے 90 دن تک مسلسل استعمال کریں۔'
                ]
              },
              bestResults: {
                title: 'بہترین نتائج کے لیے',
                points: [
                  'متوازن غذا اور ورزش کے ساتھ صحت مند طرز زندگی اپنائیں۔',
                  'کورس کے دوران زیادہ سگریٹ نوشی، شراب اور تلی ہوئی یا زیادہ چکنائی والی غذا سے پرہیز کریں۔',
                  'تیز صحت یابی کے لیے پانی زیادہ پئیں اور مناسب نیند لیں۔'
                ]
              }
            }
          },
          faqTitle: 'اکثر پوچھے جانے والے سوالات',
          faqSubtitle: 'سلطان شاہی گولڈ ہیلتھ بوسٹر کے بارے میں آپ کو جاننے کی ضرورت ہے',
          faqs: [
            { question: 'سلطان شاہی گولڈ ہیلتھ بوسٹر کیا ہے؟', answer: 'یہ ایک پریمیم ہربل سپلیمنٹ ہے جو مردوں کی توانائی، قوت، ٹیسٹوسٹیرون کی سطح اور مجموعی صحت کو بہتر بنانے کے لیے بنایا گیا ہے۔', keywords: 'پریمیم ہربل سپلیمنٹ توانائی قوت ٹیسٹوسٹیرون صحت' },
            { question: 'سلطان شاہی گولڈ ہیلتھ بوسٹر کیسے استعمال کریں؟', answer: 'کھانے کے بعد دن میں دو بار آدھا چمچ دودھ یا پانی کے ساتھ لیں۔ بہترین نتائج کے لیے 30-90 دن تک باقاعدگی سے استعمال کریں۔', keywords: 'خوراک آدھا چمچ دن میں دو بار کھانے کے بعد 30-90 دن' },
            { question: 'کیا یہ طویل مدت کے استعمال کے لیے محفوظ ہے؟', answer: 'جی ہاں، یہ قدرتی جڑی بوٹیوں سے بنایا گیا ہے اور طویل مدت کے استعمال کے لیے محفوظ ہے، کوئی معلوم ضمنی اثرات نہیں۔', keywords: 'محفوظ طویل مدت قدرتی جڑی بوٹیاں کوئی ضمنی اثرات نہیں' },
            { question: 'یہ سپلیمنٹ کون استعمال کر سکتا ہے؟', answer: 'یہ بالغ مردوں کے لیے موزوں ہے جو توانائی، قوت برداشت، تولیدی صحت اور مجموعی صحت کو بہتر بنانا چاہتے ہیں۔', keywords: 'بالغ مرد توانائی قوت برداشت تولیدی صحت مجموعی صحت' },
            { question: 'کیا میں اسے دیگر سپلیمنٹس کے ساتھ استعمال کر سکتا ہوں؟', answer: 'جی ہاں، لیکن اگر آپ دیگر دوائیں یا سپلیمنٹس لے رہے ہیں تو کسی صحت کے ماہر سے مشورہ کریں۔', keywords: 'دیگر سپلیمنٹس دوائیں صحت کے ماہر مشورہ' },
            { question: 'نتائج دیکھنے میں کتنا وقت لگے گا؟', answer: 'زیادہ تر صارفین 2-4 ہفتوں میں توانائی اور طاقت میں بہتری محسوس کرتے ہیں، جبکہ بہترین نتائج 1-3 ماہ کے بعد حاصل ہوتے ہیں۔', keywords: 'نتائج 2-4 ہفتے 1-3 ماہ توانائی طاقت' },
            { question: 'کیا یہ ٹیسٹوسٹیرون کی سطح بہتر بناتا ہے؟', answer: 'جی ہاں، سلطان شاہی گولڈ ہیلتھ بوسٹر میں موجود جڑی بوٹیاں قدرتی طور پر صحت مند ٹیسٹوسٹیرون کی سطح کو سپورٹ کرتی ہیں۔', keywords: 'ٹیسٹوسٹیرون کی سطح جڑی بوٹیاں قدرتی سپورٹ' },
            { question: 'کیا یہ شادی شدہ مردوں کے لیے موزوں ہے؟', answer: 'بالکل، یہ جنسی صحت، کارکردگی اور مجموعی طاقت کو بہتر بنانے میں مدد کرتا ہے، اس لیے شادی شدہ مردوں کے لیے بہترین ہے۔', keywords: 'شادی شدہ مرد جنسی صحت کارکردگی مجموعی طاقت' },
            { question: 'کیا اس کے کوئی ضمنی اثرات ہیں؟', answer: 'نہیں، یہ 100% قدرتی ہے اور ہدایت کے مطابق استعمال کرنے پر کوئی معلوم ضمنی اثرات نہیں ہیں۔', keywords: 'کوئی ضمنی اثرات نہیں 100% قدرتی محفوظ' },
            { question: 'کیا یہ تناؤ اور تھکن میں مددگار ہے؟', answer: 'جی ہاں، اس میں موجود جڑی بوٹیاں توانائی، دماغی وضاحت اور تناؤ کم کرنے میں مدد کرتی ہیں۔', keywords: 'تناؤ تھکن توانائی دماغی وضاحت کمی' }
          ],
          pricingPackages: [
            {
              name: '1 ماہ کا پیک',
              price: '6,000 روپے',
              details: [
                '1 بوتل سلطان شاہی گولڈ ہیلتھ بوسٹر کی',
                'فری ڈیلیوری',
                'کیس آن ڈیلیوری',
                '24/7 کسٹمر سپورٹ'
              ]
            },
            {
              name: '2 ماہ کا پیک',
              price: '11,000 روپے',
              details: [
                '2 بوتلیں سلطان شاہی گولڈ ہیلتھ بوسٹر کی',
                'فری ڈیلیوری',
                'کیس آن ڈیلیوری',
                '24/7 کسٹمر سپورٹ',
                '1,000 روپے بچائیں'
              ]
            },
            {
              name: '3 ماہ کا پیک',
              price: '16,000 روپے',
              details: [
                '3 بوتلیں سلطان شاہی گولڈ ہیلتھ بوسٹر کی',
                'فری ڈیلیوری',
                'کیس آن ڈیلیوری',
                '24/7 کسٹمر سپورٹ',
                'بہترین قیمت'
              ]
            }
          ]
        }
      },
      // Before & After (Real Results) - overrides
      beforeAfterTitle: 'Real Results, Real Men',
      beforeAfterSubtitle: 'See the difference Sultan Shahi Gold Health Booster has made in the lives of men across Pakistan',
      beforeAfterLabels: {
        beforeTitle: 'Before Sultan Shahi',
        afterTitle: 'After Sultan Shahi',
        beforeDesc: 'Low energy, poor confidence, marital issues',
        afterDesc: 'Renewed vigor, strong performance, happy relationship',
        weeksPrefix: '',
        weeksSuffix: ' weeks of use'
      },
      // Before & After sets (images) - specific to Shahi Sultan
      beforeAfterSets: [
        {
          id: 1,
          // 8 weeks set
          before: 'https://i.ibb.co/N6VyzpDb/8-weeks-of-use-Before-Shahi-Sultan-Health-Booster.png',
          after: 'https://i.ibb.co/HDw4BNjR/8-weeks-of-use-After-Shahi-Sultan-Health-Booster.png',
          duration: 8,
          summary: undefined,
          beforeAlt: '8 weeks of use Before Shahi Sultan Health Booster',
          afterAlt: '8 weeks of use After Shahi Sultan Health Booster',
          beforeTitle: '8 weeks of use Before Shahi Sultan Health Booster',
          afterTitle: '8 weeks of use After Shahi Sultan Health Booster'
        },
        {
          id: 2,
          // 4 weeks set
          before: 'https://i.ibb.co/zV0v4JcY/4-weeks-of-use-Before-Shahi-Sultan-Health-Booster.png',
          after: 'https://i.ibb.co/Gvs3GKjY/4-weeks-of-use-After-Shahi-Sultan-Health-Booster.png',
          duration: 4,
          summary: undefined,
          beforeAlt: '4 weeks of use Before Shahi Sultan Health Booster',
          afterAlt: '4 weeks of use After Shahi Sultan Health Booster',
          beforeTitle: '4 weeks of use Before Shahi Sultan Health Booster',
          afterTitle: '4 weeks of use After Shahi Sultan Health Booster'
        }
      ],
      // Affordable Packages
      pricingPackages: [
        {
          name: '1 Month Pack',
          price: 'Rs 6,000/-',
          details: [
            '1 Bottle of Sultan Shahi Gold Health Booster',
            'Free Delivery',
            'Cash on Delivery',
            '24/7 Customer Support'
          ]
        },
        {
          name: '2 Month Pack',
          price: 'Rs 11,000/-',
          details: [
            '2 Bottles of Sultan Shahi Gold Health Booster',
            'Free Delivery',
            'Cash on Delivery',
            '24/7 Customer Support',
            'Save Rs 1,000'
          ]
        },
        {
          name: '3 Month Pack',
          price: 'Rs 16,000/-',
          details: [
            '3 Bottles of Sultan Shahi Gold Health Booster',
            'Free Delivery',
            'Cash on Delivery',
            '24/7 Customer Support',
            'Best Value'
          ]
        }
      ],
      // Ingredients Section
      ingredientsTitle: 'Herbal Power. Backed by Science.',
      ingredientsSubtitle: 'Premium natural ingredients scientifically proven to enhance male vitality and performance',
      ingredientsEn: [
        {
          name: 'Ginseng',
          description: 'Boosts stamina & immunity',
          image: 'https://i.ibb.co/nsXkZMQC/Ginseng.png'
        },
        {
          name: 'Ashwagandha',
          description: 'Reduces stress & enhances vitality',
          image: 'https://i.ibb.co/210D7HdN/Ashwagandha.png'
        },
        {
          name: 'Macca Root',
          description: 'Supports reproductive health & energy',
          image: 'https://i.ibb.co/JjGfBtfJ/Macca-Root.png'
        },
        {
          name: 'Saffron',
          description: 'Natural mood & performance enhancer',
          image: 'https://i.ibb.co/gLsBdgdQ/Saffron.png'
        },
        {
          name: 'Shilajit',
          description: 'Improves strength & testosterone levels',
          image: 'https://i.ibb.co/zTgrVH1k/Shilajit.png'
        },
        {
          name: 'Safed Musli',
          description: 'Boosts semen quality & fertility',
          image: 'https://i.ibb.co/4g15SC7c/Safed-Musli.png'
        },
        {
          name: 'Tribulus Terrestris',
          description: 'Supports muscle growth & endurance',
          image: 'https://i.ibb.co/LVJ2SDN/Tribulus-Terrestris.png'
        }
      ],
      // Product-specific testimonials (EN)
      testimonials: [
        {
          id: 1,
          name: 'Ahmed K.',
          age: 42,
          location: 'Karachi',
          rating: 5,
          text: 'After 3 weeks of using Sultan Shahi Gold Health Booster, my energy levels and confidence have completely transformed. My wife has noticed the difference too!'
        },
        {
          id: 2,
          name: 'Fahad M.',
          age: 38,
          location: 'Lahore',
          rating: 5,
          text: 'I tried many products before, but Sultan Shahi Gold Health Booster is the only one that actually delivered results. Highly recommended for any man over 35.'
        },
        {
          id: 3,
          name: 'Usman R.',
          age: 45,
          location: 'Islamabad',
          rating: 5,
          text: 'The natural ingredients made me feel comfortable trying it. After 2 months, I feel like I\'m in my 20s again. Thank you!'
        }
      ],
      // Dosage & Usage Instructions (EN)
      usage: {
        title: 'Dosage & Usage Instructions',
        dosage: {
          text: 'Take ½ teaspoon twice a day with milk or water'
        },
        course: {
          text: 'Use after meals'
        },
        best: {
          text: 'For best results, continue 30–90 days regularly'
        }
      },
      // Pricing (EN) - Affordable Packages for this product only
      pricing: {
        title: 'Affordable Packages / Pricing',
        subtitle: 'Choose the package that works best for you:',
        packages: [
          {
            title: '1 Pack',
            headerTitle: '1 Pack',
            price: 6000,
            features: [
              'Free delivery all over Pakistan',
              'Secure packaging & fast shipping',
              'Cash on Delivery',
              '24/7 Customer Support'
            ]
          },
          {
            title: '2 Packs',
            headerTitle: '2 Packs',
            price: 11000,
            saveAmount: 1000,
            features: [
              'Free delivery all over Pakistan',
              'Secure packaging & fast shipping',
              'Cash on Delivery',
              '24/7 Customer Support'
            ]
          },
          {
            title: '3 Packs',
            headerTitle: '3 Packs',
            price: 16000,
            saveAmount: 2000,
            features: [
              'Free delivery all over Pakistan',
              'Secure packaging & fast shipping',
              'Cash on Delivery',
              '24/7 Customer Support',
              'Best Value'
            ]
          }
        ]
      }
      ,
      // Product-specific FAQs (EN/UR)
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know about Sultan Shahi Gold Health Booster',
      faqs: [
        { question: 'What is Sultan Shahi Gold Health Booster?', answer: 'It is a premium herbal supplement designed to enhance men\'s energy, vitality, testosterone levels, and overall wellness.', keywords: 'premium herbal supplement energy vitality testosterone wellness' },
        { question: 'How do I use Sultan Shahi Gold Health Booster?', answer: 'Take half a teaspoon twice a day with milk or water after meals. Use regularly for 30-90 days for best results.', keywords: 'dosage half teaspoon twice daily after meals 30-90 days' },
        { question: 'Is it safe for long-term use?', answer: 'Yes, it is made with natural herbs and ingredients, safe for long-term use with no known side effects.', keywords: 'safe long-term natural herbs no side effects' },
        { question: 'Who can use this supplement?', answer: 'It is suitable for adult men of all ages seeking to improve energy, stamina, reproductive health, and overall wellness.', keywords: 'adult men energy stamina reproductive health wellness' },
        { question: 'Can I use it with other supplements?', answer: 'Yes, but consult a healthcare professional if you are taking other medications or supplements.', keywords: 'other supplements medications healthcare professional consult' },
        { question: 'How long until I see results?', answer: 'Most users notice improvements in energy and stamina within 2-4 weeks, with optimal results after 1-3 months.', keywords: 'results 2-4 weeks 1-3 months energy stamina' },
        { question: 'Does it improve testosterone levels?', answer: 'Yes, the herbal ingredients in Sultan Shahi Gold Health Booster naturally support healthy testosterone levels.', keywords: 'testosterone levels herbal ingredients natural support' },
        { question: 'Is it suitable for married men?', answer: 'Absolutely, it supports sexual health, performance, and overall vitality, making it ideal for married men.', keywords: 'married men sexual health performance vitality' },
        { question: 'Does it have any side effects?', answer: 'No, the product is 100% natural and has no known side effects when used as directed.', keywords: 'no side effects 100% natural safe' },
        { question: 'Can it help with stress and fatigue?', answer: 'Yes, it contains herbs that support energy, mental clarity, and stress reduction.', keywords: 'stress fatigue energy mental clarity reduction' }
      ],
      
    },
    'malka-shahi-gold-health-booster': {
      title: 'Malka Shahi Gold Health Booster',
      subtitle: 'Premium herbal supplement for women\'s health',
      badge: 'WOMEN\'S HEALTH',
      solution: 'Malka Shahi Gold supports women\'s health naturally!',
      benefitsTitle: language === 'en' ? 'Benefits of Malka Shahi Gold' : 'ملکہ شاہی گولڈ کے فوائد'
    },
    'slim-n-shape-tea': {
      title: 'Slim n Shape Herbal Tea',
      subtitle: '🌿 Weight Loss | Boosts Immunity | Stress Relief',
      badge: 'WEIGHT LOSS',
      tagline: 'Slim Smart Naturally - Refresh Your Body & Mind!',
      heroSubtitle: 'Slim n Shape Herbal Tea is a premium blend of natural herbs like Green Tea, Lemongrass, and Mint - designed to help you lose extra fat, relieve stress, and boost immunity. Each sip refreshes your body, improves metabolism, and enhances overall well-being naturally.',
      features: [
        'Burn Fat Naturally',
        'Relieve Stress & Anxiety',
        'Boost Immunity & Energy',
        'Improve Digestion & Skin Glow'
      ],
      // Page images (Tea only)
      heroImage: 'https://i.ibb.co/MkjMjkb0/Slim-n-Shape-Herbal-Tea.png',
      benefitsImage: 'https://i.ibb.co/7t9NJdFz/Benefits-of-Slim-n-Shape-Herbal-Tea.jpg',
      specialPriceAmount: '1,200',
      // Video Section (EN)
      videoId: 'OznIF_zTue8',
      videoTitle: '🎥 See Slim n Shape in Action',
      videoSubtitle: 'Watch how Slim n Shape Herbal Tea has transformed lives with real results across Pakistan.',
      videoCover: 'https://i.ibb.co/NgRRFB7w/Slim-n-Shape-Herbal-Tea-Video.png',
      videoIframeTitle: 'Slim n Shape Herbal Tea Video',
      // Before & After (Real Results) - overrides
      beforeAfterTitle: '✨ Real People, Real Results',
      beforeAfterSubtitle: 'Experience visible transformation - feel lighter, more confident, and energetic with Slim n Shape Herbal Tea.',
      beforeAfterLabels: {
        beforeTitle: 'Before',
        afterTitle: 'After',
        beforeDesc: '',
        afterDesc: '',
        weeksPrefix: '📅 After ',
        weeksSuffix: ' Weeks of Use'
      },
      beforeAfterSets: [
        {
          id: 1,
          duration: 4,
          before: 'https://i.ibb.co/FkTjqd52/4-weeks-of-use-Before-Slim-n-Shape-Herbal-Tea.png',
          after: 'https://i.ibb.co/pvC5WsWt/4-weeks-of-use-After-Slim-n-Shape-Herbal-Tea.png',
          summary: 'Lost 4–5 kg, reduced bloating, higher energy levels.'
        },
        {
          id: 2,
          duration: 8,
          before: 'https://i.ibb.co/5x8xDhdV/8-weeks-of-use-Before-Slim-n-Shape-Herbal-Tea.png',
          after: 'https://i.ibb.co/h1VBC9cn/8-weeks-of-use-After-Slim-n-Shape-Herbal-Tea.png',
          summary: 'Lost 5–6 kg, improved digestion, glowing skin, boosted confidence.'
        }
      ],
      // Common Problems (EN)
      problemsTitle: '🔥 Common Problems Due to Obesity',
      problemsSubtitle: 'Millions of people suffer silently from these weight-related issues - but you can change that today!',
      problemsList: [
        'High blood pressure & cholesterol',
        'Heart disease & stroke risk',
        'Joint pain & fatigue',
        'Hormonal imbalance & stress',
        'Digestive issues & toxin buildup',
        'Low energy & confidence'
      ],
      solution: '🔑 Slim n Shape Herbal Tea is the natural solution you have been looking for!',
      // Benefits (EN)
      benefitsTitle: '🌿 Special Benefits of Slim n Shape Herbal Tea',
      benefitsList: [
        '🔥 Burns belly fat naturally & boosts metabolism',
        '🧘 Relieves stress, anxiety & improves sleep',
        '💖 Supports healthy blood pressure & cholesterol',
        '🛡️ Strengthens immune system & fights illness',
        '💪 Increases energy levels all day',
        '🌟 Enhances skin glow & reduces aging signs',
        '🍃 Improves digestion & reduces bloating',
        '🦴 Supports bone strength & overall wellness',
        '✅ 100% natural with no side effects',
        '⚡ Visible results in 10–15 days'
      ],
      // Pricing (EN) - Affordable Packages (Slim n Shape Tea only)
      pricing: {
        title: '💰 Choose Your Slim Plan',
        subtitle: 'Select the perfect package for your weight loss journey',
        popular: 'Best Value',
        save: 'Save',
        packages: [
          {
            title: '1 Pack',
            headerTitle: '1 Pack (100g)',
            price: 1200,
            features: [
              '100g Herbal Tea',
              'Free Delivery',
              'Cash on Delivery',
              '24/7 Support'
            ]
          },
          {
            title: '2 Pack',
            headerTitle: '2 Pack (200g)',
            price: 2000,
            saveAmount: 400,
            features: [
              '200g Herbal Tea',
              'Save Rs. 400',
              'Free Delivery',
              'Best for 1 Month'
            ]
          },
          {
            title: '3 Pack',
            headerTitle: '3 Pack (300g)',
            price: 3000,
            saveAmount: 600,
            features: [
              '300g Herbal Tea',
              'Save Rs. 600',
              'Free Delivery',
              'Complete 45-Day Course'
            ],
            recommended: true
          }
        ]
      },
      // Usage (EN)
      usage: {
        title: '☕ Dosage & Usage Instructions',
        dosage: {
          title: '☕ Ingredients',
          text: 'Slim n Shape tea powder – ½ teaspoon\nWater – 1 cup (250ml)\nHoney – 1 teaspoon\nLemon – 6–8 drops'
        },
        course: {
          title: '🧾 Method',
          text: 'Mix all ingredients in hot water.\nLet it steep for 4–5 minutes.\nDrink warm after meals, twice daily.'
        },
        best: {
          title: '💡 Usage Tips',
          text: 'Avoid oily & junk food.\nStay hydrated (8–10 glasses/day).\nUse continuously for 30 days for best results.'
        }
      },
      // Product-specific FAQs (EN)
      faqTitle: '❓ Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know about Slim n Shape Herbal Tea',
      faqs: [
        { question: 'How soon will I see results?', answer: 'Most users feel lighter and more energetic within 10–15 days of daily use.' },
        { question: 'Is Slim n Shape Herbal Tea safe for everyone?', answer: 'Yes, it is 100% natural and safe for both men and women.' },
        { question: 'Can I use it with green tea or detox drinks?', answer: 'Yes, it can be safely used alongside green tea or other herbal drinks.' },
        { question: 'Does it cause weakness?', answer: 'No, it contains natural nutrients that maintain your energy while burning fat.' },
        { question: 'Do I need to diet?', answer: 'No strict diet required - just avoid oily and sugary foods.' },
        { question: 'What is the best course duration?', answer: 'For full results, continue for 2–3 months with regular use.' },
        { question: 'Can people with high BP or cholesterol take it?', answer: 'Yes, it may help regulate BP & cholesterol naturally, but consult your doctor if on medication.' },
        { question: 'How many cups should I drink daily?', answer: 'Recommended: 2 cups per day (morning & evening after meals).' },
        { question: 'Can I use it with Slim n Shape Fit Booster?', answer: 'Yes, combining it with Fit Booster Capsules gives faster and better results.' },
        { question: 'Will the results last after stopping?', answer: 'Yes, with a balanced lifestyle and healthy eating, results are long-lasting.' }
      ],
      // Herbal Power Section (EN) - 3 Columns
      herbalSection: {
        title: '🌿 Herbal Power. Backed by Nature.',
        subtitle: 'A powerful blend of natural herbs - each carefully selected for fat burning, detox, and wellness support.',
        bullets: [
          'Green Tea – Boosts metabolism & burns fat',
          'Lemongrass – Relieves stress & aids digestion',
          'Pycnanthemum – Natural detox & antioxidant',
          'Apple Cider Extract – Reduces fat buildup',
          'Moringa – Maintains energy & immunity'
        ],
        badgesLine: '✔ 100% Natural | 🌱 Backed by Science | 🔒 Safe & Effective',
        showIngredients: true,
        customColumns: [
          {
            title: 'Green Tea',
            description: 'One of the healthiest beverages on the planet, rich in antioxidants & nutrients.',
            points: [
              'Supports fat loss & metabolism',
              'Improves brain function & mood',
              'Regulates cholesterol & blood pressure',
              'Prevents tooth decay & aging skin',
              'Boosts immunity & overall vitality'
            ]
          },
          {
            title: 'Cymbopogon Citratus (Lemongrass)',
            description: 'A time-tested herbal remedy with therapeutic benefits.',
            points: [
              'Relieves fevers & stomach cramps',
              'Eases gas, colic & digestive issues',
              'Helps with arthritic pain',
              'Promotes calmness & relaxation',
              'Natural detox & immunity booster'
            ]
          },
          {
            title: 'Pycnanthemum (Mountain Mint)',
            description: 'An aromatic herb with powerful medicinal properties.',
            points: [
              'Relieves indigestion, coughs & colds',
              'Treats mouth sores & gum problems',
              'Acts as antiseptic & natural tonic',
              'Supports wound healing & toothache relief',
              'Provides refreshing aroma & stress relief'
            ]
          }
        ]
      },
      // Urdu translations (UR) — only for this product
      i18n: {
        ur: {
          // Problems (UR)
          problemsTitle: '🔥 موٹاپے کی وجہ سے عام مسائل',
          problemsSubtitle: 'لاکھوں لوگ خاموشی سے ان وزن سے متعلق مسائل کا شکار ہیں — لیکن آج آپ اسے بدل سکتے ہیں!',
          problemsList: [
            'بلڈ پریشر اور کولیسٹرول میں اضافہ',
            'دل کے امراض اور فالج کا خطرہ',
            'جوڑوں کا درد اور تھکاوٹ',
            'ہارمونل بے ترتیبی اور ذہنی دباؤ',
            'ہاضمے کے مسائل اور جسم میں زہریلے مادے',
            'کم توانائی اور اعتماد میں کمی'
          ],
          solution: '🔑 سلیم ن شیپ ہربل ٹی وہ قدرتی حل ہے جس کی آپ تلاش کر رہے تھے!',
          // Benefits (UR)
          benefitsTitle: '🌿 سلیم اَن شیپ ہربل ٹی کے خاص فوائد',
          benefitsList: [
            '🔥 قدرتی طور پر پیٹ کی چربی گھلائے اور میٹابولزم بڑھائے',
            '🧘 ذہنی دباؤ، بے چینی میں کمی اور نیند بہتر بنائے',
            '💖 صحت مند بلڈ پریشر اور کولیسٹرول میں مدد',
            '🛡️ قوتِ مدافعت مضبوط بنائے اور بیماریوں سے لڑے',
            '💪 دن بھر توانائی کی سطح بڑھائے',
            '🌟 جلد کی چمک بڑھائے اور بڑھاپے کی علامات کم کرے',
            '🍃 ہاضمہ بہتر بنائے اور پیٹ کی سوجن کم کرے',
            '🦴 ہڈیوں کی مضبوطی اور مجموعی صحت میں مدد',
            '✅ 100٪ قدرتی، کوئی سائیڈ ایفیکٹس نہیں',
            '⚡ 10–15 دنوں میں نظر آنے والے نتائج'
          ],
          // Usage (UR)
          usage: {
            title: '☕ خوراک اور استعمال کی ہدایات',
            dosage: {
              title: '☕ اجزاء',
              text: 'سلیم ن شیپ ٹی پاؤڈر – ½ چائے کا چمچ\nپانی – 1 کپ (250 ملی)\nشہد – 1 چائے کا چمچ\nلیموں – 6–8 قطرے'
            },
            course: {
              title: '🧾 طریقہ',
              text: 'تمام اجزاء کو گرم پانی میں ملائیں۔\n4–5 منٹ تک بھگو کر رکھیں۔\nکھانے کے بعد گرم پئیں، دن میں دو بار۔'
            },
            best: {
              title: '💡 استعمال کی تجاویز',
              text: 'تیل والی اور جنک فوڈ سے پرہیز کریں۔\nہائیڈریٹ رہیں (8–10 گلاس/دن)۔\nبہترین نتائج کے لیے 30 دن مسلسل استعمال کریں۔'
            }
          },
          // FAQs (UR)
          faqTitle: '❓ اکثر پوچھے جانے والے سوالات',
          faqSubtitle: 'سلیم ن شیپ ہربل ٹی کے بارے میں جو کچھ آپ کو جاننے کی ضرورت ہے',
          faqs: [
            { question: 'نتائج کتنی جلدی نظر آئیں گے؟', answer: 'زیادہ تر صارفین روزانہ استعمال کے 10–15 دنوں میں ہلکا پن اور توانائی محسوس کرتے ہیں۔' },
            { question: 'کیا سلیم ن شیپ ہربل ٹی سب کے لیے محفوظ ہے؟', answer: 'جی ہاں، یہ 100٪ قدرتی ہے اور مرد و خواتین دونوں کے لیے محفوظ ہے۔' },
            { question: 'کیا میں اسے گرین ٹی یا ڈیٹوکس ڈرنکس کے ساتھ لے سکتا ہوں؟', answer: 'جی ہاں، اسے گرین ٹی یا دیگر ہربل ڈرنکس کے ساتھ محفوظ طریقے سے استعمال کیا جا سکتا ہے۔' },
            { question: 'کیا یہ کمزوری کا سبب بنتی ہے؟', answer: 'نہیں، اس میں قدرتی غذائی اجزاء ہیں جو چربی جلاتے ہوئے آپ کی توانائی برقرار رکھتے ہیں۔' },
            { question: 'کیا مجھے ڈائیٹ کرنی ہوگی؟', answer: 'سخت ڈائیٹ کی ضرورت نہیں — صرف تیل اور میٹھی چیزوں سے پرہیز کریں۔' },
            { question: 'بہترین کورس کی مدت کیا ہے؟', answer: 'مکمل نتائج کے لیے، باقاعدہ استعمال کے ساتھ 2–3 ماہ جاری رکھیں۔' },
            { question: 'کیا ہائی بلڈ پریشر یا کولیسٹرول والے لوگ لے سکتے ہیں؟', answer: 'جی ہاں، یہ قدرتی طور پر بلڈ پریشر اور کولیسٹرول کو منظم کرنے میں مدد کر سکتی ہے، لیکن اگر دوا لے رہے ہیں تو ڈاکٹر سے مشورہ کریں۔' },
            { question: 'روزانہ کتنے کپ پینے چاہئیں؟', answer: 'تجویز: دن میں 2 کپ (صبح اور شام کھانے کے بعد)۔' },
            { question: 'کیا میں اسے سلیم ن شیپ فٹ بوسٹر کے ساتھ استعمال کر سکتا ہوں؟', answer: 'جی ہاں، فٹ بوسٹر کیپسولز کے ساتھ ملا کر بہتر اور تیز نتائج ملتے ہیں۔' },
            { question: 'استعمال بند کرنے کے بعد کیا نتائج برقرار رہیں گے؟', answer: 'جی ہاں، متوازن طرزِ زندگی اور صحت مند کھانے کے ساتھ نتائج دیرپا رہتے ہیں۔' }
          ],
          herbalSection: {
            title: 'سلیم اَن شیپ ہربل ٹی کے خاص فوائد',
            subtitle: '🌿 قدرتی جڑی بوٹیوں کی طاقت — سائنسی طور پر ثابت شدہ۔ عالمی شہرت یافتہ اجزاء پر مشتمل، جو وزن میں کمی، ذہنی سکون اور قوتِ مدافعت بڑھانے کے لیے خاص طور پر تیار کی گئی ہے۔',
            bullets: [],
            badgesLine: '✔ ۱۰۰٪ قدرتی | 🌱 سائنسی طور پر ثابت شدہ | 🔒 محفوظ اور مؤثر',
            customColumns: [
              {
                title: 'گرین ٹی',
                description: 'دنیا کے صحت بخش ترین مشروبات میں سے ایک، اینٹی آکسیڈنٹس اور غذائی عناصر سے بھرپور۔',
                points: [
                  'چربی گھلانے اور میٹابولزم میں مدد',
                  'دماغی کارکردگی اور موڈ بہتر بنائے',
                  'کولیسٹرول اور بلڈ پریشر کو متوازن رکھے',
                  'دانتوں کی کمزوری اور جلد کے بڑھاپے سے بچاؤ',
                  'قوتِ مدافعت اور مجموعی توانائی میں اضافہ'
                ]
              },
              {
                title: 'سائمبوپوگن سیٹریٹس (لیمون گراس)',
                description: 'قدیم روایتی جڑی بوٹی جس کے بے شمار طبی فوائد ہیں۔',
                points: [
                  'بخار اور پیٹ کے مروڑ میں آرام',
                  'گیس، قولنج اور ہاضمے کے مسائل میں کمی',
                  'جوڑوں کے درد میں معاون',
                  'ذہنی سکون اور ریلیکسیشن فراہم کرے',
                  'قدرتی ڈیٹوکس اور قوتِ مدافعت بڑھائے'
                ]
              },
              {
                title: 'پائکنینتھم (ماؤنٹین منٹ)',
                description: 'خوشبودار جڑی بوٹی جس کے طاقتور طبی فوائد ہیں۔',
                points: [
                  'بدہضمی، کھانسی اور نزلہ زکام میں آرام',
                  'منہ کے چھالوں اور مسوڑھوں کے مسائل میں مفید',
                  'قدرتی جراثیم کش اور ٹانک کے طور پر کام کرے',
                  'زخم بھرنے اور دانت درد میں مدد دے',
                  'فرحت بخش خوشبو اور ذہنی سکون فراہم کرے'
                ]
              }
            ]
          }
        }
      }
    },
    'slim-n-shape-fit-booster': {
      title: 'Slim n Shape Fit Booster',
      subtitle: 'Herbal Powder',
      badge: 'WEIGHT LOSS',
      heroImage: 'https://i.ibb.co/placeholder-fit-booster.png',
      // Hero Section
      features: [
        '🔥 Lose 5–7 Kg Naturally in Just 4–6 Weeks!',
        '100% Herbal Weight Loss Formula',
        'Targets Belly & Thigh Fat',
        'No Weakness or Side Effects',
        'Visible Results in 10–15 Days'
      ],
      tagline: '🔥 Lose 5–7 Kg Naturally in Just 4–6 Weeks!',
      heroSubtitle: '"Slim Smart Naturally — Fit Booster for a New You!"',
      specialPriceAmount: '2,500',
      
      // Product Introduction
      aboutProduct: {
        title: 'Product Introduction',
        description: 'Slim n Shape Fit Booster is a 100% herbal fat-burning powder formulated by The Planner Herbal International. It supports fat burning, metabolism, and detox — targeting stubborn belly and thigh fat naturally. Every spoon helps you feel lighter, fresher, and more energetic without weakness or side effects.'
      },
      
      // Obesity Dangers
      problemsTitle: 'Obesity Dangers / Harms',
      problemsSubtitle: 'Fit Booster helps reverse these health risks naturally and effectively!',
      problemsList: [
        'High blood pressure, cholesterol & diabetes',
        'Heart disease & stroke',
        'Joint pain & fatigue',
        'Hormonal imbalance & low confidence',
        'Digestive issues & toxin buildup'
      ],
      solution: 'Fit Booster helps reverse these health risks naturally and effectively!',
      
      // Special Benefits
      benefitsTitle: 'Special Benefits of Fit Booster',
      benefitsList: [
        'Lose 5–7 Kg in just 4–6 weeks',
        'Burns belly & thigh fat naturally',
        'Controls appetite & sugar cravings',
        'Improves digestion & metabolism',
        'Boosts energy — no weakness or tiredness',
        'Detoxifies body & improves skin tone',
        '100% Herbal • Safe • No Side Effects'
      ],
      
      // Key Herbal Ingredients
      herbalSection: {
        title: '🌱 Key Herbal Ingredients',
        subtitle: 'Powerful natural ingredients scientifically proven for weight loss and wellness',
        showIngredients: true,
        ingredients: [
          {
            name: 'Green Coffee Extract',
            description: 'Speeds up fat metabolism & boosts energy',
            image: 'https://i.ibb.co/placeholder-green-coffee.png'
          },
          {
            name: 'Garcinia Cambogia',
            description: 'Suppresses appetite & reduces fat buildup',
            image: 'https://i.ibb.co/placeholder-garcinia.png'
          },
          {
            name: 'Apple Cider Vinegar Powder',
            description: 'Aids fat oxidation & detoxification',
            image: 'https://i.ibb.co/placeholder-acv.png'
          },
          {
            name: 'Lemon Peel & Ginger Extract',
            description: 'Improves digestion & reduces bloating',
            image: 'https://i.ibb.co/placeholder-lemon-ginger.png'
          },
          {
            name: 'Green Tea Extract',
            description: 'Burns stored fat naturally',
            image: 'https://i.ibb.co/placeholder-green-tea.png'
          },
          {
            name: 'Gul Daudi (Chrysanthemum)',
            description: 'Balances body heat & detoxifies',
            image: 'https://i.ibb.co/placeholder-chrysanthemum.png'
          },
          {
            name: 'Moringa Leaf Powder',
            description: 'Provides nutrients & prevents weakness',
            image: 'https://i.ibb.co/placeholder-moringa.png'
          }
        ],
        badgesLine: '✅ 100% Natural | ✅ Scientifically Proven | ✅ Safe & Effective'
      },
      
      // Dosage & Usage Instructions
      dosageSection: {
        title: '🕒 Dosage & Usage Instructions',
        steps: [
          {
            stepNumber: 'Step 1',
            title: 'Take 1 Teaspoon (≈5g)',
            description: 'After every meal (Morning, Afternoon, Night)'
          },
          {
            stepNumber: 'Step 2',
            title: 'Mix in Warm Water or Green Tea',
            description: 'Stir well and drink slowly'
          },
          {
            stepNumber: 'Step 3',
            title: 'Stay Hydrated',
            description: 'Drink at least 8–10 glasses of water daily'
          }
        ],
        notes: [
          '💡 Continue using for at least 30–45 days for best visible results and stable metabolism.',
          '💚 No strict diet required — just avoid oily & sugary foods.'
        ]
      },
      
      // Affordable Packages
      pricing: {
        title: '💰 Affordable Packages',
        subtitle: 'Choose the perfect package for your weight loss journey',
        packages: [
          {
            title: '1 Pack',
            headerTitle: '1 Pack (30 Days)',
            price: 2500,
            features: [
              '250 grams (30 Days)',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '2-Pack Combo',
            headerTitle: '2-Pack Combo (60 Days)',
            price: 4500,
            saveAmount: 500,
            features: [
              '500 grams (60 Days)',
              'Save Rs. 500',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '3-Pack Full Course',
            headerTitle: '3-Pack Full Course (90 Days)',
            price: 6000,
            saveAmount: 1500,
            features: [
              '750 grams (90 Days)',
              'Save Rs. 1500 – Best Value',
              'Free Delivery',
              'Cash on Delivery'
            ],
            recommended: true
          }
        ]
      },
      
      // Results Accuracy
      beforeAfterTitle: '🎯 Results Accuracy',
      beforeAfterSubtitle: 'Real results you can expect with Slim n Shape Fit Booster',
      resultsAccuracy: [
        'Visible results within 10–15 days',
        'Weight reduction of 5–7 Kg in 4–6 weeks',
        '100% herbal results — safe & consistent',
        'No rebound effect or weakness'
      ],
      
      // Video Section
      videoId: 'YOUR_YOUTUBE_VIDEO_ID',
      videoTitle: '📺 See Slim n Shape Fit Booster in Action',
      videoSubtitle: 'Watch how Fit Booster has transformed the lives of people across Pakistan. Real results, real stories!',
      videoCover: 'https://i.ibb.co/placeholder-fit-booster-video.png',
      videoDescription: 'Click to load video. Loading the video will enable YouTube cookies. We respect your privacy.',
      
      // FAQs
      faqTitle: '💬 Frequently Asked Questions (FAQs)',
      faqSubtitle: 'Get answers to common questions about Slim n Shape Fit Booster',
      faqs: [
        {
          question: 'How soon will I start seeing results?',
          answer: 'Most users notice visible changes within 10–15 days of daily use.'
        },
        {
          question: 'How much weight can I lose with Fit Booster?',
          answer: 'You can lose 5–7 Kg in just 4–6 weeks with regular use and normal eating habits.'
        },
        {
          question: 'Is Slim n Shape Fit Booster safe for everyone?',
          answer: 'Yes, it\'s 100% herbal and safe for both men and women of all ages.'
        },
        {
          question: 'Does it cause weakness or side effects?',
          answer: 'No, it contains Moringa and other herbs that maintain strength and energy.'
        },
        {
          question: 'Can I use it with other herbal or green teas?',
          answer: 'Yes, you can safely combine it with green tea or detox teas for better results.'
        },
        {
          question: 'Do I need to follow a strict diet or heavy exercise?',
          answer: 'No strict diet is needed, just avoid oily/sugary foods and stay lightly active.'
        },
        {
          question: 'What happens if I stop after results?',
          answer: 'No rebound weight gain. Your metabolism stays balanced naturally.'
        },
        {
          question: 'How long should I use it?',
          answer: '2–3 months (2–3 packs) give the most consistent, long-lasting results.'
        },
        {
          question: 'Can diabetic or hypertensive patients use it?',
          answer: 'Yes, but consult your doctor if you\'re under medical treatment.'
        },
        {
          question: 'Is it a powder or capsule?',
          answer: 'It\'s a herbal powder (250g). Take 1 teaspoon after meals, 3 times daily.'
        }
      ],
      
      // Urdu Translations
      i18n: {
        ur: {
          // Obesity Dangers (UR)
          problemsTitle: 'موٹاپے کے خطرات / نقصانات',
          problemsSubtitle: 'فٹ بوسٹر ان صحت کے خطرات کو قدرتی اور مؤثر طریقے سے ختم کرنے میں مدد کرتا ہے!',
          problemsList: [
            'ہائی بلڈ پریشر، کولیسٹرول اور ذیابیطس',
            'دل کی بیماری اور فالج',
            'جوڑوں کا درد اور تھکاوٹ',
            'ہارمونل عدم توازن اور کم اعتماد',
            'ہاضمے کے مسائل اور زہریلے مادوں کا جمع ہونا'
          ],
          solution: 'فٹ بوسٹر ان صحت کے خطرات کو قدرتی اور مؤثر طریقے سے ختم کرنے میں مدد کرتا ہے!',
          
          // Benefits (UR)
          benefitsTitle: 'فٹ بوسٹر کے خاص فوائد',
          benefitsList: [
            'صرف 4-6 ہفتوں میں 5-7 کلو وزن کم کریں',
            'پیٹ اور رانوں کی چربی قدرتی طور پر جلائیں',
            'بھوک اور میٹھے کی خواہش پر قابو پائیں',
            'ہاضمہ اور میٹابولزم بہتر بنائیں',
            'توانائی بڑھائیں — کوئی کمزوری یا تھکاوٹ نہیں',
            'جسم کو صاف کریں اور جلد کی رنگت بہتر بنائیں',
            '100٪ ہربل • محفوظ • کوئی سائیڈ ایفیکٹس نہیں'
          ],
          
          // Herbal Ingredients (UR)
          herbalSection: {
            title: '🌱 اہم ہربل اجزاء',
            subtitle: 'طاقتور قدرتی اجزاء جو وزن میں کمی اور تندرستی کے لیے سائنسی طور پر ثابت شدہ ہیں',
            showIngredients: true,
            ingredients: [
              {
                name: 'گرین کافی ایکسٹریکٹ',
                description: 'چربی کے میٹابولزم کو تیز کرتا ہے اور توانائی بڑھاتا ہے',
                image: 'https://i.ibb.co/placeholder-green-coffee.png'
              },
              {
                name: 'گارسینیا کیمبوجیا',
                description: 'بھوک کو دباتا ہے اور چربی کے جمع ہونے کو کم کرتا ہے',
                image: 'https://i.ibb.co/placeholder-garcinia.png'
              },
              {
                name: 'ایپل سائیڈر وینیگر پاؤڈر',
                description: 'چربی کے آکسیڈیشن اور ڈیٹاکسیفیکیشن میں مدد کرتا ہے',
                image: 'https://i.ibb.co/placeholder-acv.png'
              },
              {
                name: 'لیموں کا چھلکا اور ادرک کا عرق',
                description: 'ہاضمہ بہتر بناتا ہے اور پھولنے کو کم کرتا ہے',
                image: 'https://i.ibb.co/placeholder-lemon-ginger.png'
              },
              {
                name: 'گرین ٹی ایکسٹریکٹ',
                description: 'ذخیرہ شدہ چربی کو قدرتی طور پر جلاتا ہے',
                image: 'https://i.ibb.co/placeholder-green-tea.png'
              },
              {
                name: 'گل داؤدی (کرسنتھیمم)',
                description: 'جسم کی حرارت کو متوازن کرتا ہے اور صاف کرتا ہے',
                image: 'https://i.ibb.co/placeholder-chrysanthemum.png'
              },
              {
                name: 'مورنگا کے پتوں کا پاؤڈر',
                description: 'غذائی اجزاء فراہم کرتا ہے اور کمزوری سے بچاتا ہے',
                image: 'https://i.ibb.co/placeholder-moringa.png'
              }
            ],
            badgesLine: '✅ 100٪ قدرتی | ✅ سائنسی طور پر ثابت شدہ | ✅ محفوظ اور مؤثر'
          },
          
          // Dosage Section (UR)
          dosageSection: {
            title: '🕒 خوراک اور استعمال کی ہدایات',
            steps: [
              {
                stepNumber: 'مرحلہ 1',
                title: '1 چائے کا چمچ (≈5g) لیں',
                description: 'ہر کھانے کے بعد (صبح، دوپہر، رات)'
              },
              {
                stepNumber: 'مرحلہ 2',
                title: 'گرم پانی یا گرین ٹی میں ملائیں',
                description: 'اچھی طرح ہلائیں اور آہستہ آہستہ پیئیں'
              },
              {
                stepNumber: 'مرحلہ 3',
                title: 'ہائیڈریٹ رہیں',
                description: 'روزانہ کم از کم 8-10 گلاس پانی پیئیں'
              }
            ],
            notes: [
              '💡 بہترین نظر آنے والے نتائج اور مستحکم میٹابولزم کے لیے کم از کم 30-45 دن تک استعمال جاری رکھیں۔',
              '💚 سخت غذا کی ضرورت نہیں — صرف تیل والی اور میٹھی غذاؤں سے پرہیز کریں۔'
            ]
          },
          
          // FAQs (UR)
          faqTitle: '💬 اکثر پوچھے جانے والے سوالات (FAQs)',
          faqSubtitle: 'سلیم ن شیپ فٹ بوسٹر کے بارے میں عام سوالات کے جوابات حاصل کریں',
          faqs: [
            {
              question: 'نتائج کب نظر آنا شروع ہوں گے؟',
              answer: 'زیادہ تر صارفین روزانہ استعمال کے 10-15 دنوں میں نظر آنے والی تبدیلیاں محسوس کرتے ہیں۔'
            },
            {
              question: 'فٹ بوسٹر سے کتنا وزن کم ہو سکتا ہے؟',
              answer: 'باقاعدہ استعمال اور عام کھانے کی عادات کے ساتھ صرف 4-6 ہفتوں میں 5-7 کلو وزن کم کر سکتے ہیں۔'
            },
            {
              question: 'کیا سلیم ن شیپ فٹ بوسٹر سب کے لیے محفوظ ہے؟',
              answer: 'جی ہاں، یہ 100٪ ہربل ہے اور تمام عمر کے مردوں اور عورتوں کے لیے محفوظ ہے۔'
            },
            {
              question: 'کیا یہ کمزوری یا سائیڈ ایفیکٹس کا سبب بنتا ہے؟',
              answer: 'نہیں، اس میں مورنگا اور دیگر جڑی بوٹیاں ہیں جو طاقت اور توانائی برقرار رکھتی ہیں۔'
            },
            {
              question: 'کیا میں اسے دوسری ہربل یا گرین ٹی کے ساتھ استعمال کر سکتا ہوں؟',
              answer: 'جی ہاں، بہتر نتائج کے لیے آپ اسے محفوظ طریقے سے گرین ٹی یا ڈیٹاکس ٹی کے ساتھ ملا سکتے ہیں۔'
            },
            {
              question: 'کیا مجھے سخت غذا یا بھاری ورزش کی ضرورت ہے؟',
              answer: 'سخت غذا کی ضرورت نہیں، صرف تیل والی/میٹھی غذاؤں سے پرہیز کریں اور ہلکی سرگرمی برقرار رکھیں۔'
            },
            {
              question: 'نتائج کے بعد بند کرنے پر کیا ہوتا ہے؟',
              answer: 'وزن میں دوبارہ اضافہ نہیں ہوتا۔ آپ کا میٹابولزم قدرتی طور پر متوازن رہتا ہے۔'
            },
            {
              question: 'مجھے کتنی دیر تک استعمال کرنا چاہیے؟',
              answer: '2-3 ماہ (2-3 پیک) سب سے زیادہ مستقل، دیرپا نتائج دیتے ہیں۔'
            },
            {
              question: 'کیا ذیابیطس یا ہائی بلڈ پریشر کے مریض اسے استعمال کر سکتے ہیں؟',
              answer: 'جی ہاں، لیکن اگر آپ طبی علاج کے تحت ہیں تو اپنے ڈاکٹر سے مشورہ کریں۔'
            },
            {
              question: 'کیا یہ پاؤڈر ہے یا کیپسول؟',
              answer: 'یہ ہربل پاؤڈر ہے (250g)۔ کھانے کے بعد 1 چائے کا چمچ، دن میں 3 بار لیں۔'
            }
          ]
        }
      }
    },
    'bustmax-breast-oil': {
      title: 'BustMax Breast Oil – Breast Massage Oil',
      subtitle: '🌸 Total Breast Health & Natural Firming Solution',
      badge: 'WOMEN',
      heroImage: 'https://i.ibb.co/LVnS3NS/Bust-Max-Breast-Oil-Hero-Section.png',
      heroImageAlt: 'Bust Max Breast Oil Hero Section',
      heroImageTitle: 'BustMax Breast Oil - Total Breast Health & Natural Firming Solution',
      featuredImage: 'https://i.ibb.co/k2M0zm7W/Bust-Max-Breast-Oil.png',
      featuredImageAlt: 'Bust Max Breast Oil',
      featuredImageTitle: 'BustMax Breast Oil - Premium Natural Breast Enhancement Oil',
      
      // Hero Section
      features: [
        'Total Breast Health & Natural Firming Solution',
        'Premium active ingredients',
        'Deeply nourish the skin',
        'Promote breast development',
        'Naturally improve firmness & shape'
      ],
      tagline: '🌸 Total Breast Health & Natural Firming Solution',
      heroSubtitle: 'A strong herbal formula with premium active ingredients that deeply nourish the skin, promote breast development, and naturally improve firmness & shape.',
      specialPriceAmount: '2,500',
      
      // Common Problems Women Face
      problemsTitle: '💢 Common Problems Women Face',
      problemsSubtitle: 'BustMax Oil helps you naturally restore firmness, shape, and confidence without side effects.',
      problemsList: [
        'Small or Unshaped Breasts',
        'Sagging or Uneven Firmness',
        'Leanness due to hormonal imbalance',
        'Loss of elasticity or skin tightness',
        'Poor circulation and dull tone'
      ],
      solution: '👉 BustMax Oil helps you naturally restore firmness, shape, and confidence without side effects.',
      
      // Video Section
      videoId: 'YOUR_BUSTMAX_VIDEO_ID',
      videoTitle: '🎥 See BustMax in Action',
      videoSubtitle: 'Watch how BustMax Oil is transforming women\'s confidence and body shape across Pakistan.',
      videoCover: 'https://i.ibb.co/jdp2NVx/G-Max-Passion-Video-Section.png',
      videoCoverAlt: 'BustMax Breast Oil Video Section',
      videoCoverTitle: 'Watch BustMax Breast Oil Transformation Results',
      videoDescription: '🌺 Don\'t just take our word for it — see the real glow & shape results yourself!',
      
      // Real Results Section
      beforeAfterTitle: '💃 Real Results, Real Women',
      beforeAfterSubtitle: 'Thousands of women across Pakistan have experienced amazing transformation with regular use of BustMax Oil',
      beforeAfterLabels: {
        beforeTitle: 'Before BustMax',
        afterTitle: 'After BustMax',
        beforeDesc: 'Low energy, poor confidence, marital issues',
        afterDesc: 'Renewed vigor, strong performance, happy relationship',
        weeksPrefix: '',
        weeksSuffix: ' weeks of use'
      },
      resultsAccuracy: [
        '💗 Improved firmness & lift',
        '💗 Natural size enhancement',
        '💗 Softer & glowing skin',
        '💗 Better hormonal balance'
      ],
      beforeAfterSets: [
        {
          id: 1,
          before: 'https://i.ibb.co/xtqQ08D0/Before-4-Weeks.png',
          after: 'https://i.ibb.co/svHnfGLV/After-4-Weeks.png',
          duration: 4,
          beforeAlt: 'Before BustMax',
          afterAlt: 'After BustMax',
          beforeTitle: 'Before BustMax - Low energy, poor confidence, marital issues',
          afterTitle: 'After BustMax - Renewed vigor, strong performance, happy relationship'
        },
        {
          id: 2,
          before: 'https://i.ibb.co/jv8SBqTy/Before-8-Weeks.png',
          after: 'https://i.ibb.co/bqwhmS8/After-8-Weeks.png',
          duration: 8,
          beforeAlt: 'Before BustMax',
          afterAlt: 'After BustMax',
          beforeTitle: 'Before BustMax - Low energy, poor confidence, marital issues',
          afterTitle: 'After BustMax - Renewed vigor, strong performance, happy relationship'
        }
      ],
      
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power – 100% Natural Ingredients',
        subtitle: 'Premium natural oils and extracts for total breast health',
        showIngredients: true,
        customColumns: [
          {
            title: '🍃 Simmondsia Chinensis (Jojoba Oil)',
            description: 'Deeply nourishes and hydrates skin, improving elasticity and firmness.',
            points: []
          },
          {
            title: '🌸 Ricinus Communis (Castor Oil)',
            description: 'Stimulates collagen and promotes smooth, glowing skin.',
            points: []
          },
          {
            title: '🌾 Olea Europaea (Olive Oil)',
            description: 'Rich in antioxidants, helps in skin regeneration and natural lift.',
            points: []
          },
          {
            title: '🌰 Oak Galls',
            description: 'Tightens skin tissues, enhances tone, and supports natural firmness.',
            points: []
          },
          {
            title: '🌹 Rose Oil',
            description: 'Gives soothing fragrance and rejuvenates skin, leaving it soft and supple.',
            points: []
          }
        ],
        badgesLine: '✅ 100% Natural | ✅ No Side Effects | ✅ Safe for Daily Use'
      },
      
      // Results Section
      benefitsTitle: '✨ Visible Results You\'ll Love',
      benefitsList: [
        {
          text: 'Firmer, fuller & lifted bust',
          image: 'https://i.ibb.co/r1zJrW4/Firmer-fuller-lifted-bust.png',
          alt: 'Firmer fuller lifted bust',
          title: 'Firmer, fuller & lifted bust - Natural breast enhancement with BustMax Oil'
        },
        {
          text: 'Natural shape enhancement',
          image: 'https://i.ibb.co/fYDH9FSC/Natural-shape-enhancement.png',
          alt: 'Natural shape enhancement',
          title: 'Natural shape enhancement - Improve breast shape naturally'
        },
        {
          text: 'Smooth & moisturized skin',
          image: 'https://i.ibb.co/Jw8dwPcR/Smooth-moisturized-skin.png',
          alt: 'Smooth moisturized skin',
          title: 'Smooth & moisturized skin - Deep nourishment for soft, supple skin'
        },
        {
          text: 'Improved blood & lymph circulation',
          image: 'https://i.ibb.co/gZS322B2/Improved-blood-lymph-circulation.png',
          alt: 'Improved blood lymph circulation',
          title: 'Improved blood & lymph circulation - Better breast health and vitality'
        },
        {
          text: 'Supports hormonal balance',
          image: 'https://i.ibb.co/9mLgDjMh/Supports-hormonal-balance.png',
          alt: 'Supports hormonal balance',
          title: 'Supports hormonal balance - Natural hormonal support for women'
        },
        {
          text: '100% herbal & safe for daily use',
          image: 'https://i.ibb.co/gbxCGXbv/100-herbal-safe-for-daily-use.png',
          alt: '100 herbal safe for daily use',
          title: '100% herbal & safe for daily use - Natural ingredients with no side effects'
        },
        {
          text: 'No side effects – only herbal nourishment!',
          image: 'https://i.ibb.co/JR3SWdnN/No-side-effects-only-herbal-nourishment.png',
          alt: 'No side effects only herbal nourishment',
          title: 'No side effects – only herbal nourishment - Pure natural care for your body'
        }
      ],
      
      // Dosage & Usage Instructions
      dosageSection: {
        title: '🕒 Dosage & Usage Instructions',
        steps: [
          {
            stepNumber: '1️⃣',
            title: 'Clean the targeted area (breasts)',
            description: 'Morning & Night'
          },
          {
            stepNumber: '2️⃣',
            title: 'Take 4-5 drops of BustMax Oil',
            description: 'On palm'
          },
          {
            stepNumber: '3️⃣',
            title: 'Gently massage in circular motion',
            description: '5-10 minutes'
          },
          {
            stepNumber: '4️⃣',
            title: 'Use regularly for best results',
            description: 'Daily 2 times'
          }
        ],
        notes: [
          '⚠️ For external use only',
          'Avoid contact with eyes or damaged skin.'
        ]
      },
      
      // Affordable Packages
      pricing: {
        title: '💸 Affordable Packages',
        subtitle: 'Choose the perfect package for your breast health journey',
        packages: [
          {
            title: '1 Pack',
            headerTitle: '1 Pack',
            price: 2500,
            features: [
              '100 ml',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '2 Packs',
            headerTitle: '2 Packs',
            price: 4500,
            features: [
              '2 × 100 ml',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '3 Packs',
            headerTitle: '3 Packs',
            price: 6000,
            features: [
              '3 × 100 ml',
              'Free Delivery',
              'Cash on Delivery'
            ],
            recommended: true
          }
        ],
        shelfLife: '📦 Shelf Life: 3 Years',
        madeIn: '🌍 Made in Pakistan – 100% Herbal Formula'
      },
      
      // Testimonials Section
      testimonialsTitle: '💬 What Our Customers Say',
      testimonialsDescription: 'Real women sharing their amazing experiences with BustMax Oil',
      testimonials: [
        {
          id: 1,
          name: 'Ayesha M.',
          age: 28,
          
          location: 'Karachi',
          rating: 5,
          text: 'After using BustMax Oil for just 3 weeks, I noticed visible firmness and lift. My skin feels so soft and nourished. Highly recommend!',
          image: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: 2,
          name: 'Sana K.',
          age: 32,
          location: 'Lahore',
          rating: 5,
          text: 'I was skeptical at first, but BustMax Oil really works! My confidence has improved so much. The natural ingredients make it safe and effective.',
          image: 'https://i.pravatar.cc/150?img=5'
        },
        {
          id: 3,
          name: 'Fatima R.',
          age: 26,
          location: 'Islamabad',
          rating: 5,
          text: 'Best breast oil I\'ve ever used! The results are amazing - firmer, fuller, and my skin glows. No side effects at all. Worth every penny!',
          image: 'https://i.pravatar.cc/150?img=9'
        }
      ],
      
      // FAQs
      faqTitle: '❓ FAQs',
      faqSubtitle: 'Everything you need to know about BustMax Oil',
      faqs: [
        {
          question: 'Q1: How long before I see results?',
          answer: 'Most users notice visible firmness within 2 to 3 weeks of consistent use.'
        },
        {
          question: 'Q2: Is it safe for all skin types?',
          answer: 'Yes, BustMax Oil is 100% herbal and suitable for all skin types.'
        },
        {
          question: 'Q3: Can it cause irritation?',
          answer: 'No, but avoid applying to wounds or very sensitive skin.'
        },
        {
          question: 'Q4: How often should I apply it?',
          answer: 'Twice daily — morning and before sleep — for best results.'
        },
        {
          question: 'Q5: Does it have any side effects?',
          answer: 'None at all. It\'s free from chemicals and made with natural oils.'
        },
        {
          question: 'Q6: Can I use it with other lotions or creams?',
          answer: 'Yes, but apply BustMax Oil first for better absorption.'
        }
      ],
      
      // Urdu Translations
      i18n: {
        ur: {
          problemsTitle: '💢 خواتین کو درپیش عام مسائل',
          problemsSubtitle: 'بسٹ میکس آئل آپ کو قدرتی طور پر مضبوطی، شکل اور اعتماد بحال کرنے میں مدد کرتا ہے بغیر کسی ضمنی اثرات کے۔',
          problemsList: [
            'چھوٹے یا بے شکل چھاتی',
            'ڈھیلا پن یا غیر مساوی مضبوطی',
            'ہارمونل عدم توازن کی وجہ سے کمزوری',
            'لچک یا جلد کی سختی میں کمی',
            'خراب گردش اور پھیکا رنگ'
          ],
          solution: '👉 بسٹ میکس آئل آپ کو قدرتی طور پر مضبوطی، شکل اور اعتماد بحال کرنے میں مدد کرتا ہے بغیر کسی ضمنی اثرات کے۔',
          
          herbalSection: {
            title: '🌿 جڑی بوٹیوں کی طاقت – 100% قدرتی اجزاء',
            subtitle: 'چھاتی کی مکمل صحت کے لیے پریمیم قدرتی تیل اور عرق',
            customColumns: [
              {
                title: '🍃 سیمونڈسیا چائنینسس (جوجوبا آئل)',
                description: 'جلد کو گہرائی سے پرورش اور نمی فراہم کرتا ہے، لچک اور مضبوطی کو بہتر بناتا ہے۔'
              },
              {
                title: '🌸 ریسینس کمیونس (کیسٹر آئل)',
                description: 'کولیجن کو متحرک کرتا ہے اور ہموار، چمکدار جلد کو فروغ دیتا ہے۔'
              },
              {
                title: '🌾 اولیا یوروپیا (زیتون کا تیل)',
                description: 'اینٹی آکسیڈنٹس سے بھرپور، جلد کی تخلیق نو اور قدرتی لفٹ میں مدد کرتا ہے۔'
              },
              {
                title: '🌰 اوک گالز',
                description: 'جلد کے ٹشوز کو سخت کرتا ہے، رنگت کو بڑھاتا ہے اور قدرتی مضبوطی کو سپورٹ کرتا ہے۔'
              },
              {
                title: '🌹 گلاب کا تیل',
                description: 'سکون بخش خوشبو دیتا ہے اور جلد کو تازہ کرتا ہے، اسے نرم اور کومل بناتا ہے۔'
              }
            ],
            badgesLine: '✅ 100% قدرتی | ✅ کوئی ضمنی اثرات نہیں | ✅ روزانہ استعمال کے لیے محفوظ'
          },
          
          benefitsTitle: '✨ نظر آنے والے نتائج جو آپ کو پسند آئیں گے',
          benefitsList: [
            {
              text: 'مضبوط، بھرپور اور اٹھی ہوئی چھاتی',
              image: 'https://i.ibb.co/r1zJrW4/Firmer-fuller-lifted-bust.png',
              alt: 'مضبوط بھرپور اٹھی ہوئی چھاتی',
              title: 'مضبوط، بھرپور اور اٹھی ہوئی چھاتی - بسٹ میکس آئل کے ساتھ قدرتی بہتری'
            },
            {
              text: 'قدرتی شکل میں بہتری',
              image: 'https://i.ibb.co/fYDH9FSC/Natural-shape-enhancement.png',
              alt: 'قدرتی شکل میں بہتری',
              title: 'قدرتی شکل میں بہتری - قدرتی طور پر چھاتی کی شکل بہتر بنائیں'
            },
            {
              text: 'ہموار اور نمی والی جلد',
              image: 'https://i.ibb.co/Jw8dwPcR/Smooth-moisturized-skin.png',
              alt: 'ہموار نمی والی جلد',
              title: 'ہموار اور نمی والی جلد - نرم، کومل جلد کے لیے گہری پرورش'
            },
            {
              text: 'خون اور لمف کی گردش میں بہتری',
              image: 'https://i.ibb.co/gZS322B2/Improved-blood-lymph-circulation.png',
              alt: 'خون لمف گردش بہتری',
              title: 'خون اور لمف کی گردش میں بہتری - بہتر چھاتی کی صحت اور توانائی'
            },
            {
              text: 'ہارمونل توازن کو سپورٹ کرتا ہے',
              image: 'https://i.ibb.co/9mLgDjMh/Supports-hormonal-balance.png',
              alt: 'ہارمونل توازن سپورٹ',
              title: 'ہارمونل توازن کو سپورٹ کرتا ہے - خواتین کے لیے قدرتی ہارمونل سپورٹ'
            },
            {
              text: '100% جڑی بوٹیوں سے بنا اور روزانہ استعمال کے لیے محفوظ',
              image: 'https://i.ibb.co/gbxCGXbv/100-herbal-safe-for-daily-use.png',
              alt: '100 جڑی بوٹیوں محفوظ روزانہ استعمال',
              title: '100% جڑی بوٹیوں سے بنا اور روزانہ استعمال کے لیے محفوظ - قدرتی اجزاء بغیر ضمنی اثرات'
            },
            {
              text: 'کوئی ضمنی اثرات نہیں – صرف جڑی بوٹیوں کی پرورش!',
              image: 'https://i.ibb.co/JR3SWdnN/No-side-effects-only-herbal-nourishment.png',
              alt: 'کوئی ضمنی اثرات نہیں صرف جڑی بوٹیوں پرورش',
              title: 'کوئی ضمنی اثرات نہیں – صرف جڑی بوٹیوں کی پرورش - آپ کے جسم کے لیے خالص قدرتی دیکھ بھال'
            }
          ],
          
          dosageSection: {
            title: '🕒 خوراک اور استعمال کی ہدایات',
            steps: [
              {
                stepNumber: '1️⃣',
                title: 'ہدف والے حصے (چھاتی) کو صاف کریں',
                description: 'صبح اور رات'
              },
              {
                stepNumber: '2️⃣',
                title: 'بسٹ میکس آئل کی 4-5 بوندیں لیں',
                description: 'ہتھیلی پر'
              },
              {
                stepNumber: '3️⃣',
                title: 'نرمی سے سرکلر موشن میں مساج کریں',
                description: '5-10 منٹ تک'
              },
              {
                stepNumber: '4️⃣',
                title: 'بہترین نتائج کے لیے باقاعدگی سے استعمال کریں',
                description: 'روزانہ 2 بار'
              }
            ]
          },
          
          faqTitle: '❓ اکثر پوچھے جانے والے سوالات',
          faqSubtitle: 'بسٹ میکس آئل کے بارے میں آپ کو جاننے کی ضرورت ہے',
          faqs: [
            {
              question: 'سوال 1: نتائج دیکھنے میں کتنا وقت لگتا ہے؟',
              answer: 'زیادہ تر صارفین مسلسل استعمال کے 2 سے 3 ہفتوں کے اندر نظر آنے والی مضبوطی محسوس کرتے ہیں۔'
            },
            {
              question: 'سوال 2: کیا یہ تمام جلد کی اقسام کے لیے محفوظ ہے؟',
              answer: 'جی ہاں، بسٹ میکس آئل 100% جڑی بوٹیوں سے بنا ہے اور تمام جلد کی اقسام کے لیے موزوں ہے۔'
            },
            {
              question: 'سوال 3: کیا یہ جلن کا سبب بن سکتا ہے؟',
              answer: 'نہیں، لیکن زخموں یا بہت حساس جلد پر لگانے سے گریز کریں۔'
            },
            {
              question: 'سوال 4: مجھے اسے کتنی بار لگانا چاہیے؟',
              answer: 'بہترین نتائج کے لیے دن میں دو بار — صبح اور سونے سے پہلے۔'
            },
            {
              question: 'سوال 5: کیا اس کے کوئی ضمنی اثرات ہیں؟',
              answer: 'بالکل نہیں۔ یہ کیمیکلز سے پاک ہے اور قدرتی تیلوں سے بنایا گیا ہے۔'
            },
            {
              question: 'سوال 6: کیا میں اسے دوسرے لوشن یا کریموں کے ساتھ استعمال کر سکتی ہوں؟',
              answer: 'جی ہاں، لیکن بہتر جذب کے لیے پہلے بسٹ میکس آئل لگائیں۔'
            }
          ]
        }
      }
    },
    'bustmax-xl-breast-booster': {
      title: 'Bustmax XL – Breast Firming & Shape Booster',
      subtitle: '💗 Beautiful B Shape • Natural Lift • Visible Firmness',
      badge: 'WOMEN',
      heroImage: '/images/Bustmax XL Breast Booster.png',
      
      // Hero Section
      features: [
        'Beautiful B Shape • Natural Lift • Visible Firmness',
        'Advanced herbal formula',
        'Internal hormonal balance support',
        'Tissue nourishment',
        'No chemicals or side effects'
      ],
      tagline: '"Confidence in Every Curve — Naturally Beautiful with Bustmax XL!"',
      heroSubtitle: 'Bustmax XL aik advanced herbal formula hai jo women ke breast firmness, shape aur elasticity ko naturally improve karta hai. Ye internal hormonal balance aur tissue nourishment ko support karta hai — bina kisi chemical ya side effect ke.',
      specialPriceAmount: '3,000',
      
      // Common Problems Women Face
      problemsTitle: '💢 Common Problems Women Face',
      problemsSubtitle: 'Bustmax XL naturally restores balance, firmness, and B-shape confidence without artificial hormones.',
      problemsList: [
        'Sagging or shapeless bust after breastfeeding or aging',
        'Hormonal imbalance affecting firmness',
        'Weak skin elasticity and poor tone',
        'Lack of natural lift and roundness',
        'Dull, uneven breast texture'
      ],
      solution: '👉 Bustmax XL naturally restores balance, firmness, and B-shape confidence without artificial hormones.',
      
      // Video Section
      videoId: 'YOUR_BUSTMAX_XL_VIDEO_ID',
      videoTitle: '🎥 See Bustmax XL in Action',
      videoSubtitle: 'Watch how Bustmax XL has helped women across Pakistan feel naturally confident and youthful again!',
      videoCover: '/images/bustmax-xl-video-cover.png',
      videoDescription: '💃 Don\'t just read — see real women sharing their beautiful transformation stories!',
      
      // Real Results Section
      beforeAfterTitle: '💃 Real Results, Real Women',
      beforeAfterSubtitle: 'Thousands of satisfied women are loving their new confidence with Bustmax XL!',
      resultsAccuracy: [
        '💗 Noticeable lift and tightness in 2–3 weeks',
        '💗 Softer and smoother skin',
        '💗 Fuller, rounder shape in 4–6 weeks',
        '💗 Safe for post-breastfeeding use'
      ],
      resultsQuotes: [
        {
          text: '"I noticed visible firmness in just 15 days — it really works!"',
          author: 'Ayesha, Lahore'
        },
        {
          text: '"After weight loss, Bustmax XL helped me restore natural curves again!"',
          author: 'Rimsha, Islamabad'
        }
      ],
      resultsRating: '⭐ 4.9/5 Rating (Based on 1000+ Verified Users)',
      
      // Herbal Power Section
      herbalSection: {
        title: '🌿 Herbal Power – Key Natural Ingredients',
        subtitle: 'Premium natural herbs scientifically proven for breast health and hormonal balance',
        showIngredients: true,
        customColumns: [
          {
            title: '🌾 Fenugreek Extract (Methi Dana)',
            description: 'Stimulates breast tissue growth and supports natural hormonal activity.',
            points: []
          },
          {
            title: '🌸 Fennel Seed Extract (Saunf)',
            description: 'Contains phytoestrogens that balance female hormones and enhance fullness.',
            points: []
          },
          {
            title: '🌱 Pueraria Mirifica',
            description: 'Known for its natural estrogenic properties — restores firmness & improves lift.',
            points: []
          },
          {
            title: '🍠 Wild Yam Extract',
            description: 'Regulates hormones, supports breast tissue health, and prevents sagging.',
            points: []
          },
          {
            title: '🌿 Shatavari (Asparagus Racemosus)',
            description: 'Boosts female vitality and enhances skin elasticity.',
            points: []
          },
          {
            title: '🌼 Dong Quai Root',
            description: 'Improves blood circulation and nourishes breast tissues for better tone.',
            points: []
          },
          {
            title: '🌳 Moringa Leaf Powder',
            description: 'Provides essential vitamins and nutrients for strong and healthy tissue structure.',
            points: []
          }
        ],
        badgesLine: '✅ 100% Natural | ✅ Hormone-Friendly | ✅ Safe & Effective'
      },
      
      // Special Benefits
      benefitsTitle: '🌟 Special Benefits of Bustmax XL',
      benefitsList: [
        '✅ Restores natural B-shape & lift',
        '✅ Tightens & tones skin tissues',
        '✅ Boosts hormonal balance naturally',
        '✅ Reduces sagging and dullness',
        '✅ Enhances skin glow & elasticity',
        '✅ 100% herbal, safe, and hormone-friendly'
      ],
      
      // Dosage & Usage Instructions
      dosageSection: {
        title: '🕒 Dosage & Usage Instructions',
        steps: [
          {
            stepNumber: '1️⃣',
            title: 'Take 1 teaspoon (≈5g) of Bustmax XL powder',
            description: 'After breakfast'
          },
          {
            stepNumber: '2️⃣',
            title: 'Take 1 teaspoon again',
            description: 'After dinner'
          },
          {
            stepNumber: '3️⃣',
            title: 'Mix with lukewarm milk or water',
            description: 'Twice daily'
          },
          {
            stepNumber: '4️⃣',
            title: 'Use regularly for 30–45 days',
            description: 'For visible results'
          }
        ],
        notes: [
          '💡 Light massage or gentle exercise helps boost results naturally.',
          '⚠️ Avoid oily food, soft drinks, and late-night meals.'
        ]
      },
      
      // Affordable Packages
      pricing: {
        title: '📦 Affordable Packages',
        subtitle: 'Choose the perfect package for your breast health journey',
        packages: [
          {
            title: '1 Pack',
            headerTitle: '1 Pack (30 Days)',
            price: 3000,
            features: [
              '250g (Powder Form)',
              'Standard',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '2 Packs',
            headerTitle: '2 Packs (60 Days)',
            price: 5500,
            saveAmount: 500,
            features: [
              '500g (Powder Form)',
              'Save Rs. 500',
              'Free Delivery',
              'Cash on Delivery'
            ]
          },
          {
            title: '3 Packs',
            headerTitle: '3 Packs (90 Days)',
            price: 8000,
            saveAmount: 1000,
            features: [
              '750g (Powder Form)',
              'Best Value - Save Rs. 1,000',
              'Free Delivery',
              'Cash on Delivery'
            ],
            recommended: true
          }
        ],
        shelfLife: '📦 Shelf Life: 3 Years',
        madeIn: '🌿 Made by The Planner Herbal Int., Pakistan'
      },
      
      // Results Timeline
      resultsTimeline: {
        title: '💡 Results You Can Expect',
        timeline: [
          { duration: '2–3 Weeks', change: 'Noticeable firmness & tone' },
          { duration: '4–6 Weeks', change: 'Lift, shape & elasticity improve' },
          { duration: '8–10 Weeks', change: 'Natural B-shape maintained' },
          { duration: 'Regular Use', change: 'Balanced hormones & lasting results' }
        ]
      },
      
      // Testimonials Section
      testimonialsTitle: '💬 What Our Customers Say',
      testimonialsDescription: '⭐ Trusted by Women Nationwide | 🩷 100% Herbal Formula – No Chemicals, No Hormones',
      testimonials: [
        {
          id: 1,
          name: 'Hira',
          age: 29,
          location: 'Karachi',
          rating: 5,
          text: 'My confidence is back! Bustmax XL gave me natural lift and tone.',
          image: 'https://i.pravatar.cc/150?img=1'
        },
        {
          id: 2,
          name: 'Minaal',
          age: 31,
          location: 'Multan',
          rating: 5,
          text: 'Best herbal solution, results start in 2 weeks.',
          image: 'https://i.pravatar.cc/150?img=5'
        },
        {
          id: 3,
          name: 'Sadia',
          age: 27,
          location: 'Hyderabad',
          rating: 5,
          text: 'Totally safe and effective — loved it!',
          image: 'https://i.pravatar.cc/150?img=9'
        }
      ],
      
      // FAQs
      faqTitle: '❓ Frequently Asked Questions (FAQs)',
      faqSubtitle: 'Everything you need to know about Bustmax XL',
      faqs: [
        {
          question: 'Q1: What is Bustmax XL used for?',
          answer: '➡️ For breast firming, shape enhancement, and hormonal balance.'
        },
        {
          question: 'Q2: When will I start seeing results?',
          answer: '➡️ Within 2–3 weeks you\'ll feel visible tightness and lift.'
        },
        {
          question: 'Q3: Is it safe for all women?',
          answer: '➡️ 100% herbal — safe for all women above 18 years.'
        },
        {
          question: 'Q4: Can it be used after breastfeeding or weight loss?',
          answer: '➡️ Yes! Perfect for restoring firmness and shape.'
        },
        {
          question: 'Q5: Does it increase size?',
          answer: '➡️ Focuses on firmness, but enhances fullness through hormonal support.'
        },
        {
          question: 'Q6: Any side effects?',
          answer: '➡️ None — it\'s chemical-free and made from natural herbs only.'
        },
        {
          question: 'Q7: How long should I use it?',
          answer: '➡️ Minimum 30–45 days for visible results; 90 days for full course.'
        },
        {
          question: 'Q8: Can teenagers or older women use it?',
          answer: '➡️ Yes, recommended for 18+ and even beneficial post-menopause.'
        },
        {
          question: 'Q9: Can I combine it with other herbal products?',
          answer: '➡️ Yes, safe to use with other Planner Herbal supplements.'
        }
      ],
      
      // Urdu Translation
      i18n: {
        ur: {
          problemsTitle: '💢 عام مسائل جن کا خواتین کو سامنا ہے',
          problemsSubtitle: 'Bustmax XL قدرتی طور پر توازن، مضبوطی اور B-شکل کا اعتماد بحال کرتا ہے بغیر مصنوعی ہارمونز کے۔',
          problemsList: [
            'دودھ پلانے یا عمر بڑھنے کے بعد ڈھیلا پن یا بے شکل سینہ',
            'ہارمونل عدم توازن جو مضبوطی کو متاثر کرتا ہے',
            'کمزور جلد کی لچک اور خراب ٹون',
            'قدرتی لفٹ اور گولائی کی کمی',
            'پھیکا، غیر مساوی سینے کی ساخت'
          ],
          solution: 'Bustmax XL قدرتی طور پر توازن، مضبوطی اور B-شکل کا اعتماد بحال کرتا ہے بغیر مصنوعی ہارمونز کے۔ ◄',
          herbalSection: {
            title: '🌿 جڑی بوٹیوں کی طاقت – کلیدی قدرتی اجزاء',
            subtitle: 'چھاتی کی صحت اور ہارمونل توازن کے لیے سائنسی طور پر ثابت شدہ قدرتی جڑی بوٹیاں',
            customColumns: [
              {
                title: '🌾 میتھی کا عرق (Fenugreek Extract)',
                description: 'چھاتی کے ٹشو کی نشوونما کو متحرک کرتا ہے اور قدرتی ہارمونل سرگرمی کو سپورٹ کرتا ہے۔'
              },
              {
                title: '🌸 سونف کا عرق (Fennel Seed Extract)',
                description: 'فائٹو ایسٹروجن پر مشتمل ہے جو خواتین کے ہارمونز کو متوازن کرتا ہے اور بھرپن بڑھاتا ہے۔'
              },
              {
                title: '🌱 پیوریریا میریفیکا (Pueraria Mirifica)',
                description: 'قدرتی ایسٹروجینک خصوصیات کے لیے مشہور — مضبوطی بحال کرتا ہے اور لفٹ بہتر بناتا ہے۔'
              },
              {
                title: '🍠 جنگلی یام کا عرق (Wild Yam Extract)',
                description: 'ہارمونز کو منظم کرتا ہے، چھاتی کے ٹشو کی صحت کو سپورٹ کرتا ہے، اور ڈھیلا پن روکتا ہے۔'
              },
              {
                title: '🌿 شتاوری (Asparagus Racemosus)',
                description: 'خواتین کی توانائی بڑھاتا ہے اور جلد کی لچک میں اضافہ کرتا ہے۔'
              },
              {
                title: '🌼 ڈونگ کوائی جڑ (Dong Quai Root)',
                description: 'خون کی گردش بہتر بناتا ہے اور بہتر ٹون کے لیے چھاتی کے ٹشو کو غذائیت فراہم کرتا ہے۔'
              },
              {
                title: '🌳 مورنگا کے پتوں کا پاؤڈر (Moringa Leaf Powder)',
                description: 'مضبوط اور صحت مند ٹشو کی ساخت کے لیے ضروری وٹامنز اور غذائی اجزاء فراہم کرتا ہے۔'
              }
            ],
            badgesLine: '✅ 100% قدرتی | ✅ ہارمون دوست | ✅ محفوظ اور موثر'
          },
          benefitsTitle: '🌟 Bustmax XL کے خصوصی فوائد',
          benefitsList: [
            '✅ قدرتی B-شکل اور لفٹ بحال کرتا ہے',
            '✅ جلد کے ٹشو کو سخت اور ٹون کرتا ہے',
            '✅ قدرتی طور پر ہارمونل توازن بڑھاتا ہے',
            '✅ ڈھیلا پن اور پھیکا پن کم کرتا ہے',
            '✅ جلد کی چمک اور لچک میں اضافہ کرتا ہے',
            '✅ 100% جڑی بوٹیوں سے، محفوظ، اور ہارمون دوست'
          ]
        }
      }
    },

  };

  // Build page content from translations + product-specific overrides
  const content = useMemo(() => {
    const base = language === 'ur' ? urduContent : englishContent;
    const product = productConfigs[slug] || {};
    const ur = product?.i18n?.ur || {};
    // Use product-specific Urdu overrides when available
    const isProductUrdu = language === 'ur' && !!product?.i18n?.ur;
    const forcePricingEnglish = slug === 'slim-n-shape-garcinia-cambogia-capsules' || slug === 'b-maxtime-super-active';

    return {
      ...base,
      hero: {
        ...base.hero,
        title: product.title || base.hero.title,
        subtitle: product.subtitle || base.hero.subtitle,
        badge: product.badge || base.hero.badge,
        features: product.features || base.hero.features,
        specialPriceAmount: product.specialPriceAmount || base.hero.specialPriceAmount || '2,500'
      },
      problems: {
        ...base.problems,
        title: isProductUrdu ? (ur?.problemsTitle || base.problems.title) : (product.problemsTitle || base.problems.title),
        subtitle: isProductUrdu ? (ur?.problemsSubtitle || base.problems.subtitle) : (product.problemsSubtitle || base.problems.subtitle),
        list: isProductUrdu ? (ur?.problemsList || base.problems.list) : (product.problemsList || base.problems.list),
        solution: isProductUrdu ? (ur?.solution || product.solution || base.problems.solution) : (product.solution || base.problems.solution)
      },
      benefits: {
        ...base.benefits,
        title: isProductUrdu ? (ur?.benefitsTitle || base.benefits.title) : (product.benefitsTitle || base.benefits.title),
        list: isProductUrdu ? (ur?.benefitsList || base.benefits.list) : (product.benefitsList || base.benefits.list)
      },
      usage: {
        ...base.usage,
        title: isProductUrdu ? (ur?.usage?.title || base.usage.title) : (product.usage?.title || base.usage.title),
        dosage: {
          ...base.usage.dosage,
          ...(isProductUrdu ? (ur?.usage?.dosage || {}) : (product.usage?.dosage || {}))
        },
        course: {
          ...base.usage.course,
          ...(isProductUrdu ? (ur?.usage?.course || {}) : (product.usage?.course || {}))
        },
        best: {
          ...base.usage.best,
          ...(isProductUrdu ? (ur?.usage?.best || {}) : (product.usage?.best || {}))
        }
      },
      pricing: forcePricingEnglish
        ? {
          ...englishContent.pricing,
          title: product.pricing?.title || englishContent.pricing.title,
          subtitle: product.pricing?.subtitle || englishContent.pricing.subtitle,
          popular: product.pricing?.popular || englishContent.pricing.popular,
          save: product.pricing?.save || englishContent.pricing.save,
          packages: product.pricing?.packages || englishContent.pricing.packages
        }
        : {
          ...base.pricing,
          title: isProductUrdu ? (ur?.pricing?.title || base.pricing.title) : (product.pricing?.title || base.pricing.title),
          subtitle: isProductUrdu ? (ur?.pricing?.subtitle || base.pricing.subtitle) : (product.pricing?.subtitle || base.pricing.subtitle),
          popular: isProductUrdu ? (ur?.pricing?.popular || base.pricing.popular) : (product.pricing?.popular || base.pricing.popular),
          save: isProductUrdu ? (ur?.pricing?.save || base.pricing.save) : (product.pricing?.save || base.pricing.save),
          packages: isProductUrdu
            ? (
              (ur?.pricing?.packages
                ? ur.pricing.packages.map((pkg, idx) => ({
                  ...pkg,
                  features: pkg.features || base?.pricing?.packages?.[idx]?.features || []
                }))
                : (product.pricing?.packages || base.pricing.packages))
            )
            : (product.pricing?.packages || base.pricing.packages)
        }

    };
  }, [language, slug]);

  useEffect(() => {
    // Update page title based on current product
    if (slug && productConfigs[slug]) {
      const productTitle = productConfigs[slug].title;
      document.title = `${productTitle} | The Planner Herbal International`;

      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `${productTitle} - Premium herbal solution from The Planner Herbal International. 100% natural ingredients, free delivery across Pakistan.`);
      }

      // Update Open Graph title
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${productTitle} | The Planner Herbal International`);
      }

      // Update Twitter title
      const twitterTitle = document.querySelector('meta[property="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${productTitle} | The Planner Herbal International`);
      }
    }

    // Check if cookies are accepted
    const consent = localStorage.getItem('cookie_consent') === 'true';
    setCookiesAccepted(consent);

    // Initialize language from localStorage
    const storedLang = localStorage.getItem('tph_lang');
    if (storedLang === 'en' || storedLang === 'ur') {
      setLanguage(storedLang);
    }

    // Listen for global language toggle requests
    const onToggle = () => {
      setLanguage((prev) => (prev === 'en' ? 'ur' : 'en'));
    };
    window.addEventListener('tph:toggleLanguage', onToggle);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show/hide back to top button
      setShowScrollTop(currentScrollY > 500);

      // Hide header on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('tph:toggleLanguage', onToggle);
    };
  }, [lastScrollY, slug]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppOrder = () => {
    // Get current product title or fallback to default
    const productTitle = productConfigs[slug]?.title || 'Product';
    const message = `I would like to order ${productTitle}.

Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
City: ${formData.city}
Quantity: ${formData.quantity} ${slug === 'slim-n-shape-tea' ? (formData.quantity === '1' ? 'Pack' : 'Packs') : (slug === 'slim-n-shape-garcinia-cambogia-capsules' ? (formData.quantity === '1' ? 'Month Pack' : 'Months Pack') : (slug === 'b-maxtime-super-active' ? (formData.quantity === '1' ? 'Pack' : 'Packs') : (slug === 'shahi-sultan-health-booster' ? (formData.quantity === '1' ? 'Pack' : 'Packs') : (slug === 'sultan-shahi-gold-majoon' ? (formData.quantity === '1' ? 'Pack' : 'Packs') : (formData.quantity > 1 ? 'bottles' : 'bottle')))))}
Total: Rs ${calculatePrice(formData.quantity)}/-

Please confirm my order. Thank you!`;

    const whatsappUrl = `https://wa.me/923328888935?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const calculatePrice = (quantity) => {
    const qty = parseInt(quantity);
    // Use product-specific pricing for Slim n Shape Tea page only
    if (slug === 'slim-n-shape-tea') {
      // Force EN pricing for tea
      const productPricing = productConfigs['slim-n-shape-tea']?.pricing?.packages;
      const price = productPricing?.[qty - 1]?.price;
      if (price) return price;
    }
    // Use product-specific pricing for Shahi Sultan Health Booster
    if (slug === 'shahi-sultan-health-booster') {
      const productPricing = productConfigs['shahi-sultan-health-booster']?.pricing?.packages;
      const price = productPricing?.[qty - 1]?.price;
      if (price) return price;
    }
    // Use product-specific pricing for B-Maxtime Super Active
    if (slug === 'b-maxtime-super-active') {
      if (qty === 1) return 1200;
      if (qty === 2) return 2000;
      if (qty === 3) return 3000;
      return qty * 1200;
    }
    // Use product-specific pricing for Sultan Shahi Gold Majoon
    if (slug === 'sultan-shahi-gold-majoon') {
      const productPricing = productConfigs['sultan-shahi-gold-majoon']?.pricing?.packages;
      const price = productPricing?.[qty - 1]?.price;
      if (price) return price;
    }
    // Use product-specific pricing for Sultan Shahi Gold Health Booster
    if (slug === 'sultan-shahi-gold-health-booster') {
      if (qty === 1) return 6000;
      if (qty === 2) return 11000;
      if (qty === 3) return 16000;
      return qty * 6000;
    }
    // Use product-specific pricing for Malika Shahi Gold Health Booster
    if (slug === 'malika-shahi-gold-health-booster') {
      const productPricing = productConfigs['malika-shahi-gold-health-booster']?.pricing?.packages;
      const price = productPricing?.[qty - 1]?.price;
      if (price) return price;
    }
    // Default pricing (other products)
    if (qty === 1) return 2500;
    if (qty === 2) return 4500;
    if (qty === 3) return 6000;
    return qty * 2500; // fallback for other quantities
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ur' : 'en');
  };

  // Persist language changes and notify listeners
  useEffect(() => {
    try {
      localStorage.setItem('tph_lang', language);
    } catch (e) {
      // localStorage may be unavailable (e.g., privacy mode); fail gracefully
      console.warn('Unable to persist language to localStorage:', e);
    }
    window.dispatchEvent(new CustomEvent('tph:lang-changed', { detail: language }));
  }, [language]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6 }
  };

  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Ahmed K.",
      age: 42,
      text: "After 3 weeks of using B-Maxman, my energy levels and confidence have completely transformed. My wife has noticed the difference too!",
      rating: 5,
      location: "Karachi"
    },
    {
      id: 2,
      name: "Fahad M.",
      age: 38,
      text: "I tried many products before, but B-Maxman is the only one that actually delivered results. Highly recommended for any man over 35.",
      rating: 5,
      location: "Lahore"
    },
    {
      id: 3,
      name: "Usman R.",
      age: 45,
      text: "The natural ingredients made me feel comfortable trying it. After 2 months, I feel like I'm in my 20s again. Thank you!",
      rating: 5,
      location: "Islamabad"
    }
  ];

  // This function determines if a section should be displayed in Urdu
  const shouldShowInUrdu = (sectionName) => {
    const urduSections = ['problems', 'ingredients', 'benefits', 'usage'];
    return language === 'ur' && urduSections.includes(sectionName);
  };

  // Check if this is Sultan Shahi Gold Majoon, Sultan Shahi Gold Tila, or Sultan Shahi Gold Health Booster product for luxury theme
  const isLuxuryProduct = slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' || slug === 'sultan-shahi-gold-health-booster';
  const isBustMaxOil = slug === 'bustmax-breast-oil';

  return (
    <div className={`min-h-screen flex flex-col ${isBustMaxOil ? 'bg-gradient-to-br from-pink-950 via-rose-950 to-amber-950 text-white' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-br from-purple-950 to-black text-white' : isLuxuryProduct ? 'bg-black text-white' : 'bg-gradient-to-br from-red-50 via-white to-red-50'} ${shouldShowInUrdu('all') ? 'font-urdu' : ''}`}>
      <div className="flex-grow">
        {/* Header moved to Root layout */}

        {/* Hero Section - Optimized */}
        <section className={`py-8 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-r from-pink-900 via-rose-800 to-amber-900' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-purple-950 via-pink-900 to-purple-950' : isLuxuryProduct ? 'bg-gradient-to-r from-gray-900 to-black' : 'bg-gradient-to-r from-red-600 to-red-700'} text-white overflow-hidden relative`}>
          {/* Background pattern */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-pattern"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <motion.div className="lg:w-1/2" {...fadeInUp}>
                <div className="flex items-center space-x-2 mb-4">
                  <SafeIcon icon={FiAward} className="text-yellow-400 text-2xl" />
                  <span className={`${isBustMaxOil ? 'bg-gradient-to-r from-amber-400 to-pink-500 text-white' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-yellow-400 text-red-800'} px-3 py-1 rounded-full text-sm font-bold`}>
                    {content.hero.badge}
                  </span>
                </div>
                <h1 className={`text-3xl md:text-5xl font-bold mb-6 leading-tight ${isBustMaxOil ? 'text-amber-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-yellow-400'}`}>
                  {content.hero.title}
                </h1>
                <p className={`text-xl md:text-2xl mb-4 ${isBustMaxOil ? 'text-pink-200' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200' : isLuxuryProduct ? 'text-yellow-200' : 'text-red-100'}`}>
                  {content.hero.subtitle}
                </p>
                {content.hero.description && (
                  <p className={`text-base md:text-lg mb-6 leading-relaxed ${isBustMaxOil ? 'text-pink-100' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-100' : isLuxuryProduct ? 'text-gray-300' : 'text-red-50'}`}>
                    {content.hero.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-4 mb-6 text-lg">
                  {content.hero.features.map((feature, index) => (
                    <span key={index} className={`${isBustMaxOil ? 'bg-amber-500/20 border border-amber-400/30' : slug === 'malika-shahi-gold-health-booster' ? 'bg-pink-500/20 border border-pink-400/30' : isLuxuryProduct ? 'bg-yellow-400/20 border border-yellow-400/30' : 'bg-white/20'} px-4 py-2 rounded-full`}>{feature}</span>
                  ))}
                </div>
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="text-yellow-400 text-2xl fill-current" />
                  ))}
                  <span className="ml-2 text-lg">{content.hero.trusted}</span>
                </div>
                <motion.div
                  className={`${isBustMaxOil ? 'bg-amber-500/10 border border-amber-400/20' : slug === 'malika-shahi-gold-health-booster' ? 'bg-pink-500/10 border border-pink-400/20' : isLuxuryProduct ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-white/10 border border-white/10'} p-6 rounded-lg backdrop-blur-sm`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className={`text-2xl md:text-3xl font-bold ${isBustMaxOil ? 'text-amber-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-yellow-400'} mb-2`}>
                    {content.hero.specialPrice}: Rs {content.hero.specialPriceAmount || '2,500'}/-
                  </p>
                  <p className={`${isBustMaxOil ? 'text-pink-200' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200' : isLuxuryProduct ? 'text-yellow-200' : 'text-red-100'}`}>{content.hero.delivery}</p>
                  <motion.button
                    onClick={() => document.getElementById('order-form').scrollIntoView({ behavior: 'smooth' })}
                    className={`mt-4 ${isBustMaxOil ? 'bg-gradient-to-r from-amber-500 to-pink-600 hover:from-amber-600 hover:to-pink-700' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700' : isLuxuryProduct ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-3 text-lg transition-colors w-full`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiShoppingCart} className="text-xl" />
                    <span>Order Now</span>
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative">
                  {/* Hero graphic with abstract shapes */}
                  <div className="relative mx-auto max-w-md">
                    {/* Decorative elements */}
                    <motion.div
                      className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-30 blur-xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-400 rounded-full opacity-30 blur-xl"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3]
                      }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />

                    {/* Main content card */}
                    <div className={`${isLuxuryProduct ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-white/10 border border-white/10'} backdrop-blur-sm p-8 rounded-2xl shadow-xl`}>
                      {/* Product Image */}
                      <div className="flex justify-center">
                        <img
                          src={productConfigs[slug]?.heroImage || "https://i.ibb.co/gLX3dwfM/B-Maxman-Royal-Special-Treatment.png"}
                          alt={productConfigs[slug]?.title || "B-Maxman Royal Special Treatment"}
                          title={productConfigs[slug]?.title || "B-Maxman Royal Special Treatment"}
                          className="max-w-full h-auto rounded shadow-md"
                          loading="eager"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* About Product Section - Only for products with aboutProduct config */}
        {content.aboutProduct && (
          <section className={`py-12 md:py-16 ${isLuxuryProduct ? 'bg-black' : 'bg-white'}`}>
            <div className="container mx-auto px-4">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto"
              >
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-900'}`}>
                  {content.aboutProduct.title}
                </h2>
                <p className={`text-base md:text-lg leading-relaxed mb-8 ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                  {content.aboutProduct.description}
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {content.aboutProduct.keyFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={`flex items-start gap-3 p-4 rounded-lg ${isLuxuryProduct ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-gray-50 border border-gray-200'}`}
                    >
                      <span className="text-2xl flex-shrink-0">{feature.split(' ')[0]}</span>
                      <p className={`${isLuxuryProduct ? 'text-gray-200' : 'text-gray-800'} font-medium`}>
                        {feature.substring(feature.indexOf(' ') + 1)}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Problems Section */}
        <section
          className={`py-12 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-br from-rose-950 to-amber-950' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-br from-purple-950 to-black' : isLuxuryProduct ? 'bg-gray-900' : 'bg-gray-50'} ${shouldShowInUrdu('problems') ? 'font-urdu' : ''}`}
          dir={shouldShowInUrdu('problems') ? 'rtl' : 'ltr'}
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className={`text-3xl md:text-4xl font-bold ${isBustMaxOil ? 'text-amber-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'} mb-4`}>
                {content.problems.title}
              </h2>
              <p className={`text-xl ${isBustMaxOil ? 'text-pink-200' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200' : isLuxuryProduct ? 'text-yellow-200' : 'text-gray-600'} max-w-3xl mx-auto`}>
                {content.problems.subtitle}
              </p>
            </motion.div>

{/* Special layout for Sultan Shahi Gold Majoon with center image */}
            {slug === 'sultan-shahi-gold-majoon' && productConfigs[slug]?.problemsImage ? (
              <div className="grid lg:grid-cols-3 gap-8 items-center">
                {/* Left side problems */}
                <div className="space-y-4">
                  {content.problems.list.slice(0, 3).map((problem, index) => (
                    <motion.div
                      key={index}
                      className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiZap} className="text-yellow-400 text-lg flex-shrink-0" />
                        <p className="font-semibold text-white text-sm">{problem}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Center image */}
                <div className="flex justify-center">
                  <motion.img
                    src={productConfigs[slug].problemsImage}
                    alt="Common Problems Men Face Today"
                    className="max-w-full h-auto rounded-lg shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  />
                </div>

                {/* Right side problems */}
                <div className="space-y-4">
                  {content.problems.list.slice(3, 6).map((problem, index) => (
                    <motion.div
                      key={index + 3}
                      className="bg-gray-800 border-l-4 border-yellow-400 p-4 rounded-lg shadow-lg"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <SafeIcon icon={FiZap} className="text-yellow-400 text-lg flex-shrink-0" />
                        <p className="font-semibold text-white text-sm">{problem}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Default layout for other products */
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.problems.list.map((problem, index) => (
                  <motion.div
                    key={index}
                    className={`${slug === 'malika-shahi-gold-health-booster' ? 'bg-purple-900/50 border-l-4 border-pink-400' : isLuxuryProduct ? 'bg-gray-800 border-l-4 border-yellow-400' : 'bg-white border-l-4 border-red-500'} p-6 rounded-lg shadow-lg`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <SafeIcon icon={FiZap} className={`${slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-red-500'} text-xl flex-shrink-0`} />
                      <p className={`font-semibold ${slug === 'malika-shahi-gold-health-booster' ? 'text-pink-100' : isLuxuryProduct ? 'text-white' : 'text-gray-800'}`}>{problem}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <p className={`text-2xl font-bold ${slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-red-600'}`}>{content.problems.solution}</p>
            </motion.div>
          </div>
        </section>

        {/* Video Section - Lazy Loaded with Cookie Consent */}
        <Suspense fallback={<LoadingFallback />}>
          <VideoSection
            videoId={productConfigs[slug]?.videoId || 'hakc6mR7VL4'}
            title={productConfigs[slug]?.videoTitle}
            subtitle={productConfigs[slug]?.videoSubtitle}
            coverImage={productConfigs[slug]?.videoCover}
            videoTitle={productConfigs[slug]?.videoIframeTitle}
          />
        </Suspense>

        

        {/* Before & After Results - Always in English - Lazy Loaded */}
        <section className={`py-12 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-br from-pink-950 to-purple-950' : isLuxuryProduct ? 'bg-gradient-to-br from-black to-gray-900' : 'bg-gradient-to-br from-gray-900 to-gray-800'} text-white`}>
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-white'}`}>
                {productConfigs[slug]?.beforeAfterTitle || englishContent.beforeAfter.title}
              </h2>
              <p className={`text-lg ${isBustMaxOil ? 'text-pink-200' : isLuxuryProduct ? 'text-yellow-200' : 'text-gray-300'} max-w-3xl mx-auto`}>
                {productConfigs[slug]?.beforeAfterSubtitle || englishContent.beforeAfter.subtitle}
              </p>
            </motion.div>
            <Suspense fallback={<LoadingFallback />}>
              <BeforeAfterSlider
                sets={productConfigs[slug]?.beforeAfterSets}
                labels={productConfigs[slug]?.beforeAfterLabels}
              />
            </Suspense>
          </div>
        </section>

        {/* Sultan Shahi Gold Health Booster – Ingredients Grid */}
        {slug === 'sultan-shahi-gold-health-booster' && (
          <section className={`py-12 md:py-16 ${isLuxuryProduct ? 'bg-gray-900' : 'bg-white'} ${language === 'ur' ? 'font-urdu' : ''}`} dir={language === 'ur' ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-900'}`}>
                  {language === 'ur'
                    ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.title || 'جڑی بوٹیوں کی طاقت۔ سائنس سے ثابت شدہ۔')
                    : (productConfigs[slug]?.herbalSection?.title || '🌿 Herbal Power. Backed by Science')}
                </h2>
                <p className={`text-lg md:text-xl mb-4 max-w-3xl mx-auto ${isLuxuryProduct ? 'text-yellow-200' : 'text-gray-600'}`}>
                  {language === 'ur'
                    ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.subtitle || '')
                    : (productConfigs[slug]?.herbalSection?.subtitle || '')}
                </p>
                <p className={`text-sm md:text-base ${isLuxuryProduct ? 'text-gray-400' : 'text-gray-500'}`}>
                  {language === 'ur'
                    ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.badgesLine || '')
                    : (productConfigs[slug]?.herbalSection?.badgesLine || '')}
                </p>
              </div>
              {/* First row: 3 ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {(language === 'ur'
                  ? (productConfigs[slug]?.i18n?.ur?.ingredients || [])
                  : (productConfigs[slug]?.ingredients || [])
                ).slice(0, 3).map((ing, idx) => (
                  <div key={`sshb-ing-top-${idx}`} className={`${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6 text-center`}>
                    <img
                      src={ing.image}
                      alt={ing.name}
                      title={ing.name}
                      className="h-24 w-auto mx-auto object-contain mb-3"
                      loading="lazy"
                    />
                    <h3 className={`text-lg font-semibold ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'} mb-1`}>{ing.name}</h3>
                    <p className={`${isLuxuryProduct ? 'text-yellow-200' : 'text-gray-600'} text-sm leading-relaxed`}>{ing.description}</p>
                  </div>
                ))}
              </div>
              {/* Second row: 4 ingredients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                {(language === 'ur'
                  ? (productConfigs[slug]?.i18n?.ur?.ingredients || [])
                  : (productConfigs[slug]?.ingredients || [])
                ).slice(3, 7).map((ing, idx) => (
                  <div key={`sshb-ing-bot-${idx}`} className={`${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white border border-gray-100'} rounded-xl shadow-lg p-6 text-center`}>
                    <img
                      src={ing.image}
                      alt={ing.name}
                      title={ing.name}
                      className="h-24 w-auto mx-auto object-contain mb-3"
                      loading="lazy"
                    />
                    <h3 className={`text-lg font-semibold ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'} mb-1`}>{ing.name}</h3>
                    <p className={`${isLuxuryProduct ? 'text-yellow-200' : 'text-gray-600'} text-sm leading-relaxed`}>{ing.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Herbal Power Section - Lazy Loaded */}
        <Suspense fallback={<div className="py-10 text-center">{language === 'ur' ? 'لوڈ ہو رہا ہے…' : 'Loading…'}</div>}>
          {slug !== 'sultan-shahi-gold-health-booster' && (
            <HerbalPowerSection
              language={language}
              title={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.title) : (productConfigs[slug]?.herbalSection?.title)}
              subtitle={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.subtitle) : (productConfigs[slug]?.herbalSection?.subtitle)}
              bullets={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.bullets) : (productConfigs[slug]?.herbalSection?.bullets)}
              badgesLine={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection
                ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.badgesLine)
                : (productConfigs[slug]?.herbalSection?.badgesLine)}
              badgesLanguage={slug === 'slim-n-shape-garcinia-cambogia-capsules' ? 'en' : undefined}
              showIngredients={productConfigs[slug]?.herbalSection?.showIngredients}
              ingredients={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection?.ingredients ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.ingredients) : (productConfigs[slug]?.herbalSection?.ingredients)}
              customColumns={language === 'ur' && productConfigs[slug]?.i18n?.ur?.herbalSection ? (productConfigs[slug]?.i18n?.ur?.herbalSection?.customColumns) : (productConfigs[slug]?.herbalSection?.customColumns)}
              customColumnsGridClass={productConfigs[slug]?.herbalSection?.customColumnsGridClass}
              oneRowLayout={slug === 'b-maxman-royal-special-treatment'}
              twoColumnLayout={productConfigs[slug]?.herbalSection?.twoColumnLayout}
              threeByThreeLayout={slug === 'sultan-shahi-gold-tila'}
              bigImage={productConfigs[slug]?.herbalSection?.bigImage}
            />
          )}
        </Suspense>

        {/* Benefits Section */}
        <section
          className={`py-12 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-br from-purple-950 via-pink-950 to-amber-950' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-br from-purple-950 via-pink-950 to-purple-950' : isLuxuryProduct ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} ${shouldShowInUrdu('benefits') ? 'font-urdu' : ''}`}
          dir={shouldShowInUrdu('benefits') ? 'rtl' : 'ltr'}
          aria-labelledby="benefits-section"
          role="region"
        >
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2
                className={`text-3xl md:text-4xl font-bold ${isBustMaxOil ? 'text-amber-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'} mb-4`}
                id="benefits-section"
                title={language === 'en' ? "Expected results from B-Maxman Royal herbal supplement for men" : "بی میکس مین رائل جڑی بوٹیوں کے سپلیمنٹ سے متوقع نتائج"}
              >
                {content.benefits.title}
              </h2>
            </motion.div>

            {(['slim-n-shape-garcinia-cambogia-capsules', 'slim-n-shape-tea', 'b-maxtime-super-active'].includes(slug)) ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                {/* Left: Image 40% */}
                <div className="md:col-span-2">
                  <div className={`${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'} rounded-xl shadow-lg overflow-hidden`}>
                    <img
                      src={slug === 'slim-n-shape-tea'
                        ? (productConfigs[slug]?.benefitsImage || '/images/Slim n Shape Tea.png')
                        : (productConfigs[slug]?.benefitsImage)}
                      alt={content.benefits.title}
                      title={content.benefits.title}
                      className={`w-full object-contain p-6 ${(['slim-n-shape-garcinia-cambogia-capsules', 'slim-n-shape-tea'].includes(slug)) ? 'h-[520px] md:h-[560px]' : 'h-80'}`}
                      loading="lazy"
                    />
                  </div>
                </div>
                {/* Right: Text 60% */}
                <div className="md:col-span-3">
                  <div className="space-y-4">
                    {content.benefits.list.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className={`${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white border border-blue-100'} p-4 rounded-lg shadow`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className={`flex items-start ${shouldShowInUrdu('benefits') ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                          <SafeIcon icon={FiCheck} className={`${isLuxuryProduct ? 'text-yellow-400' : 'text-green-600'} text-xl mt-1 flex-shrink-0`} />
                          <p className={`${isLuxuryProduct ? 'text-yellow-200' : 'text-gray-800'} font-medium`}>
                            {typeof benefit === 'string' ? benefit : benefit.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.benefits.list.map((benefit, index) => (
                  <motion.article
                    key={index}
                    className={`${slug === 'malika-shahi-gold-health-booster' ? 'bg-purple-900/50 border border-pink-400/30' : isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'} p-6 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    role="article"
                    aria-labelledby={`benefit-${index}`}
                  >
                    {/* Image */}
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img
                        src={benefit.image}
                        alt={benefit.alt || (typeof benefit === 'string' ? benefit : benefit.text)}
                        title={benefit.title || (typeof benefit === 'string' ? benefit : benefit.text)}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="400"
                        height="192"
                      />
                    </div>

                    {/* Text Content */}
                    <div className={`flex items-start ${shouldShowInUrdu('benefits') ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                      <SafeIcon icon={FiCheck} className={`${slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-green-500'} text-xl mt-1 flex-shrink-0`} />
                      <h3
                        id={`benefit-${index}`}
                        className={`font-semibold ${slug === 'malika-shahi-gold-health-booster' ? 'text-pink-100' : isLuxuryProduct ? 'text-yellow-200' : 'text-gray-800'}`}
                        title={benefit.seoDescription || (typeof benefit === 'string' ? benefit : benefit.text)}
                      >
                        {typeof benefit === 'string' ? benefit : benefit.text}
                      </h3>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Testimonials - Always in English - Lazy Loaded */}
        <section className={`py-12 md:py-16 ${isLuxuryProduct ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gray-100'}`}>
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                {productConfigs[slug]?.testimonialsTitle || englishContent.testimonials.title}
              </h2>
              <p className={`text-xl max-w-3xl mx-auto ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-600'}`}>
                {productConfigs[slug]?.testimonialsSubtitle || englishContent.testimonials.subtitle}
              </p>
              {productConfigs[slug]?.testimonialsDescription && (
                <p className={`text-lg max-w-4xl mx-auto mt-4 ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                  {productConfigs[slug]?.testimonialsDescription}
                </p>
              )}
            </motion.div>
            <Suspense fallback={<LoadingFallback />}>
              <TestimonialSlider testimonials={productConfigs[slug]?.testimonials || testimonials} slug={slug} />
            </Suspense>
          </div>
        </section>

        {/* Usage Instructions - Step-by-Step for Slim n Shape Fit Booster, BustMax Oil, and Bustmax XL */}
        {(slug === 'slim-n-shape-fit-booster' || slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') && productConfigs[slug]?.dosageSection?.steps && (
          <section className={`py-12 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-b from-amber-950 to-pink-950' : 'bg-gradient-to-b from-gray-50 to-white'} ${shouldShowInUrdu('usage') ? 'font-urdu' : ''}`} dir={shouldShowInUrdu('usage') ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
              <div className="max-w-5xl mx-auto">
                {(() => {
                  const dosageData = (shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.dosageSection)
                    ? productConfigs[slug].i18n.ur.dosageSection
                    : productConfigs[slug].dosageSection;
                  
                  return (
                    <>
                      <motion.h2 
                        {...fadeInUp}
                        className={`text-3xl md:text-4xl font-bold text-center mb-4 ${isBustMaxOil ? 'text-amber-300' : 'text-gray-800'}`}
                      >
                        {dosageData.title}
                      </motion.h2>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
                        {dosageData.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            {...fadeInUp}
                            transition={{ delay: index * 0.1 }}
                            className={`${isBustMaxOil ? 'bg-pink-900/30 border-2 border-amber-500/30 hover:border-amber-400' : 'bg-white border-2 border-green-100 hover:border-green-300'} rounded-xl shadow-lg p-6 transition-all`}
                          >
                            <div className={`flex items-center justify-center w-16 h-16 ${isBustMaxOil ? 'bg-gradient-to-r from-amber-500 to-pink-600' : 'bg-green-500'} text-white rounded-full text-2xl font-bold mx-auto mb-4`}>
                              {index + 1}
                            </div>
                            <h3 className={`text-sm font-semibold ${isBustMaxOil ? 'text-amber-400' : 'text-green-600'} text-center mb-2`}>
                              {step.stepNumber}
                            </h3>
                            <h4 className={`text-lg font-bold ${isBustMaxOil ? 'text-pink-200' : 'text-gray-800'} text-center mb-3`}>
                              {step.title}
                            </h4>
                            <p className={`${isBustMaxOil ? 'text-pink-300' : 'text-gray-600'} text-center text-sm`}>
                              {step.description}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                      
                      {dosageData.notes && (
                        <motion.div 
                          {...fadeInUp}
                          className={`rounded-xl p-6 border-l-4 ${isBustMaxOil ? 'bg-gradient-to-r from-amber-900/20 to-pink-900/20 border-amber-500' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-500'}`}
                        >
                          <div className="space-y-3">
                            {dosageData.notes.map((note, index) => (
                              <p key={index} className={`text-base flex items-start ${isBustMaxOil ? 'text-pink-100' : 'text-gray-700'}`}>
                                <span className={shouldShowInUrdu('usage') ? 'mr-0 ml-2' : 'mr-2'}>{note}</span>
                              </p>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </section>
        )}

        {/* Usage Instructions - Custom for Sultan Shahi Gold Majoon, Sultan Shahi Gold Tila, and G-Max Passion */}
        {(slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila') && (
          <section className={`py-12 md:py-16 bg-gradient-to-b from-black to-gray-900 ${shouldShowInUrdu('usage') ? 'font-urdu' : ''}`} dir={shouldShowInUrdu('usage') ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
              {(() => {
                const d = (shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.dosageSection)
                  ? productConfigs[slug].i18n.ur.dosageSection
                  : (productConfigs[slug]?.dosageSection || {});
                const arrow = shouldShowInUrdu('usage') ? '👈' : '👉';
                return (
                  <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:gap-12">
                      {/* Image on left */}
                      <div className="md:w-1/2 mb-8 md:mb-0">
                        <motion.div {...fadeInLeft} className="rounded-lg overflow-hidden shadow-2xl">
                          <img 
                            src={d.image}
                            alt="Dosage & Usage Instructions" 
                            className="w-full h-auto object-cover"
                          />
                        </motion.div>
                      </div>
                      
                      {/* Content on right */}
                      <div className="md:w-1/2">
                        <motion.div {...fadeInRight}>
                          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-400">
                            {d.title}
                          </h2>
                          
                          <div className="space-y-6">
                            <div>
                              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{d?.content?.dosage?.title || 'Dosage'}</h3>
                              {d?.content?.dosage?.points ? (
                                <ul className={`text-gray-300 space-y-2 list-none ${shouldShowInUrdu('usage') ? 'text-right pr-5' : ''}`}>
                                  {d.content.dosage.points.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className={`${shouldShowInUrdu('usage') ? 'text-right' : ''} text-gray-300`}>{arrow} {d?.content?.dosage?.text}</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{d?.content?.duration?.title || 'Course Duration'}</h3>
                              {d?.content?.duration?.points ? (
                                <ul className={`text-gray-300 space-y-2 list-none ${shouldShowInUrdu('usage') ? 'text-right pr-5' : ''}`}>
                                  {d.content.duration.points.map((pt, i) => (
                                    <li key={i}>{pt}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className={`${shouldShowInUrdu('usage') ? 'text-right' : ''} text-gray-300`}>{arrow} {d?.content?.duration?.text}</p>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{d?.content?.bestResults?.title || 'Best Results'}</h3>
                              <ul className={`text-gray-300 space-y-2 ${shouldShowInUrdu('usage') ? 'text-right pr-5 list-none' : ''}`}>
                                {(d?.content?.bestResults?.points || []).map((pt, i) => (
                                  <li key={i}>{arrow} {pt}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </section>
        )}

        {!(slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' || slug === 'g-max-passion' || slug === 'slim-n-shape-fit-booster' || slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') && (
          <section className={`py-12 md:py-16 ${isLuxuryProduct ? 'bg-gray-900' : 'bg-yellow-50'}`}>
            <div className="container mx-auto px-4">
              <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                  {content.usage.title}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                    <SafeIcon icon={FiClock} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>{content.usage.dosage.title}</h3>
                    {(() => {
                      const parts = String(content?.usage?.dosage?.text || '').split('•').map(s => s.trim()).filter(Boolean);
                      const isUrdu = shouldShowInUrdu('usage');
                      return (
                        <ul className={`list-none ${isUrdu ? 'text-right' : 'text-left'} space-y-1 ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                          {parts.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                  <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                    <SafeIcon icon={FiShield} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-green-600'}`} />
                    <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>{content.usage.course.title}</h3>
                    <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>{content.usage.course.text}</p>
                  </div>
                  <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                    <SafeIcon icon={FiHeart} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-red-600'}`} />
                    <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>{content.usage.best.title}</h3>
                    <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>{content.usage.best.text}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {(slug === 'g-max-passion' && productConfigs[slug]?.usage) && (
          <section className={`py-12 md:py-16 ${isLuxuryProduct ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-yellow-50'} ${shouldShowInUrdu('usage') ? 'font-urdu' : ''}`} dir={shouldShowInUrdu('usage') ? 'rtl' : 'ltr'}>
            <div className="container mx-auto px-4">
              <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
                <h2 className={`text-3xl md:text-4xl font-bold text-center mb-8 ${isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                  {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.title 
                    ? productConfigs[slug].i18n.ur.usage.title 
                    : productConfigs[slug]?.usage?.title}
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Dosage */}
                  <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                    <SafeIcon icon={FiClock} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-red-600'}`} />
                    <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>
                      {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.dosage?.title
                        ? productConfigs[slug].i18n.ur.usage.dosage.title
                        : productConfigs[slug]?.usage?.dosage?.title}
                    </h3>
                    <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                      {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.dosage?.text
                        ? productConfigs[slug].i18n.ur.usage.dosage.text
                        : productConfigs[slug]?.usage?.dosage?.text}
                    </p>
                  </div>
                  {/* With */}
                  {productConfigs[slug]?.usage?.with && (
                    <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                      <SafeIcon icon={FiHeart} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-red-600'}`} />
                      <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.with?.title
                          ? productConfigs[slug].i18n.ur.usage.with.title
                          : productConfigs[slug]?.usage?.with?.title}
                      </h3>
                      <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.with?.text
                          ? productConfigs[slug].i18n.ur.usage.with.text
                          : productConfigs[slug]?.usage?.with?.text}
                      </p>
                    </div>
                  )}
                  {/* Timing */}
                  {productConfigs[slug]?.usage?.timing && (
                    <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                      <SafeIcon icon={FiClock} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-green-600'}`} />
                      <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.timing?.title
                          ? productConfigs[slug].i18n.ur.usage.timing.title
                          : productConfigs[slug]?.usage?.timing?.title}
                      </h3>
                      <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.timing?.text
                          ? productConfigs[slug].i18n.ur.usage.timing.text
                          : productConfigs[slug]?.usage?.timing?.text}
                      </p>
                    </div>
                  )}
                  {/* Course Duration */}
                  <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                    <SafeIcon icon={FiShield} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-green-600'}`} />
                    <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>
                      {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.course?.title
                        ? productConfigs[slug].i18n.ur.usage.course.title
                        : productConfigs[slug]?.usage?.course?.title}
                    </h3>
                    <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                      {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.course?.text
                        ? productConfigs[slug].i18n.ur.usage.course.text
                        : productConfigs[slug]?.usage?.course?.text}
                    </p>
                  </div>
                  {/* Note */}
                  {productConfigs[slug]?.usage?.note && (
                    <div className={`p-6 rounded-lg shadow-lg text-center ${isLuxuryProduct ? 'bg-gray-800 border border-yellow-400/20' : 'bg-white'}`}>
                      <SafeIcon icon={FiHeart} className={`text-4xl mx-auto mb-4 ${isLuxuryProduct ? 'text-yellow-400' : 'text-red-600'}`} />
                      <h3 className={`font-bold text-lg mb-2 ${isLuxuryProduct ? 'text-yellow-300' : 'text-gray-800'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.note?.title
                          ? productConfigs[slug].i18n.ur.usage.note.title
                          : productConfigs[slug]?.usage?.note?.title}
                      </h3>
                      <p className={`${shouldShowInUrdu('usage') ? 'text-right' : 'text-left'} ${isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'}`}>
                        {shouldShowInUrdu('usage') && productConfigs[slug]?.i18n?.ur?.usage?.note?.text
                          ? productConfigs[slug].i18n.ur.usage.note.text
                          : productConfigs[slug]?.usage?.note?.text}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Pricing */}
        <section className={`py-12 md:py-16 ${isBustMaxOil ? 'bg-gradient-to-b from-purple-950 to-pink-950' : isLuxuryProduct ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-white'}`}>
          <div className="container mx-auto px-4">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                {content.pricing.title}
              </h2>
              <p className={`text-lg ${isBustMaxOil ? 'text-pink-200' : isLuxuryProduct ? 'text-yellow-200' : 'text-gray-600'}`}>{content.pricing.subtitle}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* 1st Pack */}
              <motion.div
                className={`rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow ${isBustMaxOil ? 'bg-pink-900/20 border border-amber-400' : isLuxuryProduct ? 'bg-gray-800 border border-yellow-400' : 'bg-white border border-red-100'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className={`p-4 text-white text-center ${isBustMaxOil ? 'bg-gradient-to-r from-amber-500 to-pink-600' : isLuxuryProduct ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-red-600'}`}>
                  <h3 className={`text-xl font-bold ${isBustMaxOil ? 'text-white' : isLuxuryProduct ? 'text-black' : 'text-white'}`}>
                    {slug === 'slim-n-shape-garcinia-cambogia-capsules'
                      ? (productConfigs[slug]?.pricing?.packages?.[0]?.headerTitle || content.pricing.packages[0].title)
                      : slug === 'b-maxtime-super-active'
                        ? (productConfigs[slug]?.pricing?.packages?.[0]?.headerTitle || '1 Pack')
                        : (productConfigs[slug]?.pricing?.packages?.[0]?.headerTitle || content.pricing.packages[0].title)}
                  </h3>
                </div>
                <div className="p-6 text-center">
                  <div className={`text-4xl font-bold mb-4 ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                    Rs {(productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.()
                      || content?.pricing?.packages?.[0]?.price?.toLocaleString?.()
                      || '2,500')}
                    <span className={`text-lg ${isBustMaxOil ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-300' : 'text-gray-500'}`}>/-</span>
                  </div>
                  <ul className="mb-6 text-left space-y-2">
                    {content.pricing.packages[0].features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <SafeIcon icon={FiCheck} className={`mt-1 mr-2 flex-shrink-0 ${isBustMaxOil ? 'text-amber-400' : isLuxuryProduct ? 'text-yellow-400' : 'text-green-500'}`} />
                        <span className={isBustMaxOil ? 'text-pink-100' : isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'} dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* 2nd Pack */}
              <motion.div
                className={`rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow ${isBustMaxOil ? 'bg-pink-900/20 border border-amber-400' : isLuxuryProduct ? 'bg-gray-800 border border-yellow-400' : 'bg-white border border-red-100'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className={`p-4 text-white text-center ${isBustMaxOil ? 'bg-gradient-to-r from-amber-600 to-pink-700' : isLuxuryProduct ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' : 'bg-red-700'}`}>
                  <h3 className={`text-xl font-bold ${isBustMaxOil ? 'text-white' : isLuxuryProduct ? 'text-black' : 'text-white'}`}>
                    {slug === 'slim-n-shape-garcinia-cambogia-capsules'
                      ? (productConfigs[slug]?.pricing?.packages?.[1]?.headerTitle || content.pricing.packages[1].title)
                      : slug === 'b-maxtime-super-active'
                        ? (productConfigs[slug]?.pricing?.packages?.[1]?.headerTitle || '2 Packs')
                        : (productConfigs[slug]?.pricing?.packages?.[1]?.headerTitle || content.pricing.packages[1].title)}
                  </h3>
                </div>
                <div className="p-6 text-center">
                  {slug === 'shahi-sultan-health-booster' ? (
                    <>
                      <div className={`text-4xl font-bold mb-2 ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                        Rs {(productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.()
                          || content?.pricing?.packages?.[1]?.price?.toLocaleString?.()
                          || '4,500')}
                        <span className={`text-lg ${isBustMaxOil ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-300' : 'text-gray-500'}`}>/-</span>
                      </div>
                      {productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount ? (
                        <div className={`text-sm inline-block px-2 py-1 rounded mb-4 ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                          {content.pricing.save} {productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                        Rs {(productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.()
                          || content?.pricing?.packages?.[1]?.price?.toLocaleString?.()
                          || '4,500')}
                        <span className={`text-lg ${isBustMaxOil ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-300' : 'text-gray-500'}`}>/-</span>
                      </div>
                      {slug === 'slim-n-shape-garcinia-cambogia-capsules' ? (
                        productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount ? (
                          <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                            {content.pricing.save} {productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount}
                          </div>
                        ) : null
                      ) : slug === 'b-maxtime-super-active' ? null : (
                        productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount ? (
                          <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                            {content.pricing.save} {(productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount?.toLocaleString?.()
                              || productConfigs[slug]?.pricing?.packages?.[1]?.saveAmount
                              || 500)}
                          </div>
                        ) : null
                      )}
                    </div>
                  )}

                  <ul className="mb-6 text-left space-y-2">
                    {content.pricing.packages[1].features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <SafeIcon icon={FiCheck} className={`mt-1 mr-2 flex-shrink-0 ${isBustMaxOil ? 'text-amber-400' : isLuxuryProduct ? 'text-yellow-400' : 'text-green-500'}`} />
                        <span className={isBustMaxOil ? 'text-pink-100' : isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'} dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* 3rd Pack */}
              <motion.div
                className={`rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow ${isBustMaxOil ? 'bg-pink-900/20 border border-amber-400' : isLuxuryProduct ? 'bg-gray-800 border border-yellow-400' : 'bg-white border border-red-100'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className={`p-4 text-white text-center ${isBustMaxOil ? 'bg-gradient-to-r from-amber-700 to-pink-800' : isLuxuryProduct ? 'bg-gradient-to-r from-yellow-700 to-yellow-800' : 'bg-red-700'}`}>
                  <h3 className={`text-xl font-bold ${isBustMaxOil ? 'text-white' : isLuxuryProduct ? 'text-black' : 'text-white'}`}>
                    {slug === 'slim-n-shape-garcinia-cambogia-capsules'
                      ? (productConfigs[slug]?.pricing?.packages?.[2]?.headerTitle || content.pricing.packages[2].title)
                      : slug === 'b-maxtime-super-active'
                        ? (productConfigs[slug]?.pricing?.packages?.[2]?.headerTitle || '3 Packs')
                        : (productConfigs[slug]?.pricing?.packages?.[2]?.headerTitle || content.pricing.packages[2].title)}
                  </h3>
                </div>
                <div className="p-6 text-center">
                  {slug === 'shahi-sultan-health-booster' ? (
                    <>
                      <div className={`text-4xl font-bold mb-2 ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                        Rs {(productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.()
                          || content?.pricing?.packages?.[2]?.price?.toLocaleString?.()
                          || '6,000')}
                        <span className={`text-lg ${isBustMaxOil ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-300' : 'text-gray-500'}`}>/-</span>
                      </div>
                      {productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount ? (
                        <div className={`text-sm inline-block px-2 py-1 rounded mb-4 ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                          {content.pricing.save} {(productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount?.toLocaleString?.()
                            || productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount
                            || '1,500')}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold ${isBustMaxOil ? 'text-amber-300' : isLuxuryProduct ? 'text-yellow-400' : 'text-gray-800'}`}>
                        Rs {(productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.()
                          || content?.pricing?.packages?.[2]?.price?.toLocaleString?.()
                          || '6,000')}
                        <span className={`text-lg ${isBustMaxOil ? 'text-pink-300' : isLuxuryProduct ? 'text-yellow-300' : 'text-gray-500'}`}>/-</span>
                      </div>
                      {slug === 'slim-n-shape-garcinia-cambogia-capsules' ? (
                        productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount ? (
                          <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                            {content.pricing.save} {productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount}
                          </div>
                        ) : null
                      ) : slug === 'b-maxtime-super-active' ? null : (
                        productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount ? (
                          <div className={`mt-2 text-sm inline-block px-2 py-1 rounded ${isLuxuryProduct ? 'bg-yellow-400 text-black' : 'bg-green-100 text-green-800'}`}>
                            {content.pricing.save} {(productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount?.toLocaleString?.()
                              || productConfigs[slug]?.pricing?.packages?.[2]?.saveAmount
                              || '1,500')}
                          </div>
                        ) : null
                      )}
                    </div>
                  )}

                  <ul className="mb-6 text-left space-y-2">
                    {content.pricing.packages[2].features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <SafeIcon icon={FiCheck} className={`mt-1 mr-2 flex-shrink-0 ${isBustMaxOil ? 'text-amber-400' : isLuxuryProduct ? 'text-yellow-400' : 'text-green-500'}`} />
                        <span className={isBustMaxOil ? 'text-pink-100' : isLuxuryProduct ? 'text-gray-300' : 'text-gray-700'} dangerouslySetInnerHTML={{ __html: feature }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
            
            {/* Shelf Life & Made In - for BustMax Oil and Bustmax XL */}
            {(slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') && productConfigs[slug]?.pricing?.shelfLife && (
              <motion.div className="text-center mt-8 space-y-2" {...fadeInUp}>
                <p className={`text-lg font-medium ${isBustMaxOil ? 'text-amber-300' : 'text-gray-700'}`}>{productConfigs[slug].pricing.shelfLife}</p>
                <p className={`text-lg font-medium ${isBustMaxOil ? 'text-pink-200' : 'text-gray-700'}`}>{productConfigs[slug].pricing.madeIn}</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Results Timeline - for Bustmax XL */}
        {slug === 'bustmax-xl-breast-booster' && productConfigs[slug]?.resultsTimeline && (
          <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4">
              <motion.div className="max-w-4xl mx-auto" {...fadeInUp}>
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
                  {productConfigs[slug].resultsTimeline.title}
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                        <th className="px-6 py-4 text-left font-semibold">Duration</th>
                        <th className="px-6 py-4 text-left font-semibold">Visible Change</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productConfigs[slug].resultsTimeline.timeline.map((item, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-pink-50 transition-colors`}>
                          <td className="px-6 py-4 font-medium text-gray-800 border-b border-gray-200">{item.duration}</td>
                          <td className="px-6 py-4 text-gray-700 border-b border-gray-200">{item.change}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* FAQ Section - Lazy Loaded */}
        <Suspense fallback={<LoadingFallback />}>
          <FAQSection
            language={language}
            overrideTitle={(slug === 'slim-n-shape-garcinia-cambogia-capsules' || slug === 'slim-n-shape-tea' || slug === 'slim-n-shape-fit-booster' || slug === 'b-maxtime-super-active' || slug === 'shahi-sultan-health-booster' || slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' || slug === 'sultan-shahi-gold-health-booster' || slug === 'malika-shahi-gold-health-booster' || slug === 'g-max-passion' || slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') ? (language === 'ur' ? productConfigs[slug]?.i18n?.ur?.faqTitle : productConfigs[slug]?.faqTitle) : undefined}
            overrideSubtitle={(slug === 'slim-n-shape-garcinia-cambogia-capsules' || slug === 'slim-n-shape-tea' || slug === 'slim-n-shape-fit-booster' || slug === 'b-maxtime-super-active' || slug === 'shahi-sultan-health-booster' || slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' || slug === 'sultan-shahi-gold-health-booster' || slug === 'malika-shahi-gold-health-booster' || slug === 'g-max-passion' || slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') ? (language === 'ur' ? productConfigs[slug]?.i18n?.ur?.faqSubtitle : productConfigs[slug]?.faqSubtitle) : undefined}
            overrideFaqs={(slug === 'slim-n-shape-garcinia-cambogia-capsules' || slug === 'slim-n-shape-tea' || slug === 'slim-n-shape-fit-booster' || slug === 'b-maxtime-super-active' || slug === 'shahi-sultan-health-booster' || slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' || slug === 'sultan-shahi-gold-health-booster' || slug === 'malika-shahi-gold-health-booster' || slug === 'g-max-passion' || slug === 'bustmax-breast-oil' || slug === 'bustmax-xl-breast-booster') ? (language === 'ur' ? productConfigs[slug]?.i18n?.ur?.faqs : productConfigs[slug]?.faqs) : undefined}
            ctaLanguage={(slug === 'slim-n-shape-tea' || slug === 'slim-n-shape-garcinia-cambogia-capsules') ? 'en' : undefined}
            slug={slug}
          />
        </Suspense>

        {/* Order Form */}
        <section id="order-form" className={`py-12 md:py-16 text-white ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'bg-gradient-to-r from-black to-gray-900' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-purple-950 via-pink-950 to-purple-950' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
          <div className="container mx-auto px-4">
            <motion.div className="max-w-2xl mx-auto" {...fadeInUp}>
              <div className="text-center mb-8">
                <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.title}</h2>
                <p className={`text-xl ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200' : 'text-red-100'}`}>{content.orderForm.subtitle}</p>
              </div>

              <div className={`p-8 rounded-2xl backdrop-blur-sm ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'bg-gray-800/20 border border-yellow-400/30' : slug === 'malika-shahi-gold-health-booster' ? 'bg-purple-900/30 border border-pink-400/40' : 'bg-white/10 border border-white/10'}`}>
                <div className="grid gap-6">
                  <div>
                    <label htmlFor="name" className={`block text-sm font-semibold mb-2 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.name} *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400 bg-gray-800 border-yellow-400 focus:ring-2 focus:ring-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200 bg-purple-950 border-pink-400 focus:ring-2 focus:ring-pink-400' : 'text-gray-800 border focus:ring-2 focus:ring-yellow-400'}`}
                      placeholder={content.orderForm.namePlaceholder}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={`block text-sm font-semibold mb-2 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.phone} *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400 bg-gray-800 border-yellow-400 focus:ring-2 focus:ring-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200 bg-purple-950 border-pink-400 focus:ring-2 focus:ring-pink-400' : 'text-gray-800 border focus:ring-2 focus:ring-yellow-400'}`}
                      placeholder="03XX-XXXXXXX"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="address" className={`block text-sm font-semibold mb-2 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.address} *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400 bg-gray-800 border-yellow-400 focus:ring-2 focus:ring-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200 bg-purple-950 border-pink-400 focus:ring-2 focus:ring-pink-400' : 'text-gray-800 border focus:ring-2 focus:ring-yellow-400'}`}
                      placeholder={content.orderForm.addressPlaceholder}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className={`block text-sm font-semibold mb-2 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.city} *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400 bg-gray-800 border-yellow-400 focus:ring-2 focus:ring-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200 bg-purple-950 border-pink-400 focus:ring-2 focus:ring-pink-400' : 'text-gray-800 border focus:ring-2 focus:ring-yellow-400'}`}
                      placeholder={content.orderForm.cityPlaceholder}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="quantity" className={`block text-sm font-semibold mb-2 ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-300' : 'text-white'}`}>{content.orderForm.quantity}</label>
                    <select
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-lg border outline-none ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-400 bg-gray-800 border-yellow-400 focus:ring-2 focus:ring-yellow-400' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200 bg-purple-950 border-pink-400 focus:ring-2 focus:ring-pink-400' : 'text-gray-800 border focus:ring-2 focus:ring-yellow-400'}`}
                    >
                      <option value="1">
                        {slug === 'slim-n-shape-tea'
                          ? `1 Pack - Rs ${productConfigs['slim-n-shape-tea']?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs['slim-n-shape-tea']?.pricing?.packages?.[0]?.price}`
                          : (slug === 'slim-n-shape-garcinia-cambogia-capsules'
                            ? `1 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                            : (slug === 'slim-n-shape-fit-booster'
                              ? `1 Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                              : (slug === 'b-maxtime-super-active'
                                ? `1 Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || 1200}`
                                : (slug === 'shahi-sultan-health-booster'
                                  ? `1 Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                                  : (slug === 'sultan-shahi-gold-majoon'
                                    ? `1 Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                                    : (slug === 'sultan-shahi-gold-tila'
                                      ? `1 Bottle - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                                      : (slug === 'sultan-shahi-gold-health-booster'
                                        ? '1 Month Pack - Rs 6,000'
                                        : (slug === 'malika-shahi-gold-health-booster'
                                          ? `1 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[0]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[0]?.price}`
                                          : content.orderForm.quantityOptions[0]))))))))}
                      </option>
                      <option value="2">
                        {slug === 'slim-n-shape-tea'
                          ? `2 Packs - Rs ${productConfigs['slim-n-shape-tea']?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs['slim-n-shape-tea']?.pricing?.packages?.[1]?.price} (Save Rs. 400)`
                          : (slug === 'slim-n-shape-garcinia-cambogia-capsules'
                            ? `2 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price}`
                            : (slug === 'slim-n-shape-fit-booster'
                              ? `2 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price} (Save Rs. 500)`
                              : (slug === 'b-maxtime-super-active'
                                ? `2 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || 2000}`
                                : (slug === 'shahi-sultan-health-booster'
                                  ? `2 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price}`
                                  : (slug === 'sultan-shahi-gold-majoon'
                                    ? `2 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price}`
                                    : (slug === 'sultan-shahi-gold-tila'
                                      ? `2 Bottles - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price}`
                                      : (slug === 'sultan-shahi-gold-health-booster'
                                        ? '2 Month Pack - Rs 11,000 (Save Rs 1,000)'
                                        : (slug === 'malika-shahi-gold-health-booster'
                                          ? `2 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[1]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[1]?.price}`
                                          : content.orderForm.quantityOptions[1]))))))))}
                      </option>
                      <option value="3">
                        {slug === 'slim-n-shape-tea'
                          ? `3 Packs - Rs ${productConfigs['slim-n-shape-tea']?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs['slim-n-shape-tea']?.pricing?.packages?.[2]?.price} (Save Rs. 600)`
                          : (slug === 'slim-n-shape-garcinia-cambogia-capsules'
                            ? `3 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price}`
                            : (slug === 'slim-n-shape-fit-booster'
                              ? `3 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price} (Save Rs. 1500)`
                              : (slug === 'b-maxtime-super-active'
                                ? `3 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || 3000}`
                                : (slug === 'shahi-sultan-health-booster'
                                  ? `3 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price}`
                                  : (slug === 'sultan-shahi-gold-majoon'
                                    ? `3 Packs - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price}`
                                    : (slug === 'sultan-shahi-gold-tila'
                                      ? `3 Bottles - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price}`
                                      : (slug === 'sultan-shahi-gold-health-booster'
                                        ? '3 Month Pack - Rs 16,000 (Best Value)'
                                        : (slug === 'malika-shahi-gold-health-booster'
                                          ? `3 Month Pack - Rs ${productConfigs[slug]?.pricing?.packages?.[2]?.price?.toLocaleString?.() || productConfigs[slug]?.pricing?.packages?.[2]?.price}`
                                          : content.orderForm.quantityOptions[2]))))))))}
                      </option>
                    </select>
                  </div>

                  <div className={`p-4 rounded-lg text-center ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'bg-yellow-400 text-black' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' : 'bg-yellow-400 text-red-800'}`}>
                    <p className="font-bold text-lg">
                      {content.orderForm.total}: Rs {calculatePrice(formData.quantity)}/-
                    </p>
                    <p className="text-sm">{content.orderForm.freeDelivery}</p>
                  </div>

                  <motion.button
                    onClick={handleWhatsAppOrder}
                    className={`w-full font-bold py-4 px-6 rounded-lg flex items-center justify-center space-x-3 text-lg transition-colors ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black' : slug === 'malika-shahi-gold-health-booster' ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <SafeIcon icon={FiShoppingCart} className="text-xl" />
                    <span>{content.orderForm.orderButton}</span>
                  </motion.button>

                  <div className={`text-center ${slug === 'sultan-shahi-gold-majoon' || slug === 'sultan-shahi-gold-tila' ? 'text-yellow-300' : slug === 'malika-shahi-gold-health-booster' ? 'text-pink-200' : 'text-red-100'}`}>
                    <p className="flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiTruck} />
                      <span>{content.orderForm.sameDayDelivery}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      {/* Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-colors z-50"
            aria-label="Back to top"
          >
            <SafeIcon icon={FiChevronUp} className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;