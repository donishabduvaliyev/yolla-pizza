/**
 * Yolla Pizza · Editorial Link-Hub Controller
 * - Trilingual Localization (UZ / RU / EN) with localStorage persistence
 * - Real-time Namangan Kitchen Status (10:00 AM to 01:00 AM UTC+5)
 * - 1-Click Address Copy with Toast Notification
 */

const TRANSLATIONS = {
  uz: {
    status_open: 'Ochiq · 01:00 gacha',
    status_closed: 'Yopiq · 10:00 da ochiladi',
    hero_headline: "Haqiqiy AMERIKA uslubidagi pitsa va shirali smash burgerlar.",
    sec_links: 'Tezkor aloqa va buyurtma',
    act_tg_title: 'Telegram Bot orqali buyurtma',
    act_tg_sub: '@birzoombot · Yetkazib berish va olib ketish',
    act_call_title: "Qo'ng'iroq qilish",
    act_call_sub: 'Oshxona qaynoq aloqasi',
    act_ig_sub: '@yollapizza · Yangiliklar va jonli jarayon',
    act_loc_title: 'Manzil va Xarita',
    act_loc_sub: "5A/6 mikr-on, Namangan · Mo'ljal va yo'nalish",
    sec_serve: 'Biz nima tayyorlaymiz',
    serve_lead: "Katta va murakkab menyu o'rniga biz har kuni eng sara masalliqlardan to'rtta asosiy yo'nalishda mukammal ta'm yaratamiz.",
    tag_signature: 'Asosiy taom',
    tag_fresh: "100% MOL GO'SHTI",
    food_1_title: 'AMERIKA Pitsa',
    food_1_desc: "Cho'ziluvchan mozzarella pishlog'i, mol go'shti pepperonisi va YUMSHOQ oltinrang xamir chetlari.",
    food_2_title: 'Smash Burgerlar',
    food_2_desc: "Qizigan temir plitada bosib pishirilgan ikki qavatli shirali kotlet, erigan cheddar va maxsus sous.",
    food_3_title: 'Qarsildoq Fri va Stripslar',
    food_3_desc: "Tashqi tomoni oltinrang qarsildoq kartoshka fri hamda yumshoq tovuq filesidan issiq stripslar.",
    food_4_title: 'Muzdek Ichimliklar',
    food_4_desc: "Issiq pitsa va burgerlar bilan ayni muddao bo'luvchi muzdek gazli va tetiklantiruvchi ichimliklar.",
    sec_craft: 'Sifat va oshxona falsafasi',
    craft_1_title: "Avtrskiy uslubda tayyorlangan xamir",
    craft_1_desc: "Xamirimiz maxsus retsept asosida tayyorlanadi. Natijada ichi g'ovakli, yengil hazm bo'ladigan va cheti qarsildoq asos hosil bo'ladi.",
    craft_2_title: "Tabiiy Mozzarella va Halol go'sht",
    craft_2_desc: "Sun'iy o'rinbosarlarsiz toza pishloq, yangi maydalangan mol go'shti va xushbo'y pomidor sousidan foydalanamiz.",
    craft_3_title: 'Yuqori haroratda pishirish',
    craft_3_desc: "Har bir buyurtma faqatgina siz murojaat qilganingizdan so'ng yuqori haroratli pechda yangi uzib chiqariladi.",
    sec_location: 'Manzil va ish vaqti',
    lbl_address: 'Manzil',
    val_address: 'Namangan sh., 5A/6 mikrorayon',
    btn_copy: 'Nusxalash',
    btn_copied: 'Nusxalandi',
    lbl_hours: 'Ish tartibi',
    val_hours: 'Har kuni · 10:00 dan 01:00 gacha',
    lbl_delivery: 'Xizmat',
    val_delivery: "Zal, olib ketish va shahar bo'ylab yetkazish",
    lbl_phone: 'Telefon',
    btn_gmaps: 'Google Xarita',
    btn_ymaps: 'Yandex Xarita',
    dock_call: "Qo'ng'iroq",
    dock_order: 'Telegram orqali buyurtma',
    toast_copied: 'Manzil nusxalandi'
  },
  ru: {
    status_open: 'Открыто · до 01:00',
    status_closed: 'Закрыто · с 10:00 утра',
    hero_headline: 'Настоящая американская  пицца с хрустящей корочкой и сочные смэш-бургеры.',
    sec_links: 'Быстрая связь и заказ',
    act_tg_title: 'Заказать через Telegram-бот',
    act_tg_sub: '@birzoombot · Доставка и самовывоз',
    act_call_title: 'Позвонить на кухню',
    act_call_sub: 'Прямая линия для заказов',
    act_ig_sub: '@yollapizza · Новости и атмосфера',
    act_loc_title: 'Адрес и маршрут',
    act_loc_sub: '5А/6 мкр-н, Наманган · Навигация на карте',
    sec_serve: 'Что мы готовим',
    serve_lead: 'Вместо раздутого меню мы ежедневно фокусируемся на четырех ключевых направлениях из отборных ингредиентов.',
    tag_signature: 'Фирменное',
    tag_fresh: '100% Говядина',
    food_1_title: 'АМЕРИКАНСКАЯ Пицца',
    food_1_desc: 'Тягучая моцарелла, говяжья пепперони и мягкий золотистый край теста.',
    food_2_title: 'Смэш-Бургеры',
    food_2_desc: 'Две прожаренные на раскаленном гриле говяжьи котлеты с корочкой, расплавленный чеддер и фирменный соус.',
    food_3_title: 'Хрустящий Фри и Стрипсы',
    food_3_desc: 'Золотистый картофель фри с морской солью и сочные стрипсы из нежного куриного филе.',
    food_4_title: 'Холодные Напитки',
    food_4_desc: 'Ледяные газированные и освежающие напитки, идеально дополняющие горячую пиццу и бургеры.',
    sec_craft: 'Качество и философия кухни',
    craft_1_title: 'Тесто по авторскому рецепту',
    craft_1_desc: 'Мы готовим тесто по особому рецепту, благодаря которому оно получается воздушным, легко усваивается и имеет хрустящий край.',
    craft_2_title: 'Натуральная моцарелла и Халяль мясо',
    craft_2_desc: 'Используем только настоящий сыр без заменителей, свежую мраморную говядину и ароматный томатный соус.',
    craft_3_title: 'Выпечка при высокой температуре',
    craft_3_desc: 'Каждая пицца отправляется в раскаленную печь строго после вашего заказа и подается с пылу с жару.',
    sec_location: 'Адрес и режим работы',
    lbl_address: 'Адрес',
    val_address: 'г. Наманган, 5А/6 микрорайон',
    btn_copy: 'Скопировать',
    btn_copied: 'Скопировано',
    lbl_hours: 'График',
    val_hours: 'Ежедневно · с 10:00 до 01:00',
    lbl_delivery: 'Формат',
    val_delivery: 'Зал, самовывоз и доставка по городу',
    lbl_phone: 'Телефон',
    btn_gmaps: 'Google Карты',
    btn_ymaps: 'Яндекс Карты',
    dock_call: 'Позвонить',
    dock_order: 'Заказать в Telegram',
    toast_copied: 'Адрес скопирован'
  },
  en: {
    status_open: 'Open now · until 01:00',
    status_closed: 'Closed · opens at 10:00',
    hero_headline: 'Authentic American-style pizza and juicy smash burgers.',
    sec_links: 'Direct order & contact',
    act_tg_title: 'Order via Telegram Bot',
    act_tg_sub: '@birzoombot · Fast delivery & pickup',
    act_call_title: 'Call the kitchen',
    act_call_sub: 'Direct hotline for orders',
    act_ig_sub: '@yollapizza · Stories & kitchen updates',
    act_loc_title: 'Location & directions',
    act_loc_sub: '5A/6 microdistrict, Namangan · Find us on map',
    sec_serve: 'What we serve',
    serve_lead: 'Instead of an overwhelming menu, we focus daily on four core specialties crafted from select ingredients.',
    tag_signature: 'Signature',
    tag_fresh: '100% Beef',
    food_1_title: 'American-Style Pizza',
    food_1_desc: 'Stretchy mozzarella, beef pepperoni, and a soft golden crust.',
    food_2_title: 'Smash Burgers',
    food_2_desc: 'Double seared beef patties with lacy caramelized edges, melted cheddar, and house sauce.',
    food_3_title: 'Crispy Fries & Strips',
    food_3_desc: 'Golden sea-salt french fries and tender, hot crispy chicken breast strips.',
    food_4_title: 'Ice Cold Drinks',
    food_4_desc: 'Frosty sodas and refreshing beverages paired for hot oven-fresh pizza and burgers.',
    sec_craft: 'Craft & kitchen philosophy',
    craft_1_title: 'Artisan-Style Dough',
    craft_1_desc: 'Our dough is made with a special recipe for an airy texture, easy digestion, and a crisp edge.',
    craft_2_title: 'Real Mozzarella & Halal beef',
    craft_2_desc: 'Pure mozzarella cheese with zero artificial substitutes, fresh ground beef, and rich crushed tomato sauce.',
    craft_3_title: 'High-temperature deck baking',
    craft_3_desc: 'Every order is baked fresh to order at high heat so it arrives piping hot and crisp.',
    sec_location: 'Location & hours',
    lbl_address: 'Address',
    val_address: '5A/6 microdistrict, Namangan',
    btn_copy: 'Copy',
    btn_copied: 'Copied',
    lbl_hours: 'Hours',
    val_hours: 'Daily · 10:00 AM to 01:00 AM',
    lbl_delivery: 'Service',
    val_delivery: 'Dine-in, takeaway & city delivery',
    lbl_phone: 'Phone',
    btn_gmaps: 'Google Maps',
    btn_ymaps: 'Yandex Maps',
    dock_call: 'Call now',
    dock_order: 'Order on Telegram',
    toast_copied: 'Address copied'
  }
};

