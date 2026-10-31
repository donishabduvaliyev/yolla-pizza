import { createIcons, icons } from 'lucide';
import { initPizza3D } from './pizza3d.js';
import { translations, menuTranslations, getLanguage, setLanguage, applyTranslations } from './i18n.js';

// Initialize Lucide Icons
createIcons({ icons });

// 1. Initialize 3D Pizza Scene (Full-Screen Living Background with Dedicated Touch Zone)
const bgCanvasContainer = document.getElementById('bg-3d-canvas');
const heroTouchZone = document.getElementById('hero-3d-touch-zone');
let pizzaController = null;

if (bgCanvasContainer) {
  pizzaController = initPizza3D(bgCanvasContainer, heroTouchZone);
}

// 2. 3D Control Triggers with Toast Messages
const btnSpin = document.getElementById('btn-spin');
if (btnSpin && pizzaController) {
  btnSpin.addEventListener('click', () => {
    pizzaController.spin360();
    const lang = getLanguage();
    showToast(translations[lang].toastSpin);
  });
}

const btnTop = document.getElementById('btn-top');
if (btnTop && pizzaController) {
  btnTop.addEventListener('click', () => {
    pizzaController.setTopAngle();
    const lang = getLanguage();
    showToast(translations[lang].toastTop);
  });
}

let steamActive = true;
const btnSteam = document.getElementById('btn-steam');
if (btnSteam && pizzaController) {
  btnSteam.addEventListener('click', () => {
    steamActive = !steamActive;
    pizzaController.toggleSteam(steamActive);
    btnSteam.style.borderColor = steamActive ? 'var(--brand-yellow)' : 'rgba(255, 255, 255, 0.15)';
    const lang = getLanguage();
    showToast(steamActive ? translations[lang].toastSteamOn : translations[lang].toastSteamOff);
  });
}

const btnSpinBar = document.getElementById('btn-spin-bar');
if (btnSpinBar && pizzaController) {
  btnSpinBar.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    pizzaController.spin360();
  });
}

const logoTrigger = document.getElementById('logo-trigger');
if (logoTrigger && pizzaController) {
  logoTrigger.addEventListener('click', () => {
    pizzaController.spin360();
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    const lang = getLanguage();
    showToast(translations[lang].toastPeace);
  });
}

// 3. Real-Time Working Hours & Live Kitchen Status (UTC+5 / Asia/Tashkent)
function updateKitchenStatus() {
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const badgeOpenState = document.getElementById('badge-open-state');
  if (!statusDot || !statusText) return;

  const lang = getLanguage();
  const dict = translations[lang] || translations.uz;

  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Tashkent',
      hour: 'numeric',
      hour12: false,
    });
    const currentHour = parseInt(formatter.format(now), 10);

    // Open from 10:00 AM (10) to 01:00 AM (1)
    const isOpen = currentHour >= 10 || currentHour < 1;

    if (isOpen) {
      statusDot.className = 'status-dot';
      statusText.textContent = dict.statusOpen;
      if (badgeOpenState) {
        badgeOpenState.textContent = dict.hoursTag;
        badgeOpenState.style.color = '#22c55e';
        badgeOpenState.style.borderColor = 'rgba(34, 197, 94, 0.35)';
      }
    } else {
      statusDot.className = 'status-dot closed';
      statusText.textContent = dict.statusClosed;
      if (badgeOpenState) {
        badgeOpenState.textContent = dict.statusClosed.split('·')[0].trim();
        badgeOpenState.style.color = '#f59e0b';
        badgeOpenState.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      }
    }
  } catch (err) {
    statusDot.className = 'status-dot';
    statusText.textContent = dict.statusOpenDaily;
  }
}

// 4. Signature Menu Tab Switcher
let activeMenuItem = 'pepperoni';

const menuTabs = document.querySelectorAll('.menu-tab-chip');
const menuImg = document.getElementById('menu-img');
const menuTitle = document.getElementById('menu-title');
const menuDesc = document.getElementById('menu-desc');

function renderCurrentMenuItem() {
  const lang = getLanguage();
  const items = menuTranslations[lang] || menuTranslations.uz;
  const item = items[activeMenuItem];
  if (item && menuImg && menuTitle && menuDesc) {
    menuTitle.textContent = item.title;
    menuDesc.textContent = item.desc;
    menuImg.src = item.img;
  }
}

menuTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    menuTabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    activeMenuItem = tab.getAttribute('data-item');
    if (menuImg) menuImg.style.opacity = '0.4';

    setTimeout(() => {
      renderCurrentMenuItem();
      if (menuImg) menuImg.style.opacity = '1';
    }, 150);

    if (navigator.vibrate) navigator.vibrate(15);
  });
});

// 5. Language Switcher Setup
document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.getAttribute('data-lang');
    setLanguage(lang);
    if (navigator.vibrate) navigator.vibrate(20);
  });
});

window.addEventListener('languageChanged', () => {
  updateKitchenStatus();
  renderCurrentMenuItem();
  // Refresh icons if needed
  createIcons({ icons });
});

// Initial translation and status call
applyTranslations();
updateKitchenStatus();
renderCurrentMenuItem();
setInterval(updateKitchenStatus, 60000);

// 6. Copy Address to Clipboard with Toast Notification
const btnCopyAddress = document.getElementById('btn-copy-address');
if (btnCopyAddress) {
  btnCopyAddress.addEventListener('click', async () => {
    const address = '5A/6 mikr-on, Namangan, Uzbekistan';
    const lang = getLanguage();
    try {
      await navigator.clipboard.writeText(address);
      showToast(translations[lang].toastCopied);
      if (navigator.vibrate) navigator.vibrate(30);
    } catch (e) {
      showToast('📍 5A/6 mikr-on, Namangan');
    }
  });
}

// 7. Toast System
let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  if (!toast || !toastText) return;

  toastText.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

// 8. Auto-scroll support for visual verification and testing
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('scroll')) {
  const targetScroll = parseInt(urlParams.get('scroll'), 10);
  setTimeout(() => {
    window.scrollTo({ top: targetScroll, behavior: 'instant' });
  }, 400);
}
