/**
 * Third Man - Sales & Incentive Dashboard
 * Robust, production-grade client application logic
 */

// ==================== DEFAULT CONSTANTS & BRAND RULES ====================
// Special brands eligible for additional turnover incentive (15L: 0.15%, 20L: 0.25%, 25L+: 0.33%)
function isSpecialBrand(productName) {
  if (!productName) return false;
  const p = String(productName).toLowerCase();
  return p.includes('mohabbath green') ||
         p.includes('mohabbath gold') ||
         p.includes('jasmine');
}

const DEFAULT_PRODUCTS = [
  { id: 'p_mg', name: 'Mohabbath Green Kaima Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 98 },
  { id: 'p_mgold', name: 'Mohabbath Gold Biriyani Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 104 },
  { id: 'p_jas', name: 'Jasmine Premium Basmati Rice', category: 'Basmati', bagSize: 30, defaultRateKg: 112 },
  { id: 'p1', name: 'Wayanadan Kaima Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 96 },
  { id: 'p2', name: 'Jeerakasala Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 92 },
  { id: 'p3', name: 'Royal 1121 Sella Basmati', category: 'Basmati', bagSize: 30, defaultRateKg: 105 },
  { id: 'p4', name: 'Premium Long Grain Basmati', category: 'Basmati', bagSize: 30, defaultRateKg: 115 },
  { id: 'p5', name: 'Classic Biriyani Rice Special', category: 'Kolam', bagSize: 26, defaultRateKg: 84 },
  { id: 'p6', name: 'Wada Kolam Rice Supreme', category: 'Kolam', bagSize: 25, defaultRateKg: 78 }
];

const DEFAULT_BAG_SIZES = [5, 10, 25, 26, 30, 50];

// ==================== PRODUCT IMAGE HELPERS ====================
function getDefaultProductImage(category, name) {
  const cat = String(category || 'Kaima').toLowerCase();
  let bg = '#d97706'; // amber-600
  let label = 'KAIMA';
  if (cat.includes('basmati')) {
    bg = '#4f46e5'; // indigo-600
    label = 'BASMATI';
  } else if (cat.includes('kolam')) {
    bg = '#059669'; // emerald-600
    label = 'KOLAM';
  } else if (cat.includes('other')) {
    bg = '#475569'; // slate-600
    label = 'RICE';
  }

  // Vector SVG illustration representing a branded rice sack/bag
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <rect width="100" height="100" fill="#f1f5f9" rx="18"/>
    <path d="M26 30 C26 22, 74 22, 74 30 L80 82 C80 86, 76 89, 70 89 L30 89 C24 89, 20 86, 20 82 Z" fill="${bg}" opacity="0.95"/>
    <path d="M28 28 C28 20, 72 20, 72 28 L68 32 L32 32 Z" fill="#ffffff" opacity="0.35"/>
    <line x1="28" y1="33" x2="72" y2="33" stroke="#ffffff" stroke-dasharray="3,2" stroke-width="1.5" opacity="0.6"/>
    <circle cx="50" cy="54" r="16" fill="#ffffff" opacity="0.96"/>
    <text x="50" y="56.5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="7" font-weight="900" fill="${bg}" text-anchor="middle" dominant-baseline="middle">${label}</text>
    <path d="M21 82 L79 82 L76 87 L24 87 Z" fill="#000000" opacity="0.18"/>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

function getProductImageUrl(p) {
  if (p && p.imageUrl && typeof p.imageUrl === 'string' && p.imageUrl.trim()) {
    return p.imageUrl;
  }
  return getDefaultProductImage(p ? p.category : 'Kaima', p ? p.name : '');
}

const DEFAULT_CUSTOMERS = [];

// Storage Keys
const STORAGE_ORDERS = 'biriyani_rice_orders_fresh_v2';
const STORAGE_CUSTOMERS = 'biriyani_rice_customers_fresh_v2';
const STORAGE_PRODUCTS = 'biriyani_rice_products_v1';
const STORAGE_BAG_SIZES = 'biriyani_rice_bag_sizes_v1';
const STORAGE_LAST_BAG_SIZE = 'biriyani_rice_last_bag_size_v1';
const STORAGE_SAVED_AREAS = 'biriyani_rice_saved_areas_v1';
const STORAGE_SAVED_TOWNS = 'biriyani_rice_saved_district_towns_v2';
const STORAGE_TRASH = 'third_man_trash_v2';
const STORAGE_SAFETY_SNAPSHOT = 'third_man_safety_snapshot';
const STORAGE_INCENTIVE_EFFECTIVE_DATE = 'biriyani_rice_scheme_effective_date_v1';

// Global App State
let orders = [];
let products = [];
let bagSizes = [];
let customers = [];
let savedAreas = [];
let savedDistrictTowns = {};
let customerDistrictFilter = 'all';
let customerTownFilter = 'all';
let customerAreaFilter = 'all';
let orderAreaFilter = 'all';
let orderItems = [];
let editingOrderId = null;
let currentFilterPeriod = 'month'; // 'today', 'week', 'month', 'last_month', 'specific_month', 'year', 'custom_range', 'all'
let filterSelectedYear = new Date().getFullYear();
let filterSelectedMonth = new Date().getMonth(); // 0 to 11
let filterCustomStartDate = '';
let filterCustomEndDate = '';
const MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_NAMES_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
let currentProductCategoryFilter = 'all'; // 'all', 'Kaima', 'Kolam', 'Basmati'
let defaultRememberedBagSize = 26;
let salesTrendChartInstance = null;
let ricePieChartInstance = null;
let incentiveSchemeEffectiveDate = '2026-05-01'; // Default: May 1, 2026 (Configurable)

// Accidental Deletion Shield State
let trashList = [];
let currentTrashFilter = 'all';
let currentTrashSearch = '';

// ==================== INITIALIZATION ====================

function initApp() {
  try {
    loadDataFromStorage();
    extractCustomersFromOrdersIfMissing(false);

    // Set default order date to today
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('orderDate');
    if (dateInput) dateInput.value = today;

    // Populate dropdowns & badges
    populateProductDropdown();
    populateBagSizesDropdown();
    populateCustomerDropdown();
    populateSavedAreasDatalists();
    renderProductsManageList();
    renderBagSizesBadges();

    // Clean start: Orders start at 0 (no automatic sample data seeding)

    // Populate Year and Month filter dropdowns & initial styles
    populateFilterYearSelect();
    populateFilterMonthSelect();
    updateFilterButtonStyles();

    // Refresh entire dashboard UI
    updateDashboard();

    // Update Accidental Deletion Shield & Trash Badges
    updateTrashBadges();

    // Load and apply App Brand Logo
    loadAppLogo();

    // Restore or initialize active view (overview vs sales-register)
    try {
      const savedActiveView = localStorage.getItem('biriyani_rice_active_view') || 'overview';
      switchMainView(savedActiveView);
    } catch (e) {}

    // Initialize Lucide icons safely
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    // Initialize Google Firebase Cloud Realtime Sync
    initFirebaseSync();
  } catch (err) {
    console.error('Initialization error in app.js:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  // DOM is already ready (e.g. script placed at bottom of <body> or delayed)
  initApp();
}

// ==================== STORAGE & DATA NORMALIZATION ====================

function loadDataFromStorage() {
  try {
    // Purge legacy v1 demo cache if present
    try {
      localStorage.removeItem('biriyani_rice_orders_v1');
      localStorage.removeItem('biriyani_rice_customers_v1');
    } catch (e) {}

    const storedOrders = localStorage.getItem(STORAGE_ORDERS);
    const parsedOrders = storedOrders ? JSON.parse(storedOrders) : [];
    orders = Array.isArray(parsedOrders) ? parsedOrders.filter(Boolean) : [];

    // Normalize each order to avoid any undefined access bugs
    orders = orders.map(o => {
      if (!o || typeof o !== 'object') return null;
      
      // Ensure customer object exists
      if (!o.customer) {
        o.customer = { name: 'Customer', phone: '', location: 'Local' };
      } else if (typeof o.customer === 'string') {
        o.customer = { name: o.customer, phone: '', location: 'Local' };
      }

      // Ensure items array exists
      if (!o.items || !Array.isArray(o.items) || o.items.length === 0) {
        o.items = [{
          productId: o.product?.id || 'p1',
          productName: o.product?.name || 'Biriyani Rice',
          bagSize: parseFloat(o.bagSize) || 25,
          bagQty: parseFloat(o.bagQty) || 1,
          totalKg: parseFloat(o.totalKg) || (parseFloat(o.bagSize) || 25),
          perKgRate: parseFloat(o.perKgRate) || 95,
          totalAmount: parseFloat(o.totalAmount) || 0
        }];
      }

      // Ensure numeric fields
      o.totalKg = parseFloat(o.totalKg) || o.items.reduce((sum, it) => sum + (parseFloat(it.totalKg) || 0), 0);
      o.totalAmount = parseFloat(o.totalAmount) || o.items.reduce((sum, it) => sum + (parseFloat(it.totalAmount) || 0), 0);
      o.deliveryStatus = o.deliveryStatus || 'Normal';

      return o;
    }).filter(Boolean);

    // ==================== RESTORE USER'S PRODUCTS ====================
    let loadedProducts = null;

    // 1. Try primary v1 storage (where user's custom products were originally saved)
    const rawV1 = localStorage.getItem('biriyani_rice_products_v1');
    if (rawV1) {
      try {
        const parsed = JSON.parse(rawV1);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedProducts = parsed;
        }
      } catch (e) {}
    }

    // 2. Try v2 or unversioned product keys
    if (!loadedProducts) {
      const altKeys = ['biriyani_rice_products_fresh_v2', 'biriyani_rice_products', 'products'];
      for (const k of altKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedProducts = parsed;
              break;
            }
          } catch (e) {}
        }
      }
    }

    // 3. Deep scan all localStorage keys if still not found
    if (!loadedProducts) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('product')) {
          try {
            const parsed = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
              loadedProducts = parsed;
              break;
            }
          } catch (e) {}
        }
      }
    }

    products = (loadedProducts && loadedProducts.length > 0) ? loadedProducts : DEFAULT_PRODUCTS;

    // Normalize each product to ensure category, bagSize, and defaultRateKg exist
    products.forEach((p, idx) => {
      if (!p.id) p.id = 'p_' + (idx + 1);
      if (!p.name) p.name = 'Rice Variety ' + (idx + 1);
      if (!p.category) {
        const lower = (p.name || '').toLowerCase();
        if (lower.includes('kaima') || lower.includes('jeerakasala')) p.category = 'Kaima';
        else if (lower.includes('basmati') || lower.includes('1121') || lower.includes('sella')) p.category = 'Basmati';
        else if (lower.includes('kolam')) p.category = 'Kolam';
        else p.category = 'Kaima';
      }
      if (!p.bagSize) {
        p.bagSize = 26;
      } else {
        p.bagSize = parseFloat(p.bagSize) || 26;
      }
      if (p.defaultRateKg === undefined) {
        p.defaultRateKg = parseFloat(p.rateKg) || 90;
      } else {
        p.defaultRateKg = parseFloat(p.defaultRateKg) || 90;
      }
    });

    // Ensure the 3 special incentive brands exist in products if not already created
    if (!products.some(p => (p.name || '').toLowerCase().includes('mohabbath green'))) {
      products.unshift({ id: 'sp_mg', name: 'Mohabbath Green Kaima Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 98 });
    }
    if (!products.some(p => (p.name || '').toLowerCase().includes('mohabbath gold'))) {
      products.unshift({ id: 'sp_mgold', name: 'Mohabbath Gold Biriyani Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 104 });
    }
    if (!products.some(p => (p.name || '').toLowerCase().includes('jasmine'))) {
      products.unshift({ id: 'sp_jas', name: 'Jasmine Premium Basmati Rice', category: 'Basmati', bagSize: 30, defaultRateKg: 112 });
    }

    // ==================== RESTORE USER'S BAG SIZES ====================
    let loadedBagSizes = null;
    const rawBagsV1 = localStorage.getItem('biriyani_rice_bag_sizes_v1');
    if (rawBagsV1) {
      try {
        const parsed = JSON.parse(rawBagsV1);
        if (Array.isArray(parsed) && parsed.length > 0) loadedBagSizes = parsed;
      } catch (e) {}
    }
    if (!loadedBagSizes) {
      const rawBagsV2 = localStorage.getItem('biriyani_rice_bag_sizes_fresh_v2') || localStorage.getItem('biriyani_rice_bag_sizes');
      if (rawBagsV2) {
        try {
          const parsed = JSON.parse(rawBagsV2);
          if (Array.isArray(parsed) && parsed.length > 0) loadedBagSizes = parsed;
        } catch (e) {}
      }
    }
    bagSizes = (loadedBagSizes && loadedBagSizes.length > 0) ? loadedBagSizes : DEFAULT_BAG_SIZES;

    // Ensure common wholesale sizes exist
    [25, 26, 30, 50].forEach(s => {
      if (!bagSizes.includes(s)) bagSizes.push(s);
    });

    const storedCustomers = localStorage.getItem(STORAGE_CUSTOMERS);
    customers = storedCustomers ? JSON.parse(storedCustomers) : DEFAULT_CUSTOMERS;
    if (!Array.isArray(customers) || customers.length === 0) customers = DEFAULT_CUSTOMERS;

    // Ensure all customers have normalized district, town, landmark, and members
    customers.forEach(c => {
      if (!c.district) {
        c.district = 'Ernakulam';
      }
      if (!c.town) {
        c.town = c.area || (c.location && c.location !== 'Local' ? c.location : 'Ernakulam');
      }
      if (!c.landmark) {
        c.landmark = c.place || '';
      }
      if (!c.panchayath) {
        c.panchayath = '';
      }
      if (!c.area) {
        c.area = c.town;
      }
      if (!c.place) {
        c.place = c.landmark || c.town;
      }
      if (!Array.isArray(c.members) || c.members.length === 0) {
        c.members = getCustomerMembers(c);
      }
    });

    loadDistrictTowns();
    loadSavedAreas();

    const storedLastBag = localStorage.getItem(STORAGE_LAST_BAG_SIZE) || localStorage.getItem('biriyani_rice_last_bag_size_fresh_v2');
    defaultRememberedBagSize = storedLastBag ? (parseFloat(storedLastBag) || 26) : 26;

    // Load Scheme Effective Date (Default: 2026-05-01)
    const storedSchemeDate = localStorage.getItem(STORAGE_INCENTIVE_EFFECTIVE_DATE);
    if (storedSchemeDate && /^\d{4}-\d{2}-\d{2}$/.test(storedSchemeDate.trim())) {
      incentiveSchemeEffectiveDate = storedSchemeDate.trim();
    } else {
      incentiveSchemeEffectiveDate = '2026-05-01';
    }

    // Load Recycle Bin (Trash)
    const storedTrash = localStorage.getItem(STORAGE_TRASH);
    trashList = storedTrash ? JSON.parse(storedTrash) : [];
    if (!Array.isArray(trashList)) trashList = [];
  } catch (e) {
    console.error('Error loading localStorage data:', e);
    orders = [];
    products = DEFAULT_PRODUCTS;
    bagSizes = DEFAULT_BAG_SIZES;
    customers = DEFAULT_CUSTOMERS;
    trashList = [];
    defaultRememberedBagSize = 26;
  }
}

function saveDataToStorage() {
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    // Mirror products and bag sizes to both keys to prevent any future versioning mismatch
    localStorage.setItem('biriyani_rice_products_v1', JSON.stringify(products));
    localStorage.setItem('biriyani_rice_products_fresh_v2', JSON.stringify(products));
    localStorage.setItem('biriyani_rice_bag_sizes_v1', JSON.stringify(bagSizes));
    localStorage.setItem('biriyani_rice_bag_sizes_fresh_v2', JSON.stringify(bagSizes));
    localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
    localStorage.setItem(STORAGE_LAST_BAG_SIZE, String(defaultRememberedBagSize));
  } catch (e) {
    console.error('Error saving data to localStorage:', e);
  }

  if (isFirestoreInitialized && !isReceivingCloudSettings) {
    syncCloudConfig();
  }
}

// ==================== GOOGLE FIREBASE CLOUD REALTIME SYNC ====================
let db = null;
let isFirestoreInitialized = false;
let isReceivingCloudOrders = false;
let isReceivingCloudCustomers = false;
let isReceivingCloudSettings = false;
let hasPerformedInitialOrdersCloudSeed = false;
let hasPerformedInitialCustomersCloudSeed = false;

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDvU5PL0rINxwGwyZlpvdY6el0dLbz4UYY",
  authDomain: "third-man-1998.firebaseapp.com",
  projectId: "third-man-1998",
  storageBucket: "third-man-1998.firebasestorage.app",
  messagingSenderId: "928547046358",
  appId: "1:928547046358:web:723643e5a083a81f66da77"
};

function sanitizeForFirestore(obj) {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const clean = {};
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    clean[key] = (val === undefined) ? null : sanitizeForFirestore(val);
  }
  return clean;
}

function updateCloudSyncStatus(status, text) {
  const dot = document.getElementById('cloudSyncDot');
  const label = document.getElementById('cloudSyncText');
  if (!dot || !label) return;

  label.textContent = text;
  dot.classList.remove('bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-slate-400', 'animate-pulse');

  if (status === 'synced') {
    dot.classList.add('bg-emerald-400');
  } else if (status === 'syncing') {
    dot.classList.add('bg-amber-400', 'animate-pulse');
  } else if (status === 'offline') {
    dot.classList.add('bg-slate-400');
  } else if (status === 'error') {
    dot.classList.add('bg-rose-400');
  }
}

function initFirebaseSync() {
  if (typeof firebase === 'undefined') {
    console.warn('Firebase SDK not loaded, operating in offline/localStorage mode.');
    updateCloudSyncStatus('offline', 'Local Mode (No SDK)');
    return;
  }

  try {
    if (!firebase.apps || !firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    db = firebase.firestore();

    // Enable multi-tab offline persistence with cache
    db.enablePersistence({ synchronizeTabs: true }).catch(err => {
      console.log('Firestore persistence mode:', err.code);
    });

    isFirestoreInitialized = true;
    updateCloudSyncStatus('syncing', 'Connecting to Cloud...');

    setupFirestoreRealtimeListeners();

    // If local custom logo exists, ensure it is pushed to cloud settings
    if (localStorage.getItem(STORAGE_APP_LOGO)) {
      setTimeout(() => syncCloudConfig(), 1200);
    }
  } catch (err) {
    console.error('Firebase init error:', err);
    updateCloudSyncStatus('error', 'Cloud Connect Error');
  }
}

function setupFirestoreRealtimeListeners() {
  if (!db) return;

  // 1. Orders Realtime Listener
  db.collection('orders').onSnapshot(snapshot => {
    // If cloud is empty initially, seed local orders up to cloud
    if (snapshot.empty && orders.length > 0 && !hasPerformedInitialOrdersCloudSeed) {
      seedLocalOrdersToCloud();
      return;
    }

    if (!snapshot.empty) {
      isReceivingCloudOrders = true;
      const remoteOrders = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d && d.id) {
          remoteOrders.push(d);
        }
      });

      // Sort orders descending by date / id
      remoteOrders.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
      orders = remoteOrders;

      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
      } catch (e) {}

      // Automatically harvest any customer from orders into customer directory
      extractCustomersFromOrdersIfMissing(true);

      updateDashboard();
      isReceivingCloudOrders = false;
      updateCloudSyncStatus('synced', 'Live Synced 🟢');
    } else if (snapshot.empty && hasPerformedInitialOrdersCloudSeed) {
      orders = [];
      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
      } catch (e) {}
      updateDashboard();
      updateCloudSyncStatus('synced', 'Live Synced (0 Orders)');
    } else {
      updateCloudSyncStatus('synced', 'Live Synced 🟢');
    }
  }, err => {
    console.warn('Orders snapshot listener error:', err);
    updateCloudSyncStatus('offline', 'Offline Mode (Local)');
  });

  // 2. Customers Realtime Listener
  db.collection('customers').onSnapshot(snapshot => {
    if (snapshot.empty && customers.length > 0 && !hasPerformedInitialCustomersCloudSeed) {
      seedLocalCustomersToCloud();
      return;
    }

    if (snapshot.empty && customers.length === 0 && orders.length > 0) {
      extractCustomersFromOrdersIfMissing(true);
      return;
    }

    if (!snapshot.empty) {
      isReceivingCloudCustomers = true;
      const remoteCustomers = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d && (d.id || d.name)) {
          remoteCustomers.push(d);
        }
      });

      customers = remoteCustomers;

      // Ensure any customer from orders is also retained
      extractCustomersFromOrdersIfMissing(false);

      try {
        localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
      } catch (e) {}

      populateCustomerDropdown();
      if (typeof renderCustomersList === 'function') renderCustomersList();
      isReceivingCloudCustomers = false;
    }
  }, err => {
    console.warn('Customers snapshot error:', err);
  });

  // 3. Settings (Products, Bag sizes, etc.) Realtime Listener
  db.collection('settings').doc('app_config').onSnapshot(doc => {
    if (doc.exists) {
      isReceivingCloudSettings = true;
      const cfg = doc.data();
      if (Array.isArray(cfg.products) && cfg.products.length > 0) {
        products = cfg.products;
        localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
        populateProductDropdown();
        if (typeof renderProductsManageList === 'function') renderProductsManageList();
      }
      if (Array.isArray(cfg.bagSizes) && cfg.bagSizes.length > 0) {
        bagSizes = cfg.bagSizes;
        localStorage.setItem(STORAGE_BAG_SIZES, JSON.stringify(bagSizes));
        populateBagSizesDropdown();
        if (typeof renderBagSizesBadges === 'function') renderBagSizesBadges();
      }
      if (Array.isArray(cfg.savedAreas)) {
        savedAreas = cfg.savedAreas;
        localStorage.setItem(STORAGE_SAVED_AREAS, JSON.stringify(savedAreas));
        populateSavedAreasDatalists();
      }
      if (Array.isArray(cfg.savedDistrictTowns)) {
        savedDistrictTowns = cfg.savedDistrictTowns;
        localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
      }
      if (Array.isArray(cfg.trashList)) {
        trashList = cfg.trashList;
        localStorage.setItem(STORAGE_TRASH, JSON.stringify(trashList));
        if (typeof updateTrashBadges === 'function') updateTrashBadges();
      }
      if (cfg.appLogo !== undefined) {
        if (cfg.appLogo) {
          try {
            localStorage.setItem(STORAGE_APP_LOGO, cfg.appLogo);
          } catch (e) {}
          applyAppLogo(cfg.appLogo, true);
        } else {
          try {
            localStorage.removeItem(STORAGE_APP_LOGO);
          } catch (e) {}
          applyAppLogo(DEFAULT_LOGO_URL, false);
        }
      }
      isReceivingCloudSettings = false;
    } else {
      syncCloudConfig();
    }
  }, err => {
    console.warn('Settings snapshot error:', err);
  });
}

function seedLocalOrdersToCloud() {
  if (!db || orders.length === 0) return;
  hasPerformedInitialOrdersCloudSeed = true;
  updateCloudSyncStatus('syncing', 'Uploading Local Orders...');
  
  const batch = db.batch();
  orders.forEach(order => {
    if (order && order.id) {
      const ref = db.collection('orders').doc(order.id);
      batch.set(ref, sanitizeForFirestore(order));
    }
  });
  batch.commit().then(() => {
    updateCloudSyncStatus('synced', 'Live Synced 🟢');
  }).catch(err => {
    console.error('Initial orders seed error:', err);
  });
}

function seedLocalCustomersToCloud() {
  if (!db || customers.length === 0) return;
  hasPerformedInitialCustomersCloudSeed = true;
  updateCloudSyncStatus('syncing', 'Uploading Customers...');
  const batch = db.batch();
  customers.forEach(cust => {
    if (cust) {
      const docId = cust.id || ('c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
      cust.id = docId;
      const ref = db.collection('customers').doc(docId);
      batch.set(ref, sanitizeForFirestore(cust));
    }
  });
  batch.commit().then(() => {
    updateCloudSyncStatus('synced', 'Live Synced 🟢');
  }).catch(err => console.error('Initial customers seed error:', err));
}

// Automatically harvests and preserves customer directory from orders history
function extractCustomersFromOrdersIfMissing(syncToCloud = false) {
  if (!Array.isArray(orders) || orders.length === 0) return;
  if (!Array.isArray(customers)) customers = [];

  let addedCount = 0;
  orders.forEach(ord => {
    if (!ord || !ord.customer) return;
    const c = ord.customer;
    const cName = (typeof c === 'string' ? c : (c.name || '')).trim();
    if (!cName) return;

    const cPhone = (typeof c === 'object' && c.phone) ? String(c.phone).trim() : '';
    const cOwnerPhone = (typeof c === 'object' && c.ownerPhone) ? String(c.ownerPhone).trim() : '';
    const cStaffPhone = (typeof c === 'object' && c.staffPhone) ? String(c.staffPhone).trim() : '';

    const cleanP = cleanPhoneNumber(cPhone);
    const cleanOwn = cleanPhoneNumber(cOwnerPhone);

    const exists = customers.some(existing => {
      const nameMatch = existing.name && existing.name.trim().toLowerCase() === cName.toLowerCase();
      const phoneMatch = cleanP && existing.phone && cleanPhoneNumber(existing.phone) === cleanP;
      const ownMatch = cleanOwn && existing.ownerPhone && cleanPhoneNumber(existing.ownerPhone) === cleanOwn;
      return nameMatch || phoneMatch || ownMatch;
    });

    if (!exists) {
      const newCust = {
        id: (typeof c === 'object' && c.id) ? c.id : ('c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
        name: cName,
        category: (typeof c === 'object' && c.category) ? c.category : 'Caterer',
        district: (typeof c === 'object' && c.district) ? c.district : 'Ernakulam',
        town: (typeof c === 'object' && (c.town || c.area || c.location)) ? (c.town || c.area || c.location) : 'Ernakulam',
        landmark: (typeof c === 'object' && (c.landmark || c.place)) ? (c.landmark || c.place) : '',
        panchayath: (typeof c === 'object' && c.panchayath) ? c.panchayath : '',
        area: (typeof c === 'object' && (c.area || c.town || c.location)) ? (c.area || c.town || c.location) : 'Ernakulam',
        place: (typeof c === 'object' && (c.place || c.landmark)) ? (c.place || c.landmark) : '',
        location: (typeof c === 'object' && (c.location || c.town)) ? c.location : 'Ernakulam',
        ownerName: (typeof c === 'object' && c.ownerName) ? c.ownerName : '',
        ownerPhone: cOwnerPhone || cPhone,
        staffName: (typeof c === 'object' && c.staffName) ? c.staffName : '',
        staffRole: (typeof c === 'object' && c.staffRole) ? c.staffRole : '',
        staffPhone: cStaffPhone,
        phone: cPhone || cOwnerPhone,
        notes: (typeof c === 'object' && c.notes) ? c.notes : 'Auto-recovered from order',
        createdAt: ord.date ? new Date(ord.date).toISOString() : new Date().toISOString()
      };
      if (typeof getCustomerMembers === 'function') {
        newCust.members = getCustomerMembers(newCust);
      }
      customers.push(newCust);
      addedCount++;
    }
  });

  if (addedCount > 0) {
    try {
      localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
    } catch (e) {}
    populateCustomerDropdown();
    if (typeof renderCustomersList === 'function') renderCustomersList();
    if (syncToCloud && isFirestoreInitialized && db) {
      seedLocalCustomersToCloud();
    }
  }
}

function syncCloudOrder(order) {
  if (!db || !order || !order.id) return;
  updateCloudSyncStatus('syncing', 'Saving to Cloud...');
  db.collection('orders').doc(order.id).set(sanitizeForFirestore(order)).then(() => {
    updateCloudSyncStatus('synced', 'Live Synced 🟢');
  }).catch(err => {
    console.warn('Error saving order to Firestore:', err);
    updateCloudSyncStatus('offline', 'Saved Locally (Offline)');
  });
}

function deleteCloudOrder(orderId) {
  if (!db || !orderId) return;
  db.collection('orders').doc(orderId).delete().catch(err => {
    console.warn('Error deleting order from Firestore:', err);
  });
}

function syncCloudCustomer(customer) {
  if (!db || !customer) return;
  if (!customer.id) {
    customer.id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
  }
  updateCloudSyncStatus('syncing', 'Saving Customer...');
  db.collection('customers').doc(customer.id).set(sanitizeForFirestore(customer)).then(() => {
    updateCloudSyncStatus('synced', 'Live Synced 🟢');
  }).catch(err => {
    console.warn('Error saving customer to Firestore:', err);
  });
}

function deleteCloudCustomer(customerId) {
  if (!db || !customerId) return;
  db.collection('customers').doc(customerId).delete().catch(err => {
    console.warn('Error deleting customer from Firestore:', err);
  });
}

let syncConfigDebounceTimer = null;
function syncCloudConfig() {
  if (!db || isReceivingCloudSettings) return;
  clearTimeout(syncConfigDebounceTimer);
  syncConfigDebounceTimer = setTimeout(() => {
    let currentLogo = null;
    try {
      currentLogo = localStorage.getItem(STORAGE_APP_LOGO) || null;
    } catch (e) {}

    db.collection('settings').doc('app_config').set(sanitizeForFirestore({
      products: products || [],
      bagSizes: bagSizes || [],
      savedAreas: savedAreas || [],
      savedDistrictTowns: savedDistrictTowns || [],
      trashList: trashList || [],
      defaultRememberedBagSize: defaultRememberedBagSize || 26,
      incentiveSchemeEffectiveDate: incentiveSchemeEffectiveDate || '2026-05-01',
      appLogo: currentLogo
    }), { merge: true }).catch(err => console.warn('Config sync error:', err));
  }, 500);
}

function manualTriggerCloudSync() {
  updateCloudSyncStatus('syncing', 'Syncing Cloud...');
  if (!db) {
    initFirebaseSync();
    return;
  }
  if (orders.length > 0) {
    seedLocalOrdersToCloud();
  }
  if (customers.length > 0) {
    seedLocalCustomersToCloud();
  }
  syncCloudConfig();
  if (typeof showNotification === 'function') {
    showNotification('✓ Cloud sync triggered!');
  }
}

// ==================== HELPER ACCESSORS ====================

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCustomerName(cust) {
  if (!cust) return 'Customer';
  if (typeof cust === 'string') return cust;
  return cust.name || 'Customer';
}

// ==================== KERALA DISTRICTS & SAVED WHOLESALE TOWNS ====================
const KERALA_DISTRICTS = [
  'Ernakulam',
  'Thiruvananthapuram',
  'Kollam',
  'Pathanamthitta',
  'Alappuzha',
  'Kottayam',
  'Idukki',
  'Thrissur',
  'Palakkad',
  'Malappuram',
  'Kozhikode',
  'Wayanad',
  'Kannur',
  'Kasaragod'
];

const DEFAULT_DISTRICT_TOWNS = {
  'Ernakulam': [
    'Aluva', 'Ernakulam', 'Edappally', 'Kakkanad', 'Angamaly',
    'Perumbavoor', 'Kalamassery', 'Tripunithura', 'Kothamangalam',
    'Muvattupuzha', 'Mattancherry', 'Fort Kochi', 'North Paravur',
    'Piravom', 'Vyttila', 'Palarivattom', 'Kundannoor', 'Chittoor'
  ],
  'Kozhikode': ['Kozhikode', 'Vadakara', 'Koyilandy', 'Feroke', 'Thamarassery', 'Ramanattukara'],
  'Malappuram': ['Manjeri', 'Malappuram', 'Tirur', 'Perinthalmanna', 'Kondotty', 'Nilambur', 'Ponnani', 'Kottakkal'],
  'Kannur': ['Kannur', 'Thalassery', 'Payyannur', 'Mattannur', 'Iritty', 'Taliparamba'],
  'Thrissur': ['Thrissur', 'Chalakudy', 'Guruvayur', 'Kunnamkulam', 'Kodungallur', 'Irinjalakuda'],
  'Palakkad': ['Palakkad', 'Ottapalam', 'Shoranur', 'Chittur', 'Mannarkkad', 'Alathur'],
  'Kottayam': ['Kottayam', 'Changanassery', 'Pala', 'Ettumanoor', 'Vaikom'],
  'Alappuzha': ['Alappuzha', 'Cherthala', 'Kayamkulam', 'Mavelikkara', 'Chengannur'],
  'Thiruvananthapuram': ['Thiruvananthapuram', 'Attingal', 'Neyyattinkara', 'Nedumangad', 'Varkala'],
  'Kollam': ['Kollam', 'Karunagappally', 'Punalur', 'Kottarakkara', 'Paravur'],
  'Idukki': ['Thodupuzha', 'Munnar', 'Kattappana', 'Nedumkandam', 'Adimali'],
  'Wayanad': ['Kalpetta', 'Sulthan Bathery', 'Mananthavady'],
  'Kasaragod': ['Kasaragod', 'Kanhangad', 'Nileshwar', 'Uppala'],
  'Pathanamthitta': ['Pathanamthitta', 'Adoor', 'Thiruvalla', 'Ranni', 'Konni']
};

function getCustomerDistrict(cust) {
  if (!cust) return 'Ernakulam';
  if (typeof cust === 'object') {
    if (cust.district && typeof cust.district === 'string' && cust.district.trim()) return cust.district.trim();
  }
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.district) return found.district.trim();
  }
  return 'Ernakulam';
}

function getCustomerTown(cust) {
  if (!cust) return '';
  if (typeof cust === 'object') {
    if (cust.town && typeof cust.town === 'string' && cust.town.trim()) return cust.town.trim();
    if (cust.area && typeof cust.area === 'string' && cust.area.trim()) return cust.area.trim();
    if (cust.location && typeof cust.location === 'string' && cust.location.trim() && cust.location !== 'Local') return cust.location.trim();
  }
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found) {
      if (found.town && typeof found.town === 'string' && found.town.trim()) return found.town.trim();
      if (found.area && typeof found.area === 'string' && found.area.trim()) return found.area.trim();
      if (found.location && typeof found.location === 'string' && found.location.trim() && found.location !== 'Local') return found.location.trim();
    }
  }
  return '';
}

function getCustomerLandmark(cust) {
  if (!cust) return '';
  if (typeof cust === 'object') {
    if (cust.landmark && typeof cust.landmark === 'string' && cust.landmark.trim()) return cust.landmark.trim();
    if (cust.place && typeof cust.place === 'string' && cust.place.trim() && cust.place !== cust.town && cust.place !== cust.area) return cust.place.trim();
  }
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found) {
      if (found.landmark && typeof found.landmark === 'string' && found.landmark.trim()) return found.landmark.trim();
      if (found.place && typeof found.place === 'string' && found.place.trim()) return found.place.trim();
    }
  }
  return '';
}

function getCustomerPanchayath(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.panchayath && typeof cust.panchayath === 'string') return cust.panchayath.trim();
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.panchayath) return found.panchayath.trim();
  }
  return '';
}

function getCustomerArea(cust) {
  return getCustomerTown(cust);
}

function getCustomerPlace(cust) {
  return getCustomerLandmark(cust) || getCustomerTown(cust);
}

function getCustomerLocation(cust) {
  if (!cust || typeof cust !== 'object') return 'Ernakulam';
  const town = getCustomerTown(cust);
  const dist = getCustomerDistrict(cust) || 'Ernakulam';
  const lm = getCustomerLandmark(cust);
  const pan = getCustomerPanchayath(cust);

  let parts = [];
  if (lm) parts.push(lm);
  if (town) parts.push(town);
  if (dist && dist.toLowerCase() !== (town || '').toLowerCase()) parts.push(dist);
  if (pan) parts.push(`(${pan})`);

  if (parts.length > 0) return parts.join(', ');
  return cust.location || 'Ernakulam';
}

function loadDistrictTowns() {
  let isFirstLoad = false;
  try {
    const raw = localStorage.getItem(STORAGE_SAVED_TOWNS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        savedDistrictTowns = parsed;
      }
    } else {
      isFirstLoad = true;
    }
  } catch (e) {
    console.error('Error loading saved district towns:', e);
    isFirstLoad = true;
  }

  if (!savedDistrictTowns || typeof savedDistrictTowns !== 'object') {
    savedDistrictTowns = {};
  }

  // Ensure all 14 districts are initialized with arrays
  KERALA_DISTRICTS.forEach(d => {
    if (!Array.isArray(savedDistrictTowns[d])) {
      savedDistrictTowns[d] = [...(DEFAULT_DISTRICT_TOWNS[d] || [d])];
    }
  });

  // ONLY harvest existing towns from customer records on the very first initial load
  if (isFirstLoad && Array.isArray(customers)) {
    customers.forEach(c => {
      const dist = c.district || 'Ernakulam';
      const town = c.town || c.area || (c.location && c.location !== 'Local' ? c.location : '');
      if (dist && town && typeof town === 'string' && town.trim()) {
        const clean = town.trim();
        if (!savedDistrictTowns[dist]) savedDistrictTowns[dist] = [];
        if (!savedDistrictTowns[dist].some(t => t.toLowerCase() === clean.toLowerCase())) {
          savedDistrictTowns[dist].push(clean);
        }
      }
    });
    try {
      localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
    } catch (e) {}
  }

  // Sort towns alphabetically per district
  Object.keys(savedDistrictTowns).forEach(d => {
    if (Array.isArray(savedDistrictTowns[d])) {
      savedDistrictTowns[d].sort((a, b) => a.localeCompare(b));
    }
  });
}

function saveNewDistrictTown(district, townName) {
  if (!townName || typeof townName !== 'string') return;
  const dist = district || 'Ernakulam';
  const trimmed = townName.trim();
  if (!trimmed || trimmed.toLowerCase() === 'local' || trimmed.toLowerCase() === 'nil') return;

  // Title case formatting
  const formatted = trimmed.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  if (!savedDistrictTowns[dist]) savedDistrictTowns[dist] = [];
  if (!savedDistrictTowns[dist].some(t => t.toLowerCase() === formatted.toLowerCase())) {
    savedDistrictTowns[dist].push(formatted);
    savedDistrictTowns[dist].sort((a, b) => a.localeCompare(b));
    try {
      localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
    } catch (e) {
      console.error('Error saving district towns to localStorage:', e);
    }
    updateTownDatalists();
  }
}

function onCustDistrictChange(selectedDistrict) {
  const dist = selectedDistrict || 'Ernakulam';
  const datalist = document.getElementById('custTownsDatalist');
  if (datalist) {
    const towns = savedDistrictTowns[dist] || DEFAULT_DISTRICT_TOWNS[dist] || [];
    datalist.innerHTML = towns.map(t => `<option value="${escapeHtml(t)}"></option>`).join('');
  }
}

function onOrderDistrictChange(selectedDistrict) {
  const dist = selectedDistrict || 'Ernakulam';
  const datalist = document.getElementById('orderTownsDatalist');
  if (datalist) {
    const towns = savedDistrictTowns[dist] || DEFAULT_DISTRICT_TOWNS[dist] || [];
    datalist.innerHTML = towns.map(t => `<option value="${escapeHtml(t)}"></option>`).join('');
  }
}