let currentLang = localStorage.getItem('yolla_lang') || 'uz';
if (!TRANSLATIONS[currentLang]) {
  currentLang = 'uz';
}

/**
 * Checks if kitchen is currently open in Namangan (UTC+5: 10:00 to 01:00)
 */
function isKitchenOpen() {
  const now = new Date();
  const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
  const namanganTime = new Date(utcMs + 5 * 3600000);
  const hour = namanganTime.getHours();
  return hour >= 10 || hour < 1;
}

function updateLiveStatus() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  if (!dot || !text) return;

  const open = isKitchenOpen();
  const dict = TRANSLATIONS[currentLang];

  if (open) {
    dot.classList.remove('closed');
    text.textContent = dict.status_open;
  } else {
    dot.classList.add('closed');
    text.textContent = dict.status_closed;
  }
}

function applyLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  localStorage.setItem('yolla_lang', lang);
  document.documentElement.lang = lang;

  const dict = TRANSLATIONS[lang];

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key === 'status_open' || key === 'status_closed') return;
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  updateLiveStatus();
}

function initLanguageSwitcher() {
  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => {
      toast.hidden = true;
    }, 200);
  }, 2200);
}

function initCopyAddress() {
  const copyBtn = document.getElementById('copy-address-btn');
  const copyText = document.getElementById('copy-btn-text');
  if (!copyBtn || !copyText) return;

  copyBtn.addEventListener('click', async () => {
    const dict = TRANSLATIONS[currentLang];
    const addressText = dict.val_address;

    try {
      await navigator.clipboard.writeText(addressText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = addressText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    copyText.textContent = dict.btn_copied;
    showToast(dict.toast_copied);

    setTimeout(() => {
      copyText.textContent = TRANSLATIONS[currentLang].btn_copy;
    }, 2000);
  });
}

function initStickyDockObserver() {
  const primaryLinks = document.getElementById('primary-links');
  const stickyDock = document.getElementById('sticky-dock');
  if (!primaryLinks || !stickyDock || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        stickyDock.classList.toggle('dock-visible', scrolledPast);
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(primaryLinks);
}

document.addEventListener('DOMContentLoaded', () => {
  initLanguageSwitcher();
  initCopyAddress();
  initStickyDockObserver();
  applyLanguage(currentLang);
  setInterval(updateLiveStatus, 60000);
});