function updateTownDatalists() {
  // 1. Populate Customer Form Datalist based on selected district
  const custDistEl = document.getElementById('custDistrictSelect');
  const custDist = custDistEl ? custDistEl.value : 'Ernakulam';
  onCustDistrictChange(custDist);

  // 2. Populate Order Form Datalist based on selected district
  const orderDistEl = document.getElementById('orderDistrictSelect');
  const orderDist = orderDistEl ? orderDistEl.value : 'Ernakulam';
  onOrderDistrictChange(orderDist);

  // 3. Populate Legacy savedAreasDatalist with all active towns
  const legacyDatalist = document.getElementById('savedAreasDatalist');
  if (legacyDatalist) {
    const allTownsSet = new Set();
    Object.values(savedDistrictTowns).forEach(arr => {
      if (Array.isArray(arr)) arr.forEach(t => allTownsSet.add(t));
    });
    const sortedAll = Array.from(allTownsSet).sort((a, b) => a.localeCompare(b));
    legacyDatalist.innerHTML = sortedAll.map(t => `<option value="${escapeHtml(t)}"></option>`).join('');
  }

  // 4. Populate Customer Directory Town Filter Select (#custTownFilterSelect)
  const townFilter = document.getElementById('custTownFilterSelect');
  if (townFilter) {
    const currentVal = customerTownFilter || townFilter.value || 'all';
    const distFilterVal = customerDistrictFilter || 'all';

    let townsToShow = [];
    if (distFilterVal !== 'all' && savedDistrictTowns[distFilterVal]) {
      townsToShow = savedDistrictTowns[distFilterVal];
    } else {
      const allSet = new Set();
      if (Array.isArray(customers)) {
        customers.forEach(c => {
          const t = getCustomerTown(c);
          if (t) allSet.add(t);
        });
      }
      (savedDistrictTowns['Ernakulam'] || []).forEach(t => allSet.add(t));
      townsToShow = Array.from(allSet).sort((a, b) => a.localeCompare(b));
    }

    // Count customers per town
    const townCounts = {};
    if (Array.isArray(customers)) {
      customers.forEach(c => {
        const t = getCustomerTown(c);
        if (t) {
          const key = t.toLowerCase();
          townCounts[key] = (townCounts[key] || 0) + 1;
        }
      });
    }

    let opts = `<option value="all">🏙️ All Towns (${customers.length})</option>`;
    townsToShow.forEach(t => {
      const count = townCounts[t.toLowerCase()] || 0;
      opts += `<option value="${escapeHtml(t)}">${escapeHtml(t)}${count > 0 ? ` (${count})` : ''}</option>`;
    });

    townFilter.innerHTML = opts;
    townFilter.value = currentVal;
  }

  // 5. Populate Main Orders Table Town Filter Select (#orderAreaFilterSelect)
  const orderFilter = document.getElementById('orderAreaFilterSelect');
  if (orderFilter) {
    const currentVal = orderAreaFilter || orderFilter.value || 'all';
    const allSet = new Set();
    if (Array.isArray(orders)) {
      orders.forEach(o => {
        const t = getCustomerTown(o.customer);
        if (t) allSet.add(t);
      });
    }
    (savedDistrictTowns['Ernakulam'] || []).forEach(t => allSet.add(t));
    const sorted = Array.from(allSet).sort((a, b) => a.localeCompare(b));

    const orderTownCounts = {};
    if (Array.isArray(orders)) {
      orders.forEach(o => {
        const t = getCustomerTown(o.customer);
        if (t) {
          const key = t.toLowerCase();
          orderTownCounts[key] = (orderTownCounts[key] || 0) + 1;
        }
      });
    }

    let opts = `<option value="all">🌍 All Towns / Areas</option>`;
    sorted.forEach(t => {
      const count = orderTownCounts[t.toLowerCase()] || 0;
      opts += `<option value="${escapeHtml(t)}">${escapeHtml(t)}${count > 0 ? ` (${count})` : ''}</option>`;
    });

    orderFilter.innerHTML = opts;
    orderFilter.value = currentVal;
  }
}

function setCustomerDistrictFilter(district) {
  customerDistrictFilter = district || 'all';
  customerTownFilter = 'all'; // reset town filter on district change
  const distSelect = document.getElementById('custDistrictFilterSelect');
  if (distSelect) distSelect.value = customerDistrictFilter;
  updateTownDatalists();
  renderCustomersList();
}

function setCustomerTownFilter(town) {
  customerTownFilter = town || 'all';
  customerAreaFilter = customerTownFilter;
  const townSelect = document.getElementById('custTownFilterSelect');
  if (townSelect) townSelect.value = customerTownFilter;
  renderCustomersList();
}

function setCustomerAreaFilter(area) {
  setCustomerTownFilter(area);
}

function setOrderAreaFilter(area) {
  orderAreaFilter = area || 'all';
  const select = document.getElementById('orderAreaFilterSelect');
  if (select) select.value = orderAreaFilter;
  renderOrdersTable();
}

function populateSavedAreasDatalists() {
  updateTownDatalists();
}

function saveNewArea(areaName) {
  const dist = document.getElementById('custDistrictSelect')?.value || 'Ernakulam';
  saveNewDistrictTown(dist, areaName);
}

function loadSavedAreas() {
  loadDistrictTowns();
}

function getCustomerPhone(cust) {
  if (!cust) return 'Nil';
  if (typeof cust === 'object') {
    if (cust.phone && cust.phone !== 'Nil') return cust.phone;
    if (cust.ownerPhone && cust.ownerPhone !== 'Nil') return cust.ownerPhone;
    if (cust.staffPhone && cust.staffPhone !== 'Nil') return cust.staffPhone;
  }
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found) {
      if (found.phone) return found.phone;
      if (found.ownerPhone) return found.ownerPhone;
      if (found.staffPhone) return found.staffPhone;
    }
  }
  return 'Nil';
}

function getCustomerOwnerName(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.ownerName) return cust.ownerName;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.ownerName) return found.ownerName;
  }
  return '';
}

function getCustomerOwnerPhone(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.ownerPhone) return cust.ownerPhone;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.ownerPhone) return found.ownerPhone;
    if (found && found.phone && !found.staffPhone) return found.phone;
  }
  return '';
}

function getCustomerStaffName(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.staffName) return cust.staffName;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.staffName) return found.staffName;
  }
  return '';
}

function getCustomerStaffRole(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.staffRole) return cust.staffRole;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.staffRole) return found.staffRole;
  }
  return '';
}

function getCustomerStaffPhone(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.staffPhone) return cust.staffPhone;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.staffPhone) return found.staffPhone;
  }
  return '';
}

function getCustomerCategory(cust) {
  if (!cust) return '';
  if (typeof cust === 'object' && cust.category) return cust.category;
  const name = typeof cust === 'string' ? cust : (cust.name || '');
  if (name && Array.isArray(customers)) {
    const clean = name.trim().toLowerCase();
    const found = customers.find(c => c.name && c.name.trim().toLowerCase() === clean);
    if (found && found.category) return found.category;
  }
  return '';
}

function getCustomerCategoryBadge(category) {
  const cat = category || 'Caterer';
  switch (cat) {
    case 'Caterer':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">👨‍🍳 Caterer</span>`;
    case 'Hotel / Restaurant':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">🏨 Hotel</span>`;
    case 'Wholesaler':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">📦 Wholesaler</span>`;
    case 'Retailer':
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">🏪 Retailer</span>`;
    default:
      return `<span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">🏷️ ${escapeHtml(cat)}</span>`;
  }
}

function cleanPhoneNumber(phone) {
  if (!phone) return '';
  let cleaned = String(phone).replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.length === 11 && cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  return cleaned;
}

function isValidPhone(phone) {
  if (!phone || !String(phone).trim()) return true;
  const cleaned = cleanPhoneNumber(phone);
  return cleaned.length === 10;
}

function findDuplicateCustomer(name, ownerPhone = '', staffPhone = '', legacyPhone = '', excludeId = null) {
  const cleanName = (name || '').trim().toLowerCase();
  const cleanOwner = cleanPhoneNumber(ownerPhone);
  const cleanStaff = cleanPhoneNumber(staffPhone);
  const cleanLegacy = cleanPhoneNumber(legacyPhone);

  for (const c of customers) {
    if (excludeId && c.id === excludeId) continue;

    // Check duplicate name
    if (cleanName && c.name && c.name.trim().toLowerCase() === cleanName) {
      return { type: 'name', customer: c };
    }

    const cOwner = cleanPhoneNumber(c.ownerPhone);
    const cStaff = cleanPhoneNumber(c.staffPhone);
    const cPhone = cleanPhoneNumber(c.phone);

    // Check duplicate owner phone against other customers
    if (cleanOwner) {
      if ((cOwner && cOwner === cleanOwner) || (cPhone && cPhone === cleanOwner) || (cStaff && cStaff === cleanOwner)) {
        return { type: 'ownerPhone', customer: c, phone: cleanOwner };
      }
    }

    // Check duplicate staff phone against other customers
    if (cleanStaff) {
      if ((cStaff && cStaff === cleanStaff) || (cOwner && cOwner === cleanStaff) || (cPhone && cPhone === cleanStaff)) {
        return { type: 'staffPhone', customer: c, phone: cleanStaff };
      }
    }

    // Check legacy phone
    if (cleanLegacy) {
      if ((cPhone && cPhone === cleanLegacy) || (cOwner && cOwner === cleanLegacy) || (cStaff && cStaff === cleanLegacy)) {
        return { type: 'phone', customer: c, phone: cleanLegacy };
      }
    }
  }

  return null;
}

function generateNextOrderId() {
  let maxNum = 1000;
  orders.forEach(o => {
    if (o && o.id) {
      const match = String(o.id).match(/^ORD-(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });
  return 'ORD-' + (maxNum + 1);
}

function getCustomerLastRate(customerName, productId) {
  if (!customerName || !customerName.trim()) return null;
  const clean = customerName.trim().toLowerCase();

  for (const o of orders) {
    const oCust = getCustomerName(o.customer).trim().toLowerCase();
    if (oCust === clean) {
      if (o.items && Array.isArray(o.items)) {
        const found = o.items.find(it => it.productId === productId);
        if (found && found.perKgRate) {
          return { rate: parseFloat(found.perKgRate), date: o.date, orderId: o.id };
        }
      }
      if (o.product && o.product.id === productId && o.perKgRate) {
        return { rate: parseFloat(o.perKgRate), date: o.date, orderId: o.id };
      }
    }
  }
  return null;
}

// ==================== DROPDOWNS & SELECTORS ====================

function populateProductDropdown() {
  const select = document.getElementById('riceProductSelect');
  if (select) {
    select.innerHTML = '';
    products.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const cat = p.category ? `[${p.category}] ` : '';
      const bag = p.bagSize ? ` • ${p.bagSize}kg` : '';
      opt.textContent = `${cat}${p.name} (₹${p.defaultRateKg}/kg${bag})`;
      select.appendChild(opt);
    });
  }
}

function populateBagSizesDropdown() {
  const sorted = [...bagSizes].sort((a, b) => a - b);

  // Update modal product form bag size dropdown
  const prodBagSelect = document.getElementById('newProductBagSize');
  if (prodBagSelect) {
    const curVal = prodBagSelect.value;
    prodBagSelect.innerHTML = '';
    sorted.forEach(size => {
      const opt = document.createElement('option');
      opt.value = size;
      opt.textContent = `${size} kg ${size >= 50 ? 'Sack' : 'Bag'}`;
      if (size === 26) opt.selected = true;
      prodBagSelect.appendChild(opt);
    });
    if (curVal && sorted.includes(parseFloat(curVal))) {
      prodBagSelect.value = curVal;
    }
  }

  // Legacy/Single bag size select if present
  const select = document.getElementById('bagSizeSelect');
  if (select) {
    select.innerHTML = '';
    sorted.forEach(size => {
      const opt = document.createElement('option');
      opt.value = size;
      opt.textContent = `${size} kg ${size >= 50 ? 'Sack' : 'Bag'}`;
      if (size === defaultRememberedBagSize) opt.selected = true;
      select.appendChild(opt);
    });
  }
}

function populateCustomerDropdown() {
  const select = document.getElementById('existingCustomerSelect');
  if (!select) return;
  const currentVal = select.value;
  select.innerHTML = '<option value="">-- New Customer (Type Below) --</option>';

  customers.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id;
    opt.textContent = `${c.name} [${c.category || 'Caterer'}] (${c.location || 'Local'}) - ${c.phone || 'No Phone'}`;
    select.appendChild(opt);
  });

  if (currentVal) select.value = currentVal;
}

// ==================== MULTI-PRODUCT ORDER MODAL LOGIC ====================

function openNewOrderModal(preselectedCustomerId = null) {
  try {
    editingOrderId = null;
    const modal = document.getElementById('orderModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const modalTitle = document.getElementById('modalTitleText');
    if (modalTitle) modalTitle.textContent = 'New Wholesale Order';
    const btnDelete = document.getElementById('btnDeleteInsideModal');
    if (btnDelete) btnDelete.classList.add('hidden');
    const btnSubmit = document.getElementById('btnSubmitOrderText');
    if (btnSubmit) btnSubmit.textContent = 'Save Order';

    // 1. Order ID
    const nextId = generateNextOrderId();
    const orderIdDisplay = document.getElementById('orderIdDisplay');
    const modalOrderIdBadge = document.getElementById('modalOrderIdBadge');
    if (orderIdDisplay) orderIdDisplay.value = nextId;
    if (modalOrderIdBadge) modalOrderIdBadge.textContent = nextId;

    // 2. Order Date
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('orderDate');
    if (dateInput) dateInput.value = today;

    // 3. Delivery status
    const delStatus = document.getElementById('orderDeliveryStatus');
    if (delStatus) delStatus.value = 'Normal';

    // 4. Customer inputs
    clearCustomerSearch();
    const nameEl = document.getElementById('customerName');
    if (nameEl) nameEl.value = '';
    const catEl = document.getElementById('customerCategory');
    if (catEl) catEl.value = 'Caterer';

    const distEl = document.getElementById('orderDistrictSelect');
    if (distEl) distEl.value = 'Ernakulam';
    onOrderDistrictChange('Ernakulam');

    const townEl = document.getElementById('orderTownInput');
    if (townEl) townEl.value = '';
    const lmEl = document.getElementById('orderLandmarkInput');
    if (lmEl) lmEl.value = '';
    const panEl = document.getElementById('orderPanchayathInput');
    if (panEl) panEl.value = '';

    const locEl = document.getElementById('customerLocation');
    if (locEl) locEl.value = '';
    const areaEl = document.getElementById('customerArea');
    if (areaEl) areaEl.value = '';
    const placeEl = document.getElementById('customerPlace');
    if (placeEl) placeEl.value = '';

    const ownerNameEl = document.getElementById('customerOwnerName');
    if (ownerNameEl) ownerNameEl.value = '';
    const ownerPhoneEl = document.getElementById('customerOwnerPhone');
    if (ownerPhoneEl) ownerPhoneEl.value = '';

    const staffNameEl = document.getElementById('customerStaffName');
    if (staffNameEl) staffNameEl.value = '';
    const staffRoleEl = document.getElementById('customerStaffRole');
    if (staffRoleEl) staffRoleEl.value = 'Chef / Cook';
    const staffPhoneEl = document.getElementById('customerStaffPhone');
    if (staffPhoneEl) staffPhoneEl.value = '';

    const phoneEl = document.getElementById('customerPhone');
    if (phoneEl) phoneEl.value = '';
    updateCustomerHistoryAlert('');

    // 5. Notes
    const notesEl = document.getElementById('orderNotes');
    if (notesEl) notesEl.value = '';

    // Clear customer search and pill
    clearCustomerSearch();
    const pill = document.getElementById('selectedCustomerPill');
    if (pill) pill.classList.add('hidden');

    // 6. Reset items
    orderItems = [];
    addOrderItemRow();

    if (preselectedCustomerId) {
      selectCustomerFromSearch(preselectedCustomerId);
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error opening new order modal:', err);
  }
}

function openEditOrderModal(orderId) {
  try {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    editingOrderId = order.id;
    const modal = document.getElementById('orderModal');
    if (!modal) return;
    modal.classList.remove('hidden');

    const modalTitle = document.getElementById('modalTitleText');
    if (modalTitle) modalTitle.textContent = 'Edit Wholesale Order';
    const btnDelete = document.getElementById('btnDeleteInsideModal');
    if (btnDelete) btnDelete.classList.remove('hidden');
    const btnSubmit = document.getElementById('btnSubmitOrderText');
    if (btnSubmit) btnSubmit.textContent = 'Update Order';

    const orderIdDisplay = document.getElementById('orderIdDisplay');
    const modalOrderIdBadge = document.getElementById('modalOrderIdBadge');
    if (orderIdDisplay) orderIdDisplay.value = order.id;
    if (modalOrderIdBadge) modalOrderIdBadge.textContent = order.id;

    const dateInput = document.getElementById('orderDate');
    if (dateInput) dateInput.value = order.date || '';

    const delStatus = document.getElementById('orderDeliveryStatus');
    if (delStatus) delStatus.value = order.deliveryStatus || 'Normal';

    clearCustomerSearch();
    const custName = getCustomerName(order.customer);
    const searchInput = document.getElementById('custSearchInput');
    if (searchInput) searchInput.value = custName;
    const nameEl = document.getElementById('customerName');
    if (nameEl) nameEl.value = custName;
    updateCustomerPill(custName, `${getCustomerTown(order.customer) || getCustomerDistrict(order.customer)} • ${getCustomerCategory(order.customer) || 'Caterer'}`);
    const catEl = document.getElementById('customerCategory');
    if (catEl) catEl.value = getCustomerCategory(order.customer) || 'Caterer';

    const dist = getCustomerDistrict(order.customer);
    const distEl = document.getElementById('orderDistrictSelect');
    if (distEl) distEl.value = dist;
    onOrderDistrictChange(dist);

    const townEl = document.getElementById('orderTownInput');
    if (townEl) townEl.value = getCustomerTown(order.customer);
    const lmEl = document.getElementById('orderLandmarkInput');
    if (lmEl) lmEl.value = getCustomerLandmark(order.customer);
    const panEl = document.getElementById('orderPanchayathInput');
    if (panEl) panEl.value = getCustomerPanchayath(order.customer);

    const locEl = document.getElementById('customerLocation');
    if (locEl) locEl.value = getCustomerLocation(order.customer);
    const areaEl = document.getElementById('customerArea');
    if (areaEl) areaEl.value = getCustomerTown(order.customer);
    const placeEl = document.getElementById('customerPlace');
    if (placeEl) placeEl.value = getCustomerLandmark(order.customer) || getCustomerTown(order.customer);

    const ownerNameEl = document.getElementById('customerOwnerName');
    if (ownerNameEl) ownerNameEl.value = getCustomerOwnerName(order.customer);
    const ownerPhoneEl = document.getElementById('customerOwnerPhone');
    if (ownerPhoneEl) ownerPhoneEl.value = getCustomerOwnerPhone(order.customer);

    const staffNameEl = document.getElementById('customerStaffName');
    if (staffNameEl) staffNameEl.value = getCustomerStaffName(order.customer);
    const staffRoleEl = document.getElementById('customerStaffRole');
    if (staffRoleEl) staffRoleEl.value = getCustomerStaffRole(order.customer) || 'Chef / Cook';
    const staffPhoneEl = document.getElementById('customerStaffPhone');
    if (staffPhoneEl) staffPhoneEl.value = getCustomerStaffPhone(order.customer);

    const phoneEl = document.getElementById('customerPhone');
    if (phoneEl) phoneEl.value = getCustomerPhone(order.customer);
    updateCustomerHistoryAlert(getCustomerName(order.customer));

    const notesEl = document.getElementById('orderNotes');
    if (notesEl) notesEl.value = order.notes || '';

    // Load items
    orderItems = [];
    if (order.items && Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach(it => {
        addOrderItemRow({
          productId: it.productId,
          bagSize: parseFloat(it.bagSize) || defaultRememberedBagSize,
          bagQty: parseFloat(it.bagQty) || 1,
          perKgRate: parseFloat(it.perKgRate) || 95
        });
      });
    } else {
      addOrderItemRow({
        productId: order.product?.id || 'p1',
        bagSize: parseFloat(order.bagSize) || defaultRememberedBagSize,
        bagQty: parseFloat(order.bagQty) || 1,
        perKgRate: parseFloat(order.perKgRate) || 95
      });
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error opening edit order modal:', err);
  }
}

function closeOrderModal() {
  const modal = document.getElementById('orderModal');
  if (modal) modal.classList.add('hidden');
  const form = document.getElementById('orderForm');
  if (form) form.reset();
  editingOrderId = null;
  orderItems = [];
}

function deleteCurrentEditingOrder() {
  if (!editingOrderId) return;
  const orderId = editingOrderId;
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  showConfirmModal({
    title: `Delete Order ${orderId}?`,
    message: `Move order <strong>${escapeHtml(orderId)}</strong> (${escapeHtml(getCustomerName(order.customer))} • ${(order.totalKg || 0).toLocaleString('en-IN')} kg) to the Recycle Bin?`,
    hint: '🛡️ Don\'t worry! It will be kept safely in the Recycle Bin. You can undo this immediately or restore it anytime.',
    confirmText: 'Move to Recycle Bin',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      const removed = order;
      orders = orders.filter(o => o.id !== orderId);
      saveDataToStorage();
      deleteCloudOrder(orderId);
      closeOrderModal();
      updateDashboard();

      const trashEntry = moveToTrash(
        'order',
        removed,
        `${removed.id} • ${getCustomerName(removed.customer)}`,
        `${(removed.totalKg || 0).toLocaleString('en-IN')} kg • ₹${(Math.round(removed.totalAmount) || 0).toLocaleString('en-IN')} • ${removed.date || ''}`
      );

      showNotification(`Order ${orderId} moved to Recycle Bin.`, () => {
        restoreTrashItem(trashEntry.trashId);
      });
    }
  });
}

function addOrderItemRow(itemData = null) {
  const defaultProd = products[0] || { id: 'p1', name: 'Wayanadan Kaima Rice', category: 'Kaima', bagSize: 26, defaultRateKg: 96 };
  const prodId = itemData?.productId || defaultProd.id;
  const currentProd = products.find(p => p.id === prodId) || defaultProd;
  const custName = document.getElementById('customerName')?.value || '';

  const lastPriceInfo = getCustomerLastRate(custName, prodId);
  const defaultRate = currentProd.defaultRateKg || 95;
  const initialRate = itemData?.perKgRate !== undefined
    ? itemData.perKgRate
    : (lastPriceInfo ? lastPriceInfo.rate : defaultRate);

  const defaultBag = itemData?.bagSize || currentProd.bagSize || defaultRememberedBagSize || (bagSizes.includes(26) ? 26 : (bagSizes[0] || 25));

  const newItem = {
    uid: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    productId: prodId,
    bagSize: defaultBag,
    bagQty: itemData?.bagQty || 10,
    perKgRate: initialRate,
    lastPriceInfo: lastPriceInfo,
    defaultRate: defaultRate
  };

  orderItems.push(newItem);
  renderOrderItems();
  calculateOrderTotals();
}

function removeOrderItemRow(index) {
  if (orderItems.length > 1) {
    const removedItem = orderItems.splice(index, 1)[0];
    renderOrderItems();
    calculateOrderTotals();
    showNotification('Rice item removed from order.', () => {
      orderItems.splice(index, 0, removedItem);
      renderOrderItems();
      calculateOrderTotals();
      showNotification('✓ Item restored to order!');
    });
  }
}

function renderOrderItems() {
  const container = document.getElementById('orderItemsContainer');
  if (!container) return;

  const custName = document.getElementById('customerName')?.value || '';
  container.innerHTML = '';

  orderItems.forEach((item, index) => {
    const lastPriceInfo = getCustomerLastRate(custName, item.productId);
    item.lastPriceInfo = lastPriceInfo;

    const currentProd = products.find(p => p.id === item.productId) || products[0] || { defaultRateKg: 95 };
    item.defaultRate = currentProd.defaultRateKg || 95;

    const itemWeight = (parseFloat(item.bagSize) || 0) * (parseFloat(item.bagQty) || 0);
    const itemAmount = itemWeight * (parseFloat(item.perKgRate) || 0);

    const card = document.createElement('div');
    card.className = 'bg-white p-3.5 rounded-xl border border-blue-200/90 shadow-xs space-y-3 relative';

    const productOptions = products.map(p => {
      const cat = p.category ? `[${escapeHtml(p.category)}] ` : '';
      const bag = p.bagSize ? ` • ${p.bagSize}kg` : '';
      const star = isSpecialBrand(p.name) ? ' ⭐ (Bonus Brand)' : '';
      return `<option value="${p.id}" ${p.id === item.productId ? 'selected' : ''}>${cat}${escapeHtml(p.name)}${star} (₹${p.defaultRateKg}/kg${bag})</option>`;
    }).join('');

    const bagSizeOptions = bagSizes.map(size =>
      `<option value="${size}" ${parseFloat(size) === parseFloat(item.bagSize) ? 'selected' : ''}>${size} kg ${size >= 50 ? 'Sack' : 'Bag'}</option>`
    ).join('');

    const brandIncentiveNotice = isSpecialBrand(currentProd.name)
      ? '<span class="inline-flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">⭐ 0.33% Bonus Brand</span>'
      : '';

    let priceHelperHtml = '';
    if (lastPriceInfo) {
      priceHelperHtml = `
        <span class="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition" onclick="useCustomerLastPrice(${index})" title="Click to apply last purchase price">
          <span>⚡ Last Price: ₹${lastPriceInfo.rate}/kg (${lastPriceInfo.date})</span>
        </span>
      `;
    } else {
      priceHelperHtml = `
        <span class="text-[10px] text-slate-500">Standard Rate: ₹${item.defaultRate}/kg</span>
      `;
    }

    const canRemove = orderItems.length > 1;

    card.innerHTML = `
      <div class="flex items-center justify-between pb-1 border-b border-slate-100">
        <span class="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
          <span class="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">${index + 1}</span>
          <span>Rice Brand &amp; Bag Selection</span>
        </span>
        ${canRemove ? `
          <button type="button" onclick="removeOrderItemRow(${index})" class="text-rose-500 hover:text-rose-700 text-xs font-semibold flex items-center gap-1 hover:bg-rose-50 px-2 py-0.5 rounded-lg transition" title="Delete this rice item">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            <span>Remove</span>
          </button>
        ` : ''}
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Rice Variety *</label>
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
              <img src="${getProductImageUrl(currentProd)}" alt="${escapeHtml(currentProd.name)}" class="w-full h-full object-cover">
            </div>
            <select onchange="onItemProductChange(${index}, this.value)" class="flex-1 min-w-0 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/30 truncate">
              ${productOptions}
            </select>
          </div>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Bag Size (KG) *</label>
          <select onchange="onItemBagSizeChange(${index}, this.value)" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800 focus:ring-2 focus:ring-blue-500/30">
            ${bagSizeOptions}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">No. of Bags *</label>
          <input type="number" min="1" value="${item.bagQty}" oninput="onItemQtyChange(${index}, this.value)" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/30" required>
        </div>
        <div>
          <label class="block text-[11px] font-bold text-slate-700 mb-1">Rate / KG (₹) *</label>
          <input type="number" step="0.5" min="1" value="${item.perKgRate}" oninput="onItemRateChange(${index}, this.value)" class="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/30" required>
        </div>
        <div class="bg-blue-50/70 p-2 rounded-lg border border-blue-100 text-right flex flex-col justify-center h-[38px]">
          <div class="text-[10px] text-slate-500 font-semibold">${itemWeight.toLocaleString('en-IN')} kg</div>
          <div class="text-xs font-black text-blue-900">₹${Math.round(itemAmount).toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="pt-0.5 flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2 flex-wrap">
          ${priceHelperHtml}
          ${brandIncentiveNotice}
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Per Bag: ₹${Math.round((parseFloat(item.bagSize) || 0) * (parseFloat(item.perKgRate) || 0)).toLocaleString('en-IN')}</span>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function onItemProductChange(index, newProductId) {
  if (!orderItems[index]) return;
  orderItems[index].productId = newProductId;

  const currentProd = products.find(p => p.id === newProductId);
  if (currentProd && currentProd.bagSize) {
    orderItems[index].bagSize = currentProd.bagSize;
  } else if (!orderItems[index].bagSize) {
    orderItems[index].bagSize = defaultRememberedBagSize || 26;
  }

  const custName = document.getElementById('customerName')?.value || '';
  const lastPriceInfo = getCustomerLastRate(custName, newProductId);

  const defaultRate = currentProd ? (currentProd.defaultRateKg || 95) : 95;
  orderItems[index].perKgRate = lastPriceInfo ? lastPriceInfo.rate : defaultRate;
  orderItems[index].lastPriceInfo = lastPriceInfo;
  orderItems[index].defaultRate = defaultRate;

  renderOrderItems();
  calculateOrderTotals();
}

function onItemBagSizeChange(index, newSize) {
  if (!orderItems[index]) return;
  const numSize = parseFloat(newSize) || 26;
  orderItems[index].bagSize = numSize;

  defaultRememberedBagSize = numSize;
  try {
    localStorage.setItem(STORAGE_LAST_BAG_SIZE, numSize.toString());
  } catch (e) {}

  renderOrderItems();
  calculateOrderTotals();
}

function onItemQtyChange(index, newQty) {
  if (!orderItems[index]) return;
  orderItems[index].bagQty = parseFloat(newQty) || 0;
  calculateOrderTotals();
  updateCardSubtotal(index);
}

function onItemRateChange(index, newRate) {
  if (!orderItems[index]) return;
  orderItems[index].perKgRate = parseFloat(newRate) || 0;
  calculateOrderTotals();
  updateCardSubtotal(index);
}

function useCustomerLastPrice(index) {
  if (!orderItems[index] || !orderItems[index].lastPriceInfo) return;
  orderItems[index].perKgRate = orderItems[index].lastPriceInfo.rate;
  renderOrderItems();
  calculateOrderTotals();
}

function updateCardSubtotal(index) {
  const container = document.getElementById('orderItemsContainer');
  if (!container) return;
  const cards = container.children;
  if (!cards || !cards[index]) return;

  const item = orderItems[index];
  const itemWeight = (parseFloat(item.bagSize) || 0) * (parseFloat(item.bagQty) || 0);
  const itemAmount = itemWeight * (parseFloat(item.perKgRate) || 0);

  const subtotalBox = cards[index].querySelector('.bg-blue-50\\/70');
  if (subtotalBox) {
    subtotalBox.innerHTML = `
      <div class="text-[10px] text-slate-500 font-semibold">${itemWeight.toLocaleString('en-IN')} kg</div>
      <div class="text-xs font-black text-blue-900">₹${Math.round(itemAmount).toLocaleString('en-IN')}</div>
    `;
  }
}

function calculateOrderTotals() {
  let totalBags = 0;
  let totalKg = 0;
  let totalAmount = 0;

  orderItems.forEach(item => {
    const size = parseFloat(item.bagSize) || 0;
    const qty = parseFloat(item.bagQty) || 0;
    const rate = parseFloat(item.perKgRate) || 0;
    const weight = size * qty;
    const amount = weight * rate;

    item.totalKg = weight;
    item.totalAmount = amount;

    totalBags += qty;
    totalKg += weight;
    totalAmount += amount;
  });

  const bagsEl = document.getElementById('summaryTotalBags');
  const kgEl = document.getElementById('summaryTotalKg');
  const amtEl = document.getElementById('summaryTotalAmount');

  if (bagsEl) bagsEl.textContent = `${totalBags} Bags`;
  if (kgEl) kgEl.textContent = `${totalKg.toLocaleString('en-IN')} kg`;
  if (amtEl) amtEl.textContent = `₹${Math.round(totalAmount).toLocaleString('en-IN')}`;
}

// ==================== CUSTOMER AUTO-COMPLETE ====================

function onCustomerSearchInput(query) {
  const nameEl = document.getElementById('customerName');
  if (nameEl) nameEl.value = query;

  const clearBtn = document.getElementById('clearCustSearchBtn');
  if (clearBtn) {
    if (query && query.trim()) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  const pill = document.getElementById('selectedCustomerPill');
  if (pill && (!query || !query.trim())) {
    pill.classList.add('hidden');
  }

  showCustomerSearchDropdown(query);
}

function showCustomerSearchDropdown(filterQuery = '') {
  const dropdown = document.getElementById('custSearchDropdown');
  if (!dropdown) return;

  const rawQ = (filterQuery !== undefined && filterQuery !== null && filterQuery !== '')
    ? filterQuery
    : (document.getElementById('custSearchInput')?.value || '');
  const q = rawQ.trim().toLowerCase();

  const clearBtn = document.getElementById('clearCustSearchBtn');
  if (clearBtn) {
    if (rawQ.trim()) clearBtn.classList.remove('hidden');
    else clearBtn.classList.add('hidden');
  }

  const matches = customers.filter(c => {
    if (!q) return true;
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(q)) ||
      (c.ownerPhone && c.ownerPhone.includes(q)) ||
      (c.staffName && c.staffName.toLowerCase().includes(q)) ||
      (c.staffRole && c.staffRole.toLowerCase().includes(q)) ||
      (c.staffPhone && c.staffPhone.includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q)) ||
      (c.town && c.town.toLowerCase().includes(q)) ||
      (c.landmark && c.landmark.toLowerCase().includes(q)) ||
      (c.panchayath && c.panchayath.toLowerCase().includes(q)) ||
      (c.area && c.area.toLowerCase().includes(q)) ||
      (c.place && c.place.toLowerCase().includes(q)) ||
      (c.location && c.location.toLowerCase().includes(q)) ||
      (c.category && c.category.toLowerCase().includes(q))
    );
  });

  dropdown.innerHTML = '';
  if (matches.length === 0) {
    if (q) {
      const escapedQuery = escapeHtml(rawQ.trim());
      const encodedQuery = encodeURIComponent(rawQ.trim());
      dropdown.innerHTML = `
        <div class="p-3 text-center">
          <div class="text-xs text-slate-500 mb-2">No existing customer matching "<strong>${escapedQuery}</strong>"</div>
          <button type="button" onclick="quickCreateCustomerFromSearch(decodeURIComponent('${encodedQuery}'))" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm active:scale-95">
            <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
            <span>+ Add as New Customer</span>
          </button>
        </div>
      `;
    } else {
      dropdown.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">Type customer name, phone, or location to search...</div>';
    }
    dropdown.classList.remove('hidden');
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
    return;
  }

  matches.slice(0, 8).forEach(c => {
    const item = document.createElement('div');
    item.className = 'p-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-xs transition border-b border-slate-100 last:border-0';
    item.onclick = () => selectCustomerFromSearch(c.id);

    const catBadge = getCustomerCategoryBadge(c.category || 'Caterer');
    const members = getCustomerMembers(c);
    let contactSnippet = '';
    if (members.length > 0) {
      contactSnippet = members.map(m => `${escapeHtml(m.name)} (${escapeHtml(m.role)})${m.phone ? ` - ${escapeHtml(m.phone)}` : ''}`).join(' • ');
    } else {
      contactSnippet = c.phone || 'No Phone';
    }

    item.innerHTML = `
      <div class="flex-1 pr-2">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-bold text-slate-900">${escapeHtml(c.name)}</span>
          ${catBadge}
        </div>
        <div class="text-[11px] text-slate-500 mt-0.5">
          ${escapeHtml(c.location || 'Local')} • <span class="text-slate-600 font-medium">${contactSnippet}</span>
        </div>
      </div>
      <span class="text-[10px] text-blue-700 font-bold bg-blue-100/70 hover:bg-blue-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 shrink-0">
        <i data-lucide="check" class="w-3 h-3"></i>
        <span>Select</span>
      </span>
    `;
    dropdown.appendChild(item);
  });

  dropdown.classList.remove('hidden');
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function quickCreateCustomerFromSearch(name) {
  const nameEl = document.getElementById('customerName');
  const searchInput = document.getElementById('custSearchInput');
  const dropdown = document.getElementById('custSearchDropdown');
  const clearBtn = document.getElementById('clearCustSearchBtn');

  if (nameEl) nameEl.value = name;
  if (searchInput) searchInput.value = name;
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (dropdown) dropdown.classList.add('hidden');

  updateCustomerPill(name, 'New Customer (Unsaved)');
  updateCustomerHistoryAlert('');
  openQuickNewCustomerModal();
}

function hideCustomerSearchDropdown() {
  setTimeout(() => {
    const dropdown = document.getElementById('custSearchDropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }, 200);
}

function clearCustomerSearch() {
  const searchInput = document.getElementById('custSearchInput');
  if (searchInput) searchInput.value = '';
  const nameEl = document.getElementById('customerName');
  if (nameEl) nameEl.value = '';
  const clearBtn = document.getElementById('clearCustSearchBtn');
  if (clearBtn) clearBtn.classList.add('hidden');
  const dropdown = document.getElementById('custSearchDropdown');
  if (dropdown) dropdown.classList.add('hidden');
  const pill = document.getElementById('selectedCustomerPill');
  if (pill) pill.classList.add('hidden');
  updateCustomerHistoryAlert('');
}

function updateCustomerPill(name, meta) {
  const pill = document.getElementById('selectedCustomerPill');
  const nameText = document.getElementById('selectedCustomerNameText');
  const metaText = document.getElementById('selectedCustomerMetaText');

  if (!pill) return;
  if (name && name.trim()) {
    if (nameText) nameText.textContent = name;
    if (metaText) metaText.textContent = meta || 'Customer';
    pill.classList.remove('hidden');
  } else {
    pill.classList.add('hidden');
  }
}

function selectCustomerFromSearch(custId) {
  const cust = customers.find(c => c.id === custId);
  if (!cust) return;

  const nameEl = document.getElementById('customerName');
  const catEl = document.getElementById('customerCategory');
  const locEl = document.getElementById('customerLocation');
  const ownerNameEl = document.getElementById('customerOwnerName');
  const ownerPhoneEl = document.getElementById('customerOwnerPhone');
  const staffNameEl = document.getElementById('customerStaffName');
  const staffRoleEl = document.getElementById('customerStaffRole');
  const staffPhoneEl = document.getElementById('customerStaffPhone');
  const phoneEl = document.getElementById('customerPhone');
  const searchInput = document.getElementById('custSearchInput');
  const clearBtn = document.getElementById('clearCustSearchBtn');
  const dropdown = document.getElementById('custSearchDropdown');

  if (nameEl) nameEl.value = cust.name || '';
  if (catEl) catEl.value = cust.category || 'Caterer';
  if (locEl) locEl.value = getCustomerLocation(cust);

  const dist = getCustomerDistrict(cust);
  const distEl = document.getElementById('orderDistrictSelect');
  if (distEl) distEl.value = dist;
  onOrderDistrictChange(dist);

  const townEl = document.getElementById('orderTownInput');
  if (townEl) townEl.value = getCustomerTown(cust);
  const lmEl = document.getElementById('orderLandmarkInput');
  if (lmEl) lmEl.value = getCustomerLandmark(cust);
  const panEl = document.getElementById('orderPanchayathInput');
  if (panEl) panEl.value = getCustomerPanchayath(cust);

  const areaEl = document.getElementById('customerArea');
  const placeEl = document.getElementById('customerPlace');
  if (areaEl) areaEl.value = getCustomerTown(cust);
  if (placeEl) placeEl.value = getCustomerLandmark(cust) || getCustomerTown(cust);
  if (ownerNameEl) ownerNameEl.value = cust.ownerName || '';
  if (ownerPhoneEl) ownerPhoneEl.value = cust.ownerPhone || '';
  if (staffNameEl) staffNameEl.value = cust.staffName || '';
  if (staffRoleEl) staffRoleEl.value = cust.staffRole || 'Chef / Cook';
  if (staffPhoneEl) staffPhoneEl.value = cust.staffPhone || '';
  if (phoneEl) phoneEl.value = cust.ownerPhone || cust.staffPhone || cust.phone || '';

  if (searchInput) searchInput.value = cust.name || '';
  if (clearBtn) clearBtn.classList.remove('hidden');
  if (dropdown) dropdown.classList.add('hidden');

  updateCustomerPill(cust.name, `${getCustomerTown(cust) || getCustomerDistrict(cust)} • ${cust.category || 'Caterer'}`);
  updateCustomerHistoryAlert(cust.name);
  refreshItemRatesForCustomer(cust.name);
}

function openQuickNewCustomerModal(isEdit = false) {
  const modal = document.getElementById('quickNewCustomerModal');
  if (!modal) return;

  const currentName = (document.getElementById('customerName')?.value || document.getElementById('custSearchInput')?.value || '').trim();
  const quickNameInput = document.getElementById('quickCustNameInput');
  if (quickNameInput) quickNameInput.value = currentName;

  const titleEl = document.getElementById('quickCustModalTitle');
  if (titleEl) {
    titleEl.textContent = isEdit ? 'Edit Customer Details' : 'Add New Customer';
  }

  modal.classList.remove('hidden');

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeQuickNewCustomerModal() {
  const modal = document.getElementById('quickNewCustomerModal');
  if (modal) modal.classList.add('hidden');
}

function onQuickCustNameInput(val) {
  const nameEl = document.getElementById('customerName');
  const searchInput = document.getElementById('custSearchInput');
  if (nameEl) nameEl.value = val;
  if (searchInput) searchInput.value = val;
}

function saveQuickCustomerAndApply() {
  const quickName = (document.getElementById('quickCustNameInput')?.value || '').trim();
  if (!quickName) {
    alert('Please enter a Customer or Shop Name.');
    return;
  }

  const nameEl = document.getElementById('customerName');
  const searchInput = document.getElementById('custSearchInput');
  if (nameEl) nameEl.value = quickName;
  if (searchInput) searchInput.value = quickName;

  const town = document.getElementById('orderTownInput')?.value.trim() || '';
  const dist = document.getElementById('orderDistrictSelect')?.value || 'Ernakulam';
  const cat = document.getElementById('customerCategory')?.value || 'Caterer';

  updateCustomerPill(quickName, `${town || dist} • ${cat}`);

  const saveCheck = document.getElementById('saveCustomerCheckbox');
  if (!saveCheck || saveCheck.checked) {
    const ownerName = document.getElementById('customerOwnerName')?.value.trim() || '';
    const ownerPhone = cleanPhoneNumber(document.getElementById('customerOwnerPhone')?.value.trim() || '');
    const staffName = document.getElementById('customerStaffName')?.value.trim() || '';
    const staffRole = document.getElementById('customerStaffRole')?.value || 'Chef / Cook';
    const staffPhone = cleanPhoneNumber(document.getElementById('customerStaffPhone')?.value.trim() || '');
    const landmark = document.getElementById('orderLandmarkInput')?.value.trim() || '';
    const panchayath = document.getElementById('orderPanchayathInput')?.value.trim() || '';

    let locParts = [];
    if (landmark) locParts.push(landmark);
    if (town) locParts.push(town);
    if (dist && dist.toLowerCase() !== town.toLowerCase()) locParts.push(dist);
    if (panchayath) locParts.push(`(${panchayath})`);
    const formattedLoc = locParts.length > 0 ? locParts.join(', ') : dist;

    let existingIndex = customers.findIndex(c => c.name && c.name.toLowerCase() === quickName.toLowerCase());
    if (existingIndex !== -1) {
      customers[existingIndex] = {
        ...customers[existingIndex],
        category: cat,
        district: dist,
        town: town,
        landmark: landmark,
        panchayath: panchayath,
        location: formattedLoc,
        ownerName: ownerName || customers[existingIndex].ownerName,
        ownerPhone: ownerPhone || customers[existingIndex].ownerPhone,
        staffName: staffName || customers[existingIndex].staffName,
        staffRole: staffRole || customers[existingIndex].staffRole,
        staffPhone: staffPhone || customers[existingIndex].staffPhone,
        phone: ownerPhone || staffPhone || customers[existingIndex].phone || 'Nil'
      };
      syncCloudCustomer(customers[existingIndex]);
    } else {
      const newCust = {
        id: `CUST-${Date.now()}`,
        name: quickName,
        category: cat,
        district: dist,
        town: town,
        landmark: landmark,
        panchayath: panchayath,
        location: formattedLoc,
        ownerName: ownerName,
        ownerPhone: ownerPhone,
        staffName: staffName,
        staffRole: staffRole,
        staffPhone: staffPhone,
        phone: ownerPhone || staffPhone || 'Nil'
      };
      customers.push(newCust);
      syncCloudCustomer(newCust);
    }
    saveDataToStorage();
    populateCustomerDropdown();
  }

  closeQuickNewCustomerModal();
  showNotification(`Customer '${quickName}' applied to order!`);
}

function onCustomerNameManualChange() {
  const name = document.getElementById('customerName')?.value || '';
  updateCustomerHistoryAlert(name);
  refreshItemRatesForCustomer(name);
}

function updateCustomerHistoryAlert(customerName) {
  const alertEl = document.getElementById('customerHistoryAlert');
  const alertText = document.getElementById('customerHistoryText');
  if (!alertEl || !alertText) return;

  if (!customerName || !customerName.trim()) {
    alertEl.classList.add('hidden');
    return;
  }

  const clean = customerName.trim().toLowerCase();
  const custOrders = orders.filter(o => getCustomerName(o.customer).trim().toLowerCase() === clean);
  const totalKg = custOrders.reduce((sum, o) => sum + (parseFloat(o.totalKg) || 0), 0);
  const custObj = customers.find(c => c.name && c.name.toLowerCase() === clean);
  const catLabel = custObj && custObj.category ? ` [${custObj.category}]` : '';

  const members = custObj ? getCustomerMembers(custObj) : [];
  const memberManageBtn = custObj
    ? `<button type="button" onclick="openCustomerDetailModal('${custObj.id}')" class="underline font-bold text-blue-700 hover:text-blue-900 ml-1.5 inline-flex items-center gap-0.5"><i data-lucide="users" class="w-3.5 h-3.5"></i><span>Manage Team Members (${members.length})</span></button>`
    : '';

  if (custOrders.length > 0) {
    alertText.innerHTML = `✓ Regular Customer: <b>${escapeHtml(customerName)}${catLabel}</b> has placed <b>${custOrders.length}</b> orders (${totalKg.toLocaleString('en-IN')} kg purchased previously). ${memberManageBtn}`;
    alertEl.classList.remove('hidden');
  } else if (custObj) {
    alertText.innerHTML = `✓ Customer Profile: <b>${escapeHtml(customerName)}${catLabel}</b>. ${memberManageBtn}`;
    alertEl.classList.remove('hidden');
  } else {
    alertEl.classList.add('hidden');
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function refreshItemRatesForCustomer(customerName) {
  if (!customerName) return;

  orderItems.forEach(item => {
    const lastPriceInfo = getCustomerLastRate(customerName, item.productId);
    item.lastPriceInfo = lastPriceInfo;
    if (lastPriceInfo) {
      item.perKgRate = lastPriceInfo.rate;
    }
  });

  renderOrderItems();
  calculateOrderTotals();
}

// ==================== SAVE ORDER ====================

function handleSaveOrder(event) {
  event.preventDefault();

  const customerName = document.getElementById('customerName')?.value.trim();
  const customerCategory = document.getElementById('customerCategory')?.value || 'Caterer';
  const customerDistrict = document.getElementById('orderDistrictSelect')?.value || 'Ernakulam';
  const customerTown = document.getElementById('orderTownInput')?.value.trim() || document.getElementById('customerArea')?.value.trim() || '';
  const customerLandmark = document.getElementById('orderLandmarkInput')?.value.trim() || document.getElementById('customerPlace')?.value.trim() || '';
  const customerPanchayath = document.getElementById('orderPanchayathInput')?.value.trim() || '';
  const customerLocationRaw = document.getElementById('customerLocation')?.value.trim() || '';

  if (customerTown) {
    saveNewDistrictTown(customerDistrict, customerTown);
  }

  // Location string formatting
  let locParts = [];
  if (customerLandmark) locParts.push(customerLandmark);
  if (customerTown) locParts.push(customerTown);
  if (customerDistrict && customerDistrict.toLowerCase() !== (customerTown || '').toLowerCase()) locParts.push(customerDistrict);
  if (customerPanchayath) locParts.push(`(${customerPanchayath})`);
  const customerLocation = locParts.length > 0 ? locParts.join(', ') : (customerLocationRaw || 'Ernakulam');

  const customerArea = customerTown;
  const customerPlace = customerLandmark || customerTown;

  const customerOwnerName = document.getElementById('customerOwnerName')?.value.trim() || '';
  const customerOwnerPhoneRaw = document.getElementById('customerOwnerPhone')?.value.trim() || '';
  const customerStaffName = document.getElementById('customerStaffName')?.value.trim() || '';
  const customerStaffRole = document.getElementById('customerStaffRole')?.value || 'Chef / Cook';
  const customerStaffPhoneRaw = document.getElementById('customerStaffPhone')?.value.trim() || '';
  const customerPhoneRaw = document.getElementById('customerPhone')?.value.trim() || '';
  const orderDate = document.getElementById('orderDate')?.value;
  const deliveryStatus = document.getElementById('orderDeliveryStatus')?.value || 'Normal';
  const notes = document.getElementById('orderNotes')?.value.trim() || '';

  if (!customerName) {
    alert('Please enter a customer or shop name.');
    return;
  }

  // Validate Owner Phone if provided
  let cleanOwnerPhone = '';
  if (customerOwnerPhoneRaw) {
    cleanOwnerPhone = cleanPhoneNumber(customerOwnerPhoneRaw);
    if (cleanOwnerPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for Owner (or leave blank). You entered: ' + customerOwnerPhoneRaw);
      return;
    }
  }

  // Validate Staff Phone if provided
  let cleanStaffPhone = '';
  if (customerStaffPhoneRaw) {
    cleanStaffPhone = cleanPhoneNumber(customerStaffPhoneRaw);
    if (cleanStaffPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for Staff (or leave blank). You entered: ' + customerStaffPhoneRaw);
      return;
    }
  }

  const primaryPhone = cleanOwnerPhone || cleanStaffPhone || cleanPhoneNumber(customerPhoneRaw) || '';

  if (orderItems.length === 0) {
    alert('Please add at least one rice item.');
    return;
  }

  // Save/update customer in directory if requested
  const saveCustCheck = document.getElementById('saveCustomerCheckbox');
  const shouldSaveCust = saveCustCheck ? saveCustCheck.checked : true;
  if (shouldSaveCust && customerName) {
    let existingIndex = customers.findIndex(c => c.name && c.name.toLowerCase() === customerName.toLowerCase());
    if (existingIndex === -1 && (cleanOwnerPhone || cleanStaffPhone)) {
      existingIndex = customers.findIndex(c => {
        const cOwn = cleanPhoneNumber(c.ownerPhone);
        const cStf = cleanPhoneNumber(c.staffPhone);
        const cPh = cleanPhoneNumber(c.phone);
        return (cleanOwnerPhone && (cOwn === cleanOwnerPhone || cPh === cleanOwnerPhone)) ||
               (cleanStaffPhone && (cStf === cleanStaffPhone || cPh === cleanStaffPhone));
      });
    }

    if (existingIndex === -1) {
      const newCust = {
        id: 'c_' + Date.now(),
        name: customerName,
        category: customerCategory,
        district: customerDistrict,
        town: customerTown,
        landmark: customerLandmark,
        panchayath: customerPanchayath,
        area: customerArea,
        place: customerPlace,
        ownerName: customerOwnerName,
        ownerPhone: cleanOwnerPhone,
        staffName: customerStaffName,
        staffRole: customerStaffRole,
        staffPhone: cleanStaffPhone,
        phone: primaryPhone,
        location: customerLocation || 'Ernakulam',
        notes: 'Added from order'
      };
      customers.push(newCust);
      saveDataToStorage();
      syncCloudCustomer(newCust);
      populateCustomerDropdown();
      populateSavedAreasDatalists();
    } else {
      let changed = false;
      const target = customers[existingIndex];
      if (customerDistrict && (!target.district || target.district === 'Ernakulam')) { target.district = customerDistrict; changed = true; }
      if (customerTown && !target.town) { target.town = customerTown; target.area = customerTown; changed = true; }
      if (customerLandmark && !target.landmark) { target.landmark = customerLandmark; target.place = customerLandmark; changed = true; }
      if (customerPanchayath && !target.panchayath) { target.panchayath = customerPanchayath; changed = true; }
      if (!target.ownerName && customerOwnerName) { target.ownerName = customerOwnerName; changed = true; }
      if (!target.ownerPhone && cleanOwnerPhone) { target.ownerPhone = cleanOwnerPhone; changed = true; }
      if (!target.staffName && customerStaffName) { target.staffName = customerStaffName; changed = true; }
      if ((!target.staffRole || target.staffRole === 'Chef / Cook') && customerStaffRole) { target.staffRole = customerStaffRole; changed = true; }
      if (!target.staffPhone && cleanStaffPhone) { target.staffPhone = cleanStaffPhone; changed = true; }
      if (!target.phone && primaryPhone) { target.phone = primaryPhone; changed = true; }
      if (customerArea && !target.area) { target.area = customerArea; changed = true; }
      if (customerPlace && !target.place) { target.place = customerPlace; changed = true; }
      if ((!target.location || target.location === 'Local' || target.location === 'Ernakulam') && customerLocation) {
        target.location = customerLocation;
        changed = true;
      }
      if (!target.category && customerCategory) {
        target.category = customerCategory;
        changed = true;
      }
      if (changed) {
        saveDataToStorage();
        syncCloudCustomer(target);
        populateSavedAreasDatalists();
      }
    }
  }

  // Calculate order totals
  let totalBags = 0;
  let totalKg = 0;
  let totalAmount = 0;

  const sanitizedItems = orderItems.map(item => {
    const size = parseFloat(item.bagSize) || 25;
    const qty = parseFloat(item.bagQty) || 1;
    const rate = parseFloat(item.perKgRate) || 95;
    const weight = size * qty;
    const amount = weight * rate;

    totalBags += qty;
    totalKg += weight;
    totalAmount += amount;

    const prod = products.find(p => p.id === item.productId) || { name: 'Biriyani Rice' };

    return {
      productId: item.productId,
      productName: prod.name,
      bagSize: size,
      bagQty: qty,
      perKgRate: rate,
      totalKg: weight,
      totalAmount: Math.round(amount)
    };
  });

  const firstProd = sanitizedItems[0];
  const primaryProductDisplay = sanitizedItems.length === 1
    ? firstProd.productName
    : `${firstProd.productName} (+${sanitizedItems.length - 1} more)`;

  const averagePerKgRate = totalKg > 0 ? (totalAmount / totalKg) : (firstProd.perKgRate || 95);

  if (editingOrderId) {
    const existingIndex = orders.findIndex(o => o.id === editingOrderId);
    if (existingIndex !== -1) {
      const prevOrder = orders[existingIndex];
      const updatedOrder = {
        ...prevOrder,
        id: editingOrderId,
        date: orderDate,
        deliveryStatus: deliveryStatus,
        customer: {
          name: customerName,
          category: customerCategory,
          district: customerDistrict,
          town: customerTown,
          landmark: customerLandmark,
          panchayath: customerPanchayath,
          area: customerArea,
          place: customerPlace,
          location: customerLocation || 'Ernakulam',
          ownerName: customerOwnerName,
          ownerPhone: cleanOwnerPhone,
          staffName: customerStaffName,
          staffRole: customerStaffRole,
          staffPhone: cleanStaffPhone,
          phone: primaryPhone || 'Nil'
        },
        items: sanitizedItems,
        product: { id: firstProd.productId, name: primaryProductDisplay },
        bagSize: firstProd.bagSize,
        bagQty: totalBags,
        totalKg: totalKg,
        perKgRate: Math.round(averagePerKgRate * 100) / 100,
        totalAmount: Math.round(totalAmount),
        notes: notes
      };
      orders[existingIndex] = updatedOrder;
      saveDataToStorage();
      syncCloudOrder(updatedOrder);
      closeOrderModal();
      updateDashboard();
      showNotification(`Order ${editingOrderId} updated successfully!`);
      showOrderSuccessWhatsAppModal(editingOrderId);
    }
  } else {
    const newId = generateNextOrderId();
    const newOrder = {
      id: newId,
      date: orderDate,
      deliveryStatus: deliveryStatus,
      customer: {
        name: customerName,
        category: customerCategory,
        district: customerDistrict,
        town: customerTown,
        landmark: customerLandmark,
        panchayath: customerPanchayath,
        area: customerArea,
        place: customerPlace,
        location: customerLocation || 'Ernakulam',
        ownerName: customerOwnerName,
        ownerPhone: cleanOwnerPhone,
        staffName: customerStaffName,
        staffRole: customerStaffRole,
        staffPhone: cleanStaffPhone,
        phone: primaryPhone || 'Nil'
      },
      items: sanitizedItems,
      product: { id: firstProd.productId, name: primaryProductDisplay },
      bagSize: firstProd.bagSize,
      bagQty: totalBags,
      totalKg: totalKg,
      perKgRate: Math.round(averagePerKgRate * 100) / 100,
      totalAmount: Math.round(totalAmount),
      notes: notes,
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    saveDataToStorage();
    syncCloudOrder(newOrder);
    closeOrderModal();
    updateDashboard();
    showNotification(`New order ${newId} recorded! (${totalKg.toLocaleString('en-IN')} kg - ₹${Math.round(totalAmount).toLocaleString('en-IN')})`);
    showOrderSuccessWhatsAppModal(newId);
  }
}

function deleteOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  showConfirmModal({
    title: `Delete Order ${orderId}?`,
    message: `Move order <strong>${escapeHtml(orderId)}</strong> (${escapeHtml(getCustomerName(order.customer))} • ${(order.totalKg || 0).toLocaleString('en-IN')} kg) to the Recycle Bin?`,
    hint: '🛡️ Don\'t worry! It will be kept safely in the Recycle Bin. You can undo this action immediately or restore it anytime.',
    confirmText: 'Move to Recycle Bin',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      const removed = order;
      orders = orders.filter(o => o.id !== orderId);
      saveDataToStorage();
      deleteCloudOrder(orderId);
      updateDashboard();

      const trashEntry = moveToTrash(
        'order',
        removed,
        `${removed.id} • ${getCustomerName(removed.customer)}`,
        `${(removed.totalKg || 0).toLocaleString('en-IN')} kg • ₹${(Math.round(removed.totalAmount) || 0).toLocaleString('en-IN')} • ${removed.date || ''}`
      );

      showNotification(`Order ${orderId} moved to Recycle Bin.`, () => {
        restoreTrashItem(trashEntry.trashId);
      });
    }
  });
}

// ==================== INCENTIVE SCHEME & CALCULATION ====================
// Scheme Effective Date: Date-gating for the current active incentive scheme (started May 2026).
// 1. General Volume Slab: Starts ONLY after achieving the first 10,000 kg (First 10,000 kg = ₹5,000, then +₹1/kg). Under 10,000 kg = ₹0.
// 2. Special Brands Turnover Incentive: Mohabbath Green, Mohabbath Gold, Jasmine
//    - ₹15 Lakhs: 0.15%
//    - ₹20 Lakhs: 0.25%
//    - ₹25 Lakhs+: 0.33%
// 3. Pre-Scheme Sales (< Effective Date): Separated pending user rules for earlier scheme.

function formatSchemeDate(dateStr) {
  if (!dateStr) return '01 May 2026';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${String(day).padStart(2, '0')} ${monthNames[month] || ''} ${year}`;
    }
  } catch (e) {}
  return dateStr;
}

function updateSchemeEffectiveDate(newDate) {
  if (!newDate) return;
  incentiveSchemeEffectiveDate = newDate;
  try {
    localStorage.setItem(STORAGE_INCENTIVE_EFFECTIVE_DATE, newDate);
  } catch (e) {
    console.warn('Could not save scheme effective date:', e);
  }
  updateDashboard();
  if (typeof showNotification === 'function') {
    showNotification(`Active scheme start date updated to ${formatSchemeDate(newDate)}`);
  }
}

function calculateIncentive(ordersList = [], totalKg = 0) {
  const BASE_TARGET_KG = 10000;
  const BASE_INCENTIVE = 5000;
  const EXTRA_PER_KG_RATE = 1.0;
  const effectiveDate = incentiveSchemeEffectiveDate || '2026-05-01';

  // Partition orders: Active Scheme (date >= effectiveDate) vs Pre-Scheme (date < effectiveDate)
  const currentOrders = [];
  const preSchemeOrders = [];

  (ordersList || []).forEach(o => {
    if (!o) return;
    const orderDate = o.date || '1970-01-01';
    if (orderDate >= effectiveDate) {
      currentOrders.push(o);
    } else {
      preSchemeOrders.push(o);
    }
  });

  // Calculate volume & turnover strictly for current active scheme orders
  let currentKg = 0;
  let currentRevenue = 0;
  currentOrders.forEach(o => {
    currentKg += (parseFloat(o.totalKg) || 0);
    currentRevenue += (parseFloat(o.totalAmount) || 0);
  });

  // Calculate separated pre-scheme orders volume & turnover
  let preSchemeKg = 0;
  let preSchemeRevenue = 0;
  preSchemeOrders.forEach(o => {
    preSchemeKg += (parseFloat(o.totalKg) || 0);
    preSchemeRevenue += (parseFloat(o.totalAmount) || 0);
  });

  // 1. Base Volume Slab (Active Scheme Only)
  // "aathyathe 10000 kg achive cheythaal maathraan icentive slap start aavukayullu"
  const isTargetReached = (currentKg >= BASE_TARGET_KG);
  const baseIncentive = isTargetReached ? BASE_INCENTIVE : 0;
  const extraKg = isTargetReached ? Math.max(0, currentKg - BASE_TARGET_KG) : 0;
  const extraIncentive = isTargetReached ? (extraKg * EXTRA_PER_KG_RATE) : 0;
  const weightIncentive = baseIncentive + extraIncentive;
  const progressPercent = Math.min(100, Math.round((currentKg / BASE_TARGET_KG) * 100));
  const remainingKg = Math.max(0, BASE_TARGET_KG - currentKg);

  // 2. Special Brands Turnover Slab (Mohabbath Green, Mohabbath Gold, Jasmine) - Active Scheme Only
  // "mohabbath green, mohabbath gold and jasmine brandukalkk normalin purame additional incentive und.(₹15 Lakhs 0.15%, ₹20 Lakhs 0.25%, ₹25 Lakhs onwards 0.33%)"
  let specialBrandRevenue = 0;
  let specialBrandKg = 0;

  currentOrders.forEach(o => {
    if (o.items && Array.isArray(o.items) && o.items.length > 0) {
      o.items.forEach(it => {
        if (isSpecialBrand(it.productName)) {
          specialBrandRevenue += (parseFloat(it.totalAmount) || 0);
          specialBrandKg += (parseFloat(it.totalKg) || 0);
        }
      });
    } else if (o.product && isSpecialBrand(o.product.name)) {
      specialBrandRevenue += (parseFloat(o.totalAmount) || 0);
      specialBrandKg += (parseFloat(o.totalKg) || 0);
    }
  });

  let specialBrandRate = 0; // percentage e.g. 0.15, 0.25, 0.33
  let specialBrandSlabName = 'Below ₹15L (0%)';
  let nextBrandTarget = 1500000;
  let brandRemainingToNext = Math.max(0, 1500000 - specialBrandRevenue);

  if (specialBrandRevenue >= 2500000) {
    specialBrandRate = 0.33;
    specialBrandSlabName = '₹25L+ Slab (0.33%)';
    nextBrandTarget = 2500000;
    brandRemainingToNext = 0;
  } else if (specialBrandRevenue >= 2000000) {
    specialBrandRate = 0.25;
    specialBrandSlabName = '₹20L Slab (0.25%)';
    nextBrandTarget = 2500000;
    brandRemainingToNext = 2500000 - specialBrandRevenue;
  } else if (specialBrandRevenue >= 1500000) {
    specialBrandRate = 0.15;
    specialBrandSlabName = '₹15L Slab (0.15%)';
    nextBrandTarget = 2000000;
    brandRemainingToNext = 2000000 - specialBrandRevenue;
  } else {
    specialBrandRate = 0;
    specialBrandSlabName = `Below ₹15L (Need ₹${Math.round(brandRemainingToNext).toLocaleString('en-IN')} for 0.15%)`;
    nextBrandTarget = 1500000;
    brandRemainingToNext = 1500000 - specialBrandRevenue;
  }

  const specialBrandIncentive = (specialBrandRevenue * specialBrandRate) / 100;
  const totalIncentive = weightIncentive + specialBrandIncentive;

  return {
    effectiveDate,
    currentOrdersCount: currentOrders.length,
    currentKg,
    currentRevenue,
    totalIncentive,
    weightIncentive,
    baseIncentive,
    extraIncentive,
    extraKg,
    isTargetReached,
    progressPercent,
    remainingKg,
    // Special Brand Fields
    specialBrandRevenue,
    specialBrandKg,
    specialBrandRate,
    specialBrandSlabName,
    specialBrandIncentive,
    nextBrandTarget,
    brandRemainingToNext,
    // Pre-Scheme Partition Fields (Separated from May Scheme)
    preSchemeOrdersCount: preSchemeOrders.length,
    preSchemeKg,
    preSchemeRevenue
  };
}

function updateIncentiveCard(ordersList = [], totalKg = 0) {
  const inc = calculateIncentive(ordersList, totalKg);

  const amountEl = document.getElementById('incentiveAmount');
  const subTextEl = document.getElementById('incentiveSubText');
  const progressTextEl = document.getElementById('incentiveKgProgressText');
  const percentEl = document.getElementById('incentivePercent');
  const progressBarEl = document.getElementById('incentiveProgressBar');
  const remainingEl = document.getElementById('incentiveRemainingNote');

  // Brand widgets on dashboard
  const brandBadgeEl = document.getElementById('incentiveBrandBadge');
  const brandSalesTextEl = document.getElementById('incentiveBrandSalesText');
  const brandBonusTextEl = document.getElementById('incentiveBrandBonusText');

  // Scheme badge & Pre-Scheme Notice on dashboard widget
  const schemeBadgeEl = document.getElementById('incentiveSchemeDateBadge');
  const preSchemeNoticeEl = document.getElementById('incentivePreSchemeNotice');

  if (amountEl) {
    amountEl.textContent = `₹${Math.round(inc.totalIncentive).toLocaleString('en-IN')}`;
  }

  // Subtext on Orange Metric Card
  if (subTextEl) {
    if (inc.isTargetReached) {
      if (inc.specialBrandIncentive > 0) {
        subTextEl.textContent = `(₹5,000 + ₹${Math.round(inc.extraIncentive)} + Brand ₹${Math.round(inc.specialBrandIncentive)})`;
      } else {
        subTextEl.textContent = `(₹5,000 + ₹${Math.round(inc.extraIncentive)} Extra Bonus)`;
      }
    } else {
      if (inc.specialBrandIncentive > 0) {
        subTextEl.textContent = `(Brand Bonus: ₹${Math.round(inc.specialBrandIncentive)} • 10T Locked)`;
      } else {
        subTextEl.textContent = `${Math.round(inc.remainingKg).toLocaleString('en-IN')} kg to Unlock 10T Slab`;
      }
    }
  }

  // Volume Progress (strictly for active scheme volume)
  if (progressTextEl) {
    progressTextEl.textContent = `${Math.round(inc.currentKg).toLocaleString('en-IN')} / 10,000 kg`;
  }
  if (percentEl) {
    percentEl.textContent = inc.isTargetReached ? '100% (Unlocked)' : `${inc.progressPercent}%`;
    percentEl.className = inc.isTargetReached ? 'text-xs font-black text-emerald-600' : 'text-xs font-black text-amber-600';
  }
  if (progressBarEl) {
    progressBarEl.style.width = `${inc.progressPercent}%`;
    if (inc.isTargetReached) {
      progressBarEl.className = 'bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 shadow-sm';
    } else {
      progressBarEl.className = 'bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-700 shadow-sm';
    }
  }
  if (remainingEl) {
    if (inc.isTargetReached) {
      remainingEl.textContent = `🎉 Unlocked! (+${Math.round(inc.extraKg)} kg bonus)`;
      remainingEl.className = 'text-emerald-700 font-bold text-[10px]';
    } else {
      remainingEl.textContent = `Locked (${Math.round(inc.remainingKg).toLocaleString('en-IN')} kg left)`;
      remainingEl.className = 'text-amber-700 font-bold text-[10px]';
    }
  }

  // Special Brand in Widget
  if (brandBadgeEl) {
    brandBadgeEl.textContent = inc.specialBrandRate > 0 ? `${inc.specialBrandRate}% Slab` : '0%';
    brandBadgeEl.className = inc.specialBrandRate > 0
      ? 'text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300'
      : 'text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded';
  }
  if (brandSalesTextEl) {
    brandSalesTextEl.textContent = `Brands: ₹${Math.round(inc.specialBrandRevenue).toLocaleString('en-IN')}`;
  }
  if (brandBonusTextEl) {
    brandBonusTextEl.textContent = `+₹${Math.round(inc.specialBrandIncentive).toLocaleString('en-IN')}`;
  }

  // Dashboard Widget Scheme Badges
  if (schemeBadgeEl) {
    schemeBadgeEl.innerHTML = `<i data-lucide="calendar" class="w-3 h-3 text-blue-600 inline-block mr-1"></i>Active: From ${formatSchemeDate(inc.effectiveDate)}`;
  }
  if (preSchemeNoticeEl) {
    if (inc.preSchemeOrdersCount > 0) {
      preSchemeNoticeEl.innerHTML = `<span class="inline-flex items-center gap-1 text-slate-600 bg-amber-50/80 border border-amber-200/70 px-2.5 py-1 rounded-lg font-medium text-[10px]"><i data-lucide="info" class="w-3 h-3 text-amber-600 shrink-0"></i><span><strong>${inc.preSchemeOrdersCount} earlier orders</strong> (${Math.round(inc.preSchemeKg).toLocaleString('en-IN')} kg) separated pending previous scheme rules</span></span>`;
      preSchemeNoticeEl.classList.remove('hidden');
    } else {
      preSchemeNoticeEl.classList.add('hidden');
    }
  }

  // Detail Modal Date Input
  const dateInput = document.getElementById('schemeEffectiveDateInput');
  if (dateInput && dateInput.value !== inc.effectiveDate) {
    dateInput.value = inc.effectiveDate;
  }

  // Detail Modal Elements
  const modalKg = document.getElementById('modalCalcKg');
  if (modalKg) modalKg.textContent = `${Math.round(inc.currentKg).toLocaleString('en-IN')} kg`;

  const modalActiveSchemeDateLabel = document.getElementById('modalActiveSchemeDateLabel');
  if (modalActiveSchemeDateLabel) {
    modalActiveSchemeDateLabel.textContent = `From ${formatSchemeDate(inc.effectiveDate)}`;
  }

  const modalBase = document.getElementById('modalCalcBase');
  if (modalBase) {
    modalBase.textContent = inc.isTargetReached
      ? '₹5,000 (Unlocked)'
      : `₹0 (Locked - ${Math.round(inc.remainingKg).toLocaleString('en-IN')} kg needed)`;
    modalBase.className = inc.isTargetReached ? 'font-bold text-emerald-600' : 'font-bold text-amber-600';
  }

  const modalExtra = document.getElementById('modalCalcExtra');
  if (modalExtra) {
    modalExtra.textContent = inc.isTargetReached
      ? `₹${Math.round(inc.extraIncentive).toLocaleString('en-IN')} (${Math.round(inc.extraKg)} kg × ₹1)`
      : '₹0 (Starts above 10,000 kg)';
  }

  const modalVolSub = document.getElementById('modalCalcVolumeSubtotal');
  if (modalVolSub) {
    modalVolSub.textContent = `₹${Math.round(inc.weightIncentive).toLocaleString('en-IN')}`;
  }

  const modalBrandSales = document.getElementById('modalCalcBrandSales');
  if (modalBrandSales) {
    modalBrandSales.textContent = `₹${Math.round(inc.specialBrandRevenue).toLocaleString('en-IN')}`;
  }

  const modalBrandRate = document.getElementById('modalCalcBrandRate');
  if (modalBrandRate) {
    modalBrandRate.textContent = inc.specialBrandSlabName;
  }

  const modalBrandBonus = document.getElementById('modalCalcBrandBonus');
  if (modalBrandBonus) {
    modalBrandBonus.textContent = `₹${Math.round(inc.specialBrandIncentive).toLocaleString('en-IN')}`;
  }

  const modalTotal = document.getElementById('modalCalcTotal');
  if (modalTotal) {
    modalTotal.textContent = `₹${Math.round(inc.totalIncentive).toLocaleString('en-IN')}`;
  }

  const modalVolBadge = document.getElementById('modalVolumeStatusBadge');
  if (modalVolBadge) {
    modalVolBadge.textContent = inc.isTargetReached ? '✓ 10T Unlocked' : 'Locked (< 10,000 kg)';
    modalVolBadge.className = inc.isTargetReached
      ? 'text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800'
      : 'text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
  }

  const modalBrandBadge = document.getElementById('modalBrandStatusBadge');
  if (modalBrandBadge) {
    modalBrandBadge.textContent = inc.specialBrandRate > 0 ? `${inc.specialBrandRate}% Active` : '0% (< ₹15L)';
    modalBrandBadge.className = inc.specialBrandRate > 0
      ? 'text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800'
      : 'text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800';
  }

  // Pre-Scheme Modal Elements
  const preDateLabel = document.getElementById('modalPreSchemeDateLabel');
  if (preDateLabel) {
    preDateLabel.textContent = `Before ${formatSchemeDate(inc.effectiveDate)}`;
  }
  const preOrdersCount = document.getElementById('modalPreSchemeOrdersCount');
  if (preOrdersCount) {
    preOrdersCount.textContent = inc.preSchemeOrdersCount;
  }
  const preKg = document.getElementById('modalPreSchemeKg');
  if (preKg) {
    preKg.textContent = `${Math.round(inc.preSchemeKg).toLocaleString('en-IN')} kg`;
  }
  const preRev = document.getElementById('modalPreSchemeRevenue');
  if (preRev) {
    preRev.textContent = `₹${Math.round(inc.preSchemeRevenue).toLocaleString('en-IN')}`;
  }

  const preSummaryRow = document.getElementById('modalPreSchemeSummaryRow');
  if (preSummaryRow) {
    if (inc.preSchemeOrdersCount > 0) {
      preSummaryRow.classList.remove('hidden');
      const inlineCount = document.getElementById('modalPreSchemeCountInline');
      if (inlineCount) inlineCount.textContent = inc.preSchemeOrdersCount;
      const inlineKg = document.getElementById('modalPreSchemeKgInline');
      if (inlineKg) inlineKg.textContent = `${Math.round(inc.preSchemeKg).toLocaleString('en-IN')} kg`;
    } else {
      preSummaryRow.classList.add('hidden');
    }
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// ==================== COMPREHENSIVE PERIOD & DATE FILTERING ====================

function getActivePeriodLabel() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  if (currentFilterPeriod === 'today') {
    return `Today (${todayStr})`;
  } else if (currentFilterPeriod === 'week') {
    return 'This Week (Last 7 Days)';
  } else if (currentFilterPeriod === 'month') {
    return `This Month (${MONTH_NAMES_FULL[now.getMonth()]} ${now.getFullYear()})`;
  } else if (currentFilterPeriod === 'last_month') {
    return `Last Month (${MONTH_NAMES_FULL[filterSelectedMonth]} ${filterSelectedYear})`;
  } else if (currentFilterPeriod === 'specific_month') {
    return `${MONTH_NAMES_FULL[filterSelectedMonth]} ${filterSelectedYear}`;
  } else if (currentFilterPeriod === 'year') {
    return `Full Year ${filterSelectedYear}`;
  } else if (currentFilterPeriod === 'custom_range') {
    const s = filterCustomStartDate || 'Beginning';
    const e = filterCustomEndDate || 'Now';
    return `Custom: ${s} to ${e}`;
  } else {
    return 'All Time Records';
  }
}

function updateFilterButtonStyles() {
  // 1. Reset all preset buttons
  document.querySelectorAll('.period-btn').forEach(btn => {
    btn.className = 'period-btn px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition font-bold text-xs';
  });

  // 2. Highlight matching active preset button
  const activeBtnId = {
    today: 'btnFilterToday',
    week: 'btnFilterWeek',
    month: 'btnFilterMonth',
    last_month: 'btnFilterLastMonth',
    year: 'btnFilterThisYear',
    all: 'btnFilterAll'
  }[currentFilterPeriod];

  if (activeBtnId) {
    const activeBtn = document.getElementById(activeBtnId);
    if (activeBtn) {
      activeBtn.className = 'period-btn px-2.5 py-1 rounded-lg bg-blue-600 text-white shadow-xs transition font-bold text-xs';
    }
  }

  // 3. Update Active Period Banner & Badge
  const labelText = getActivePeriodLabel();
  const activePeriodLabelEl = document.getElementById('activePeriodLabel');
  if (activePeriodLabelEl) activePeriodLabelEl.textContent = labelText;

  const badge = document.getElementById('incentivePeriodBadge');
  if (badge) badge.textContent = labelText;

  // 4. Show/Hide Reset to Month button
  const resetBtn = document.getElementById('btnResetToCurrentMonth');
  if (resetBtn) {
    if (currentFilterPeriod === 'month') {
      resetBtn.classList.add('hidden');
    } else {
      resetBtn.classList.remove('hidden');
    }
  }

  // 5. Sync Month and Year select elements
  const monthSelect = document.getElementById('filterMonthSelect');
  if (monthSelect) monthSelect.value = String(filterSelectedMonth);

  const yearSelect = document.getElementById('filterYearSelect');
  if (yearSelect) yearSelect.value = String(filterSelectedYear);
}

function populateFilterYearSelect() {
  const currentYear = new Date().getFullYear();
  const yearsSet = new Set([currentYear - 2, currentYear - 1, currentYear, currentYear + 1]);

  // Extract years from all orders
  (orders || []).forEach(o => {
    if (o && o.date) {
      const y = parseInt(String(o.date).substring(0, 4), 10);
      if (!isNaN(y) && y > 2000 && y < 2100) {
        yearsSet.add(y);
      }
    }
  });

  const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);

  // Populate #filterYearSelect
  const filterYearSelect = document.getElementById('filterYearSelect');
  if (filterYearSelect) {
    const currentVal = filterYearSelect.value;
    filterYearSelect.innerHTML = sortedYears.map(y => `<option value="${y}">${y}</option>`).join('');
    filterYearSelect.value = currentVal && sortedYears.includes(Number(currentVal)) ? currentVal : String(filterSelectedYear);
  }

  // Populate #historyYearSelect
  const historyYearSelect = document.getElementById('historyYearSelect');
  if (historyYearSelect) {
    const currentVal = historyYearSelect.value;
    historyYearSelect.innerHTML = sortedYears.map(y => `<option value="${y}">Year ${y}</option>`).join('');
    historyYearSelect.value = currentVal && sortedYears.includes(Number(currentVal)) ? currentVal : String(filterSelectedYear);
  }
}

function populateFilterMonthSelect() {
  const monthSelect = document.getElementById('filterMonthSelect');
  if (monthSelect) {
    monthSelect.value = String(filterSelectedMonth);
  }
}

function setFilterPeriod(period) {
  currentFilterPeriod = period;
  const now = new Date();

  if (period === 'month') {
    filterSelectedYear = now.getFullYear();
    filterSelectedMonth = now.getMonth();
  } else if (period === 'last_month') {
    let lmYear = now.getFullYear();
    let lmMonth = now.getMonth() - 1;
    if (lmMonth < 0) {
      lmMonth = 11;
      lmYear -= 1;
    }
    filterSelectedYear = lmYear;
    filterSelectedMonth = lmMonth;
  } else if (period === 'year') {
    filterSelectedYear = now.getFullYear();
  }

  updateFilterButtonStyles();
  updateDashboard();
}

function setFilterSpecificMonth(year, monthIndex) {
  filterSelectedYear = parseInt(year, 10);
  filterSelectedMonth = parseInt(monthIndex, 10);
  currentFilterPeriod = 'specific_month';

  updateFilterButtonStyles();
  updateDashboard();
}

function onMonthSelectChange(event) {
  const val = parseInt(event.target.value, 10);
  setFilterSpecificMonth(filterSelectedYear, val);
}

function onYearSelectChange(event) {
  const val = parseInt(event.target.value, 10);
  if (currentFilterPeriod === 'year') {
    filterSelectedYear = val;
    updateFilterButtonStyles();
    updateDashboard();
  } else {
    setFilterSpecificMonth(val, filterSelectedMonth);
  }
}

function stepPreviousMonth() {
  let m = filterSelectedMonth - 1;
  let y = filterSelectedYear;
  if (m < 0) {
    m = 11;
    y -= 1;
  }
  setFilterSpecificMonth(y, m);
}

function stepNextMonth() {
  let m = filterSelectedMonth + 1;
  let y = filterSelectedYear;
  if (m > 11) {
    m = 0;
    y += 1;
  }
  setFilterSpecificMonth(y, m);
}

// ==================== CUSTOM DATE RANGE FILTERING ====================

function toggleCustomRangePanel() {
  const panel = document.getElementById('customDateRangePanel');
  const chevron = document.getElementById('customRangeChevron');
  if (!panel) return;

  const isHidden = panel.classList.toggle('hidden');
  if (chevron) {
    if (isHidden) {
      chevron.classList.remove('rotate-180');
    } else {
      chevron.classList.add('rotate-180');
      const startInp = document.getElementById('customDateStartInput');
      const endInp = document.getElementById('customDateEndInput');
      if (startInp && !startInp.value && filterCustomStartDate) startInp.value = filterCustomStartDate;
      if (endInp && !endInp.value && filterCustomEndDate) endInp.value = filterCustomEndDate;
    }
  }
}

function applyCustomDateRange() {
  const startInp = document.getElementById('customDateStartInput');
  const endInp = document.getElementById('customDateEndInput');
  const startDate = startInp ? startInp.value.trim() : '';
  const endDate = endInp ? endInp.value.trim() : '';

  if (!startDate && !endDate) {
    showNotification('Please select at least a start date or end date');
    return;
  }

  if (startDate && endDate && startDate > endDate) {
    showNotification('Start date cannot be after end date');
    return;
  }

  filterCustomStartDate = startDate;
  filterCustomEndDate = endDate;
  currentFilterPeriod = 'custom_range';

  updateFilterButtonStyles();
  updateDashboard();
  showNotification(`Custom range applied: ${startDate || 'Start'} to ${endDate || 'End'}`);
}

function clearCustomDateRange() {
  const startInp = document.getElementById('customDateStartInput');
  const endInp = document.getElementById('customDateEndInput');
  if (startInp) startInp.value = '';
  if (endInp) endInp.value = '';

  filterCustomStartDate = '';
  filterCustomEndDate = '';
  setFilterPeriod('month');
}

function setPresetDateRange(startDate, endDate) {
  const startInp = document.getElementById('customDateStartInput');
  const endInp = document.getElementById('customDateEndInput');
  if (startInp) startInp.value = startDate;
  if (endInp) endInp.value = endDate;

  applyCustomDateRange();
}

function setPresetLastNDays(days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  setPresetDateRange(startStr, endStr);
}

function getFilteredOrders() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return orders.filter(order => {
    if (!order || !order.date) return false;
    const orderDateStr = String(order.date).split('T')[0];

    if (currentFilterPeriod === 'today') {
      return orderDateStr === todayStr;
    } else if (currentFilterPeriod === 'week') {
      const orderDate = new Date(orderDateStr);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      return orderDate >= sevenDaysAgo;
    } else if (currentFilterPeriod === 'month') {
      const currentYear = now.getFullYear();
      const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
      return orderDateStr.startsWith(`${currentYear}-${currentMonth}`);
    } else if (currentFilterPeriod === 'last_month') {
      const lmPrefix = `${filterSelectedYear}-${String(Number(filterSelectedMonth) + 1).padStart(2, '0')}`;
      return orderDateStr.startsWith(lmPrefix);
    } else if (currentFilterPeriod === 'specific_month') {
      const mPrefix = `${filterSelectedYear}-${String(Number(filterSelectedMonth) + 1).padStart(2, '0')}`;
      return orderDateStr.startsWith(mPrefix);
    } else if (currentFilterPeriod === 'year') {
      return orderDateStr.startsWith(String(filterSelectedYear));
    } else if (currentFilterPeriod === 'custom_range') {
      if (filterCustomStartDate && filterCustomEndDate) {
        return orderDateStr >= filterCustomStartDate && orderDateStr <= filterCustomEndDate;
      } else if (filterCustomStartDate) {
        return orderDateStr >= filterCustomStartDate;
      } else if (filterCustomEndDate) {
        return orderDateStr <= filterCustomEndDate;
      }
      return true;
    } else {
      return true; // 'all'
    }
  });
}

// ==================== MONTHLY SALES & INCENTIVES HISTORY ====================

function openMonthlyHistoryModal() {
  const modal = document.getElementById('monthlyHistoryModal');
  if (!modal) return;

  populateFilterYearSelect();
  modal.classList.remove('hidden');

  const historyYearSelect = document.getElementById('historyYearSelect');
  const targetYear = historyYearSelect ? parseInt(historyYearSelect.value, 10) || filterSelectedYear : filterSelectedYear;

  renderMonthlyHistoryList(targetYear);

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeMonthlyHistoryModal() {
  const modal = document.getElementById('monthlyHistoryModal');
  if (modal) modal.classList.add('hidden');
}

function onHistoryYearChange(event) {
  const year = parseInt(event.target.value, 10) || new Date().getFullYear();
  renderMonthlyHistoryList(year);
}

function renderMonthlyHistoryList(targetYear) {
  const tbody = document.getElementById('monthlyHistoryTableBody');
  if (!tbody) return;

  const yearNum = parseInt(targetYear, 10) || new Date().getFullYear();
  const yearPrefix = String(yearNum);

  // Filter orders for this year
  const yearOrders = orders.filter(o => o && o.date && String(o.date).startsWith(yearPrefix));

  let totalAnnualRevenue = 0;
  let totalAnnualKg = 0;
  let totalAnnualBags = 0;
  let totalAnnualIncentive = 0;
  let targetUnlockedMonthsCount = 0;
  let bestMonthData = { monthIndex: -1, revenue: 0, kg: 0 };

  const rowsHtml = [];

  // Loop through all 12 months (0 to 11)
  for (let m = 0; m < 12; m++) {
    const monthStr = String(m + 1).padStart(2, '0');
    const monthPrefix = `${yearPrefix}-${monthStr}`;
    const monthOrders = yearOrders.filter(o => String(o.date).startsWith(monthPrefix));

    let mRevenue = 0;
    let mKg = 0;
    let mBags = 0;

    monthOrders.forEach(o => {
      mRevenue += (parseFloat(o.totalAmount) || 0);
      mKg += (parseFloat(o.totalKg) || 0);
      mBags += (parseFloat(o.bagQty) || 0);
    });

    const inc = calculateIncentive(monthOrders, mKg);

    totalAnnualRevenue += mRevenue;
    totalAnnualKg += mKg;
    totalAnnualBags += mBags;
    totalAnnualIncentive += inc.totalIncentive;

    if (inc.isTargetReached) {
      targetUnlockedMonthsCount++;
    }

    if (mRevenue > bestMonthData.revenue) {
      bestMonthData = { monthIndex: m, revenue: mRevenue, kg: mKg };
    }

    const monthName = MONTH_NAMES_FULL[m];
    const isCurrentMonth = (new Date().getFullYear() === yearNum && new Date().getMonth() === m);
    const tons = (mKg / 1000).toFixed(2);

    // 10T volume badge
    let targetBadgeHtml = '';
    if (mKg === 0) {
      targetBadgeHtml = '<span class="text-[11px] text-slate-400 font-semibold">—</span>';
    } else if (inc.isTargetReached) {
      targetBadgeHtml = `
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
          <i data-lucide="check-circle" class="w-3.5 h-3.5 text-emerald-600"></i>
          <span>10T Unlocked (+₹${Math.round(inc.weightIncentive).toLocaleString('en-IN')})</span>
        </div>
      `;
    } else {
      targetBadgeHtml = `
        <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
          <i data-lucide="clock" class="w-3 h-3 text-amber-600"></i>
          <span>${inc.progressPercent}% (${Math.round(inc.remainingKg).toLocaleString('en-IN')} kg left)</span>
        </div>
      `;
    }

    // Special brand badge
    let brandBadgeHtml = '';
    if (inc.specialBrandRevenue > 0) {
      if (inc.specialBrandRate > 0) {
        brandBadgeHtml = `
          <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
            <span>₹${Math.round(inc.specialBrandRevenue).toLocaleString('en-IN')} (${inc.specialBrandRate}%: +₹${Math.round(inc.specialBrandIncentive).toLocaleString('en-IN')})</span>
          </div>
        `;
      } else {
        brandBadgeHtml = `
          <span class="text-[10px] text-slate-500 font-semibold">₹${Math.round(inc.specialBrandRevenue).toLocaleString('en-IN')} (&lt; ₹15L)</span>
        `;
      }
    } else {
      brandBadgeHtml = '<span class="text-[11px] text-slate-400 font-semibold">—</span>';
    }

    // Total incentive badge
    let incBadgeHtml = '';
    if (inc.totalIncentive > 0) {
      incBadgeHtml = `<span class="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">₹${Math.round(inc.totalIncentive).toLocaleString('en-IN')}</span>`;
    } else {
      incBadgeHtml = '<span class="text-xs font-bold text-slate-400">₹0</span>';
    }

    // Row styling
    const isRowFiltered = (currentFilterPeriod === 'specific_month' && filterSelectedYear === yearNum && filterSelectedMonth === m) ||
                          (currentFilterPeriod === 'month' && isCurrentMonth);
    const rowClass = isRowFiltered ? 'bg-indigo-50/60 font-semibold' : 'hover:bg-slate-50/80 transition';

    rowsHtml.push(`
      <tr class="${rowClass}">
        <td class="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
          <span>${monthName} ${yearNum}</span>
          ${isCurrentMonth ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-blue-100 text-blue-700">Current</span>' : ''}
          ${isRowFiltered ? '<span class="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-200 text-indigo-900">Active</span>' : ''}
        </td>
        <td class="py-3 px-3 text-center font-bold text-slate-700">${monthOrders.length}</td>
        <td class="py-3 px-3 text-center font-bold text-slate-700">${mBags.toLocaleString('en-IN')}</td>
        <td class="py-3 px-4 text-right font-black text-slate-900">
          <div>${Math.round(mKg).toLocaleString('en-IN')} <span class="text-[10px] text-slate-500 font-bold">kg</span></div>
          <div class="text-[10px] text-slate-400 font-medium">${tons} Tonnes</div>
        </td>
        <td class="py-3 px-4 text-right font-black text-slate-900">₹${Math.round(mRevenue).toLocaleString('en-IN')}</td>
        <td class="py-3 px-4">${targetBadgeHtml}</td>
        <td class="py-3 px-4">${brandBadgeHtml}</td>
        <td class="py-3 px-4 text-right">${incBadgeHtml}</td>
        <td class="py-3 px-4 text-center">
          <button type="button" onclick="viewMonthOnDashboard(${yearNum}, ${m})" class="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] shadow-2xs transition active:scale-95 inline-flex items-center gap-1">
            <i data-lucide="layout-dashboard" class="w-3 h-3"></i>
            <span>View</span>
          </button>
        </td>
      </tr>
    `);
  }

  tbody.innerHTML = rowsHtml.join('');

  // Update KPI Cards
  const revEl = document.getElementById('histKpiRevenue');
  if (revEl) revEl.textContent = `₹${Math.round(totalAnnualRevenue).toLocaleString('en-IN')}`;

  const ordCountEl = document.getElementById('histKpiOrdersCount');
  if (ordCountEl) ordCountEl.textContent = `${yearOrders.length} Orders Recorded`;

  const weightEl = document.getElementById('histKpiWeight');
  if (weightEl) weightEl.textContent = `${Math.round(totalAnnualKg).toLocaleString('en-IN')} kg`;

  const tonsEl = document.getElementById('histKpiTons');
  if (tonsEl) tonsEl.textContent = `${(totalAnnualKg / 1000).toFixed(2)} Metric Tonnes`;

  const incEl = document.getElementById('histKpiIncentive');
  if (incEl) incEl.textContent = `₹${Math.round(totalAnnualIncentive).toLocaleString('en-IN')}`;

  const unlockedMonthsEl = document.getElementById('histKpiTargetUnlockedMonths');
  if (unlockedMonthsEl) unlockedMonthsEl.textContent = `${targetUnlockedMonthsCount} Months Target Unlocked`;

  const bestMonthEl = document.getElementById('histKpiBestMonth');
  const bestMonthStatsEl = document.getElementById('histKpiBestMonthStats');
  if (bestMonthEl) {
    if (bestMonthData.monthIndex >= 0 && bestMonthData.revenue > 0) {
      bestMonthEl.textContent = `${MONTH_NAMES_FULL[bestMonthData.monthIndex]}`;
      if (bestMonthStatsEl) {
        bestMonthStatsEl.textContent = `₹${Math.round(bestMonthData.revenue).toLocaleString('en-IN')} (${Math.round(bestMonthData.kg).toLocaleString('en-IN')} kg)`;
      }
    } else {
      bestMonthEl.textContent = '—';
      if (bestMonthStatsEl) bestMonthStatsEl.textContent = 'No sales recorded';
    }
  }

  const badgeEl = document.getElementById('historyTotalMonthsBadge');
  if (badgeEl) badgeEl.textContent = `${yearOrders.length} Orders in ${yearNum}`;

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function viewMonthOnDashboard(year, monthIndex) {
  closeMonthlyHistoryModal();
  setFilterSpecificMonth(year, monthIndex);
  showNotification(`Viewing ${MONTH_NAMES_FULL[monthIndex]} ${year} sales & incentives`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function printMonthlyHistory() {
  window.print();
}

function seedSampleMultiMonthDataPrompt() {
  showSafeConfirmModal({
    title: 'Load Multi-Month Sample Sales Data?',
    message: 'This will add realistic sample orders across multiple months (October 2026, September 2026, January 2026, etc.) so you can test all month/year filters, date ranges, and incentive achievements. Any existing real orders will be safely preserved.',
    confirmText: 'Load Multi-Month Data',
    cancelText: 'Cancel',
    isDanger: false,
    icon: 'sparkles',
    onConfirm: () => {
      seedInitialDemoData();
      populateFilterYearSelect();
      const histYear = document.getElementById('historyYearSelect')?.value || 2026;
      renderMonthlyHistoryList(histYear);
      updateDashboard();
      showNotification('Multi-month sample sales data loaded successfully!');
    }
  });
}

function updateDashboard() {
  try {
    const filteredOrders = getFilteredOrders();

    let totalRevenue = 0;
    let totalKg = 0;
    let totalBags = 0;

    filteredOrders.forEach(o => {
      totalRevenue += (parseFloat(o.totalAmount) || 0);
      totalKg += (parseFloat(o.totalKg) || 0);
      totalBags += (parseFloat(o.bagQty) || 0);
    });

    // 1. Update Metrics Cards
    const revEl = document.getElementById('metricTotalRevenue');
    if (revEl) revEl.textContent = `₹${Math.round(totalRevenue).toLocaleString('en-IN')}`;
    const orderCountEl = document.getElementById('metricOrderCount');
    if (orderCountEl) orderCountEl.textContent = `${filteredOrders.length} Orders`;

    const kgEl = document.getElementById('metricTotalKg');
    if (kgEl) kgEl.innerHTML = `${Math.round(totalKg).toLocaleString('en-IN')} <span class="text-base font-bold text-white">kg</span>`;
    const tons = (totalKg / 1000).toFixed(2);
    const tonsEl = document.getElementById('metricTons');
    if (tonsEl) tonsEl.textContent = `${tons} Metric Tonnes`;

    const bagsEl = document.getElementById('metricTotalBags');
    if (bagsEl) bagsEl.innerHTML = `${Math.round(totalBags).toLocaleString('en-IN')} <span class="text-base font-bold text-white">Bags</span>`;
    const bagBrkEl = document.getElementById('metricBagBreakdown');
    if (bagBrkEl) bagBrkEl.textContent = `Avg: ${(totalBags > 0 ? (totalKg/totalBags).toFixed(1) : 0)} kg/Bag`;

    // 2. Incentive Widget
    updateIncentiveCard(filteredOrders, totalKg);

    // 3. Top Customers
    updateTopCustomersWidget(filteredOrders);

    // 4. Charts
    updateCharts(filteredOrders);

    // 5. Orders Register Table
    renderOrdersTable();

    // 5.1 Update Sidebar Order Count Badge
    const sideBadge = document.getElementById('sidebarOrderCountBadge');
    if (sideBadge) sideBadge.textContent = orders.length;

    // 6. Update Leaderboards if modal is open
    const lbModal = document.getElementById('leaderboardModal');
    if (lbModal && !lbModal.classList.contains('hidden')) {
      renderLeaderboard();
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
  } catch (err) {
    console.error('Error updating dashboard:', err);
  }
}

function updateTopCustomersWidget(filteredOrders) {
  const container = document.getElementById('topCustomersList');
  if (!container) return;

  const customerMap = {};
  filteredOrders.forEach(o => {
    const name = getCustomerName(o.customer);
    if (!customerMap[name]) customerMap[name] = 0;
    customerMap[name] += (parseFloat(o.totalKg) || 0);
  });

  const sorted = Object.entries(customerMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">No orders in period</p>';
    return;
  }

  container.innerHTML = '';
  sorted.forEach(([name, kg], idx) => {
    const rank = idx + 1;
    let badgeColor = 'bg-slate-200 text-slate-700';
    if (rank === 1) badgeColor = 'bg-amber-400 text-amber-950';
    else if (rank === 2) badgeColor = 'bg-slate-300 text-slate-800';
    else if (rank === 3) badgeColor = 'bg-amber-600 text-white';

    const item = document.createElement('div');
    item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-50 text-xs hover:bg-amber-50 cursor-pointer transition';
    item.onclick = () => openLeaderboardModal();
    item.title = 'Click to open Full Leaderboards';
    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="w-5 h-5 rounded-full ${badgeColor} font-black flex items-center justify-center text-[10px] shrink-0 shadow-sm">${rank}</span>
        <span class="font-bold text-slate-800 truncate">${escapeHtml(name)}</span>
      </div>
      <span class="font-black text-blue-600 shrink-0">${Math.round(kg).toLocaleString('en-IN')} kg</span>
    `;
    container.appendChild(item);
  });
}

// ==================== CHARTS RENDERING ====================

function updateCharts(filteredOrders) {
  if (typeof Chart === 'undefined') {
    return; // Safely skip if Chart.js CDN is unavailable
  }

  try {
    // 1. Sales Trend
    const dateMap = {};
    filteredOrders.forEach(o => {
      const d = o.date || 'Unknown';
      if (!dateMap[d]) dateMap[d] = { kg: 0, revenue: 0 };
      dateMap[d].kg += (parseFloat(o.totalKg) || 0);
      dateMap[d].revenue += (parseFloat(o.totalAmount) || 0);
    });

    const sortedDates = Object.keys(dateMap).sort();
    const labels = sortedDates.map(d => {
      const parts = d.split('-');
      return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
    });
    const kgData = sortedDates.map(d => dateMap[d].kg);
    const revenueData = sortedDates.map(d => dateMap[d].revenue);

    const ctxTrend = document.getElementById('salesTrendChart');
    if (ctxTrend) {
      if (salesTrendChartInstance) {
        salesTrendChartInstance.destroy();
      }

      const palette = ['#2563eb', '#10b981', '#7c3aed', '#ea580c', '#0891b2', '#f43f5e', '#f59e0b'];
      const barColors = labels.map((_, i) => palette[i % palette.length]);

      salesTrendChartInstance = new Chart(ctxTrend, {
        type: 'bar',
        data: {
          labels: labels.length ? labels : ['No Data'],
          datasets: [
            {
              label: 'Weight Sold (KG)',
              data: kgData.length ? kgData : [0],
              backgroundColor: barColors,
              borderRadius: 8,
              yAxisID: 'y'
            },
            {
              label: 'Revenue (₹)',
              data: revenueData.length ? revenueData : [0],
              type: 'line',
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              pointBackgroundColor: '#10b981',
              pointRadius: 4,
              fill: true,
              tension: 0.35,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: {
              type: 'linear',
              position: 'left',
              title: { display: true, text: 'KG', font: { size: 10, weight: 'bold' } },
              grid: { color: '#f1f5f9' }
            },
            y1: {
              type: 'linear',
              position: 'right',
              title: { display: true, text: '₹ Revenue', font: { size: 10, weight: 'bold' } },
              grid: { drawOnChartArea: false }
            },
            x: {
              grid: { display: false }
            }
          }
        }
      });
    }

    // 2. Rice Variety Breakdown
    const productKgMap = {};
    filteredOrders.forEach(o => {
      if (o.items && Array.isArray(o.items)) {
        o.items.forEach(it => {
          const name = it.productName || 'Rice Variety';
          productKgMap[name] = (productKgMap[name] || 0) + (parseFloat(it.totalKg) || 0);
        });
      } else {
        const name = o.product?.name || 'Rice Variety';
        productKgMap[name] = (productKgMap[name] || 0) + (parseFloat(o.totalKg) || 0);
      }
    });

    const pLabels = Object.keys(productKgMap);
    const pData = pLabels.map(l => productKgMap[l]);

    const ctxPie = document.getElementById('ricePieChart');
    if (ctxPie) {
      if (ricePieChartInstance) {
        ricePieChartInstance.destroy();
      }

      const colors = ['#7c3aed', '#10b981', '#2563eb', '#ea580c', '#0891b2', '#f43f5e'];

      ricePieChartInstance = new Chart(ctxPie, {
        type: 'doughnut',
        data: {
          labels: pLabels.length ? pLabels : ['No Data Available'],
          datasets: [{
            data: pData.length ? pData : [1],
            backgroundColor: pLabels.length ? colors.slice(0, pLabels.length) : ['#e2e8f0'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { boxWidth: 10, font: { size: 10, weight: 'bold' } }
            }
          },
          cutout: '68%'
        }
      });

      const topSumEl = document.getElementById('topProductSummary');
      if (topSumEl) {
        if (pLabels.length > 0) {
          let topProd = pLabels[0];
          let maxKg = pData[0];
          for (let i = 1; i < pLabels.length; i++) {
            if (pData[i] > maxKg) {
              maxKg = pData[i];
              topProd = pLabels[i];
            }
          }
          topSumEl.innerHTML = `Top Seller: <strong class="text-blue-900">${escapeHtml(topProd)}</strong> (${Math.round(maxKg).toLocaleString('en-IN')} kg)`;
        } else {
          topSumEl.textContent = 'Add orders to see variety breakdown here.';
        }
      }
    }
  } catch (err) {
    console.error('Error rendering charts:', err);
  }
}

// ==================== MAIN VIEW SWITCHING (OVERVIEW vs SALES REGISTER) ====================

let currentMainView = 'overview'; // 'overview' or 'sales-register'

function switchMainView(viewName) {
  currentMainView = viewName || 'overview';

  const overviewView = document.getElementById('viewOverview');
  const salesRegisterView = document.getElementById('viewSalesRegister');
  const navBtnOverview = document.getElementById('navBtnOverview');
  const navBtnSalesRegister = document.getElementById('navBtnSalesRegister');
  const mainTitle = document.getElementById('mainViewHeaderTitle');
  const mainSubtitle = document.getElementById('mainViewHeaderSubtitle');

  if (currentMainView === 'sales-register') {
    if (overviewView) overviewView.classList.add('hidden');
    if (salesRegisterView) salesRegisterView.classList.remove('hidden');

    if (mainTitle) mainTitle.textContent = 'SALES REGISTER';
    if (mainSubtitle) mainSubtitle.textContent = 'Order Entries & Dispatch Ledger';

    if (navBtnOverview) {
      navBtnOverview.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition';
    }
    if (navBtnSalesRegister) {
      navBtnSalesRegister.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-600/30 transition group';
    }

    renderOrdersTable();
  } else {
    // 'overview'
    if (overviewView) overviewView.classList.remove('hidden');
    if (salesRegisterView) salesRegisterView.classList.add('hidden');

    if (mainTitle) mainTitle.textContent = 'OVERVIEW';
    if (mainSubtitle) mainSubtitle.textContent = 'Performance at a Glance';

    if (navBtnOverview) {
      navBtnOverview.className = 'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-600/30 transition';
    }
    if (navBtnSalesRegister) {
      navBtnSalesRegister.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition group';
    }
  }

  try {
    localStorage.setItem('biriyani_rice_active_view', currentMainView);
  } catch (e) {}

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// ==================== ORDERS TABLE ====================

function renderOrdersTable() {
  const tbody = document.getElementById('ordersTableBody');
  const emptyState = document.getElementById('noOrdersMessage');
  if (!tbody) return;

  const filteredOrders = getFilteredOrders();
  const searchQuery = (document.getElementById('orderSearchInput')?.value || '').toLowerCase();
  const orderAreaFilterVal = (document.getElementById('orderAreaFilterSelect')?.value || 'all').toLowerCase();
  const orderDateFilterVal = document.getElementById('orderDateFilter')?.value || '';
  const orderAmountFilterVal = document.getElementById('orderAmountFilterSelect')?.value || 'all';
  const orderSortVal = document.getElementById('orderSortSelect')?.value || 'date-desc';

  // Toggle clear date button visibility
  const clearDateBtn = document.getElementById('clearDateBtn');
  if (clearDateBtn) {
    if (orderDateFilterVal) {
      clearDateBtn.classList.remove('hidden');
    } else {
      clearDateBtn.classList.add('hidden');
    }
  }

  let displayOrders = filteredOrders.filter(o => {
    // Specific Date Filter
    if (orderDateFilterVal) {
      const orderDateStr = String(o.date || '').split('T')[0];
      if (orderDateStr !== orderDateFilterVal) return false;
    }

    // Sale Amount Filter
    if (orderAmountFilterVal !== 'all') {
      const amt = parseFloat(o.totalAmount) || 0;
      if (orderAmountFilterVal === 'above-1lakh' && amt < 100000) return false;
      if (orderAmountFilterVal === '50k-1lakh' && (amt < 50000 || amt >= 100000)) return false;
      if (orderAmountFilterVal === '25k-50k' && (amt < 25000 || amt >= 50000)) return false;
      if (orderAmountFilterVal === 'below-25k' && amt >= 25000) return false;
    }

    // Area filter
    if (orderAreaFilterVal !== 'all') {
      const custArea = getCustomerArea(o.customer).toLowerCase();
      const custLoc = getCustomerLocation(o.customer).toLowerCase();
      if (custArea !== orderAreaFilterVal && !custLoc.includes(orderAreaFilterVal)) return false;
    }

    if (searchQuery) {
      const matchName = getCustomerName(o.customer).toLowerCase().includes(searchQuery);
      const matchPhone = getCustomerPhone(o.customer).includes(searchQuery);
      const matchOwnerName = getCustomerOwnerName(o.customer).toLowerCase().includes(searchQuery);
      const matchOwnerPhone = getCustomerOwnerPhone(o.customer).includes(searchQuery);
      const matchStaffName = getCustomerStaffName(o.customer).toLowerCase().includes(searchQuery);
      const matchStaffPhone = getCustomerStaffPhone(o.customer).includes(searchQuery);
      const matchDistrict = getCustomerDistrict(o.customer).toLowerCase().includes(searchQuery);
      const matchTown = getCustomerTown(o.customer).toLowerCase().includes(searchQuery);
      const matchLandmark = getCustomerLandmark(o.customer).toLowerCase().includes(searchQuery);
      const matchPanchayath = getCustomerPanchayath(o.customer).toLowerCase().includes(searchQuery);
      const matchArea = getCustomerArea(o.customer).toLowerCase().includes(searchQuery);
      const matchPlace = getCustomerPlace(o.customer).toLowerCase().includes(searchQuery);
      const matchLoc = getCustomerLocation(o.customer).toLowerCase().includes(searchQuery);
      const matchCat = getCustomerCategory(o.customer).toLowerCase().includes(searchQuery);
      const matchId = String(o.id || '').toLowerCase().includes(searchQuery);
      const matchNotes = String(o.notes || '').toLowerCase().includes(searchQuery);
      let matchProd = (o.product?.name || '').toLowerCase().includes(searchQuery);
      if (o.items && Array.isArray(o.items)) {
        if (o.items.some(it => (it.productName || '').toLowerCase().includes(searchQuery))) {
          matchProd = true;
        }
      }
      return matchName || matchPhone || matchOwnerName || matchOwnerPhone || matchStaffName || matchStaffPhone || matchDistrict || matchTown || matchLandmark || matchPanchayath || matchArea || matchPlace || matchLoc || matchCat || matchProd || matchId || matchNotes;
    }
    return true;
  });

  // Sorting: Default is date-desc (newest order on top)
  displayOrders.sort((a, b) => {
    if (orderSortVal === 'date-asc') {
      const tA = new Date(a.date || 0).getTime();
      const tB = new Date(b.date || 0).getTime();
      if (tA !== tB) return tA - tB;
      const numA = parseInt(String(a.id || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(String(b.id || '').replace(/\D/g, ''), 10) || 0;
      return numA - numB;
    } else if (orderSortVal === 'amount-desc') {
      const amtA = parseFloat(a.totalAmount) || 0;
      const amtB = parseFloat(b.totalAmount) || 0;
      if (amtB !== amtA) return amtB - amtA;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else if (orderSortVal === 'amount-asc') {
      const amtA = parseFloat(a.totalAmount) || 0;
      const amtB = parseFloat(b.totalAmount) || 0;
      if (amtA !== amtB) return amtA - amtB;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else if (orderSortVal === 'qty-desc') {
      const qtyA = (a.bagQty !== undefined) ? a.bagQty : (a.items || []).reduce((s, i) => s + (i.bagQty || 0), 0);
      const qtyB = (b.bagQty !== undefined) ? b.bagQty : (b.items || []).reduce((s, i) => s + (i.bagQty || 0), 0);
      if (qtyB !== qtyA) return qtyB - qtyA;
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    } else {
      // Default: date-desc (Newest order always on top)
      const tA = new Date(a.date || 0).getTime();
      const tB = new Date(b.date || 0).getTime();
      if (tB !== tA) return tB - tA;
      const numA = parseInt(String(a.id || '').replace(/\D/g, ''), 10) || 0;
      const numB = parseInt(String(b.id || '').replace(/\D/g, ''), 10) || 0;
      return numB - numA;
    }
  });

  tbody.innerHTML = '';

  // Update header summary mini stats
  const regCountEl = document.getElementById('registerOrdersCountBadge');
  if (regCountEl) regCountEl.textContent = `${displayOrders.length} Orders`;

  const totalFilteredBags = displayOrders.reduce((sum, o) => {
    return sum + ((o.bagQty !== undefined) ? (parseFloat(o.bagQty) || 0) : (o.items || []).reduce((is, it) => is + (parseFloat(it.bagQty) || 0), 0));
  }, 0);
  const totalFilteredSale = displayOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

  const regBagsEl = document.getElementById('registerTotalBagsText');
  if (regBagsEl) regBagsEl.textContent = `${Math.round(totalFilteredBags).toLocaleString('en-IN')} Bags`;

  const regSaleEl = document.getElementById('registerTotalSaleText');
  if (regSaleEl) regSaleEl.textContent = `₹${Math.round(totalFilteredSale).toLocaleString('en-IN')}`;

  const sideBadge = document.getElementById('sidebarOrderCountBadge');
  if (sideBadge) sideBadge.textContent = orders.length;

  if (displayOrders.length === 0) {
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  } else {
    if (emptyState) emptyState.classList.add('hidden');
  }

  displayOrders.forEach(o => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

    const items = (o.items && o.items.length > 0) ? o.items : [
      {
        productName: o.product ? o.product.name : 'Biriyani Rice',
        bagSize: o.bagSize || 25,
        bagQty: o.bagQty || 0,
        totalKg: o.totalKg || 0,
        perKgRate: o.perKgRate || 0,
        totalAmount: o.totalAmount || 0
      }
    ];

    let itemsHtml = '';
    const hasSpecialBrand = items.some(it => isSpecialBrand(it.productName));
    const specialBrandTag = hasSpecialBrand
      ? '<span class="px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded text-[9px] font-bold inline-flex items-center gap-0.5">⭐ Bonus</span>'
      : '';

    if (items.length === 1) {
      itemsHtml = `
        <div class="font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
          <span>${escapeHtml(items[0].productName)}</span>
          ${specialBrandTag}
        </div>
        <span class="inline-block mt-0.5 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold">
          ${items[0].bagSize} kg Bag × ${items[0].bagQty}
        </span>
      `;
    } else {
      itemsHtml = `
        <div class="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>${escapeHtml(items[0].productName)}</span>
          ${specialBrandTag}
          <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[9px] font-black">+${items.length - 1} more</span>
        </div>
        <div class="text-[10px] text-slate-500 mt-0.5 space-y-0.5">
          ${items.map(it => `<div>• ${escapeHtml(it.productName)}: ${it.bagQty} bags (${it.bagSize}kg)</div>`).join('')}
        </div>
      `;
    }

    const rateDisplay = items.length === 1
      ? `₹${items[0].perKgRate}/kg`
      : `Avg ₹${Math.round(o.perKgRate || (o.totalAmount / (o.totalKg || 1)))}/kg`;

    const totalBagsCount = (o.bagQty !== undefined) ? o.bagQty : items.reduce((s, i) => s + (i.bagQty || 0), 0);

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="font-mono font-bold text-blue-700 text-xs">${escapeHtml(o.id)}</div>
        <div class="text-[11px] text-slate-500 font-medium">${escapeHtml(o.date)}</div>
      </td>
      <td class="px-4 py-3">
        <div class="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">${escapeHtml(getCustomerName(o.customer))}</div>
        ${o.notes ? `
          <div class="text-[10px] text-slate-500 mt-0.5 flex items-start gap-1 max-w-[260px]">
            <span class="font-semibold text-slate-700 shrink-0">📝 Note:</span>
            <span class="truncate" title="${escapeHtml(o.notes)}">${escapeHtml(o.notes)}</span>
          </div>
        ` : ''}
      </td>
      <td class="px-4 py-3">
        ${itemsHtml}
      </td>
      <td class="px-4 py-3 text-right font-black text-slate-800 whitespace-nowrap">
        ${totalBagsCount} <span class="text-[10px] text-slate-400 font-normal">Bags</span>
      </td>
      <td class="px-4 py-3 text-right font-black text-blue-950 whitespace-nowrap">
        ${(parseFloat(o.totalKg) || 0).toLocaleString('en-IN')} <span class="text-[10px] text-slate-500 font-normal">kg</span>
      </td>
      <td class="px-4 py-3 text-right font-medium text-slate-600 whitespace-nowrap">
        ${rateDisplay}
      </td>
      <td class="px-4 py-3 text-right whitespace-nowrap">
        <div class="font-black text-slate-900">₹${(parseFloat(o.totalAmount) || 0).toLocaleString('en-IN')}</div>
      </td>
      <td class="px-4 py-3 text-center whitespace-nowrap">
        <div class="flex items-center justify-center gap-1.5">
          <button onclick="openEditOrderModal('${o.id}')" title="Edit Order" class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition">
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button onclick="shareOrderToWhatsApp('${o.id}')" title="Send to WhatsApp Group" class="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition">
            <i data-lucide="message-circle" class="w-4 h-4"></i>
          </button>
          <button onclick="openInvoiceModal('${o.id}')" title="Print Bill" class="p-1.5 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
            <i data-lucide="printer" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteOrder('${o.id}')" title="Delete Order" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function toggleOrderSort(field) {
  const select = document.getElementById('orderSortSelect');
  if (!select) return;
  if (field === 'date') {
    select.value = (select.value === 'date-desc') ? 'date-asc' : 'date-desc';
  } else if (field === 'amount') {
    select.value = (select.value === 'amount-desc') ? 'amount-asc' : 'amount-desc';
  } else if (field === 'qty') {
    select.value = (select.value === 'qty-desc') ? 'qty-asc' : 'qty-desc';
  }
  renderOrdersTable();
}

function clearOrderDateFilter() {
  const input = document.getElementById('orderDateFilter');
  if (input) input.value = '';
  renderOrdersTable();
}

// ==================== WHATSAPP GROUP SHARING ====================

let currentWhatsAppOrderId = null;
let currentInvoiceOrderId = null;

function formatWhatsAppOrderMessage(order) {
  if (!order) return '';

  const orderId = order.id || 'ORD-0000';
  const isUrgent = (order.deliveryStatus === 'Urgent');
  const deliveryStatusText = isUrgent ? '⚡ Urgent' : '🚚 Normal';
  const customerName = getCustomerName(order.customer);

  const items = (order.items && order.items.length > 0) ? order.items : [
    {
      productName: order.product ? order.product.name : 'Biriyani Rice',
      bagSize: order.bagSize || 26,
      bagQty: order.bagQty || 0,
      totalKg: order.totalKg || 0,
      perKgRate: order.perKgRate || 0,
      totalAmount: order.totalAmount || 0
    }
  ];

  const totalBags = (order.bagQty !== undefined) ? order.bagQty : items.reduce((s, i) => s + (parseFloat(i.bagQty) || 0), 0);

  let itemsText = '';
  items.forEach((it) => {
    const qty = it.bagQty || 0;
    itemsText += `   • *${it.productName}:* ${qty} Bags\n`;
  });

  const noteText = (order.notes && order.notes.trim()) ? order.notes.trim() : '-';

  const message =
`1. *Order ID:* ${orderId}
2. *Delivery:* ${deliveryStatusText}
3. *Customer Name:* ${customerName}
4. *Orders:*
${itemsText}   👉 *Total:* ${totalBags} Bags
5. *Note:* ${noteText}`;

  return message;
}

function shareOrderToWhatsApp(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const message = formatWhatsAppOrderMessage(order);
  const encodedText = encodeURIComponent(message);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  window.open(whatsappUrl, '_blank');
}

function showOrderSuccessWhatsAppModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  currentWhatsAppOrderId = orderId;
  const modal = document.getElementById('orderSuccessWhatsAppModal');
  if (!modal) return;

  const msg = formatWhatsAppOrderMessage(order);
  const previewEl = document.getElementById('orderSuccessWhatsAppPreview');
  const subtextEl = document.getElementById('orderSuccessModalSubtext');

  if (previewEl) previewEl.textContent = msg;
  if (subtextEl) subtextEl.textContent = `Order ID: ${order.id} • ${getCustomerName(order.customer)}`;

  modal.classList.remove('hidden');
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeOrderSuccessModal() {
  const modal = document.getElementById('orderSuccessWhatsAppModal');
  if (modal) modal.classList.add('hidden');
  currentWhatsAppOrderId = null;
}

function sendSavedOrderToWhatsApp() {
  if (currentWhatsAppOrderId) {
    shareOrderToWhatsApp(currentWhatsAppOrderId);
    closeOrderSuccessModal();
  }
}

function copyWhatsAppMessage() {
  const previewEl = document.getElementById('orderSuccessWhatsAppPreview');
  if (previewEl && previewEl.textContent) {
    navigator.clipboard.writeText(previewEl.textContent).then(() => {
      showNotification('WhatsApp message copied to clipboard!');
    }).catch(() => {
      showNotification('Failed to copy text.');
    });
  }
}

function shareInvoiceOrderToWhatsApp() {
  if (currentInvoiceOrderId) {
    shareOrderToWhatsApp(currentInvoiceOrderId);
  }
}

// ==================== INVOICE MODAL & PRINT ====================

function openInvoiceModal(orderId) {
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  currentInvoiceOrderId = order.id;

  const invNum = document.getElementById('invNumber');
  if (invNum) invNum.textContent = order.id;
  const invDate = document.getElementById('invDate');
  if (invDate) invDate.textContent = 'Date: ' + order.date;

  const custName = document.getElementById('invCustomerName');
  if (custName) custName.textContent = getCustomerName(order.customer);
  const custLoc = document.getElementById('invCustomerLocation');
  if (custLoc) custLoc.textContent = getCustomerLocation(order.customer);

  const ownerName = getCustomerOwnerName(order.customer);
  const ownerPhone = getCustomerOwnerPhone(order.customer);
  const staffName = getCustomerStaffName(order.customer);
  const staffRole = getCustomerStaffRole(order.customer);
  const staffPhone = getCustomerStaffPhone(order.customer);
  const legacyPhone = getCustomerPhone(order.customer);

  const ownerRow = document.getElementById('invCustomerOwnerRow');
  const ownerText = document.getElementById('invCustomerOwnerText');
  const staffRow = document.getElementById('invCustomerStaffRow');
  const staffText = document.getElementById('invCustomerStaffText');
  const phoneRow = document.getElementById('invCustomerPhoneRow');

  if (ownerRow && ownerText) {
    if (ownerName || ownerPhone) {
      ownerText.textContent = `${ownerName || 'Owner'}${ownerPhone ? ` • Mob: ${ownerPhone}` : ''}`;
      ownerRow.classList.remove('hidden');
    } else {
      ownerRow.classList.add('hidden');
    }
  }

  if (staffRow && staffText) {
    if (staffName || staffPhone) {
      staffText.textContent = `${staffName || 'Staff'} (${staffRole || 'Staff'})${staffPhone ? ` • Mob: ${staffPhone}` : ''}`;
      staffRow.classList.remove('hidden');
    } else {
      staffRow.classList.add('hidden');
    }
  }

  if (phoneRow) {
    if ((ownerName || ownerPhone) || (staffName || staffPhone)) {
      phoneRow.classList.add('hidden');
    } else {
      phoneRow.classList.remove('hidden');
      const custPhone = document.getElementById('invCustomerPhone');
      if (custPhone) custPhone.textContent = 'Mob: ' + legacyPhone;
    }
  }

  const items = (order.items && order.items.length > 0) ? order.items : [
    {
      productName: order.product ? order.product.name : 'Biriyani Rice',
      bagSize: order.bagSize || 25,
      bagQty: order.bagQty || 0,
      totalKg: order.totalKg || 0,
      perKgRate: order.perKgRate || 0,
      totalAmount: order.totalAmount || 0
    }
  ];

  const itemsTbody = document.getElementById('invItemsTableBody');
  if (itemsTbody) {
    itemsTbody.innerHTML = '';
    items.forEach(it => {
      const row = document.createElement('tr');
      row.className = 'border-b border-slate-100';
      row.innerHTML = `
        <td class="p-3 font-bold text-slate-900">${escapeHtml(it.productName)}</td>
        <td class="p-3 text-center">${it.bagSize} kg</td>
        <td class="p-3 text-center font-bold">${it.bagQty} Bags</td>
        <td class="p-3 text-right font-bold text-slate-900">${(parseFloat(it.totalKg) || 0).toLocaleString('en-IN')} kg</td>
        <td class="p-3 text-right font-medium">₹${(parseFloat(it.perKgRate) || 0).toFixed(2)}</td>
        <td class="p-3 text-right font-black text-slate-900">₹${(parseFloat(it.totalAmount) || 0).toLocaleString('en-IN')}</td>
      `;
      itemsTbody.appendChild(row);
    });
  }

  const subTotalEl = document.getElementById('invSubTotal');
  if (subTotalEl) subTotalEl.textContent = `₹${(parseFloat(order.totalAmount) || 0).toLocaleString('en-IN')}`;

  const notesBox = document.getElementById('invNotesContainer');
  const notesText = document.getElementById('invNotesText');
  if (notesBox && notesText) {
    if (order.notes && order.notes.trim()) {
      notesText.textContent = order.notes;
      notesBox.classList.remove('hidden');
    } else {
      notesBox.classList.add('hidden');
    }
  }

  const modal = document.getElementById('invoiceModal');
  if (modal) modal.classList.remove('hidden');

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeInvoiceModal() {
  const modal = document.getElementById('invoiceModal');
  if (modal) modal.classList.add('hidden');
}

// ==================== INCENTIVE DETAILS MODAL ====================

function showIncentiveDetails() {
  const modal = document.getElementById('incentiveDetailModal');
  if (modal) {
    modal.classList.remove('hidden');
    const dateInput = document.getElementById('schemeEffectiveDateInput');
    if (dateInput) {
      dateInput.value = incentiveSchemeEffectiveDate || '2026-05-01';
    }
  }
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeIncentiveDetails() {
  const modal = document.getElementById('incentiveDetailModal');
  if (modal) modal.classList.add('hidden');
}

// ==================== SETTINGS (MASTER DATA, TOWNS & PRODUCTS) MODAL ====================

let currentSettingsTab = 'towns';

function setSettingsTab(tabName) {
  currentSettingsTab = tabName || 'towns';

  const tabTowns = document.getElementById('settingsTabContent-towns');
  const tabProducts = document.getElementById('settingsTabContent-products');
  const tabGeneral = document.getElementById('settingsTabContent-general');

  const btnTowns = document.getElementById('settingsTabBtn-towns');
  const btnProducts = document.getElementById('settingsTabBtn-products');
  const btnGeneral = document.getElementById('settingsTabBtn-general');

  // Reset tab button styles
  [btnTowns, btnProducts, btnGeneral].forEach(btn => {
    if (btn) {
      btn.className = 'settings-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-white text-slate-600 hover:text-slate-900 border border-slate-200';
    }
  });

  // Hide all contents
  if (tabTowns) tabTowns.classList.add('hidden');
  if (tabProducts) tabProducts.classList.add('hidden');
  if (tabGeneral) tabGeneral.classList.add('hidden');

  if (currentSettingsTab === 'towns') {
    if (tabTowns) tabTowns.classList.remove('hidden');
    if (btnTowns) btnTowns.className = 'settings-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    renderSettingsTownsList();
  } else if (currentSettingsTab === 'products') {
    if (tabProducts) tabProducts.classList.remove('hidden');
    if (btnProducts) btnProducts.className = 'settings-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    populateBagSizesDropdown();
    renderProductsManageList();
    renderBagSizesBadges();
  } else if (currentSettingsTab === 'general') {
    if (tabGeneral) tabGeneral.classList.remove('hidden');
    if (btnGeneral) btnGeneral.className = 'settings-tab-btn px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function openSettingsModal(initialTab = 'towns') {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.remove('hidden');
  cancelProductEdit();
  setSettingsTab(initialTab || 'towns');
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeSettingsModal() {
  const modal = document.getElementById('settingsModal');
  if (modal) modal.classList.add('hidden');
  cancelProductEdit();
}

function renderSettingsTownsList() {
  const container = document.getElementById('settingsTownsListContainer');
  const countBadge = document.getElementById('settingsTownsCountBadge');
  const distFilterSelect = document.getElementById('settingsTownsFilterDistrict');
  const searchInput = document.getElementById('settingsTownsSearchInput');

  if (!container) return;

  const selectedDist = distFilterSelect ? distFilterSelect.value : 'all';
  const query = (searchInput?.value || '').trim().toLowerCase();

  // Gather towns to display
  let townsList = [];

  if (selectedDist !== 'all') {
    const list = savedDistrictTowns[selectedDist] || [];
    list.forEach(name => {
      townsList.push({ district: selectedDist, name: name });
    });
  } else {
    KERALA_DISTRICTS.forEach(d => {
      const list = savedDistrictTowns[d] || [];
      list.forEach(name => {
        townsList.push({ district: d, name: name });
      });
    });
  }

  if (query) {
    townsList = townsList.filter(item =>
      item.name.toLowerCase().includes(query) ||
      item.district.toLowerCase().includes(query)
    );
  }

  // Update count badge
  if (countBadge) {
    const totalDistTowns = selectedDist !== 'all'
      ? (savedDistrictTowns[selectedDist]?.length || 0)
      : Object.values(savedDistrictTowns).reduce((sum, arr) => sum + (arr?.length || 0), 0);
    countBadge.textContent = query
      ? `${townsList.length} of ${totalDistTowns} Towns`
      : `${townsList.length} Towns`;
  }

  container.innerHTML = '';

  if (townsList.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
        <i data-lucide="map-pin-off" class="w-8 h-8 mx-auto text-slate-300"></i>
        <div class="text-xs font-bold text-slate-600">No towns found</div>
        <p class="text-[11px] text-slate-400 max-w-sm mx-auto">
          ${query ? `No towns match "${escapeHtml(query)}"` : `No saved towns in this district yet`}. Add a new town using the form on the left!
        </p>
      </div>
    `;
    if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    return;
  }

  townsList.forEach(item => {
    // Count how many customers have this town
    const custCount = Array.isArray(customers)
      ? customers.filter(c => {
          const cDist = getCustomerDistrict(c);
          const cTown = getCustomerTown(c);
          return (cDist.toLowerCase() === item.district.toLowerCase() || selectedDist === 'all') &&
                 cTown.toLowerCase() === item.name.toLowerCase();
        }).length
      : 0;

    const row = document.createElement('div');
    row.className = 'p-3 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition flex items-center justify-between gap-3 group';
    row.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 font-bold text-xs border border-blue-200/60">
          🏙️
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-extrabold text-slate-900 text-xs">${escapeHtml(item.name)}</span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
              📍 ${escapeHtml(item.district)}
            </span>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-semibold ${custCount > 0 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500'}">
              👥 ${custCount} ${custCount === 1 ? 'Customer' : 'Customers'}
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0">
        <button type="button" onclick="openEditTownModal('${escapeHtml(item.district)}', '${escapeHtml(item.name)}')" title="Rename / Edit Town Name" class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition inline-flex items-center gap-1 text-[11px] font-bold">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Edit</span>
        </button>
        <button type="button" onclick="deleteDistrictTown('${escapeHtml(item.district)}', '${escapeHtml(item.name)}')" title="Delete Town from Saved List" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition inline-flex items-center gap-1 text-[11px] font-bold">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          <span class="hidden sm:inline">Delete</span>
        </button>
      </div>
    `;
    container.appendChild(row);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function addNewDistrictTown() {
  const distSelect = document.getElementById('newTownDistrictSelect');
  const nameInput = document.getElementById('newTownNameInput');

  const dist = distSelect ? distSelect.value : 'Ernakulam';
  const rawName = nameInput ? nameInput.value.trim() : '';

  if (!rawName) {
    alert('Please enter a town name.');
    nameInput?.focus();
    return;
  }

  const formatted = rawName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  if (!savedDistrictTowns[dist]) savedDistrictTowns[dist] = [];

  if (savedDistrictTowns[dist].some(t => t.toLowerCase() === formatted.toLowerCase())) {
    alert(`Town "${formatted}" is already saved in ${dist}.`);
    nameInput?.focus();
    return;
  }

  savedDistrictTowns[dist].push(formatted);
  savedDistrictTowns[dist].sort((a, b) => a.localeCompare(b));

  try {
    localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
  } catch (e) {
    console.error('Error saving towns to storage:', e);
  }

  if (nameInput) nameInput.value = '';

  const filterDist = document.getElementById('settingsTownsFilterDistrict');
  if (filterDist && filterDist.value !== 'all' && filterDist.value !== dist) {
    filterDist.value = dist;
  }

  updateTownDatalists();
  renderSettingsTownsList();
  showNotification(`✓ '${formatted}' added to ${dist} towns!`);
}

function openEditTownModal(district, townName) {
  const modal = document.getElementById('editTownModal');
  const distInput = document.getElementById('editTownDistrict');
  const distDisplay = document.getElementById('editTownDistrictDisplay');
  const origInput = document.getElementById('editTownOriginalName');
  const newNameInput = document.getElementById('editTownNewName');

  if (!modal) return;

  if (distInput) distInput.value = district;
  if (distDisplay) distDisplay.value = district;
  if (origInput) origInput.value = townName;
  if (newNameInput) {
    newNameInput.value = townName;
    setTimeout(() => newNameInput.focus(), 100);
  }

  modal.classList.remove('hidden');
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeEditTownModal() {
  const modal = document.getElementById('editTownModal');
  if (modal) modal.classList.add('hidden');
}

function submitEditTownName() {
  const dist = document.getElementById('editTownDistrict')?.value;
  const oldName = document.getElementById('editTownOriginalName')?.value;
  const newNameRaw = document.getElementById('editTownNewName')?.value.trim();

  if (!newNameRaw) {
    alert('Please enter a town name.');
    return;
  }

  const newName = newNameRaw.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');

  if (!dist || !oldName) {
    closeEditTownModal();
    return;
  }

  if (oldName.toLowerCase() === newName.toLowerCase()) {
    closeEditTownModal();
    return;
  }

  if (!savedDistrictTowns[dist]) savedDistrictTowns[dist] = [];

  if (savedDistrictTowns[dist].some(t => t.toLowerCase() === newName.toLowerCase())) {
    alert(`Town "${newName}" already exists in ${dist}.`);
    return;
  }

  // Replace town in savedDistrictTowns
  savedDistrictTowns[dist] = savedDistrictTowns[dist].map(t =>
    t.toLowerCase() === oldName.toLowerCase() ? newName : t
  );
  savedDistrictTowns[dist].sort((a, b) => a.localeCompare(b));

  try {
    localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
  } catch (e) {}

  // Update existing customers
  let customersUpdated = 0;
  if (Array.isArray(customers)) {
    customers.forEach(c => {
      const cDist = getCustomerDistrict(c);
      const cTown = getCustomerTown(c);
      if (cDist.toLowerCase() === dist.toLowerCase() && cTown.toLowerCase() === oldName.toLowerCase()) {
        c.town = newName;
        c.area = newName;
        if (c.place && c.place.toLowerCase() === oldName.toLowerCase()) {
          c.place = newName;
        }
        c.location = getCustomerLocation(c);
        customersUpdated++;
      }
    });
  }

  // Update existing orders
  if (Array.isArray(orders)) {
    orders.forEach(o => {
      if (typeof o.customer === 'object') {
        const oDist = getCustomerDistrict(o.customer);
        const oTown = getCustomerTown(o.customer);
        if (oDist.toLowerCase() === dist.toLowerCase() && oTown.toLowerCase() === oldName.toLowerCase()) {
          o.customer.town = newName;
          o.customer.area = newName;
          if (o.customer.place && o.customer.place.toLowerCase() === oldName.toLowerCase()) {
            o.customer.place = newName;
          }
          o.customer.location = getCustomerLocation(o.customer);
        }
      }
    });
  }

  saveDataToStorage();
  updateTownDatalists();
  renderSettingsTownsList();
  renderCustomersList();
  renderOrdersTable();
  closeEditTownModal();

  showNotification(`✓ Town '${oldName}' renamed to '${newName}'!${customersUpdated > 0 ? ` (${customersUpdated} customer records updated)` : ''}`);
}

function deleteDistrictTown(district, townName) {
  const dist = district || 'Ernakulam';
  const clean = townName.trim();

  // Count customers currently using this town
  const usingCustomers = Array.isArray(customers)
    ? customers.filter(c => {
        const cDist = getCustomerDistrict(c);
        const cTown = getCustomerTown(c);
        return cDist.toLowerCase() === dist.toLowerCase() && cTown.toLowerCase() === clean.toLowerCase();
      })
    : [];

  const countMsg = usingCustomers.length > 0
    ? `<br><br><span class="text-amber-800 text-xs font-semibold">⚠️ Note: <strong>${usingCustomers.length} registered customer(s)</strong> currently have this town. Their profiles will safely keep this address, but '${escapeHtml(clean)}' will be removed from future autocomplete suggestions and dropdowns.</span>`
    : '';

  showConfirmModal({
    title: `Remove Town: ${clean}?`,
    message: `Remove <strong>${escapeHtml(clean)}</strong> from <strong>${escapeHtml(dist)}</strong> saved towns autocomplete list?${countMsg}`,
    hint: '🛡️ You can re-add this town anytime from Settings or simply by typing it when creating an order.',
    confirmText: 'Remove Town',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      if (savedDistrictTowns[dist]) {
        savedDistrictTowns[dist] = savedDistrictTowns[dist].filter(t => t.toLowerCase() !== clean.toLowerCase());
        try {
          localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
        } catch (e) {}

        updateTownDatalists();
        renderSettingsTownsList();

        showNotification(`✓ '${clean}' removed from ${dist} saved towns.`, () => {
          saveNewDistrictTown(dist, clean);
          renderSettingsTownsList();
          showNotification(`✓ '${clean}' restored to ${dist}!`);
        });
      }
    }
  });
}

function confirmResetDistrictTowns() {
  const distSelect = document.getElementById('settingsTownsFilterDistrict');
  const selectedDist = distSelect ? distSelect.value : 'Ernakulam';

  const isAll = (selectedDist === 'all');
  const targetLabel = isAll ? 'all 14 districts' : selectedDist;

  showConfirmModal({
    title: `Reset Towns for ${targetLabel}?`,
    message: `Restore default wholesale towns for <strong>${targetLabel}</strong>? Any custom towns you manually added will be replaced with standard wholesale hubs.`,
    hint: '🛡️ Customer records and past orders will remain 100% safe.',
    confirmText: 'Reset to Default Towns',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      if (isAll) {
        KERALA_DISTRICTS.forEach(d => {
          savedDistrictTowns[d] = [...(DEFAULT_DISTRICT_TOWNS[d] || [d])];
        });
      } else {
        savedDistrictTowns[selectedDist] = [...(DEFAULT_DISTRICT_TOWNS[selectedDist] || [selectedDist])];
      }

      try {
        localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
      } catch (e) {}

      updateTownDatalists();
      renderSettingsTownsList();
      showNotification(`✓ Default towns restored for ${targetLabel}!`);
    }
  });
}

function setProductCategoryFilter(category) {
  currentProductCategoryFilter = category;

  // Update button active styling
  ['all', 'Kaima', 'Kolam', 'Basmati'].forEach(cat => {
    const btn = document.getElementById(`catFilter${cat}`);
    if (btn) {
      if (cat.toLowerCase() === category.toLowerCase()) {
        btn.className = 'cat-filter-btn px-2.5 py-1 rounded-lg bg-white shadow-xs text-blue-600 font-bold transition';
      } else {
        btn.className = 'cat-filter-btn px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 transition';
      }
    }
  });

  renderProductsManageList();
}

function renderProductsManageList() {
  const container = document.getElementById('productsManageList');
  if (!container) return;
  container.innerHTML = '';

  const filtered = currentProductCategoryFilter === 'all'
    ? products
    : products.filter(p => (p.category || 'Other').toLowerCase() === currentProductCategoryFilter.toLowerCase());

  // Update count badge
  const countBadge = document.getElementById('productsCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} of ${products.length} Varieties`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center text-slate-400 bg-slate-50 border border-slate-200 rounded-xl">
        <i data-lucide="package-open" class="w-8 h-8 mx-auto mb-2 text-slate-300"></i>
        <p class="text-xs font-bold text-slate-600">No products found in '${escapeHtml(currentProductCategoryFilter)}' category.</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Use the form above to add a new variety.</p>
      </div>
    `;
    if (window.lucide && typeof lucide.createIcons === 'function') lucide.createIcons();
    return;
  }

  filtered.forEach(p => {
    const item = document.createElement('div');
    item.className = 'flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-xl text-xs gap-3 transition shadow-xs';

    // Category badge color
    const cat = (p.category || 'Kaima').toLowerCase();
    let catClass = 'bg-slate-100 text-slate-800 border-slate-200';
    if (cat === 'kaima') {
      catClass = 'bg-amber-100 text-amber-900 border-amber-300';
    } else if (cat === 'kolam') {
      catClass = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    } else if (cat === 'basmati') {
      catClass = 'bg-indigo-100 text-indigo-900 border-indigo-300';
    }

    const bagSize = parseFloat(p.bagSize) || 26;
    const rate = parseFloat(p.defaultRateKg) || 0;
    const estBagPrice = Math.round(bagSize * rate);

    const specialBadge = isSpecialBrand(p.name)
      ? '<span class="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-500 text-white shadow-xs flex items-center gap-1">⭐ Additional Incentive Brand (0.33%)</span>'
      : '';

    const imgUrl = getProductImageUrl(p);

    item.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <!-- Bag Thumbnail Image -->
        <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
          <img src="${imgUrl}" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover">
        </div>

        <div class="space-y-1 min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="font-extrabold text-slate-900 text-sm tracking-tight truncate">${escapeHtml(p.name)}</span>
            <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${catClass}">${escapeHtml(p.category || 'Kaima')}</span>
            ${specialBadge}
          </div>
          <div class="flex items-center gap-2 text-[11px] text-slate-600 flex-wrap">
            <span class="font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <i data-lucide="package" class="w-3 h-3"></i>
              <span>${bagSize} kg Bag</span>
            </span>
            <span class="font-black text-slate-900">₹${rate} / kg</span>
            <span class="text-slate-400">|</span>
            <span class="text-slate-500 font-semibold">≈ ₹${estBagPrice.toLocaleString('en-IN')} / bag</span>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
        <!-- Edit Button -->
        <button onclick="editProduct('${p.id}')" title="Edit this product" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/90 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition shadow-xs active:scale-95">
          <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          <span>Edit</span>
        </button>
        <!-- Delete Button -->
        <button onclick="deleteProduct('${p.id}')" title="Delete this product" class="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 rounded-lg text-xs font-bold inline-flex items-center gap-1 transition shadow-xs active:scale-95">
          <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          <span>Delete</span>
        </button>
      </div>
    `;
    container.appendChild(item);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// ==================== PRODUCT IMAGE UPLOAD HANDLERS ====================

function triggerProductImageUpload() {
  const input = document.getElementById('productImageInput');
  if (input) input.click();
}

function onProductImageSelected(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file (JPG, PNG, WEBP).');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Compress and resize to max 200x200 px to preserve localStorage (~12-15 KB per image)
      const canvas = document.createElement('canvas');
      const maxDim = 200;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      setProductFormImage(dataUrl);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function setProductFormImage(dataUrl) {
  const hiddenInput = document.getElementById('editingProductImage');
  const previewImg = document.getElementById('productImagePreview');
  const placeholder = document.getElementById('productImagePlaceholder');
  const removeBtn = document.getElementById('removeProductImageBtn');

  if (hiddenInput) {
    hiddenInput.value = dataUrl || '';
    hiddenInput.dataset.removed = dataUrl ? 'false' : 'true';
  }

  if (dataUrl) {
    if (previewImg) {
      previewImg.src = dataUrl;
      previewImg.classList.remove('hidden');
    }
    if (placeholder) placeholder.classList.add('hidden');
    if (removeBtn) removeBtn.classList.remove('hidden');
  } else {
    if (previewImg) {
      previewImg.src = '';
      previewImg.classList.add('hidden');
    }
    if (placeholder) placeholder.classList.remove('hidden');
    if (removeBtn) removeBtn.classList.add('hidden');
  }
}

function removeProductFormImage() {
  const fileInput = document.getElementById('productImageInput');
  if (fileInput) fileInput.value = '';
  setProductFormImage('');
}

function onProductCategoryFormChange(cat) {
  // If user hasn't selected a custom image, keep placeholder clean
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function editProduct(prodId) {
  const prod = products.find(p => p.id === prodId);
  if (!prod) return;

  const editingInput = document.getElementById('editingProductId');
  const nameInput = document.getElementById('newProductName');
  const catSelect = document.getElementById('newProductCategory');
  const bagSelect = document.getElementById('newProductBagSize');
  const rateInput = document.getElementById('newProductRate');

  if (editingInput) editingInput.value = prod.id;
  if (nameInput) nameInput.value = prod.name;
  if (catSelect) catSelect.value = prod.category || 'Kaima';
  if (bagSelect) bagSelect.value = prod.bagSize || 26;
  if (rateInput) rateInput.value = prod.defaultRateKg;

  // Load existing product image or clear preview
  setProductFormImage(prod.imageUrl || '');

  // Change form header & button to Edit mode
  const title = document.getElementById('productFormTitle');
  if (title) {
    title.innerHTML = `
      <i data-lucide="edit-3" class="w-4 h-4 text-amber-600"></i>
      <span>Edit Product: <span class="text-amber-700">${escapeHtml(prod.name)}</span></span>
    `;
  }

  const badge = document.getElementById('productEditingBadge');
  if (badge) badge.classList.remove('hidden');

  const cancelBtn = document.getElementById('productCancelBtn');
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  const submitText = document.getElementById('productSubmitBtnText');
  if (submitText) submitText.textContent = 'Save Changes';

  const submitBtn = document.getElementById('productSubmitBtn');
  if (submitBtn) {
    submitBtn.className = 'text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 shadow-sm active:scale-95';
  }

  const formBox = document.getElementById('productFormBox');
  if (formBox) {
    formBox.className = 'mt-4 bg-amber-50/60 p-4 rounded-xl border border-amber-300 ring-2 ring-amber-400/20 transition';
  }

  if (nameInput) {
    nameInput.focus();
    nameInput.select();
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function cancelProductEdit() {
  const editingInput = document.getElementById('editingProductId');
  const nameInput = document.getElementById('newProductName');
  const catSelect = document.getElementById('newProductCategory');
  const bagSelect = document.getElementById('newProductBagSize');
  const rateInput = document.getElementById('newProductRate');

  if (editingInput) editingInput.value = '';
  if (nameInput) nameInput.value = '';
  if (catSelect) catSelect.value = 'Kaima';
  if (bagSelect) bagSelect.value = 26;
  if (rateInput) rateInput.value = '';

  // Clear product image
  removeProductFormImage();

  const title = document.getElementById('productFormTitle');
  if (title) {
    title.innerHTML = `
      <i data-lucide="plus-circle" class="w-4 h-4 text-blue-600"></i>
      <span>Add New Rice Product</span>
    `;
  }

  const badge = document.getElementById('productEditingBadge');
  if (badge) badge.classList.add('hidden');

  const cancelBtn = document.getElementById('productCancelBtn');
  if (cancelBtn) cancelBtn.classList.add('hidden');

  const submitText = document.getElementById('productSubmitBtnText');
  if (submitText) submitText.textContent = 'Add Product';

  const submitBtn = document.getElementById('productSubmitBtn');
  if (submitBtn) {
    submitBtn.className = 'text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5 shadow-sm active:scale-95';
  }

  const formBox = document.getElementById('productFormBox');
  if (formBox) {
    formBox.className = 'mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200 transition';
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function saveProductForm() {
  const editingInput = document.getElementById('editingProductId');
  const nameInput = document.getElementById('newProductName');
  const catSelect = document.getElementById('newProductCategory');
  const bagSelect = document.getElementById('newProductBagSize');
  const rateInput = document.getElementById('newProductRate');
  const imgInput = document.getElementById('editingProductImage');

  if (!nameInput || !rateInput) return;

  const editingId = editingInput ? editingInput.value.trim() : '';
  const name = nameInput.value.trim();
  const category = catSelect ? catSelect.value : 'Kaima';
  const bagSize = bagSelect ? (parseFloat(bagSelect.value) || 26) : 26;
  const rate = parseFloat(rateInput.value);
  const imageUrl = imgInput ? imgInput.value.trim() : '';

  if (!name) {
    alert('Please enter a product name (e.g. Wayanadan Kaima Rice).');
    if (nameInput) nameInput.focus();
    return;
  }

  if (isNaN(rate) || rate <= 0) {
    alert('Please enter a valid rate per kg (₹).');
    if (rateInput) rateInput.focus();
    return;
  }

  if (editingId) {
    // EDIT EXISTING PRODUCT
    const index = products.findIndex(p => p.id === editingId);
    if (index !== -1) {
      products[index].name = name;
      products[index].category = category;
      products[index].bagSize = bagSize;
      products[index].defaultRateKg = rate;
      if (imageUrl) {
        products[index].imageUrl = imageUrl;
      } else if (imgInput && imgInput.dataset.removed === 'true') {
        products[index].imageUrl = '';
      }

      saveDataToStorage();
      populateProductDropdown();
      renderProductsManageList();
      cancelProductEdit();
      showNotification(`Product '${name}' updated successfully!`);
    }
  } else {
    // ADD NEW PRODUCT
    const newProduct = {
      id: 'p_' + Date.now(),
      name: name,
      category: category,
      bagSize: bagSize,
      defaultRateKg: rate,
      imageUrl: imageUrl || ''
    };

    products.push(newProduct);
    saveDataToStorage();
    populateProductDropdown();
    renderProductsManageList();
    cancelProductEdit();
    showNotification(`New product '${name}' added!`);
  }
}

function addNewProduct() {
  saveProductForm();
}

function deleteProduct(prodId) {
  if (products.length <= 1) {
    alert('At least one rice variety must remain in the catalog.');
    return;
  }

  const prod = products.find(p => p.id === prodId);
  if (!prod) return;

  showConfirmModal({
    title: `Delete Product: ${prod.name}?`,
    message: `Move product <strong>${escapeHtml(prod.name)}</strong> to the Recycle Bin?`,
    hint: '🛡️ Don\'t worry! Product details and rates are preserved in the Recycle Bin. You can restore it anytime.',
    confirmText: 'Move to Recycle Bin',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      const editingInput = document.getElementById('editingProductId');
      if (editingInput && editingInput.value === prodId) {
        cancelProductEdit();
      }

      const removed = prod;
      products = products.filter(p => p.id !== prodId);
      saveDataToStorage();
      populateProductDropdown();
      renderProductsManageList();

      const trashEntry = moveToTrash(
        'product',
        removed,
        removed.name,
        `${removed.category || 'Rice'} • ${removed.bagSize || 26} kg bag • Rate: ₹${removed.defaultRateKg || 0}/kg`
      );

      showNotification(`Product '${removed.name}' moved to Recycle Bin.`, () => {
        restoreTrashItem(trashEntry.trashId);
      });
    }
  });
}

function renderBagSizesBadges() {
  const container = document.getElementById('bagSizesList');
  if (!container) return;
  container.innerHTML = '';

  const sorted = [...bagSizes].sort((a, b) => a - b);
  sorted.forEach(size => {
    const badge = document.createElement('span');
    badge.className = 'inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-xs font-bold';
    badge.innerHTML = `
      <span>${size} kg</span>
      <button onclick="removeBagSize(${size})" class="text-blue-700 hover:text-rose-700 ml-1 font-bold">×</button>
    `;
    container.appendChild(badge);
  });
}

function addNewBagSize() {
  const input = document.getElementById('newBagSizeInput');
  if (!input) return;
  const size = parseFloat(input.value);

  if (isNaN(size) || size <= 0) {
    alert('Please enter a valid bag weight in KG (e.g. 26, 30, 35, 50).');
    return;
  }
  if (bagSizes.includes(size)) {
    alert(`A ${size} kg bag size already exists.`);
    return;
  }

  bagSizes.push(size);
  saveDataToStorage();
  populateBagSizesDropdown();
  renderBagSizesBadges();
  input.value = '';
  showNotification(`${size} kg bag size added!`);
}

function removeBagSize(size) {
  if (bagSizes.length <= 1) {
    alert('At least one bag size must remain.');
    return;
  }
  showConfirmModal({
    title: `Remove ${size} kg Bag Size?`,
    message: `Remove <strong>${size} kg</strong> from available bag sizes?`,
    hint: '🛡️ You can restore it immediately using Undo or add it back anytime in Settings.',
    confirmText: 'Remove Size',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      bagSizes = bagSizes.filter(s => s !== size);
      saveDataToStorage();
      populateBagSizesDropdown();
      renderBagSizesBadges();
      showNotification(`${size} kg bag size removed.`, () => {
        if (!bagSizes.includes(size)) {
          bagSizes.push(size);
          bagSizes.sort((a, b) => a - b);
          saveDataToStorage();
          populateBagSizesDropdown();
          renderBagSizesBadges();
          showNotification(`✓ ${size} kg bag size restored!`);
        }
      });
    }
  });
}

function resetAllData() {
  if (orders.length === 0 && customers.length === 0) {
    showNotification('No sales orders or customer data to clear.');
    return;
  }

  showConfirmModal({
    title: 'Clear All Sales Orders (Fresh Start)?',
    message: `Are you sure you want to clear <strong>${orders.length} orders</strong>? Custom products and bag sizes will remain safe.`,
    hint: '🛡️ MAXIMUM ACCIDENTAL DELETION PROTECTION: An automatic safety recovery snapshot will be saved. You can undo this action immediately or restore all data from the Recycle Bin!',
    confirmText: 'Clear Orders (Save Backup Snapshot)',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      // 1. Save safety snapshot in localStorage
      const snapshot = {
        orders: JSON.parse(JSON.stringify(orders)),
        customers: JSON.parse(JSON.stringify(customers)),
        clearedAt: new Date().toISOString(),
        orderCount: orders.length,
        customerCount: customers.length
      };
      try {
        localStorage.setItem(STORAGE_SAFETY_SNAPSHOT, JSON.stringify(snapshot));
      } catch (e) {}

      // 2. Put orders in trash as a batch
      if (orders.length > 0) {
        moveToTrash(
          'batch_orders',
          orders,
          `Batch Backup: ${orders.length} Orders Cleared on Fresh Start`,
          `Cleared on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} • Full batch restorable`
        );
      }

      orders = [];
      saveDataToStorage();
      closeSettingsModal();
      updateDashboard();

      showNotification('All orders cleared! (Automatic safety snapshot saved in Recycle Bin).', () => {
        restoreSafetySnapshot();
      });
    }
  });
}

// ==================== CUSTOMER DIRECTORY MODAL ====================

let customerCategoryFilter = 'all';

function setCustomerCategoryFilter(cat) {
  customerCategoryFilter = cat;

  // Update pills UI
  const pillBtns = document.querySelectorAll('.cust-cat-pill');
  pillBtns.forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
    btn.classList.add('bg-slate-100', 'text-slate-600');
  });

  const activeId = (
    cat === 'all' ? 'custCatBtn-all' :
    cat === 'Caterer' ? 'custCatBtn-Caterer' :
    cat === 'Hotel / Restaurant' ? 'custCatBtn-Hotel' :
    cat === 'Wholesaler' ? 'custCatBtn-Wholesaler' :
    cat === 'Retailer' ? 'custCatBtn-Retailer' :
    cat === 'Other' ? 'custCatBtn-Other' : 'custCatBtn-all'
  );
  const activeBtn = document.getElementById(activeId);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-100', 'text-slate-600');
    activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
  }

  renderCustomersList();
}

function openCustomersModal() {
  const modal = document.getElementById('customersModal');
  if (modal) modal.classList.remove('hidden');
  renderCustomersList();
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeCustomersModal() {
  const modal = document.getElementById('customersModal');
  if (modal) modal.classList.add('hidden');
  cancelEditCustomer();
}

function handleCustomerFormSubmit(event) {
  event.preventDefault();
  const editId = document.getElementById('custEditId')?.value.trim();
  const name = document.getElementById('custNameInput')?.value.trim();
  const category = document.getElementById('custCategoryInput')?.value || 'Caterer';
  const district = document.getElementById('custDistrictSelect')?.value || 'Ernakulam';
  const town = document.getElementById('custTownInput')?.value.trim() || document.getElementById('custAreaInput')?.value.trim() || '';
  const landmark = document.getElementById('custLandmarkInput')?.value.trim() || document.getElementById('custPlaceInput')?.value.trim() || '';
  const panchayath = document.getElementById('custPanchayathInput')?.value.trim() || '';
  const loc = document.getElementById('custLocationInput')?.value.trim();
  const ownerName = document.getElementById('custOwnerNameInput')?.value.trim() || '';
  const rawOwnerPhone = document.getElementById('custOwnerPhoneInput')?.value.trim() || '';
  const staffName = document.getElementById('custStaffNameInput')?.value.trim() || '';
  const staffRole = document.getElementById('custStaffRoleInput')?.value || 'Chef / Cook';
  const rawStaffPhone = document.getElementById('custStaffPhoneInput')?.value.trim() || '';
  const rawLegacyPhone = document.getElementById('custPhoneInput')?.value.trim() || '';
  const notes = document.getElementById('custNotesInput')?.value.trim();

  if (!name) {
    alert('Please enter a customer or shop name.');
    return;
  }

  if (town) {
    saveNewDistrictTown(district, town);
  }

  let locParts = [];
  if (landmark) locParts.push(landmark);
  if (town) locParts.push(town);
  if (district && district.toLowerCase() !== (town || '').toLowerCase()) locParts.push(district);
  if (panchayath) locParts.push(`(${panchayath})`);
  const combinedLoc = locParts.length > 0 ? locParts.join(', ') : (loc || 'Ernakulam');

  const area = town;
  const place = landmark || town;

  // Validate owner phone: optional, but strictly 10 digits if provided
  let cleanOwnerPhone = '';
  if (rawOwnerPhone) {
    cleanOwnerPhone = cleanPhoneNumber(rawOwnerPhone);
    if (cleanOwnerPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for Owner (or leave blank). You entered: ' + rawOwnerPhone);
      return;
    }
  }

  // Validate staff phone: optional, but strictly 10 digits if provided
  let cleanStaffPhone = '';
  if (rawStaffPhone) {
    cleanStaffPhone = cleanPhoneNumber(rawStaffPhone);
    if (cleanStaffPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for Staff (or leave blank). You entered: ' + rawStaffPhone);
      return;
    }
  }

  const primaryPhone = cleanOwnerPhone || cleanStaffPhone || cleanPhoneNumber(rawLegacyPhone) || '';

  // Duplicate checks
  const duplicate = findDuplicateCustomer(name, cleanOwnerPhone, cleanStaffPhone, primaryPhone, editId || null);
  if (duplicate) {
    if (duplicate.type === 'name') {
      alert(`A customer with the name "${name}" already exists in the directory.`);
    } else if (duplicate.type === 'ownerPhone') {
      alert(`Owner phone "${cleanOwnerPhone}" is already registered for "${duplicate.customer.name}".`);
    } else if (duplicate.type === 'staffPhone') {
      alert(`Staff phone "${cleanStaffPhone}" is already registered for "${duplicate.customer.name}".`);
    } else if (duplicate.type === 'phone') {
      alert(`Phone number "${primaryPhone}" is already registered for "${duplicate.customer.name}".`);
    }
    return;
  }

  if (editId) {
    // Update existing customer
    const idx = customers.findIndex(c => c.id === editId);
    if (idx !== -1) {
      const prevName = customers[idx].name;
      customers[idx] = {
        ...customers[idx],
        name: name,
        category: category,
        district: district,
        town: town,
        landmark: landmark,
        panchayath: panchayath,
        area: area,
        place: place,
        ownerName: ownerName,
        ownerPhone: cleanOwnerPhone,
        staffName: staffName,
        staffRole: staffRole,
        staffPhone: cleanStaffPhone,
        phone: primaryPhone || customers[idx].phone || '',
        location: combinedLoc || 'Ernakulam',
        notes: notes || ''
      };

      // Also update customer references in existing orders if name or contact changed
      orders.forEach(o => {
        if (getCustomerName(o.customer).toLowerCase() === prevName.toLowerCase()) {
          if (typeof o.customer === 'object') {
            o.customer.name = name;
            o.customer.category = category;
            o.customer.district = district;
            o.customer.town = town;
            o.customer.landmark = landmark;
            o.customer.panchayath = panchayath;
            o.customer.area = area;
            o.customer.place = place;
            o.customer.ownerName = ownerName;
            o.customer.ownerPhone = cleanOwnerPhone;
            o.customer.staffName = staffName;
            o.customer.staffRole = staffRole;
            o.customer.staffPhone = cleanStaffPhone;
            if (primaryPhone) o.customer.phone = primaryPhone;
            if (combinedLoc) o.customer.location = combinedLoc;
          }
        }
      });

      saveDataToStorage();
      if (customers[targetIndex]) syncCloudCustomer(customers[targetIndex]);
      populateCustomerDropdown();
      populateSavedAreasDatalists();
      cancelEditCustomer();
      renderCustomersList();
      updateDashboard();
      showNotification(`Customer '${name}' updated successfully!`);
    }
  } else {
    // Add new customer
    const newCust = {
      id: 'c_' + Date.now(),
      name: name,
      category: category,
      district: district,
      town: town,
      landmark: landmark,
      panchayath: panchayath,
      area: area,
      place: place,
      ownerName: ownerName,
      ownerPhone: cleanOwnerPhone,
      staffName: staffName,
      staffRole: staffRole,
      staffPhone: cleanStaffPhone,
      phone: primaryPhone,
      location: combinedLoc || 'Ernakulam',
      notes: notes || ''
    };
    customers.push(newCust);

    saveDataToStorage();
    syncCloudCustomer(newCust);
    populateCustomerDropdown();
    populateSavedAreasDatalists();
    renderCustomersList();

    // Reset inputs
    document.getElementById('custNameInput').value = '';
    document.getElementById('custCategoryInput').value = 'Caterer';
    const distSelect = document.getElementById('custDistrictSelect');
    if (distSelect) {
      distSelect.value = 'Ernakulam';
      onCustDistrictChange('Ernakulam');
    }
    if (document.getElementById('custTownInput')) document.getElementById('custTownInput').value = '';
    if (document.getElementById('custLandmarkInput')) document.getElementById('custLandmarkInput').value = '';
    if (document.getElementById('custPanchayathInput')) document.getElementById('custPanchayathInput').value = '';
    if (document.getElementById('custAreaInput')) document.getElementById('custAreaInput').value = '';
    if (document.getElementById('custPlaceInput')) document.getElementById('custPlaceInput').value = '';
    if (document.getElementById('custLocationInput')) document.getElementById('custLocationInput').value = '';
    if (document.getElementById('custOwnerNameInput')) document.getElementById('custOwnerNameInput').value = '';
    if (document.getElementById('custOwnerPhoneInput')) document.getElementById('custOwnerPhoneInput').value = '';
    if (document.getElementById('custStaffNameInput')) document.getElementById('custStaffNameInput').value = '';
    if (document.getElementById('custStaffRoleInput')) document.getElementById('custStaffRoleInput').value = 'Chef / Cook';
    if (document.getElementById('custStaffPhoneInput')) document.getElementById('custStaffPhoneInput').value = '';
    if (document.getElementById('custPhoneInput')) document.getElementById('custPhoneInput').value = '';
    if (document.getElementById('custNotesInput')) document.getElementById('custNotesInput').value = '';

    showNotification(`Customer '${name}' added!`);
  }
}

function handleAddNewCustomer(event) {
  handleCustomerFormSubmit(event);
}

function editCustomer(customerId) {
  const cust = customers.find(c => c.id === customerId);
  if (!cust) return;

  const formCard = document.getElementById('customerFormCard');
  const editIdInput = document.getElementById('custEditId');
  const nameInput = document.getElementById('custNameInput');
  const catInput = document.getElementById('custCategoryInput');
  const distSelect = document.getElementById('custDistrictSelect');
  const townInput = document.getElementById('custTownInput');
  const landmarkInput = document.getElementById('custLandmarkInput');
  const panchayathInput = document.getElementById('custPanchayathInput');
  const areaInput = document.getElementById('custAreaInput');
  const placeInput = document.getElementById('custPlaceInput');
  const locInput = document.getElementById('custLocationInput');
  const ownerNameInput = document.getElementById('custOwnerNameInput');
  const ownerPhoneInput = document.getElementById('custOwnerPhoneInput');
  const staffNameInput = document.getElementById('custStaffNameInput');
  const staffRoleInput = document.getElementById('custStaffRoleInput');
  const staffPhoneInput = document.getElementById('custStaffPhoneInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const notesInput = document.getElementById('custNotesInput');
  const titleText = document.getElementById('custFormTitleText');
  const submitText = document.getElementById('custSubmitText');
  const cancelBtn = document.getElementById('custCancelEditBtn');

  const custDist = cust.district || 'Ernakulam';
  if (distSelect) {
    distSelect.value = custDist;
    onCustDistrictChange(custDist);
  }
  if (townInput) townInput.value = cust.town || cust.area || '';
  if (landmarkInput) landmarkInput.value = cust.landmark || cust.place || '';
  if (panchayathInput) panchayathInput.value = cust.panchayath || '';

  if (editIdInput) editIdInput.value = cust.id;
  if (nameInput) nameInput.value = cust.name || '';
  if (catInput) catInput.value = cust.category || 'Caterer';
  if (areaInput) areaInput.value = cust.town || cust.area || cust.location || '';
  if (placeInput) placeInput.value = cust.landmark || cust.place || '';
  if (locInput) locInput.value = cust.location || '';
  if (ownerNameInput) ownerNameInput.value = cust.ownerName || '';
  if (ownerPhoneInput) ownerPhoneInput.value = cust.ownerPhone || (cust.phone || '');
  if (staffNameInput) staffNameInput.value = cust.staffName || '';
  if (staffRoleInput) staffRoleInput.value = cust.staffRole || 'Chef / Cook';
  if (staffPhoneInput) staffPhoneInput.value = cust.staffPhone || '';
  if (phoneInput) phoneInput.value = cust.phone || '';
  if (notesInput) notesInput.value = cust.notes || '';

  if (titleText) titleText.textContent = `Edit Customer: ${cust.name}`;
  if (submitText) submitText.textContent = 'Update Customer';
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  if (formCard) {
    formCard.classList.remove('bg-blue-50/60', 'border-blue-200/70');
    formCard.classList.add('bg-amber-50/80', 'border-amber-300', 'ring-2', 'ring-amber-300/40');
  }

  // Scroll to form inside modal
  const modalScrollContainer = document.querySelector('#customersModal > div');
  if (modalScrollContainer) {
    modalScrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
  }
  nameInput?.focus();
}

function cancelEditCustomer() {
  const formCard = document.getElementById('customerFormCard');
  const editIdInput = document.getElementById('custEditId');
  const nameInput = document.getElementById('custNameInput');
  const catInput = document.getElementById('custCategoryInput');
  const distSelect = document.getElementById('custDistrictSelect');
  const townInput = document.getElementById('custTownInput');
  const landmarkInput = document.getElementById('custLandmarkInput');
  const panchayathInput = document.getElementById('custPanchayathInput');
  const areaInput = document.getElementById('custAreaInput');
  const placeInput = document.getElementById('custPlaceInput');
  const locInput = document.getElementById('custLocationInput');
  const ownerNameInput = document.getElementById('custOwnerNameInput');
  const ownerPhoneInput = document.getElementById('custOwnerPhoneInput');
  const staffNameInput = document.getElementById('custStaffNameInput');
  const staffRoleInput = document.getElementById('custStaffRoleInput');
  const staffPhoneInput = document.getElementById('custStaffPhoneInput');
  const phoneInput = document.getElementById('custPhoneInput');
  const notesInput = document.getElementById('custNotesInput');
  const titleText = document.getElementById('custFormTitleText');
  const submitText = document.getElementById('custSubmitText');
  const cancelBtn = document.getElementById('custCancelEditBtn');

  if (distSelect) {
    distSelect.value = 'Ernakulam';
    onCustDistrictChange('Ernakulam');
  }
  if (townInput) townInput.value = '';
  if (landmarkInput) landmarkInput.value = '';
  if (panchayathInput) panchayathInput.value = '';

  if (editIdInput) editIdInput.value = '';
  if (nameInput) nameInput.value = '';
  if (catInput) catInput.value = 'Caterer';
  if (areaInput) areaInput.value = '';
  if (placeInput) placeInput.value = '';
  if (locInput) locInput.value = '';
  if (ownerNameInput) ownerNameInput.value = '';
  if (ownerPhoneInput) ownerPhoneInput.value = '';
  if (staffNameInput) staffNameInput.value = '';
  if (staffRoleInput) staffRoleInput.value = 'Chef / Cook';
  if (staffPhoneInput) staffPhoneInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (notesInput) notesInput.value = '';

  if (titleText) titleText.textContent = 'Add New Customer';
  if (submitText) submitText.textContent = 'Save Customer';
  if (cancelBtn) cancelBtn.classList.add('hidden');

  if (formCard) {
    formCard.classList.remove('bg-amber-50/80', 'border-amber-300', 'ring-2', 'ring-amber-300/40');
    formCard.classList.add('bg-blue-50/60', 'border-blue-200/70');
  }
}

function renderCustomersList() {
  const container = document.getElementById('customersListContainer');
  const countBadge = document.getElementById('custCountBadge');
  const filteredBadge = document.getElementById('custFilteredCountBadge');
  const searchInput = document.getElementById('custDirectorySearchInput') || document.getElementById('custSearchInput');
  const search = (searchInput?.value || '').toLowerCase();

  if (!container) return;

  const filtered = customers.filter(c => {
    // District Filter
    if (customerDistrictFilter !== 'all') {
      const cDist = getCustomerDistrict(c).toLowerCase();
      if (cDist !== customerDistrictFilter.toLowerCase()) return false;
    }

    // Town / Area Filter
    const activeTownFilter = (customerTownFilter !== 'all' ? customerTownFilter : customerAreaFilter);
    if (activeTownFilter !== 'all') {
      const cTown = getCustomerTown(c).toLowerCase();
      const cArea = getCustomerArea(c).toLowerCase();
      const cLoc = getCustomerLocation(c).toLowerCase();
      const filterVal = activeTownFilter.toLowerCase();
      if (cTown !== filterVal && cArea !== filterVal && !cLoc.includes(filterVal)) return false;
    }

    // Category Filter
    if (customerCategoryFilter !== 'all') {
      const custCat = c.category || 'Caterer';
      if (custCat !== customerCategoryFilter) return false;
    }

    if (!search) return true;
    const members = getCustomerMembers(c);
    const matchMember = members.some(m =>
      (m.name && m.name.toLowerCase().includes(search)) ||
      (m.phone && m.phone.includes(search)) ||
      (m.role && m.role.toLowerCase().includes(search))
    );
    return (
      (c.name && c.name.toLowerCase().includes(search)) ||
      (c.phone && c.phone.includes(search)) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(search)) ||
      (c.ownerPhone && c.ownerPhone.includes(search)) ||
      (c.staffName && c.staffName.toLowerCase().includes(search)) ||
      (c.staffRole && c.staffRole.toLowerCase().includes(search)) ||
      (c.staffPhone && c.staffPhone.includes(search)) ||
      (c.district && c.district.toLowerCase().includes(search)) ||
      (c.town && c.town.toLowerCase().includes(search)) ||
      (c.landmark && c.landmark.toLowerCase().includes(search)) ||
      (c.panchayath && c.panchayath.toLowerCase().includes(search)) ||
      (c.area && c.area.toLowerCase().includes(search)) ||
      (c.place && c.place.toLowerCase().includes(search)) ||
      (c.location && c.location.toLowerCase().includes(search)) ||
      (c.category && c.category.toLowerCase().includes(search)) ||
      (c.notes && c.notes.toLowerCase().includes(search)) ||
      matchMember
    );
  });

  if (countBadge) countBadge.textContent = customers.length;
  if (filteredBadge) {
    const isFilterActive = (customerDistrictFilter !== 'all' || customerTownFilter !== 'all' || customerAreaFilter !== 'all' || customerCategoryFilter !== 'all');
    if (!isFilterActive) {
      filteredBadge.textContent = `${filtered.length} customers`;
    } else {
      filteredBadge.textContent = `${filtered.length} of ${customers.length}`;
    }
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    const filterDesc = [];
    if (customerDistrictFilter !== 'all') filterDesc.push(`district '${customerDistrictFilter}'`);
    if (customerTownFilter !== 'all') filterDesc.push(`town '${customerTownFilter}'`);
    else if (customerAreaFilter !== 'all') filterDesc.push(`area '${customerAreaFilter}'`);
    if (customerCategoryFilter !== 'all') filterDesc.push(`category '${customerCategoryFilter}'`);
    const filterDescStr = filterDesc.length > 0 ? ` in ${filterDesc.join(', ')}` : '';
    container.innerHTML = `<div class="p-6 text-center text-xs text-slate-400">
      No customers found${filterDescStr}. Add a new customer on the left!
    </div>`;
    return;
  }

  filtered.forEach(c => {
    const custOrders = orders.filter(o => getCustomerName(o.customer).toLowerCase() === c.name.toLowerCase());
    const totalKg = custOrders.reduce((sum, o) => sum + (parseFloat(o.totalKg) || 0), 0);
    const totalRevenue = custOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
    const catBadge = getCustomerCategoryBadge(c.category || 'Caterer');

    const members = getCustomerMembers(c);
    let contactsHtml = '';
    if (members.length > 0) {
      const memberChips = members.map(m => {
        const badge = getDesignationBadge(m.role);
        return `
          <div class="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 rounded-lg px-2 py-1 text-[11px]">
            <span class="font-bold text-slate-800">${escapeHtml(m.name)}</span>
            ${badge}
            ${m.isPrimary ? '<span class="text-[9px] font-black text-amber-700">★</span>' : ''}
            ${m.phone ? `<a href="tel:${escapeHtml(m.phone)}" class="font-mono text-blue-700 font-bold hover:underline flex items-center gap-0.5 ml-0.5"><i data-lucide="phone" class="w-3 h-3"></i>${escapeHtml(m.phone)}</a>` : ''}
          </div>
        `;
      }).join('');

      contactsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 space-y-1.5">
          <div class="flex items-center justify-between text-[11px]">
            <button type="button" onclick="openCustomerDetailModal('${c.id}')" class="font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 hover:underline">
              <i data-lucide="users" class="w-3.5 h-3.5 text-indigo-600"></i>
              <span>Team &amp; Contacts (${members.length})</span>
            </button>
            <button type="button" onclick="openCustomerDetailModal('${c.id}', true)" class="text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline inline-flex items-center gap-0.5">
              <i data-lucide="plus" class="w-3 h-3"></i>
              <span>+ Add Member</span>
            </button>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap">
            ${memberChips}
          </div>
        </div>
      `;
    } else {
      contactsHtml = `
        <div class="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span class="text-slate-400">No members added yet</span>
          <button type="button" onclick="openCustomerDetailModal('${c.id}', true)" class="text-[11px] text-indigo-600 hover:text-indigo-800 font-bold hover:underline inline-flex items-center gap-0.5">
            <i data-lucide="plus" class="w-3 h-3"></i>
            <span>+ Add Member</span>
          </button>
        </div>
      `;
    }

    const cDist = getCustomerDistrict(c);
    const cTown = getCustomerTown(c);
    const cLandmark = getCustomerLandmark(c);
    const cPanch = getCustomerPanchayath(c);

    let locChips = [];
    if (cLandmark) {
      locChips.push(`<span class="inline-flex items-center gap-1 font-semibold text-slate-800"><i data-lucide="map-pin" class="w-3 h-3 text-rose-500"></i><span>${escapeHtml(cLandmark)}</span></span>`);
    }
    if (cTown) {
      locChips.push(`<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">🏙️ ${escapeHtml(cTown)}${cDist && cDist.toLowerCase() !== cTown.toLowerCase() ? `, ${escapeHtml(cDist)}` : ''}</span>`);
    } else if (cDist) {
      locChips.push(`<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">📍 ${escapeHtml(cDist)}</span>`);
    }
    if (cPanch) {
      locChips.push(`<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">🏛️ ${escapeHtml(cPanch)}</span>`);
    }

    const locSnippet = locChips.length > 0
      ? `<div class="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1.5 flex-wrap">${locChips.join(' ')}</div>`
      : `<div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1"><i data-lucide="map-pin" class="w-3 h-3 text-rose-500"></i><span>${escapeHtml(getCustomerLocation(c))}</span></div>`;

    const card = document.createElement('div');
    card.className = 'p-3 bg-white border border-slate-200 rounded-xl hover:shadow-sm transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5';
    card.innerHTML = `
      <div class="flex-1 min-w-0 w-full sm:w-auto">
        <div class="flex items-center gap-1.5 flex-wrap">
          <button type="button" onclick="openCustomerDetailModal('${c.id}')" class="font-bold text-slate-900 text-xs hover:text-blue-600 hover:underline flex items-center gap-1 text-left" title="Click to view Customer Profile &amp; Team">
            <span>${escapeHtml(c.name)}</span>
            <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i>
          </button>
          ${catBadge}
        </div>
        ${locSnippet}
        ${contactsHtml}
        ${c.notes ? `<div class="text-[10px] text-slate-400 mt-1">${escapeHtml(c.notes)}</div>` : ''}
        <div class="text-[10px] text-blue-700 font-semibold mt-1">
          Total: ${custOrders.length} orders • ${totalKg.toLocaleString('en-IN')} kg • ₹${Math.round(totalRevenue).toLocaleString('en-IN')}
        </div>
      </div>
      <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <button onclick="openCustomerDetailModal('${c.id}')" title="Open Customer Profile &amp; Manage Members" class="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-2.5 py-1.5 rounded-lg transition inline-flex items-center gap-1 border border-indigo-200/70">
          <i data-lucide="users" class="w-3.5 h-3.5"></i>
          <span>Members (${members.length})</span>
        </button>
        <button onclick="startOrderForCustomer('${c.id}')" class="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>Order</span>
        </button>
        <button onclick="editCustomer('${c.id}')" title="Edit Customer Details" class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteCustomer('${c.id}')" title="Delete customer" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function startOrderForCustomer(customerId) {
  closeCustomersModal();
  openNewOrderModal(customerId);
}

function deleteCustomer(customerId) {
  const cust = customers.find(c => c.id === customerId);
  if (!cust) return;

  showConfirmModal({
    title: `Delete Customer: ${cust.name}?`,
    message: `Move customer <strong>${escapeHtml(cust.name)}</strong> (${escapeHtml(cust.category || 'Customer')}) to the Recycle Bin?`,
    hint: '🛡️ Customer details will be safely preserved in the Recycle Bin and can be restored anytime.',
    confirmText: 'Move to Recycle Bin',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      const editId = document.getElementById('custEditId')?.value;
      if (editId === customerId) {
        cancelEditCustomer();
      }

      const removed = cust;
      customers = customers.filter(c => c.id !== customerId);
      saveDataToStorage();
      deleteCloudCustomer(customerId);
      populateCustomerDropdown();
      renderCustomersList();

      const trashEntry = moveToTrash(
        'customer',
        removed,
        removed.name,
        `${removed.category || 'Customer'} • 📞 ${removed.phone || 'No phone'} • 📍 ${removed.location || 'Local'}`
      );

      showNotification(`Customer '${removed.name}' moved to Recycle Bin.`, () => {
        restoreTrashItem(trashEntry.trashId);
      });
    }
  });
}

// ==================== CUSTOMER PROFILE & TEAM MEMBERS MANAGER ====================

let activeDetailCustomerId = null;

function getDesignationBadge(role) {
  const r = (role || 'Staff').trim();
  switch (r) {
    case 'Owner':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">👑 Owner</span>`;
    case 'Managing Partner':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-orange-100 text-orange-900 border border-orange-300">🤝 Partner</span>`;
    case 'Manager':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300">👔 Manager</span>`;
    case 'Head Chef / Usthad':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">👨‍🍳 Usthad</span>`;
    case 'Chef / Cook':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">🍳 Chef</span>`;
    case 'Purchase In-charge':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-900 border border-teal-300">📦 Purchase</span>`;
    case 'Supervisor':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-900 border border-cyan-300">📋 Supervisor</span>`;
    case 'Accountant / Billing':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">💰 Billing</span>`;
    case 'Staff':
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">👤 Staff</span>`;
    default:
      return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">🏷️ ${escapeHtml(r)}</span>`;
  }
}

function getDesignationAvatar(role) {
  const r = (role || 'Staff').trim();
  switch (r) {
    case 'Owner':
    case 'Managing Partner':
      return { bg: 'bg-amber-100 text-amber-700', icon: '<i data-lucide="crown" class="w-4 h-4"></i>' };
    case 'Head Chef / Usthad':
    case 'Chef / Cook':
      return { bg: 'bg-purple-100 text-purple-700', icon: '<i data-lucide="chef-hat" class="w-4 h-4"></i>' };
    case 'Manager':
      return { bg: 'bg-blue-100 text-blue-700', icon: '<i data-lucide="briefcase" class="w-4 h-4"></i>' };
    case 'Purchase In-charge':
      return { bg: 'bg-teal-100 text-teal-700', icon: '<i data-lucide="package" class="w-4 h-4"></i>' };
    case 'Supervisor':
      return { bg: 'bg-cyan-100 text-cyan-700', icon: '<i data-lucide="clipboard-list" class="w-4 h-4"></i>' };
    case 'Accountant / Billing':
      return { bg: 'bg-emerald-100 text-emerald-700', icon: '<i data-lucide="receipt" class="w-4 h-4"></i>' };
    default:
      return { bg: 'bg-slate-100 text-slate-700', icon: '<i data-lucide="user" class="w-4 h-4"></i>' };
  }
}

function getCustomerMembers(cust) {
  if (!cust) return [];
  let target = null;
  if (typeof cust === 'object') {
    target = cust;
  } else if (typeof cust === 'string') {
    const clean = cust.trim().toLowerCase();
    target = customers.find(c => (c.id === cust || (c.name && c.name.trim().toLowerCase() === clean)));
  }

  if (target && Array.isArray(target.members) && target.members.length > 0) {
    return target.members;
  }

  // Fallback: synthesize members from legacy owner/staff fields if present
  const members = [];
  if (target) {
    if (target.ownerName || target.ownerPhone) {
      members.push({
        id: 'm_owner_' + (target.id || '1'),
        name: target.ownerName || 'Owner',
        role: 'Owner',
        phone: target.ownerPhone || '',
        isPrimary: true
      });
    }
    if (target.staffName || target.staffPhone) {
      members.push({
        id: 'm_staff_' + (target.id || '2'),
        name: target.staffName || 'Staff',
        role: target.staffRole || 'Chef / Cook',
        phone: target.staffPhone || '',
        isPrimary: members.length === 0
      });
    }
    if (members.length === 0 && target.phone && target.phone !== 'Nil') {
      members.push({
        id: 'm_phone_' + (target.id || '3'),
        name: target.name || 'Primary Contact',
        role: 'Contact',
        phone: target.phone,
        isPrimary: true
      });
    }
  }
  return members;
}

function syncCustomerMemberLegacyFields(cust) {
  if (!cust || !Array.isArray(cust.members)) return;
  const members = cust.members;

  const owner = members.find(m => m.role === 'Owner' || m.role === 'Managing Partner');
  if (owner) {
    cust.ownerName = owner.name;
    cust.ownerPhone = owner.phone;
  }

  const staff = members.find(m => m.role.includes('Chef') || m.role === 'Manager' || m.role.includes('Purchase') || m.role === 'Staff' || m.role === 'Supervisor');
  if (staff) {
    cust.staffName = staff.name;
    cust.staffRole = staff.role;
    cust.staffPhone = staff.phone;
  }

  const primary = members.find(m => m.isPrimary) || members[0];
  const primaryPhone = primary?.phone || cust.ownerPhone || cust.staffPhone || '';
  if (primaryPhone) cust.phone = primaryPhone;
}

function findDuplicateMemberPhone(phone, currentCustId = null, currentMemberId = null) {
  const clean = cleanPhoneNumber(phone);
  if (!clean) return null;

  for (const c of customers) {
    if (c.id === currentCustId) {
      // Check duplicate within the same customer's other members
      if (Array.isArray(c.members)) {
        for (const m of c.members) {
          if (currentMemberId && m.id === currentMemberId) continue;
          if (cleanPhoneNumber(m.phone) === clean) {
            return { type: 'same_customer', customer: c, member: m };
          }
        }
      }
      continue;
    }

    // Check against other customer's members
    const members = getCustomerMembers(c);
    for (const m of members) {
      if (cleanPhoneNumber(m.phone) === clean) {
        return { type: 'other_customer', customer: c, member: m };
      }
    }

    if (cleanPhoneNumber(c.phone) === clean || cleanPhoneNumber(c.ownerPhone) === clean || cleanPhoneNumber(c.staffPhone) === clean) {
      return { type: 'other_customer', customer: c, member: { name: c.name, role: 'Contact' } };
    }
  }
  return null;
}

function openCustomerDetailModal(customerId, openAddFormImmediately = false) {
  const cust = customers.find(c => c.id === customerId);
  if (!cust) return;

  activeDetailCustomerId = cust.id;

  // Initialize members array if not already initialized
  if (!Array.isArray(cust.members)) {
    cust.members = getCustomerMembers(cust);
    saveDataToStorage();
  }

  const modal = document.getElementById('customerDetailModal');
  if (!modal) return;

  const nameEl = document.getElementById('cdCustomerName');
  const avatarEl = document.getElementById('cdCustomerAvatar');
  const catBadgeEl = document.getElementById('cdCustomerCategoryBadge');
  const locEl = document.getElementById('cdCustomerLocation');
  const notesBox = document.getElementById('cdNotesBox');
  const notesText = document.getElementById('cdNotesText');

  if (nameEl) nameEl.textContent = cust.name;
  if (avatarEl) avatarEl.textContent = (cust.name || 'C').charAt(0).toUpperCase();
  if (catBadgeEl) catBadgeEl.innerHTML = getCustomerCategoryBadge(cust.category || 'Caterer');
  
  const cdDist = getCustomerDistrict(cust);
  const cdTown = getCustomerTown(cust);
  const cdLandmark = getCustomerLandmark(cust);
  const cdPanch = getCustomerPanchayath(cust);
  if (locEl) {
    let partsHtml = [];
    if (cdLandmark) partsHtml.push(`<span class="flex items-center gap-1 font-semibold text-slate-100">📍 ${escapeHtml(cdLandmark)}</span>`);
    if (cdTown) partsHtml.push(`<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">🏙️ ${escapeHtml(cdTown)}${cdDist && cdDist.toLowerCase() !== cdTown.toLowerCase() ? `, ${escapeHtml(cdDist)}` : ''}</span>`);
    else if (cdDist) partsHtml.push(`<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">📍 ${escapeHtml(cdDist)}</span>`);
    if (cdPanch) partsHtml.push(`<span class="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">🏛️ ${escapeHtml(cdPanch)}</span>`);
    
    if (partsHtml.length > 0) {
      locEl.innerHTML = partsHtml.join(' ');
    } else {
      locEl.innerHTML = `<span>📍 ${escapeHtml(getCustomerLocation(cust))}</span>`;
    }
  }

  if (notesBox && notesText) {
    if (cust.notes && cust.notes.trim()) {
      notesText.textContent = cust.notes;
      notesBox.classList.remove('hidden');
    } else {
      notesBox.classList.add('hidden');
    }
  }

  // Calculate customer lifetime statistics
  const custOrders = orders.filter(o => getCustomerName(o.customer).toLowerCase() === cust.name.toLowerCase());
  const totalBags = custOrders.reduce((sum, o) => sum + (parseFloat(o.bagQty) || 0), 0);
  const totalKg = custOrders.reduce((sum, o) => sum + (parseFloat(o.totalKg) || 0), 0);
  const totalRev = custOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);

  const statsOrdersEl = document.getElementById('cdStatsOrders');
  const statsKgEl = document.getElementById('cdStatsKg');
  const statsRevEl = document.getElementById('cdStatsRevenue');

  if (statsOrdersEl) statsOrdersEl.textContent = `${custOrders.length} Orders (${totalBags} Bags)`;
  if (statsKgEl) statsKgEl.textContent = `${totalKg.toLocaleString('en-IN')} kg`;
  if (statsRevEl) statsRevEl.textContent = `₹${Math.round(totalRev).toLocaleString('en-IN')}`;

  renderCustomerMembersList();

  if (openAddFormImmediately) {
    openAddMemberForm();
  } else {
    closeAddMemberForm();
  }

  modal.classList.remove('hidden');

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeCustomerDetailModal() {
  const modal = document.getElementById('customerDetailModal');
  if (modal) modal.classList.add('hidden');
  activeDetailCustomerId = null;
  closeAddMemberForm();
  renderCustomersList();
}

function startOrderFromCustomerDetail() {
  if (!activeDetailCustomerId) return;
  const custId = activeDetailCustomerId;
  closeCustomerDetailModal();
  closeCustomersModal();
  openNewOrderModal(custId);
}

function openAddMemberForm(memberIdToEdit = null) {
  const card = document.getElementById('cdMemberFormCard');
  if (!card) return;

  const titleEl = document.getElementById('cdMemberFormTitle');
  const editIdInput = document.getElementById('cdMemberEditId');
  const nameInput = document.getElementById('cdMemberNameInput');
  const roleSelect = document.getElementById('cdMemberRoleSelect');
  const phoneInput = document.getElementById('cdMemberPhoneInput');
  const isPrimaryCheck = document.getElementById('cdMemberIsPrimary');
  const submitText = document.getElementById('cdMemberSubmitText');

  card.classList.remove('hidden');

  if (memberIdToEdit && activeDetailCustomerId) {
    const cust = customers.find(c => c.id === activeDetailCustomerId);
    const members = getCustomerMembers(cust);
    const m = members.find(item => item.id === memberIdToEdit);
    if (m) {
      if (editIdInput) editIdInput.value = m.id;
      if (nameInput) nameInput.value = m.name || '';
      if (roleSelect) roleSelect.value = m.role || 'Staff';
      if (phoneInput) phoneInput.value = m.phone || '';
      if (isPrimaryCheck) isPrimaryCheck.checked = !!m.isPrimary;
      if (titleEl) titleEl.textContent = `Edit Member: ${m.name}`;
      if (submitText) submitText.textContent = 'Update Member';
    }
  } else {
    if (editIdInput) editIdInput.value = '';
    if (nameInput) nameInput.value = '';
    if (roleSelect) roleSelect.value = 'Staff';
    if (phoneInput) phoneInput.value = '';
    if (isPrimaryCheck) isPrimaryCheck.checked = false;
    if (titleEl) titleEl.textContent = 'Add New Team Member';
    if (submitText) submitText.textContent = 'Save Member';
  }

  nameInput?.focus();

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeAddMemberForm() {
  const card = document.getElementById('cdMemberFormCard');
  if (card) card.classList.add('hidden');
  const editIdInput = document.getElementById('cdMemberEditId');
  const nameInput = document.getElementById('cdMemberNameInput');
  const phoneInput = document.getElementById('cdMemberPhoneInput');
  if (editIdInput) editIdInput.value = '';
  if (nameInput) nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
}

function handleSaveMember(event) {
  event.preventDefault();
  if (!activeDetailCustomerId) return;

  const cust = customers.find(c => c.id === activeDetailCustomerId);
  if (!cust) return;

  if (!Array.isArray(cust.members)) {
    cust.members = getCustomerMembers(cust);
  }

  const editId = document.getElementById('cdMemberEditId')?.value.trim();
  const name = document.getElementById('cdMemberNameInput')?.value.trim();
  const role = document.getElementById('cdMemberRoleSelect')?.value || 'Staff';
  const rawPhone = document.getElementById('cdMemberPhoneInput')?.value.trim() || '';
  const isPrimary = document.getElementById('cdMemberIsPrimary')?.checked || false;

  if (!name) {
    alert('Please enter member name.');
    return;
  }

  let cleanPhone = '';
  if (rawPhone) {
    cleanPhone = cleanPhoneNumber(rawPhone);
    if (cleanPhone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number for member (or leave blank). You entered: ' + rawPhone);
      return;
    }
  }

  // Duplicate mobile check
  if (cleanPhone) {
    const duplicate = findDuplicateMemberPhone(cleanPhone, cust.id, editId || null);
    if (duplicate) {
      if (duplicate.type === 'same_customer') {
        alert(`This phone number (${cleanPhone}) is already assigned to "${duplicate.member.name}" (${duplicate.member.role}) in this same customer.`);
        return;
      } else if (duplicate.type === 'other_customer') {
        alert(`This phone number (${cleanPhone}) is already registered for another customer: "${duplicate.customer.name}" (${duplicate.member.name} - ${duplicate.member.role}).`);
        return;
      }
    }
  }

  if (isPrimary) {
    cust.members.forEach(m => m.isPrimary = false);
  }

  if (editId) {
    const idx = cust.members.findIndex(m => m.id === editId);
    if (idx !== -1) {
      cust.members[idx] = {
        ...cust.members[idx],
        id: editId,
        name: name,
        role: role,
        phone: cleanPhone,
        isPrimary: isPrimary
      };
      showNotification(`Member '${name}' updated!`);
    }
  } else {
    cust.members.push({
      id: 'm_' + Date.now(),
      name: name,
      role: role,
      phone: cleanPhone,
      isPrimary: isPrimary || cust.members.length === 0
    });
    showNotification(`Member '${name}' added!`);
  }

  syncCustomerMemberLegacyFields(cust);
  saveDataToStorage();
  closeAddMemberForm();
  renderCustomerMembersList();
  renderCustomersList();
}

function editCustomerMember(customerId, memberId) {
  activeDetailCustomerId = customerId;
  openAddMemberForm(memberId);
}

function deleteCustomerMember(customerId, memberId) {
  const cust = customers.find(c => c.id === customerId);
  if (!cust) return;

  if (!Array.isArray(cust.members)) {
    cust.members = getCustomerMembers(cust);
  }

  const member = cust.members.find(m => m.id === memberId);
  if (!member) return;

  showConfirmModal({
    title: `Remove Member: ${member.name}?`,
    message: `Remove <strong>${escapeHtml(member.name)}</strong> (${escapeHtml(member.role)}) from ${escapeHtml(cust.name)}'s team?`,
    hint: 'This contact will be removed from this customer profile.',
    confirmText: 'Remove Member',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      cust.members = cust.members.filter(m => m.id !== memberId);
      syncCustomerMemberLegacyFields(cust);
      saveDataToStorage();
      renderCustomerMembersList();
      renderCustomersList();
      showNotification(`Member '${member.name}' removed.`);
    }
  });
}

function renderCustomerMembersList() {
  const container = document.getElementById('cdMembersListContainer');
  const countBadge = document.getElementById('cdMembersCountBadge');
  if (!container) return;

  if (!activeDetailCustomerId) {
    container.innerHTML = '';
    return;
  }

  const cust = customers.find(c => c.id === activeDetailCustomerId);
  if (!cust) return;

  const members = getCustomerMembers(cust);
  if (countBadge) countBadge.textContent = members.length;
  container.innerHTML = '';

  if (members.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
        <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center">
          <i data-lucide="users" class="w-5 h-5"></i>
        </div>
        <div class="text-xs font-bold text-slate-700">No team members added yet</div>
        <p class="text-[11px] text-slate-400 max-w-sm mx-auto">Add the Owner, Head Chef, Manager, or Purchase In-charge so you always have their direct contacts handy.</p>
        <button type="button" onclick="openAddMemberForm()" class="mt-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1 shadow-sm">
          <i data-lucide="user-plus" class="w-3.5 h-3.5"></i>
          <span>+ Add First Member</span>
        </button>
      </div>
    `;
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
    return;
  }

  members.forEach(m => {
    const card = document.createElement('div');
    card.className = 'p-3 bg-white border border-slate-200 rounded-xl hover:shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-2.5';

    const avatar = getDesignationAvatar(m.role);
    const badge = getDesignationBadge(m.role);

    card.innerHTML = `
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-9 h-9 rounded-xl ${avatar.bg} flex items-center justify-center shrink-0 shadow-2xs">
          ${avatar.icon}
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-slate-900 text-xs truncate">${escapeHtml(m.name)}</span>
            ${badge}
            ${m.isPrimary ? '<span class="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300">⭐ Primary</span>' : ''}
          </div>
          <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
            ${m.phone ? `
              <span class="font-mono text-slate-700 font-bold">${escapeHtml(m.phone)}</span>
            ` : '<span class="text-slate-400 font-mono text-[10px]">No mobile entered</span>'}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        ${m.phone ? `
          <a href="tel:${escapeHtml(m.phone)}" title="Call" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition inline-flex items-center gap-1 text-[11px] font-bold">
            <i data-lucide="phone" class="w-3.5 h-3.5"></i>
            <span>Call</span>
          </a>
          <a href="https://wa.me/91${escapeHtml(m.phone)}" target="_blank" title="WhatsApp" class="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition inline-flex items-center gap-1 text-[11px] font-bold">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
            <span>WhatsApp</span>
          </a>
        ` : ''}
        <button type="button" onclick="editCustomerMember('${cust.id}', '${m.id}')" title="Edit Member" class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition">
          <i data-lucide="edit-3" class="w-4 h-4"></i>
        </button>
        <button type="button" onclick="deleteCustomerMember('${cust.id}', '${m.id}')" title="Delete Member" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// ==================== DATA BACKUP & DEMO DATA ====================

function exportDataJSON() {
  const exportPayload = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    schemeEffectiveDate: incentiveSchemeEffectiveDate,
    orders: orders,
    products: products,
    bagSizes: bagSizes,
    customers: customers
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `third_man_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function triggerImportDataJSON() {
  const input = document.getElementById('importJsonFileInput');
  if (input) {
    input.value = '';
    input.click();
  }
}

function handleImportDataJSON(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid JSON file format');
      }

      let restoredOrders = 0;
      let restoredCustomers = 0;

      if (Array.isArray(data.orders)) {
        orders = data.orders;
        restoredOrders = orders.length;
      }
      if (Array.isArray(data.customers)) {
        customers = data.customers;
        restoredCustomers = customers.length;
      }
      if (Array.isArray(data.products) && data.products.length > 0) {
        products = data.products;
      }
      if (Array.isArray(data.bagSizes) && data.bagSizes.length > 0) {
        bagSizes = data.bagSizes;
      }
      if (data.schemeEffectiveDate && /^\d{4}-\d{2}-\d{2}$/.test(data.schemeEffectiveDate.trim())) {
        incentiveSchemeEffectiveDate = data.schemeEffectiveDate.trim();
        try {
          localStorage.setItem(STORAGE_INCENTIVE_EFFECTIVE_DATE, incentiveSchemeEffectiveDate);
        } catch (e) {}
      }

      saveDataToStorage();
      if (typeof manualTriggerCloudSync === 'function') manualTriggerCloudSync();
      updateDashboard();
      populateCustomerDropdown();
      populateProductDropdown();
      populateBagSizesDropdown();
      renderCustomersList();
      if (typeof renderProductsManageList === 'function') renderProductsManageList();
      if (typeof renderBagSizesBadges === 'function') renderBagSizesBadges();

      if (window.lucide && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }

      showNotification(`✓ Backup restored successfully! (${restoredOrders} orders, ${restoredCustomers} customers)`);
      alert(`Data restored successfully!\n\nOrders: ${restoredOrders}\nCustomers: ${restoredCustomers}`);
    } catch (err) {
      console.error('Import error:', err);
      alert('Error restoring backup file: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function seedInitialDemoData() {
  const today = new Date();

  function getDateStr(daysAgo) {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  }

  const sampleOrders = [
    // Current Month (November 2026)
    {
      id: 'ORD-1001',
      date: getDateStr(0),
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        staffName: 'Ustad Shafi',
        staffRole: 'Chef / Cook',
        staffPhone: '9847111222',
        phone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 15, totalKg: 390, perKgRate: 96, totalAmount: 37440 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 15,
      totalKg: 390,
      perKgRate: 96,
      totalAmount: 37440,
      notes: 'Delivered via KL-11 Pick-up. Driver: Rafeeq.'
    },
    {
      id: 'ORD-1002',
      date: getDateStr(1),
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        staffName: 'Musthafa',
        staffRole: 'Manager',
        staffPhone: '9744223344',
        phone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Urgent',
      items: [
        { productId: 'p2', productName: 'Jeerakasala Rice', bagSize: 50, bagQty: 8, totalKg: 400, perKgRate: 92, totalAmount: 36800 }
      ],
      product: { id: 'p2', name: 'Jeerakasala Rice' },
      bagSize: 50,
      bagQty: 8,
      totalKg: 400,
      perKgRate: 92,
      totalAmount: 36800,
      notes: 'Urgent dispatch for wedding banquet.'
    },
    {
      id: 'ORD-1003',
      date: getDateStr(2),
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        staffName: 'Chef Hameed',
        staffRole: 'Chef / Cook',
        staffPhone: '9895334455',
        phone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p3', productName: 'Royal 1121 Sella Basmati', bagSize: 26, bagQty: 8, totalKg: 208, perKgRate: 105, totalAmount: 21840 },
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 30, bagQty: 4, totalKg: 120, perKgRate: 96, totalAmount: 11520 }
      ],
      product: { id: 'p3', name: 'Royal 1121 Sella Basmati (+1 more)' },
      bagSize: 26,
      bagQty: 12,
      totalKg: 328,
      perKgRate: 101.7,
      totalAmount: 33360,
      notes: 'Weekly recurring supply.'
    },
    {
      id: 'ORD-1004',
      date: getDateStr(4),
      customer: {
        name: 'Zuhra Wedding Caterers',
        category: 'Caterer',
        ownerName: 'K.P. Ummer',
        ownerPhone: '9447556677',
        staffName: 'Jabir',
        staffRole: 'Purchase In-charge',
        staffPhone: '9447889900',
        phone: '9447556677',
        location: 'Manjeri'
      },
      deliveryStatus: 'Urgent',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 50, bagQty: 6, totalKg: 300, perKgRate: 96, totalAmount: 28800 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 50,
      bagQty: 6,
      totalKg: 300,
      perKgRate: 96,
      totalAmount: 28800,
      notes: 'Delivery arranged to catering site. Function on Saturday.'
    },
    {
      id: 'ORD-1005',
      date: '2026-11-06',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_mg', productName: 'Mohabbath Green Kaima Rice', bagSize: 26, bagQty: 50, totalKg: 1300, perKgRate: 98, totalAmount: 127400 }
      ],
      product: { id: 'sp_mg', name: 'Mohabbath Green Kaima Rice' },
      bagSize: 26,
      bagQty: 50,
      totalKg: 1300,
      perKgRate: 98,
      totalAmount: 127400,
      notes: 'Bulk weekend mandi stock.'
    },

    // October 2026 (Last Month) - Target 10T Achieved + Special Brands Turnover Bonus (> ₹15L)
    {
      id: 'ORD-2001',
      date: '2026-10-04',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_mg', productName: 'Mohabbath Green Kaima Rice', bagSize: 26, bagQty: 120, totalKg: 3120, perKgRate: 98, totalAmount: 305760 }
      ],
      product: { id: 'sp_mg', name: 'Mohabbath Green Kaima Rice' },
      bagSize: 26,
      bagQty: 120,
      totalKg: 3120,
      perKgRate: 98,
      totalAmount: 305760,
      notes: 'Monthly bulk dispatch.'
    },
    {
      id: 'ORD-2002',
      date: '2026-10-10',
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_jas', productName: 'Jasmine Premium Basmati Rice', bagSize: 30, bagQty: 100, totalKg: 3000, perKgRate: 112, totalAmount: 336000 }
      ],
      product: { id: 'sp_jas', name: 'Jasmine Premium Basmati Rice' },
      bagSize: 30,
      bagQty: 100,
      totalKg: 3000,
      perKgRate: 112,
      totalAmount: 336000,
      notes: 'Grand wedding reception bulk stock.'
    },
    {
      id: 'ORD-2003',
      date: '2026-10-16',
      customer: {
        name: 'Zuhra Wedding Caterers',
        category: 'Caterer',
        ownerName: 'K.P. Ummer',
        ownerPhone: '9447556677',
        location: 'Manjeri'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_mgold', productName: 'Mohabbath Gold Biriyani Rice', bagSize: 26, bagQty: 110, totalKg: 2860, perKgRate: 104, totalAmount: 297440 }
      ],
      product: { id: 'sp_mgold', name: 'Mohabbath Gold Biriyani Rice' },
      bagSize: 26,
      bagQty: 110,
      totalKg: 2860,
      perKgRate: 104,
      totalAmount: 297440,
      notes: 'Convention centre catering supply.'
    },
    {
      id: 'ORD-2004',
      date: '2026-10-22',
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_mg', productName: 'Mohabbath Green Kaima Rice', bagSize: 26, bagQty: 90, totalKg: 2340, perKgRate: 98, totalAmount: 229320 }
      ],
      product: { id: 'sp_mg', name: 'Mohabbath Green Kaima Rice' },
      bagSize: 26,
      bagQty: 90,
      totalKg: 2340,
      perKgRate: 98,
      totalAmount: 229320,
      notes: 'Calicut branch recurring delivery.'
    },
    {
      id: 'ORD-2005',
      date: '2026-10-28',
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_jas', productName: 'Jasmine Premium Basmati Rice', bagSize: 30, bagQty: 120, totalKg: 3600, perKgRate: 112, totalAmount: 403200 }
      ],
      product: { id: 'sp_jas', name: 'Jasmine Premium Basmati Rice' },
      bagSize: 30,
      bagQty: 120,
      totalKg: 3600,
      perKgRate: 112,
      totalAmount: 403200,
      notes: 'Festival banquet special supply.'
    },

    // September 2026 (Under 10T - Progress 84%)
    {
      id: 'ORD-2101',
      date: '2026-09-08',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 100, totalKg: 2600, perKgRate: 96, totalAmount: 249600 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 100,
      totalKg: 2600,
      perKgRate: 96,
      totalAmount: 249600
    },
    {
      id: 'ORD-2102',
      date: '2026-09-17',
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p2', productName: 'Jeerakasala Rice', bagSize: 50, bagQty: 50, totalKg: 2500, perKgRate: 92, totalAmount: 230000 }
      ],
      product: { id: 'p2', name: 'Jeerakasala Rice' },
      bagSize: 50,
      bagQty: 50,
      totalKg: 2500,
      perKgRate: 92,
      totalAmount: 230000
    },
    {
      id: 'ORD-2103',
      date: '2026-09-25',
      customer: {
        name: 'Zuhra Wedding Caterers',
        category: 'Caterer',
        ownerName: 'K.P. Ummer',
        ownerPhone: '9447556677',
        location: 'Manjeri'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 130, totalKg: 3380, perKgRate: 96, totalAmount: 324480 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 130,
      totalKg: 3380,
      perKgRate: 96,
      totalAmount: 324480
    },

    // August 2026 (Target 10T Unlocked - 10,800 kg)
    {
      id: 'ORD-2201',
      date: '2026-08-10',
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 150, totalKg: 3900, perKgRate: 96, totalAmount: 374400 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 150,
      totalKg: 3900,
      perKgRate: 96,
      totalAmount: 374400
    },
    {
      id: 'ORD-2202',
      date: '2026-08-20',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p2', productName: 'Jeerakasala Rice', bagSize: 50, bagQty: 70, totalKg: 3500, perKgRate: 92, totalAmount: 322000 }
      ],
      product: { id: 'p2', name: 'Jeerakasala Rice' },
      bagSize: 50,
      bagQty: 70,
      totalKg: 3500,
      perKgRate: 92,
      totalAmount: 322000
    },
    {
      id: 'ORD-2203',
      date: '2026-08-28',
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p3', productName: 'Royal 1121 Sella Basmati', bagSize: 26, bagQty: 130, totalKg: 3380, perKgRate: 105, totalAmount: 354900 }
      ],
      product: { id: 'p3', name: 'Royal 1121 Sella Basmati' },
      bagSize: 26,
      bagQty: 130,
      totalKg: 3380,
      perKgRate: 105,
      totalAmount: 354900
    },

    // January to March 2026 (For testing Jan 1 to Jan 20 & Jan 1 to Mar 29 filters)
    {
      id: 'ORD-3001',
      date: '2026-01-04',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 40, totalKg: 1040, perKgRate: 96, totalAmount: 99840 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 40,
      totalKg: 1040,
      perKgRate: 96,
      totalAmount: 99840
    },
    {
      id: 'ORD-3002',
      date: '2026-01-11',
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p2', productName: 'Jeerakasala Rice', bagSize: 50, bagQty: 24, totalKg: 1200, perKgRate: 92, totalAmount: 110400 }
      ],
      product: { id: 'p2', name: 'Jeerakasala Rice' },
      bagSize: 50,
      bagQty: 24,
      totalKg: 1200,
      perKgRate: 92,
      totalAmount: 110400
    },
    {
      id: 'ORD-3003',
      date: '2026-01-18',
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 50, totalKg: 1300, perKgRate: 96, totalAmount: 127400 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 50,
      totalKg: 1300,
      perKgRate: 96,
      totalAmount: 127400
    },
    {
      id: 'ORD-3004',
      date: '2026-01-26',
      customer: {
        name: 'Zuhra Wedding Caterers',
        category: 'Caterer',
        ownerName: 'K.P. Ummer',
        ownerPhone: '9447556677',
        location: 'Manjeri'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p3', productName: 'Royal 1121 Sella Basmati', bagSize: 30, bagQty: 60, totalKg: 1800, perKgRate: 105, totalAmount: 189000 }
      ],
      product: { id: 'p3', name: 'Royal 1121 Sella Basmati' },
      bagSize: 30,
      bagQty: 60,
      totalKg: 1800,
      perKgRate: 105,
      totalAmount: 189000
    },
    {
      id: 'ORD-3005',
      date: '2026-02-12',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 80, totalKg: 2080, perKgRate: 96, totalAmount: 199680 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 80,
      totalKg: 2080,
      perKgRate: 96,
      totalAmount: 199680
    },
    {
      id: 'ORD-3006',
      date: '2026-02-24',
      customer: {
        name: 'Malabar Catering Unit',
        category: 'Caterer',
        ownerName: 'Rashid K.',
        ownerPhone: '9744112233',
        location: 'Kannur'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p2', productName: 'Jeerakasala Rice', bagSize: 50, bagQty: 30, totalKg: 1500, perKgRate: 92, totalAmount: 138000 }
      ],
      product: { id: 'p2', name: 'Jeerakasala Rice' },
      bagSize: 50,
      bagQty: 30,
      totalKg: 1500,
      perKgRate: 92,
      totalAmount: 138000
    },
    {
      id: 'ORD-3007',
      date: '2026-03-08',
      customer: {
        name: 'Rahmath Hotel & Restaurant',
        category: 'Hotel / Restaurant',
        ownerName: 'Ali Akbar',
        ownerPhone: '9895223344',
        location: 'Calicut Town'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 90, totalKg: 2340, perKgRate: 96, totalAmount: 224640 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 90,
      totalKg: 2340,
      perKgRate: 96,
      totalAmount: 224640
    },
    {
      id: 'ORD-3008',
      date: '2026-03-22',
      customer: {
        name: 'Zuhra Wedding Caterers',
        category: 'Caterer',
        ownerName: 'K.P. Ummer',
        ownerPhone: '9447556677',
        location: 'Manjeri'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'sp_jas', productName: 'Jasmine Premium Basmati Rice', bagSize: 30, bagQty: 70, totalKg: 2100, perKgRate: 112, totalAmount: 235200 }
      ],
      product: { id: 'sp_jas', name: 'Jasmine Premium Basmati Rice' },
      bagSize: 30,
      bagQty: 70,
      totalKg: 2100,
      perKgRate: 112,
      totalAmount: 235200
    },
    {
      id: 'ORD-3009',
      date: '2026-03-28',
      customer: {
        name: 'Al-Reem Mandi & Biriyani',
        category: 'Hotel / Restaurant',
        ownerName: 'Moideen Haji',
        ownerPhone: '9847123456',
        location: 'Kozhikode'
      },
      deliveryStatus: 'Normal',
      items: [
        { productId: 'p1', productName: 'Wayanadan Kaima Rice', bagSize: 26, bagQty: 55, totalKg: 1430, perKgRate: 96, totalAmount: 137280 }
      ],
      product: { id: 'p1', name: 'Wayanadan Kaima Rice' },
      bagSize: 26,
      bagQty: 55,
      totalKg: 1430,
      perKgRate: 96,
      totalAmount: 137280
    }
  ];

  // Merge sample orders safely without duplicating existing IDs
  if (!orders || orders.length === 0) {
    orders = sampleOrders;
  } else {
    const existingIds = new Set(orders.map(o => o.id));
    sampleOrders.forEach(so => {
      if (!existingIds.has(so.id)) {
        orders.push(so);
      }
    });
  }

  customers = [
    {
      id: 'c1',
      name: 'Al-Reem Mandi & Biriyani',
      category: 'Hotel / Restaurant',
      location: 'Kozhikode',
      notes: 'Daily biriyani rice buyer',
      members: [
        { id: 'm1_1', name: 'Moideen Haji', role: 'Owner', phone: '9847123456', isPrimary: true },
        { id: 'm1_2', name: 'Ustad Shafi', role: 'Head Chef / Usthad', phone: '9847111222', isPrimary: false },
        { id: 'm1_3', name: 'Suhail', role: 'Purchase In-charge', phone: '9847333444', isPrimary: false }
      ],
      ownerName: 'Moideen Haji',
      ownerPhone: '9847123456',
      staffName: 'Ustad Shafi',
      staffRole: 'Head Chef / Usthad',
      staffPhone: '9847111222',
      phone: '9847123456'
    },
    {
      id: 'c2',
      name: 'Malabar Catering Unit',
      category: 'Caterer',
      location: 'Kannur',
      notes: 'Bulk wedding orders',
      members: [
        { id: 'm2_1', name: 'Rashid K.', role: 'Owner', phone: '9744112233', isPrimary: true },
        { id: 'm2_2', name: 'Musthafa', role: 'Manager', phone: '9744223344', isPrimary: false },
        { id: 'm2_3', name: 'Chef Ashraf', role: 'Chef / Cook', phone: '9744556677', isPrimary: false }
      ],
      ownerName: 'Rashid K.',
      ownerPhone: '9744112233',
      staffName: 'Musthafa',
      staffRole: 'Manager',
      staffPhone: '9744223344',
      phone: '9744112233'
    },
    {
      id: 'c3',
      name: 'Rahmath Hotel & Restaurant',
      category: 'Hotel / Restaurant',
      location: 'Calicut Town',
      notes: 'Weekly recurring supply',
      members: [
        { id: 'm3_1', name: 'Ali Akbar', role: 'Managing Partner', phone: '9895223344', isPrimary: true },
        { id: 'm3_2', name: 'Chef Hameed', role: 'Head Chef / Usthad', phone: '9895334455', isPrimary: false }
      ],
      ownerName: 'Ali Akbar',
      ownerPhone: '9895223344',
      staffName: 'Chef Hameed',
      staffRole: 'Head Chef / Usthad',
      staffPhone: '9895334455',
      phone: '9895223344'
    },
    {
      id: 'c4',
      name: 'Zuhra Wedding Caterers',
      category: 'Caterer',
      location: 'Manjeri',
      notes: 'Function caterer',
      members: [
        { id: 'm4_1', name: 'K.P. Ummer', role: 'Owner', phone: '9447556677', isPrimary: true },
        { id: 'm4_2', name: 'Jabir', role: 'Purchase In-charge', phone: '9447889900', isPrimary: false },
        { id: 'm4_3', name: 'Majeed Usthad', role: 'Head Chef / Usthad', phone: '9447221100', isPrimary: false }
      ],
      ownerName: 'K.P. Ummer',
      ownerPhone: '9447556677',
      staffName: 'Jabir',
      staffRole: 'Purchase In-charge',
      staffPhone: '9447889900',
      phone: '9447556677'
    }
  ];

  saveDataToStorage();
}

function loadSampleDemoData() {
  seedInitialDemoData();
  updateDashboard();
  showNotification('Demo sample data loaded successfully!');
}

// ==================== ACCIDENTAL DELETION SHIELD & RECYCLE BIN ====================

let currentNotificationTimeout = null;

function showNotification(msg, undoCallback = null) {
  const oldToast = document.getElementById('appNotificationToast');
  if (oldToast) oldToast.remove();
  if (currentNotificationTimeout) clearTimeout(currentNotificationTimeout);

  const toast = document.createElement('div');
  toast.id = 'appNotificationToast';
  toast.className = 'fixed bottom-5 right-5 z-[99] max-w-md bg-[#09111e] text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-slate-700/80 transition-all duration-300 transform';

  if (undoCallback && typeof undoCallback === 'function') {
    toast.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0 pr-1">
        <div class="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </div>
        <span class="truncate text-slate-200">${escapeHtml(msg)}</span>
      </div>
      <button id="toastUndoActionBtn" class="shrink-0 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black rounded-xl text-xs shadow-md transition flex items-center gap-1.5">
        <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i>
        <span>UNDO</span>
      </button>
    `;

    document.body.appendChild(toast);

    const undoBtn = toast.querySelector('#toastUndoActionBtn');
    if (undoBtn) {
      undoBtn.onclick = (e) => {
        e.stopPropagation();
        toast.remove();
        undoCallback();
      };
    }

    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }

    currentNotificationTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 8500);

  } else {
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-emerald-400 font-bold">✓</span>
        <span>${escapeHtml(msg)}</span>
      </div>
    `;
    document.body.appendChild(toast);

    currentNotificationTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// ----------------- Confirmation Modal -----------------
function showConfirmModal({ title, message, hint, confirmText, confirmClass, onConfirm }) {
  const modal = document.getElementById('safeConfirmModal');
  if (!modal) {
    if (confirm(message ? message.replace(/<[^>]*>/g, '') : title)) onConfirm();
    return;
  }

  const titleEl = document.getElementById('confirmModalTitle');
  const msgEl = document.getElementById('confirmModalMessage');
  const hintEl = document.getElementById('confirmModalHintText');
  const okBtn = document.getElementById('confirmModalOkBtn');
  const okText = document.getElementById('confirmModalOkText');

  if (titleEl) titleEl.textContent = title || 'Confirm Deletion';
  if (msgEl) msgEl.innerHTML = message || 'Are you sure you want to proceed?';
  if (hintEl) hintEl.textContent = hint || 'Deleted items are safely stored in the Recycle Bin and can be restored anytime.';
  if (okText) okText.textContent = confirmText || 'Delete';

  if (okBtn) {
    okBtn.className = `px-4 py-2 text-xs font-bold text-white rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-95 ${confirmClass || 'bg-rose-600 hover:bg-rose-700'}`;
    okBtn.onclick = () => {
      closeConfirmModal();
      if (typeof onConfirm === 'function') onConfirm();
    };
  }

  modal.classList.remove('hidden');

  // Cancel button focused by default for safety
  const cancelBtn = document.getElementById('confirmModalCancelBtn');
  if (cancelBtn) cancelBtn.focus();

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeConfirmModal() {
  const modal = document.getElementById('safeConfirmModal');
  if (modal) modal.classList.add('hidden');
}

// ----------------- Trash Badges & Storage -----------------
function updateTrashBadges() {
  const count = trashList.length;
  const sideBadge = document.getElementById('trashCountBadge');
  const topBadge = document.getElementById('topTrashCountBadge');
  const modalBadge = document.getElementById('trashModalTotalBadge');

  if (sideBadge) {
    sideBadge.textContent = count;
    if (count > 0) sideBadge.classList.remove('hidden');
    else sideBadge.classList.add('hidden');
  }

  if (topBadge) {
    topBadge.textContent = count;
    if (count > 0) topBadge.classList.remove('hidden');
    else topBadge.classList.add('hidden');
  }

  if (modalBadge) {
    modalBadge.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
  }
}

function saveTrashToStorage() {
  try {
    localStorage.setItem(STORAGE_TRASH, JSON.stringify(trashList));
    updateTrashBadges();
  } catch (e) {
    console.error('Error saving trash:', e);
  }
}

function moveToTrash(type, itemData, title, details) {
  const entry = {
    trashId: 'tr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type: type, // 'order', 'customer', 'product', 'batch_orders'
    title: title,
    details: details,
    deletedAt: new Date().toISOString(),
    data: JSON.parse(JSON.stringify(itemData))
  };
  trashList.unshift(entry);
  if (trashList.length > 100) trashList = trashList.slice(0, 100);
  saveTrashToStorage();
  return entry;
}

function openTrashModal() {
  const modal = document.getElementById('trashModal');
  if (modal) modal.classList.remove('hidden');
  currentTrashSearch = '';
  const searchInp = document.getElementById('trashSearchInput');
  if (searchInp) searchInp.value = '';
  renderTrashList();
}

function closeTrashModal() {
  const modal = document.getElementById('trashModal');
  if (modal) modal.classList.add('hidden');
}

function setTrashFilter(filter) {
  currentTrashFilter = filter;
  const tabs = ['all', 'order', 'customer', 'product'];
  tabs.forEach(t => {
    const btn = document.getElementById(`trashTabBtn-${t}`);
    if (btn) {
      if (t === filter) {
        btn.className = 'trash-tab-btn px-3 py-1.5 rounded-lg bg-blue-600 text-white shadow-xs transition';
      } else {
        btn.className = 'trash-tab-btn px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition';
      }
    }
  });
  renderTrashList();
}

function onTrashSearchInput(val) {
  currentTrashSearch = (val || '').toLowerCase().trim();
  renderTrashList();
}

function renderTrashList() {
  const container = document.getElementById('trashItemsContainer');
  if (!container) return;

  // Check safety snapshot banner
  const snapshotBanner = document.getElementById('safetySnapshotBanner');
  const snapshotInfo = document.getElementById('safetySnapshotInfo');
  const snapshotRaw = localStorage.getItem(STORAGE_SAFETY_SNAPSHOT);
  if (snapshotRaw && snapshotBanner) {
    try {
      const snap = JSON.parse(snapshotRaw);
      const dateStr = snap.clearedAt ? new Date(snap.clearedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'recently';
      if (snapshotInfo) {
        snapshotInfo.textContent = `Full backup with ${snap.orderCount || 0} orders saved before reset (${dateStr}).`;
      }
      snapshotBanner.classList.remove('hidden');
    } catch (e) {
      snapshotBanner.classList.add('hidden');
    }
  } else if (snapshotBanner) {
    snapshotBanner.classList.add('hidden');
  }

  updateTrashBadges();

  let items = trashList;
  if (currentTrashFilter !== 'all') {
    items = items.filter(it => it.type === currentTrashFilter);
  }
  if (currentTrashSearch) {
    items = items.filter(it => 
      (it.title && it.title.toLowerCase().includes(currentTrashSearch)) ||
      (it.details && it.details.toLowerCase().includes(currentTrashSearch)) ||
      (it.type && it.type.toLowerCase().includes(currentTrashSearch))
    );
  }

  if (items.length === 0) {
    container.innerHTML = `
      <div class="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-400">
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2 shadow-xs">
          <i data-lucide="shield-check" class="w-6 h-6"></i>
        </div>
        <p class="font-bold text-slate-800 text-sm">Recycle Bin is Empty</p>
        <p class="text-xs text-slate-400 mt-0.5">Accidentally deleted orders, customers, or products will appear here and can be restored anytime.</p>
      </div>
    `;
    if (window.lucide && typeof lucide.createIcons === 'function') {
      lucide.createIcons();
    }
    return;
  }

  container.innerHTML = '';
  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'p-3 bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-3';

    let typeBadge = '';
    if (it.type === 'order') {
      typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">📦 Order</span>';
    } else if (it.type === 'customer') {
      typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">👥 Customer</span>';
    } else if (it.type === 'product') {
      typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">🌾 Product</span>';
    } else if (it.type === 'batch_orders') {
      typeBadge = '<span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-300">🗄️ Orders Batch</span>';
    }

    const dateStr = it.deletedAt ? new Date(it.deletedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Recently';

    card.innerHTML = `
      <div class="flex items-start gap-3 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 mt-0.5">
          <i data-lucide="${it.type === 'order' ? 'shopping-bag' : it.type === 'customer' ? 'user' : 'package'}" class="w-4 h-4"></i>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            ${typeBadge}
            <span class="font-bold text-slate-900 text-xs truncate">${escapeHtml(it.title)}</span>
            <span class="text-[10px] text-slate-400">• Deleted ${escapeHtml(dateStr)}</span>
          </div>
          <p class="text-[11px] text-slate-500 mt-0.5 truncate">${escapeHtml(it.details || '')}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 self-end sm:self-center shrink-0">
        <button type="button" onclick="restoreTrashItem('${it.trashId}')" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-xs active:scale-95" title="Restore this item">
          <i data-lucide="rotate-ccw" class="w-3.5 h-3.5 text-emerald-600"></i>
          <span>Restore</span>
        </button>
        <button type="button" onclick="deleteTrashPermanently('${it.trashId}')" class="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition" title="Delete permanently">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function restoreTrashItem(trashId) {
  const idx = trashList.findIndex(t => t.trashId === trashId);
  if (idx === -1) return;
  const item = trashList[idx];

  if (item.type === 'order') {
    const exists = orders.some(o => o.id === item.data.id);
    if (!exists) {
      orders.unshift(item.data);
    } else {
      item.data.id = generateNextOrderId();
      orders.unshift(item.data);
    }
    saveDataToStorage();
    updateDashboard();
    showNotification(`✓ Order ${item.data.id} restored successfully!`);

  } else if (item.type === 'customer') {
    const exists = customers.some(c => c.id === item.data.id);
    if (!exists) {
      customers.push(item.data);
    }
    saveDataToStorage();
    populateCustomerDropdown();
    renderCustomersList();
    showNotification(`✓ Customer '${item.data.name}' restored!`);

  } else if (item.type === 'product') {
    const exists = products.some(p => p.id === item.data.id);
    if (!exists) {
      products.push(item.data);
    }
    saveDataToStorage();
    populateProductDropdown();
    renderProductsManageList();
    showNotification(`✓ Product '${item.data.name}' restored!`);

  } else if (item.type === 'batch_orders') {
    if (Array.isArray(item.data)) {
      orders = [...item.data, ...orders];
      saveDataToStorage();
      if (typeof manualTriggerCloudSync === 'function') manualTriggerCloudSync();
      updateDashboard();
      showNotification(`✓ Batch of ${item.data.length} orders restored!`);
    }
  }

  // Remove from trash
  trashList.splice(idx, 1);
  saveTrashToStorage();
  renderTrashList();
}

function restoreAllTrash() {
  if (trashList.length === 0) {
    showNotification('Recycle Bin is empty.');
    return;
  }

  showConfirmModal({
    title: 'Restore All Items?',
    message: `Are you sure you want to restore all <strong>${trashList.length} items</strong> from the Recycle Bin?`,
    hint: 'All orders, customers, and products will be returned to your active database.',
    confirmText: 'Restore All',
    confirmClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    onConfirm: () => {
      const toRestore = [...trashList];
      toRestore.forEach(item => {
        if (item.type === 'order') {
          if (!orders.some(o => o.id === item.data.id)) orders.unshift(item.data);
        } else if (item.type === 'customer') {
          if (!customers.some(c => c.id === item.data.id)) customers.push(item.data);
        } else if (item.type === 'product') {
          if (!products.some(p => p.id === item.data.id)) products.push(item.data);
        } else if (item.type === 'batch_orders' && Array.isArray(item.data)) {
          orders = [...item.data, ...orders];
        }
      });

      trashList = [];
      saveTrashToStorage();
      saveDataToStorage();
      if (typeof manualTriggerCloudSync === 'function') manualTriggerCloudSync();
      updateDashboard();
      populateCustomerDropdown();
      renderCustomersList();
      populateProductDropdown();
      renderProductsManageList();
      renderTrashList();
      showNotification('✓ All items in Recycle Bin restored successfully!');
    }
  });
}

function deleteTrashPermanently(trashId) {
  showConfirmModal({
    title: 'Delete Permanently?',
    message: 'Are you sure you want to permanently delete this item? It cannot be recovered after this.',
    hint: '⚠️ This will permanently remove the item from local storage.',
    confirmText: 'Delete Permanently',
    confirmClass: 'bg-rose-700 hover:bg-rose-800 text-white',
    onConfirm: () => {
      trashList = trashList.filter(t => t.trashId !== trashId);
      saveTrashToStorage();
      renderTrashList();
      showNotification('Item permanently deleted.');
    }
  });
}

function emptyTrashPrompt() {
  if (trashList.length === 0) {
    showNotification('Recycle Bin is already empty.');
    return;
  }

  showConfirmModal({
    title: 'Empty Entire Recycle Bin?',
    message: `Are you sure you want to permanently empty the Recycle Bin (<strong>${trashList.length} items</strong>)?`,
    hint: '⚠️ All deleted items will be permanently erased and cannot be restored.',
    confirmText: 'Empty Trash',
    confirmClass: 'bg-rose-700 hover:bg-rose-800 text-white',
    onConfirm: () => {
      trashList = [];
      saveTrashToStorage();
      renderTrashList();
      showNotification('Recycle Bin has been emptied.');
    }
  });
}

function restoreSafetySnapshot() {
  const raw = localStorage.getItem(STORAGE_SAFETY_SNAPSHOT);
  if (!raw) {
    showNotification('No safety recovery snapshot found.');
    return;
  }

  try {
    const snapshot = JSON.parse(raw);
    showConfirmModal({
      title: 'Restore Safety Snapshot?',
      message: `Restore <strong>${snapshot.orderCount || (snapshot.orders ? snapshot.orders.length : 0)} orders</strong> from the pre-reset safety backup?`,
      hint: 'This will merge all backed-up orders and customers back into your dashboard safely.',
      confirmText: 'Restore Snapshot',
      confirmClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      onConfirm: () => {
        if (Array.isArray(snapshot.orders) && snapshot.orders.length > 0) {
          const existingIds = new Set(orders.map(o => o.id));
          const restoredOrders = snapshot.orders.filter(o => !existingIds.has(o.id));
          orders = [...restoredOrders, ...orders];
        }
        if (Array.isArray(snapshot.customers) && snapshot.customers.length > 0) {
          const existingCustIds = new Set(customers.map(c => c.id));
          const restoredCusts = snapshot.customers.filter(c => !existingCustIds.has(c.id));
          customers = [...customers, ...restoredCusts];
        }

        saveDataToStorage();
        updateDashboard();
        populateCustomerDropdown();
        renderCustomersList();
        renderTrashList();
        showNotification(`✓ Safety snapshot restored! (${snapshot.orderCount || 0} orders recovered)`);
      }
    });
  } catch (e) {
    showNotification('Could not read snapshot data.');
  }
}

// Global Bindings for Accidental Deletion Shield
window.openTrashModal = openTrashModal;
window.closeTrashModal = closeTrashModal;
window.setTrashFilter = setTrashFilter;
window.onTrashSearchInput = onTrashSearchInput;
window.renderTrashList = renderTrashList;
window.restoreTrashItem = restoreTrashItem;
window.restoreAllTrash = restoreAllTrash;
window.deleteTrashPermanently = deleteTrashPermanently;
window.emptyTrashPrompt = emptyTrashPrompt;
window.restoreSafetySnapshot = restoreSafetySnapshot;
window.showConfirmModal = showConfirmModal;
window.closeConfirmModal = closeConfirmModal;

// ==================== GLOBAL WINDOW BINDINGS ====================
// Guarantees all onclick handlers work in all browser contexts
window.openNewOrderModal = openNewOrderModal;
window.openEditOrderModal = openEditOrderModal;
window.closeOrderModal = closeOrderModal;
window.handleSaveOrder = handleSaveOrder;
window.deleteOrder = deleteOrder;
window.deleteCurrentEditingOrder = deleteCurrentEditingOrder;
window.addOrderItemRow = addOrderItemRow;
window.removeOrderItemRow = removeOrderItemRow;
window.onItemProductChange = onItemProductChange;
window.onItemBagSizeChange = onItemBagSizeChange;
window.onItemQtyChange = onItemQtyChange;
window.onItemRateChange = onItemRateChange;
window.useCustomerLastPrice = useCustomerLastPrice;
window.calculateOrderTotals = calculateOrderTotals;
window.onCustomerSearchInput = onCustomerSearchInput;
window.showCustomerSearchDropdown = showCustomerSearchDropdown;
window.hideCustomerSearchDropdown = hideCustomerSearchDropdown;
window.clearCustomerSearch = clearCustomerSearch;
window.selectCustomerFromSearch = selectCustomerFromSearch;
window.openQuickNewCustomerModal = openQuickNewCustomerModal;
window.closeQuickNewCustomerModal = closeQuickNewCustomerModal;
window.onQuickCustNameInput = onQuickCustNameInput;
window.saveQuickCustomerAndApply = saveQuickCustomerAndApply;
window.updateCustomerPill = updateCustomerPill;
window.onCustomerNameManualChange = onCustomerNameManualChange;
window.openCustomersModal = openCustomersModal;
window.closeCustomersModal = closeCustomersModal;
window.handleAddNewCustomer = handleAddNewCustomer;
window.handleCustomerFormSubmit = handleCustomerFormSubmit;
window.editCustomer = editCustomer;
window.cancelEditCustomer = cancelEditCustomer;
window.setCustomerCategoryFilter = setCustomerCategoryFilter;
window.quickCreateCustomerFromSearch = quickCreateCustomerFromSearch;
window.getCustomerCategory = getCustomerCategory;
window.getCustomerCategoryBadge = getCustomerCategoryBadge;
window.getCustomerOwnerName = getCustomerOwnerName;
window.getCustomerOwnerPhone = getCustomerOwnerPhone;
window.getCustomerStaffName = getCustomerStaffName;
window.getCustomerStaffRole = getCustomerStaffRole;
window.getCustomerStaffPhone = getCustomerStaffPhone;
window.openCustomerDetailModal = openCustomerDetailModal;
window.closeCustomerDetailModal = closeCustomerDetailModal;
window.startOrderFromCustomerDetail = startOrderFromCustomerDetail;
window.openAddMemberForm = openAddMemberForm;
window.closeAddMemberForm = closeAddMemberForm;
window.handleSaveMember = handleSaveMember;
window.editCustomerMember = editCustomerMember;
window.deleteCustomerMember = deleteCustomerMember;
window.renderCustomerMembersList = renderCustomerMembersList;
window.getCustomerMembers = getCustomerMembers;
window.getDesignationBadge = getDesignationBadge;
window.getDesignationAvatar = getDesignationAvatar;
window.cleanPhoneNumber = cleanPhoneNumber;
window.isValidPhone = isValidPhone;
window.findDuplicateCustomer = findDuplicateCustomer;
window.renderCustomersList = renderCustomersList;
window.startOrderForCustomer = startOrderForCustomer;
window.deleteCustomer = deleteCustomer;
window.openInvoiceModal = openInvoiceModal;
window.closeInvoiceModal = closeInvoiceModal;
window.showIncentiveDetails = showIncentiveDetails;
window.closeIncentiveDetails = closeIncentiveDetails;
window.updateSchemeEffectiveDate = updateSchemeEffectiveDate;
window.formatSchemeDate = formatSchemeDate;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.saveProductForm = saveProductForm;
window.editProduct = editProduct;
window.cancelProductEdit = cancelProductEdit;
window.setProductCategoryFilter = setProductCategoryFilter;
window.addNewProduct = addNewProduct;
window.deleteProduct = deleteProduct;
window.triggerProductImageUpload = triggerProductImageUpload;
window.onProductImageSelected = onProductImageSelected;
window.removeProductFormImage = removeProductFormImage;
window.onProductCategoryFormChange = onProductCategoryFormChange;
window.getProductImageUrl = getProductImageUrl;
window.addNewBagSize = addNewBagSize;
window.removeBagSize = removeBagSize;
window.resetAllData = resetAllData;
window.exportDataJSON = exportDataJSON;
window.triggerImportDataJSON = triggerImportDataJSON;
window.handleImportDataJSON = handleImportDataJSON;
window.manualTriggerCloudSync = manualTriggerCloudSync;
window.initFirebaseSync = initFirebaseSync;
window.syncCloudOrder = syncCloudOrder;
window.deleteCloudOrder = deleteCloudOrder;
window.syncCloudCustomer = syncCloudCustomer;
window.deleteCloudCustomer = deleteCloudCustomer;
window.loadSampleDemoData = loadSampleDemoData;
window.setFilterPeriod = setFilterPeriod;
// ==================== SALES LEADERBOARDS ====================

let leaderboardPeriod = 'all'; // 'all', 'month', 'week', 'today'
let leaderboardActiveTab = 'customers'; // 'customers', 'products', 'champions', 'locations', 'milestones'
let leaderboardCustomerMetric = 'kg'; // 'kg', 'revenue', 'orders'

function openLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.classList.remove('hidden');
  renderLeaderboard();
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeLeaderboardModal() {
  const modal = document.getElementById('leaderboardModal');
  if (modal) modal.classList.add('hidden');
}

function setLeaderboardPeriod(period) {
  leaderboardPeriod = period;

  document.querySelectorAll('.lb-period-btn').forEach(btn => {
    btn.classList.remove('bg-amber-500', 'text-white', 'shadow-sm');
    btn.classList.add('text-slate-600');
  });
  const activeBtn = document.getElementById(`lbPeriodBtn-${period}`);
  if (activeBtn) {
    activeBtn.classList.remove('text-slate-600');
    activeBtn.classList.add('bg-amber-500', 'text-white', 'shadow-sm');
  }

  renderLeaderboard();
}

function setLeaderboardTab(tab) {
  leaderboardActiveTab = tab;

  document.querySelectorAll('.lb-tab-btn').forEach(btn => {
    btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
    btn.classList.add('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
  });
  const activeBtn = document.getElementById(`lbTabBtn-${tab}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-slate-100', 'text-slate-600', 'hover:bg-slate-200');
    activeBtn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
  }

  ['customers', 'products', 'champions', 'locations', 'milestones'].forEach(t => {
    const el = document.getElementById(`lbContent-${t}`);
    if (el) {
      if (t === tab) el.classList.remove('hidden');
      else el.classList.add('hidden');
    }
  });

  renderLeaderboard();
}

function setLeaderboardCustomerMetric(metric) {
  leaderboardCustomerMetric = metric;

  document.querySelectorAll('.lb-cust-metric-btn').forEach(btn => {
    btn.classList.remove('bg-slate-900', 'text-white');
    btn.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
  });
  const activeBtn = document.getElementById(`lbMetricBtn-${metric}`);
  if (activeBtn) {
    activeBtn.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');
    activeBtn.classList.add('bg-slate-900', 'text-white');
  }

  renderCustomersLeaderboard();
}

function getLeaderboardOrders() {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  return orders.filter(order => {
    if (!order || !order.date) return true;
    const orderDate = new Date(order.date);

    if (leaderboardPeriod === 'today') {
      return order.date === todayStr;
    } else if (leaderboardPeriod === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return orderDate >= sevenDaysAgo;
    } else if (leaderboardPeriod === 'month') {
      return (
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth()
      );
    } else {
      return true; // 'all'
    }
  });
}

function startOrderFromLeaderboard(customerName) {
  closeLeaderboardModal();
  const cust = customers.find(c => c.name && c.name.toLowerCase() === customerName.toLowerCase());
  if (cust) {
    openNewOrderModal(cust.id);
  } else {
    openNewOrderModal();
    const nameEl = document.getElementById('customerName');
    if (nameEl) nameEl.value = customerName;
    updateCustomerHistoryAlert(customerName);
  }
}

function renderLeaderboard() {
  if (leaderboardActiveTab === 'customers') {
    renderCustomersLeaderboard();
  } else if (leaderboardActiveTab === 'products') {
    renderProductsLeaderboard();
  } else if (leaderboardActiveTab === 'champions') {
    renderChampionsLeaderboard();
  } else if (leaderboardActiveTab === 'locations') {
    renderLocationsLeaderboard();
  } else if (leaderboardActiveTab === 'milestones') {
    renderMilestonesLeaderboard();
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function renderCustomersLeaderboard() {
  const lbOrders = getLeaderboardOrders();
  const podiumContainer = document.getElementById('lbPodiumContainer');
  const tableContainer = document.getElementById('lbCustomersTableBody');
  const emptyNotice = document.getElementById('lbCustomersEmpty');

  if (!tableContainer) return;

  const map = {};
  lbOrders.forEach(o => {
    const name = getCustomerName(o.customer);
    if (!map[name]) {
      const custObj = customers.find(c => c.name && c.name.toLowerCase() === name.toLowerCase()) || {};
      map[name] = {
        name: name,
        id: custObj.id || null,
        category: getCustomerCategory(o.customer) || custObj.category || 'Caterer',
        location: getCustomerLocation(o.customer) || custObj.location || 'Local',
        phone: getCustomerPhone(o.customer) || custObj.phone || '',
        totalKg: 0,
        totalRevenue: 0,
        ordersCount: 0,
        lastDate: o.date
      };
    }
    map[name].totalKg += (parseFloat(o.totalKg) || 0);
    map[name].totalRevenue += (parseFloat(o.totalAmount) || 0);
    map[name].ordersCount += 1;
    if (o.date > map[name].lastDate) map[name].lastDate = o.date;
  });

  const list = Object.values(map);

  if (leaderboardCustomerMetric === 'revenue') {
    list.sort((a, b) => b.totalRevenue - a.totalRevenue);
  } else if (leaderboardCustomerMetric === 'orders') {
    list.sort((a, b) => b.ordersCount - a.ordersCount || b.totalKg - a.totalKg);
  } else {
    list.sort((a, b) => b.totalKg - a.totalKg);
  }

  if (list.length === 0) {
    if (emptyNotice) emptyNotice.classList.remove('hidden');
    if (podiumContainer) podiumContainer.innerHTML = '';
    tableContainer.innerHTML = '';
    return;
  }
  if (emptyNotice) emptyNotice.classList.add('hidden');

  // Render Podium (Top 3)
  if (podiumContainer) {
    const top1 = list[0] || null;
    const top2 = list[1] || null;
    const top3 = list[2] || null;

    function renderPodiumCard(cust, rank) {
      if (!cust) return '<div class="hidden sm:block flex-1"></div>';
      const isFirst = rank === 1;
      const isSecond = rank === 2;

      const crown = isFirst ? '👑' : (isSecond ? '🥈' : '🥉');
      const rankBg = isFirst ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-300' : (isSecond ? 'bg-slate-300 text-slate-800 ring-2 ring-slate-200' : 'bg-amber-600 text-white ring-2 ring-amber-500');
      const cardBorder = isFirst ? 'border-amber-400 shadow-md bg-gradient-to-b from-amber-50/80 to-white sm:-mt-2' : 'border-slate-200 bg-white shadow-xs';
      const orderBtnBg = isFirst ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800';

      const metricDisplay = (
        leaderboardCustomerMetric === 'revenue' ? `₹${Math.round(cust.totalRevenue).toLocaleString('en-IN')}` :
        leaderboardCustomerMetric === 'orders' ? `${cust.ordersCount} Orders` :
        `${cust.totalKg.toLocaleString('en-IN')} kg`
      );

      return `
        <div class="flex-1 rounded-2xl p-4 border ${cardBorder} flex flex-col items-center text-center relative transition hover:-translate-y-1">
          <div class="text-2xl mb-1">${crown}</div>
          <div class="w-10 h-10 rounded-full ${rankBg} font-black flex items-center justify-center text-sm shadow-sm mb-2">
            #${rank}
          </div>
          <div class="font-extrabold text-xs text-slate-900 truncate max-w-full px-1" title="${escapeHtml(cust.name)}">${escapeHtml(cust.name)}</div>
          <div class="mt-1">${getCustomerCategoryBadge(cust.category)}</div>
          <div class="text-[11px] text-slate-500 mt-1">${escapeHtml(cust.location)}</div>
          <div class="mt-2 text-sm font-black text-blue-700">${metricDisplay}</div>
          <div class="text-[10px] text-slate-400 mt-0.5">
            ${cust.ordersCount} orders • ₹${Math.round(cust.totalRevenue).toLocaleString('en-IN')}
          </div>
          <button onclick="startOrderFromLeaderboard('${escapeHtml(cust.name)}')" class="mt-3 text-[11px] font-bold px-3 py-1 rounded-lg ${orderBtnBg} transition inline-flex items-center gap-1 active:scale-95">
            <i data-lucide="plus" class="w-3 h-3"></i>
            <span>Order</span>
          </button>
        </div>
      `;
    }

    podiumContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-2 pb-4">
        ${renderPodiumCard(top2, 2)}
        ${renderPodiumCard(top1, 1)}
        ${renderPodiumCard(top3, 3)}
      </div>
    `;
  }

  // Render Table
  tableContainer.innerHTML = '';
  list.forEach((c, idx) => {
    const rank = idx + 1;
    let rankBadge = `<span class="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-[11px]">${rank}</span>`;
    if (rank === 1) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black flex items-center justify-center text-[11px] shadow-xs">🥇 1</span>`;
    else if (rank === 2) rankBadge = `<span class="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black flex items-center justify-center text-[11px] shadow-xs">🥈 2</span>`;
    else if (rank === 3) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black flex items-center justify-center text-[11px] shadow-xs">🥉 3</span>`;

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 border-b border-slate-100 transition';
    tr.innerHTML = `
      <td class="px-3.5 py-3 text-center">${rankBadge}</td>
      <td class="px-3.5 py-3">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="font-bold text-slate-900 text-xs">${escapeHtml(c.name)}</span>
          ${getCustomerCategoryBadge(c.category)}
        </div>
        <div class="text-[11px] text-slate-500">${escapeHtml(c.location)} ${c.phone ? '• ' + escapeHtml(c.phone) : ''}</div>
      </td>
      <td class="px-3.5 py-3 text-right">
        <span class="font-black text-slate-900 text-xs">${c.totalKg.toLocaleString('en-IN')} kg</span>
        <div class="text-[10px] text-slate-400 font-medium">${(c.totalKg / 1000).toFixed(2)} Tonnes</div>
      </td>
      <td class="px-3.5 py-3 text-right font-black text-blue-700 text-xs">
        ₹${Math.round(c.totalRevenue).toLocaleString('en-IN')}
      </td>
      <td class="px-3.5 py-3 text-center font-bold text-slate-700 text-xs">
        ${c.ordersCount}
      </td>
      <td class="px-3.5 py-3 text-center">
        <button onclick="startOrderFromLeaderboard('${escapeHtml(c.name)}')" class="px-2.5 py-1 text-[11px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition inline-flex items-center gap-1 active:scale-95">
          <i data-lucide="plus" class="w-3 h-3"></i>
          <span>Order</span>
        </button>
      </td>
    `;
    tableContainer.appendChild(tr);
  });
}

function renderProductsLeaderboard() {
  const lbOrders = getLeaderboardOrders();
  const prodContainer = document.getElementById('lbProductsList');
  const bagContainer = document.getElementById('lbBagSizesList');
  const catContainer = document.getElementById('lbRiceCategoriesList');

  if (!prodContainer || !bagContainer || !catContainer) return;

  const prodMap = {};
  const catMap = {};
  const bagMap = {};
  let grandTotalKg = 0;

  lbOrders.forEach(o => {
    const items = (o.items && o.items.length > 0) ? o.items : [
      {
        productId: o.product?.id || 'p1',
        productName: o.product?.name || 'Biriyani Rice',
        bagSize: o.bagSize || 25,
        bagQty: o.bagQty || 0,
        totalKg: o.totalKg || 0,
        totalAmount: o.totalAmount || 0
      }
    ];

    items.forEach(it => {
      const pName = it.productName || 'Rice Variety';
      const size = parseFloat(it.bagSize) || 25;
      const qty = parseFloat(it.bagQty) || 0;
      const kg = parseFloat(it.totalKg) || (size * qty);
      const amt = parseFloat(it.totalAmount) || 0;

      grandTotalKg += kg;

      if (!prodMap[pName]) prodMap[pName] = { name: pName, kg: 0, bags: 0, revenue: 0 };
      prodMap[pName].kg += kg;
      prodMap[pName].bags += qty;
      prodMap[pName].revenue += amt;

      const bagLabel = `${size} kg Bag`;
      if (!bagMap[bagLabel]) bagMap[bagLabel] = { label: bagLabel, size: size, bags: 0, kg: 0 };
      bagMap[bagLabel].bags += qty;
      bagMap[bagLabel].kg += kg;

      const matchedProd = products.find(p => p.name.toLowerCase() === pName.toLowerCase() || p.id === it.productId);
      const category = matchedProd?.category || 'Kaima';
      if (!catMap[category]) catMap[category] = { category: category, kg: 0, revenue: 0 };
      catMap[category].kg += kg;
      catMap[category].revenue += amt;
    });
  });

  const prodList = Object.values(prodMap).sort((a, b) => b.kg - a.kg);
  const bagList = Object.values(bagMap).sort((a, b) => b.bags - a.bags);
  const catList = Object.values(catMap).sort((a, b) => b.kg - a.kg);

  // 1. Products List
  if (prodList.length === 0) {
    prodContainer.innerHTML = '<p class="text-xs text-slate-400 py-4 text-center">No rice sales in this period.</p>';
  } else {
    const maxKg = prodList[0].kg || 1;
    prodContainer.innerHTML = '';
    prodList.forEach((p, idx) => {
      const pct = Math.round((p.kg / maxKg) * 100);
      const totalPct = grandTotalKg > 0 ? ((p.kg / grandTotalKg) * 100).toFixed(1) : 0;
      const rank = idx + 1;
      const rankColor = rank === 1 ? 'bg-amber-400 text-amber-950 font-black' : (rank === 2 ? 'bg-slate-300 text-slate-800 font-black' : 'bg-slate-100 text-slate-700 font-bold');

      const card = document.createElement('div');
      card.className = 'p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5';
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-5 h-5 rounded-full ${rankColor} text-[10px] flex items-center justify-center shrink-0">#${rank}</span>
            <span class="font-extrabold text-slate-900 truncate">${escapeHtml(p.name)}</span>
          </div>
          <span class="font-black text-slate-900 shrink-0">${p.kg.toLocaleString('en-IN')} kg <span class="text-[10px] text-slate-500 font-medium">(${totalPct}%)</span></span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div class="bg-emerald-500 h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
        <div class="flex items-center justify-between text-[11px] text-slate-500">
          <span>${p.bags} bags sold</span>
          <span class="font-bold text-blue-700">₹${Math.round(p.revenue).toLocaleString('en-IN')}</span>
        </div>
      `;
      prodContainer.appendChild(card);
    });
  }

  // 2. Bag Sizes List
  if (bagList.length === 0) {
    bagContainer.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">No bag data in this period.</p>';
  } else {
    const maxBags = bagList[0].bags || 1;
    bagContainer.innerHTML = '';
    bagList.forEach((b, idx) => {
      const pct = Math.round((b.bags / maxBags) * 100);
      const isTop = idx === 0;

      const card = document.createElement('div');
      card.className = 'p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5';
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 font-bold text-slate-900">
            <span>${b.label}</span>
            ${isTop ? '<span class="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-200">⭐ Most Popular</span>' : ''}
          </div>
          <span class="font-black text-blue-700">${b.bags} Bags <span class="text-slate-400 font-normal">(${b.kg.toLocaleString('en-IN')} kg)</span></span>
        </div>
        <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div class="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
        </div>
      `;
      bagContainer.appendChild(card);
    });
  }

  // 3. Rice Categories
  if (catList.length === 0) {
    catContainer.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">No category data.</p>';
  } else {
    catContainer.innerHTML = '';
    catList.forEach(c => {
      const share = grandTotalKg > 0 ? ((c.kg / grandTotalKg) * 100).toFixed(1) : 0;
      let tagColor = 'bg-purple-100 text-purple-800 border-purple-200';
      if (c.category === 'Basmati') tagColor = 'bg-blue-100 text-blue-800 border-blue-200';
      else if (c.category === 'Kolam') tagColor = 'bg-amber-100 text-amber-800 border-amber-200';

      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs';
      row.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${tagColor}">${escapeHtml(c.category)}</span>
          <span class="text-[11px] text-slate-500">${share}% share</span>
        </div>
        <div class="text-right">
          <div class="font-extrabold text-slate-900">${c.kg.toLocaleString('en-IN')} kg</div>
          <div class="text-[10px] text-slate-400 font-medium">₹${Math.round(c.revenue).toLocaleString('en-IN')}</div>
        </div>
      `;
      catContainer.appendChild(row);
    });
  }
}

function renderChampionsLeaderboard() {
  const container = document.getElementById('lbChampionsList');
  if (!container) return;

  const lbOrders = getLeaderboardOrders();
  const categories = [
    { key: 'Caterer', label: 'Master Caterer', icon: '👨‍🍳', sub: 'Top Catering Unit' },
    { key: 'Hotel / Restaurant', label: 'Hotel & Restaurant', icon: '🏨', sub: 'Leading Dining Partner' },
    { key: 'Wholesaler', label: 'Prime Wholesaler', icon: '📦', sub: 'Top Bulk Partner' },
    { key: 'Retailer', label: 'Top Retail Partner', icon: '🏪', sub: 'Leading Retail Merchant' },
    { key: 'Other', label: 'Star Buyer', icon: '🏷️', sub: 'Leading Buyer' }
  ];

  container.innerHTML = '';

  categories.forEach(cat => {
    const catOrders = lbOrders.filter(o => {
      const custCat = getCustomerCategory(o.customer);
      return (custCat || 'Caterer') === cat.key;
    });

    const custMap = {};
    catOrders.forEach(o => {
      const name = getCustomerName(o.customer);
      if (!custMap[name]) {
        custMap[name] = {
          name: name,
          location: getCustomerLocation(o.customer),
          phone: getCustomerPhone(o.customer),
          kg: 0,
          revenue: 0,
          orders: 0
        };
      }
      custMap[name].kg += (parseFloat(o.totalKg) || 0);
      custMap[name].revenue += (parseFloat(o.totalAmount) || 0);
      custMap[name].orders += 1;
    });

    const sorted = Object.values(custMap).sort((a, b) => b.kg - a.kg);
    const champion = sorted[0] || null;

    const card = document.createElement('div');
    card.className = 'bg-white border rounded-2xl p-4 shadow-xs flex flex-col justify-between transition hover:shadow-md ' +
      (champion ? 'border-amber-300 bg-gradient-to-b from-amber-50/50 to-white' : 'border-slate-200');

    if (champion) {
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>${cat.icon}</span>
              <span>${cat.label}</span>
            </span>
            <span class="px-2 py-0.5 bg-amber-400 text-amber-950 font-black text-[9px] rounded-full shadow-xs">#1 Champion 🏆</span>
          </div>
          <div class="text-[10px] text-slate-400 mb-2">${cat.sub}</div>
          <h4 class="font-extrabold text-sm text-slate-900 leading-tight">${escapeHtml(champion.name)}</h4>
          <p class="text-[11px] text-slate-500 mt-0.5">${escapeHtml(champion.location)} • ${escapeHtml(champion.phone)}</p>
          
          <div class="mt-3 p-2 bg-amber-100/50 rounded-xl border border-amber-200/60 flex items-center justify-between">
            <div>
              <div class="text-[10px] text-amber-900 font-bold uppercase">Volume</div>
              <div class="font-black text-slate-900 text-xs">${champion.kg.toLocaleString('en-IN')} kg</div>
            </div>
            <div class="text-right">
              <div class="text-[10px] text-amber-900 font-bold uppercase">Revenue</div>
              <div class="font-black text-blue-800 text-xs">₹${Math.round(champion.revenue).toLocaleString('en-IN')}</div>
            </div>
          </div>
          <div class="text-[10px] text-slate-400 font-semibold mt-1 text-center">
            ${champion.orders} orders placed
          </div>
        </div>
        <button onclick="startOrderFromLeaderboard('${escapeHtml(champion.name)}')" class="mt-4 w-full py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95">
          <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          <span>New Order</span>
        </button>
      `;
    } else {
      card.innerHTML = `
        <div class="py-6 text-center text-slate-400 space-y-1">
          <div class="text-2xl">${cat.icon}</div>
          <div class="text-xs font-bold text-slate-700">${cat.label}</div>
          <div class="text-[11px]">No orders in this segment yet.</div>
        </div>
      `;
    }

    container.appendChild(card);
  });
}

function renderLocationsLeaderboard() {
  const container = document.getElementById('lbLocationsList');
  if (!container) return;

  const lbOrders = getLeaderboardOrders();
  const locMap = {};
  let maxKg = 1;

  lbOrders.forEach(o => {
    const loc = getCustomerArea(o.customer) || getCustomerLocation(o.customer) || 'Local Area';
    const cName = getCustomerName(o.customer);
    const kg = parseFloat(o.totalKg) || 0;
    const rev = parseFloat(o.totalAmount) || 0;

    if (!locMap[loc]) {
      locMap[loc] = { name: loc, kg: 0, revenue: 0, orders: 0, buyers: new Set() };
    }
    locMap[loc].kg += kg;
    locMap[loc].revenue += rev;
    locMap[loc].orders += 1;
    locMap[loc].buyers.add(cName);
  });

  const list = Object.values(locMap).sort((a, b) => b.kg - a.kg);
  if (list.length > 0) maxKg = list[0].kg || 1;

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 py-6 text-center">No location data available in this period.</p>';
    return;
  }

  list.forEach((l, idx) => {
    const rank = idx + 1;
    const pct = Math.round((l.kg / maxKg) * 100);
    const rankBadge = rank === 1
      ? '<span class="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black text-xs flex items-center justify-center shadow-xs">🥇 1</span>'
      : (rank === 2
        ? '<span class="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-xs">🥈 2</span>'
        : (rank === 3
          ? '<span class="w-6 h-6 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow-xs">🥉 3</span>'
          : `<span class="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center">#${rank}</span>`));

    const card = document.createElement('div');
    card.className = 'p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 hover:bg-blue-50/40 transition';
    card.innerHTML = `
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-2.5">
          ${rankBadge}
          <div>
            <span class="font-extrabold text-slate-900">${escapeHtml(l.name)}</span>
            <span class="text-[10px] text-slate-500 font-medium ml-1.5">(${l.buyers.size} buyers • ${l.orders} orders)</span>
          </div>
        </div>
        <div class="text-right">
          <span class="font-black text-slate-900 text-xs">${l.kg.toLocaleString('en-IN')} kg</span>
          <span class="text-slate-400 text-[10px] font-medium ml-1">(${(l.kg / 1000).toFixed(2)} Tonnes)</span>
          <div class="text-[11px] font-bold text-blue-700">₹${Math.round(l.revenue).toLocaleString('en-IN')}</div>
        </div>
      </div>
      <div class="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderMilestonesLeaderboard() {
  const container = document.getElementById('lbMilestonesList');
  if (!container) return;

  const custMap = {};
  orders.forEach(o => {
    const name = getCustomerName(o.customer);
    if (!custMap[name]) {
      const custObj = customers.find(c => c.name && c.name.toLowerCase() === name.toLowerCase()) || {};
      custMap[name] = {
        name: name,
        category: getCustomerCategory(o.customer) || custObj.category || 'Caterer',
        location: getCustomerLocation(o.customer) || custObj.location || 'Local',
        kg: 0,
        revenue: 0,
        orders: 0
      };
    }
    custMap[name].kg += (parseFloat(o.totalKg) || 0);
    custMap[name].revenue += (parseFloat(o.totalAmount) || 0);
    custMap[name].orders += 1;
  });

  const list = Object.values(custMap);

  const club10T = list.filter(c => c.kg >= 10000).sort((a, b) => b.kg - a.kg);
  const club5T = list.filter(c => c.kg >= 5000 && c.kg < 10000).sort((a, b) => b.kg - a.kg);
  const club1T = list.filter(c => c.kg >= 1000 && c.kg < 5000).sort((a, b) => b.kg - a.kg);
  const rising = list.filter(c => c.kg < 1000).sort((a, b) => b.kg - a.kg);

  function renderTierSection(title, badgeClass, members, icon, description, nextTier = null) {
    let membersHtml = '';
    if (members.length === 0) {
      membersHtml = '<div class="p-4 text-center text-xs text-slate-400">No members in this tier yet. Keep selling!</div>';
    } else {
      membersHtml = members.map(m => {
        let upgradeHint = '';
        if (nextTier && m.kg < nextTier) {
          const needed = nextTier - m.kg;
          if (needed <= 1500) {
            upgradeHint = `<span class="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">⚡ Needs ${needed.toLocaleString('en-IN')} kg for next tier!</span>`;
          }
        }

        return `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-100 hover:shadow-xs transition text-xs">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-slate-900">${escapeHtml(m.name)}</span>
              ${getCustomerCategoryBadge(m.category)}
              ${upgradeHint}
            </div>
            <div class="flex items-center gap-3">
              <span class="font-black text-slate-900">${m.kg.toLocaleString('en-IN')} kg</span>
              <button onclick="startOrderFromLeaderboard('${escapeHtml(m.name)}')" class="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded text-[10px] transition active:scale-95">Order</button>
            </div>
          </div>
        `;
      }).join('');
    }

    return `
      <div class="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
        <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">${icon}</span>
            <div>
              <div class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span>${title}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold ${badgeClass}">${members.length} Members</span>
              </div>
              <p class="text-[10px] text-slate-500">${description}</p>
            </div>
          </div>
        </div>
        <div class="space-y-1.5">
          ${membersHtml}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="space-y-4">
      ${renderTierSection('10 Ton Elite Club (≥ 10,000 kg)', 'bg-amber-400 text-amber-950', club10T, '💎', 'Highest Wholesale Partners - Incentive Target Achievers')}
      ${renderTierSection('5 Ton Champions (5,000 - 9,999 kg)', 'bg-purple-100 text-purple-800', club5T, '🥇', 'Major Recurring Buyers', 10000)}
      ${renderTierSection('1 Ton Wholesalers (1,000 - 4,999 kg)', 'bg-blue-100 text-blue-800', club1T, '🥈', 'Regular Wholesale Buyers', 5000)}
      ${renderTierSection('Rising Stars (< 1,000 kg)', 'bg-emerald-100 text-emerald-800', rising, '🌱', 'Growing Buyers & New Accounts', 1000)}
    </div>
  `;
}

// ==========================================
// 12. EXPANDABLE & FULLSCREEN MODALS
// ==========================================
function toggleModalFullscreen(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const dialog = modal.querySelector('.modal-expandable') || modal.querySelector('.bg-white') || modal.firstElementChild;
  if (!dialog) return;

  const isFullscreen = dialog.classList.toggle('fullscreen-modal');
  modal.classList.toggle('!p-0', isFullscreen);

  // Update maximize/restore icon inside the modal header if present
  const maxBtn = modal.querySelector('button[onclick*="toggleModalFullscreen"]');
  if (maxBtn) {
    const icon = maxBtn.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', isFullscreen ? 'minimize-2' : 'maximize-2');
    }
    maxBtn.setAttribute('title', isFullscreen ? 'Restore Window' : 'Maximize Window');
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

// Press Escape to restore fullscreen before closing modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const fsDialog = document.querySelector('.fullscreen-modal');
    if (fsDialog) {
      const parentModal = fsDialog.closest('[id$="Modal"]');
      if (parentModal && !parentModal.classList.contains('hidden')) {
        toggleModalFullscreen(parentModal.id);
        e.stopPropagation();
      }
    }
  }
});

// ==========================================
// 13. APP BRAND LOGO MANAGEMENT
// ==========================================
const STORAGE_APP_LOGO = 'thirdman_app_logo';
const DEFAULT_LOGO_URL = 'logo.svg';

const EMBEDDED_DEFAULT_LOGO_SVG = 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#09111e"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>
  <rect x="10" y="10" width="180" height="180" rx="42" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="4" filter="url(#shadow)"/>
  <g fill="url(#goldGrad)" opacity="0.95">
    <ellipse cx="44" cy="70" rx="7" ry="13" transform="rotate(-35 44 70)"/>
    <ellipse cx="36" cy="95" rx="7" ry="13" transform="rotate(-20 36 95)"/>
    <ellipse cx="38" cy="122" rx="7" ry="13" transform="rotate(10 38 122)"/>
    <ellipse cx="50" cy="146" rx="7" ry="12" transform="rotate(35 50 146)"/>
  </g>
  <g fill="url(#goldGrad)" opacity="0.95">
    <ellipse cx="156" cy="70" rx="7" ry="13" transform="rotate(35 156 70)"/>
    <ellipse cx="164" cy="95" rx="7" ry="13" transform="rotate(20 164 95)"/>
    <ellipse cx="162" cy="122" rx="7" ry="13" transform="rotate(-10 162 122)"/>
    <ellipse cx="150" cy="146" rx="7" ry="12" transform="rotate(-35 150 146)"/>
  </g>
  <circle cx="100" cy="95" r="45" fill="#0b1324" stroke="url(#cyanGrad)" stroke-width="2.5"/>
  <path d="M86 58 L100 44 L114 58 L107 63 L100 56 L93 63 Z" fill="url(#goldGrad)"/>
  <text x="100" y="107" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="1">TM</text>
  <rect x="28" y="152" width="144" height="26" rx="13" fill="url(#goldGrad)"/>
  <text x="100" y="169" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="900" fill="#09111e" text-anchor="middle" letter-spacing="1.5">THIRD MAN</text>
</svg>`);

function loadAppLogo() {
  try {
    const customLogo = localStorage.getItem(STORAGE_APP_LOGO);
    if (customLogo) {
      applyAppLogo(customLogo, true);
    } else {
      // Default logo SVG
      applyAppLogo(DEFAULT_LOGO_URL, false);
    }
  } catch (err) {
    console.error('Error loading app logo:', err);
    applyAppLogo(EMBEDDED_DEFAULT_LOGO_SVG, false);
  }
}

function applyAppLogo(logoUrl, isCustom = false) {
  const sidebarImg = document.getElementById('appSidebarLogoImg');
  const sidebarFallback = document.getElementById('appSidebarLogoFallback');
  const invoiceImg = document.getElementById('invoiceLogoImg');
  const invoiceFallback = document.getElementById('invoiceLogoFallback');
  const settingsImg = document.getElementById('settingsLogoPreviewImg');
  const settingsFallback = document.getElementById('settingsLogoFallback');
  const favicon = document.getElementById('appFavicon');
  const removeBtn = document.getElementById('btnRemoveLogo');

  const bindImgFallback = (img) => {
    if (!img) return;
    img.onerror = function() {
      this.onerror = null;
      this.src = EMBEDDED_DEFAULT_LOGO_SVG;
    };
  };
  bindImgFallback(sidebarImg);
  bindImgFallback(invoiceImg);
  bindImgFallback(settingsImg);

  if (logoUrl) {
    if (sidebarImg) {
      sidebarImg.src = logoUrl;
      sidebarImg.classList.remove('hidden');
    }
    if (sidebarFallback) sidebarFallback.classList.add('hidden');

    if (invoiceImg) {
      invoiceImg.src = logoUrl;
      invoiceImg.classList.remove('hidden');
    }
    if (invoiceFallback) invoiceFallback.classList.add('hidden');

    if (settingsImg) {
      settingsImg.src = logoUrl;
      settingsImg.classList.remove('hidden');
    }
    if (settingsFallback) settingsFallback.classList.add('hidden');

    if (favicon) {
      favicon.href = logoUrl;
    }
  } else {
    if (sidebarImg) sidebarImg.classList.add('hidden');
    if (sidebarFallback) sidebarFallback.classList.remove('hidden');

    if (invoiceImg) invoiceImg.classList.add('hidden');
    if (invoiceFallback) invoiceFallback.classList.remove('hidden');

    if (settingsImg) settingsImg.classList.add('hidden');
    if (settingsFallback) settingsFallback.classList.remove('hidden');
  }

  if (removeBtn) {
    if (isCustom) {
      removeBtn.classList.remove('hidden');
    } else {
      removeBtn.classList.add('hidden');
    }
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function triggerAppLogoUpload() {
  const fileInput = document.getElementById('appLogoFileInput');
  if (fileInput) {
    fileInput.value = '';
    fileInput.click();
  }
}

function handleAppLogoUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select a valid image file (PNG, JPG, SVG, WEBP).');
    return;
  }

  // If SVG file, read directly as data URL without canvas rasterization
  if (file.type === 'image/svg+xml') {
    const reader = new FileReader();
    reader.onload = function(e) {
      const dataUrl = e.target.result;
      try {
        localStorage.setItem(STORAGE_APP_LOGO, dataUrl);
        applyAppLogo(dataUrl, true);
        syncCloudConfig();
        showNotification('App logo updated successfully!');
      } catch (err) {
        console.error('Failed to save logo in localStorage:', err);
        alert('File is too large to save in local storage. Please choose an image under 2MB.');
      }
    };
    reader.readAsDataURL(file);
    return;
  }

  // For raster images (PNG, JPG, WEBP), resize smoothly via Canvas to max 400x400
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 400;
      let w = img.width;
      let h = img.height;
      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.9);
      try {
        localStorage.setItem(STORAGE_APP_LOGO, dataUrl);
        applyAppLogo(dataUrl, true);
        syncCloudConfig();
        showNotification('App logo updated successfully!');
      } catch (err) {
        console.error('Failed to save logo in localStorage:', err);
        alert('Failed to save logo. Please choose a smaller image.');
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function removeAppLogo() {
  localStorage.removeItem(STORAGE_APP_LOGO);
  applyAppLogo(DEFAULT_LOGO_URL, false);
  syncCloudConfig();
  showNotification('App logo reset to default');
}

// Global Exports
window.initApp = initApp;
window.updateDashboard = updateDashboard;
window.openLeaderboardModal = openLeaderboardModal;
window.closeLeaderboardModal = closeLeaderboardModal;
window.setLeaderboardTab = setLeaderboardTab;
window.setLeaderboardPeriod = setLeaderboardPeriod;
window.setLeaderboardCustomerMetric = setLeaderboardCustomerMetric;
window.startOrderFromLeaderboard = startOrderFromLeaderboard;
window.renderLeaderboard = renderLeaderboard;
window.toggleModalFullscreen = toggleModalFullscreen;
window.setCustomerAreaFilter = setCustomerAreaFilter;
window.setOrderAreaFilter = setOrderAreaFilter;
window.populateSavedAreasDatalists = populateSavedAreasDatalists;
window.saveNewArea = saveNewArea;
window.getCustomerArea = getCustomerArea;
window.getCustomerPlace = getCustomerPlace;
window.onCustDistrictChange = onCustDistrictChange;
window.onOrderDistrictChange = onOrderDistrictChange;
window.setCustomerDistrictFilter = setCustomerDistrictFilter;
window.setCustomerTownFilter = setCustomerTownFilter;
window.getCustomerDistrict = getCustomerDistrict;
window.getCustomerTown = getCustomerTown;
window.getCustomerLandmark = getCustomerLandmark;
window.getCustomerPanchayath = getCustomerPanchayath;
window.saveNewDistrictTown = saveNewDistrictTown;
window.loadAppLogo = loadAppLogo;
window.applyAppLogo = applyAppLogo;
window.EMBEDDED_DEFAULT_LOGO_SVG = EMBEDDED_DEFAULT_LOGO_SVG;
window.extractCustomersFromOrdersIfMissing = extractCustomersFromOrdersIfMissing;
window.triggerAppLogoUpload = triggerAppLogoUpload;
window.handleAppLogoUpload = handleAppLogoUpload;
window.removeAppLogo = removeAppLogo;
window.setSettingsTab = setSettingsTab;
window.renderSettingsTownsList = renderSettingsTownsList;
window.addNewDistrictTown = addNewDistrictTown;
window.openEditTownModal = openEditTownModal;
window.closeEditTownModal = closeEditTownModal;
window.submitEditTownName = submitEditTownName;
window.deleteDistrictTown = deleteDistrictTown;
window.confirmResetDistrictTowns = confirmResetDistrictTowns;

// Date & Period Filter Exports
window.setFilterPeriod = setFilterPeriod;
window.setFilterSpecificMonth = setFilterSpecificMonth;
window.onMonthSelectChange = onMonthSelectChange;
window.onYearSelectChange = onYearSelectChange;
window.stepPreviousMonth = stepPreviousMonth;
window.stepNextMonth = stepNextMonth;
window.toggleCustomRangePanel = toggleCustomRangePanel;
window.applyCustomDateRange = applyCustomDateRange;
window.clearCustomDateRange = clearCustomDateRange;
window.setPresetDateRange = setPresetDateRange;
window.setPresetLastNDays = setPresetLastNDays;
window.populateFilterYearSelect = populateFilterYearSelect;
window.populateFilterMonthSelect = populateFilterMonthSelect;
window.updateFilterButtonStyles = updateFilterButtonStyles;

// Monthly History & Incentive Ledger Exports
window.openMonthlyHistoryModal = openMonthlyHistoryModal;
window.closeMonthlyHistoryModal = closeMonthlyHistoryModal;
window.onHistoryYearChange = onHistoryYearChange;
window.renderMonthlyHistoryList = renderMonthlyHistoryList;
window.viewMonthOnDashboard = viewMonthOnDashboard;
window.printMonthlyHistory = printMonthlyHistory;
window.seedSampleMultiMonthDataPrompt = seedSampleMultiMonthDataPrompt;
