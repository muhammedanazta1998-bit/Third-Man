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

// User's 6 official confirmed active rice varieties
const USER_CONFIRMED_PRODUCTS = [
  { id: 'prod_mg', name: 'Mohabbath Green', category: 'Kaima', bagSize: 26, defaultRateKg: 98, active: true },
  { id: 'prod_mgold', name: 'Mohabbath Gold', category: 'Kaima', bagSize: 26, defaultRateKg: 104, active: true },
  { id: 'prod_jas', name: 'Jasmine', category: 'Basmati', bagSize: 30, defaultRateKg: 112, active: true },
  { id: 'prod_dcw', name: 'White Chabi', category: 'Basmati', bagSize: 30, defaultRateKg: 90, active: true },
  { id: 'prod_dcg', name: 'Golden Chabi', category: 'Basmati', bagSize: 30, defaultRateKg: 92, active: true },
  { id: 'prod_jmt', name: 'JMT Rose 2nd', category: 'Other', bagSize: 26, defaultRateKg: 88, active: true }
];

// Additional official confirmed varieties (historical / inactive)
const ADDITIONAL_CONFIRMED_PRODUCTS = [
  { id: 'prod_joker', name: 'Joker', category: 'Other', bagSize: 26, defaultRateKg: 66, active: false },
  { id: 'prod_daawat', name: 'Daawat XXXL Gold Sella', category: 'Basmati', bagSize: 30, defaultRateKg: 112, active: false },
  { id: 'prod_royalgold', name: 'Royal Gold', category: 'Basmati', bagSize: 30, defaultRateKg: 113, active: false },
  { id: 'prod_royalwhite', name: 'Royal White', category: 'Basmati', bagSize: 30, defaultRateKg: 113, active: false }
];

const ALL_OFFICIAL_PRODUCTS = [...USER_CONFIRMED_PRODUCTS, ...ADDITIONAL_CONFIRMED_PRODUCTS];

/**
 * Robust Canonical Product Resolution
 * Maps any variant, legacy name, ID, or case permutation to the official variety.
 */
function getCanonicalProduct(p) {
  if (!p) return null;
  const rawId = typeof p === 'object' ? (p.id || p.productId) : null;
  const rawName = String(typeof p === 'object' ? (p.name || p.productName || '') : p).trim();
  const lower = rawName.toLowerCase();

  // Strip aggregate order text like "(+1 more)" if present
  const cleanLower = lower.replace(/\s*\(\+\d+\s*more\)/i, '').trim();

  // 1. Match by exact canonical ID
  if (rawId) {
    const byId = ALL_OFFICIAL_PRODUCTS.find(op => op.id === rawId);
    if (byId) return byId;
  }

  // 2. Mohabbath Green
  if (cleanLower === 'mohabbath green' || cleanLower === 'mohabbath' || cleanLower === 'mohabbath green kaima' || rawId === 'prod_mg') {
    return ALL_OFFICIAL_PRODUCTS[0];
  }
  // 3. Mohabbath Gold
  if (cleanLower === 'mohabbath gold' || cleanLower === 'mohabbath gold kaima' || rawId === 'prod_mgold') {
    return ALL_OFFICIAL_PRODUCTS[1];
  }
  // 4. Jasmine
  if (cleanLower === 'jasmine' || cleanLower === 'jasmine basmati' || rawId === 'prod_jas') {
    return ALL_OFFICIAL_PRODUCTS[2];
  }
  // 5. White Chabi (DC White, Double Chabi White Sella)
  if (cleanLower === 'white chabi' || cleanLower === 'dc white' || cleanLower === 'dcwhite' ||
      cleanLower === 'double chabi white sella' || cleanLower === 'double chabi white' ||
      cleanLower === 'double chabi white sella basmati' || cleanLower === 'dc white sella' || rawId === 'prod_dcw') {
    return ALL_OFFICIAL_PRODUCTS[3];
  }
  // 6. Golden Chabi (DC Gold, Double Chabi Gold Sella)
  if (cleanLower === 'golden chabi' || cleanLower === 'dc gold' || cleanLower === 'dcgold' ||
      cleanLower === 'double chabi gold sella' || cleanLower === 'double chabi gold' ||
      cleanLower === 'double chabi gold sella basmati' || cleanLower === 'dc gold sella' || rawId === 'prod_dcg') {
    return ALL_OFFICIAL_PRODUCTS[4];
  }
  // 7. JMT Rose 2nd (SM 3Rose 2nd)
  if (cleanLower === 'jmt rose 2nd' || cleanLower === 'sm 3rose 2nd' || cleanLower === 'sm 3rose' ||
      cleanLower === 'sm 3 rose 2nd' || cleanLower === 'jmt rose' || cleanLower === 'jmt rose second' || rawId === 'prod_jmt') {
    return ALL_OFFICIAL_PRODUCTS[5];
  }
  // 8. Joker
  if (cleanLower === 'joker' || rawId === 'prod_joker') {
    return ALL_OFFICIAL_PRODUCTS[6];
  }
  // 9. Daawat XXXL Gold Sella
  if (cleanLower === 'daawat xxxl gold sella' || cleanLower === 'daawat' || cleanLower === 'dawat' || cleanLower === 'daawat gold sella' || rawId === 'prod_daawat') {
    return ALL_OFFICIAL_PRODUCTS[7];
  }
  // 10. Royal Gold
  if (cleanLower === 'royal gold' || rawId === 'prod_royalgold') {
    return ALL_OFFICIAL_PRODUCTS[8];
  }
  // 11. Royal White
  if (cleanLower === 'royal white' || rawId === 'prod_royalwhite') {
    return ALL_OFFICIAL_PRODUCTS[9];
  }

  return null;
}

function isUserConfirmedProduct(p) {
  if (!p) return false;
  return Boolean(getCanonicalProduct(p));
}

const DEMO_SAMPLE_PRODUCT_IDS = ['p1', 'p2', 'p3', 'p4'];

const DEMO_SAMPLE_PRODUCT_NAMES = [
  'wayanadan kaima rice',
  'wayanadan kaima',
  'wayanadan',
  'jeerakasala rice',
  'jeerakasala',
  'royal 1121 sella basmati',
  'royal 1121 sella',
  '1121 sella basmati',
  'royal basmati',
  'premium long grain basmati',
  'long grain basmati',
  'biriyani rice',
  'rice variety'
];

function getDeletedProductKeys() {
  try {
    const raw = localStorage.getItem('biriyani_rice_deleted_products_v1');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function recordDeletedProductKey(id, name) {
  try {
    const keys = getDeletedProductKeys();
    if (id && !keys.includes(id)) keys.push(id);
    if (name) {
      const lower = name.trim().toLowerCase();
      if (!keys.includes(lower)) keys.push(lower);
    }
    localStorage.setItem('biriyani_rice_deleted_products_v1', JSON.stringify(keys));
  } catch (e) {}
}

function unrecordDeletedProductKey(id, name) {
  try {
    let keys = getDeletedProductKeys();
    const idStr = String(id || '');
    const nameLower = name ? name.trim().toLowerCase() : '';
    keys = keys.filter(k => k !== idStr && k !== nameLower);
    localStorage.setItem('biriyani_rice_deleted_products_v1', JSON.stringify(keys));
  } catch (e) {}
}

function isDemoSampleProduct(p) {
  if (!p) return false;
  if (isUserConfirmedProduct(p)) return false; // NEVER filter user's official products!
  const deletedKeys = getDeletedProductKeys();
  if (p.id && (DEMO_SAMPLE_PRODUCT_IDS.includes(p.id) || deletedKeys.includes(p.id))) return true;
  const name = String(typeof p === 'string' ? p : (p.name || p.productName || '')).trim().toLowerCase();
  if (!name) return false;
  if (deletedKeys.includes(name)) return true;
  return DEMO_SAMPLE_PRODUCT_NAMES.some(demo => name === demo || name.startsWith('rice variety') || (demo.length > 8 && name.includes(demo)));
}

function isUnwantedDummyProduct(p) {
  return isDemoSampleProduct(p);
}

function detectCategoryFromName(name) {
  const lower = String(name || '').toLowerCase();
  if (lower.includes('mohabbath') || lower.includes('kaima') || lower.includes('jeera')) return 'Kaima';
  if (lower.includes('white chabi') || lower.includes('golden chabi') || lower.includes('dc white') || lower.includes('dc gold') || lower.includes('dc ') || lower.includes('jasmine') || lower.includes('basmati') || lower.includes('1121') || lower.includes('sella') || lower.includes('royal gold') || lower.includes('royal white') || lower.includes('daawat')) return 'Basmati';
  if (lower.includes('kolam')) return 'Kolam';
  if (lower.includes('jmt') || lower.includes('rose') || lower.includes('matta')) return 'Other';
  return 'Other';
}

const DEFAULT_PRODUCTS = USER_CONFIRMED_PRODUCTS;
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

// Pre-November Verified Canonical Customers (Derived from Historical May-October Sales)
const PRE_NOVEMBER_CANONICAL_CUSTOMERS = [
  { id: 'c_hist_001', name: 'Thanima Hotel', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_002', name: 'Al-Safi Food Court', town: 'Pukkattupady', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_003', name: 'Edakkat Basmati', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_004', name: 'KERALA FOOD COURT', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_005', name: 'MK Aluva', town: 'Aluva', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_006', name: 'AGC TRADERS KEEZHILLAM', town: 'Keezhillam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_007', name: 'A One Kalady', town: 'Kalady', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_008', name: 'Redberries Supermarket', town: 'Ernakulam', district: 'Ernakulam', category: 'Retailer', phone: '' },
  { id: 'c_hist_009', name: 'ZAM ZAM VALLAM', town: 'Vallam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_010', name: 'Malayalies Oottupura', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_011', name: 'Hotel Malabar Palace', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_012', name: 'Ubees kalady', town: 'Kalady', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_013', name: 'Ameen traders', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_014', name: 'PMA Traders', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_015', name: 'The Grand Hotel', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_016', name: 'AR Traders', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_017', name: 'MAJ', town: 'Angamaly', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_018', name: 'MISBA SUPERMARKET', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_019', name: 'Naaz Traders', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_020', name: 'Edavilayil Paravoor', town: 'Paravoor', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_021', name: 'Parallex Hotel', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_022', name: 'Mezhukkattil', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_023', name: 'Davis and Company', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_024', name: 'FOOD BEE', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_025', name: 'SULTHAN BASMATI', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_026', name: 'VNV VALLANATTU ADIMALI', town: 'Adimali', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_027', name: 'MAMMOOTTY STORES MUNNAR', town: 'Munnar', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_028', name: 'SRINIVASAKAPERUMAL', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_029', name: 'MR TRADERS ADIMALI', town: 'Adimali', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_030', name: 'PARUTHIKKAATTIL', town: '⁠Kothamangalam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_031', name: 'Edakkat Enterprises Bypass', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_032', name: 'KCM TRADERS MUNNAR', town: 'Munnar', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_033', name: 'NADUKUDIYIL', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_034', name: 'Khaja Makani', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_035', name: 'KERALA RICE BAZAR', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_036', name: 'Shoppers shope', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_037', name: 'Naattukada', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_038', name: 'KCA Angamaly', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_039', name: 'Union Basmati', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_040', name: 'Southern Aluva', town: 'Aluva', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_041', name: 'Bismi Traders Kothamangalam', town: '⁠Kothamangalam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_042', name: 'Sanchika', town: '⁠Kothamangalam', district: 'Ernakulam', category: 'Retailer', phone: '' },
  { id: 'c_hist_043', name: 'ALUVA TRADING COMPANY', town: '⁠Kothamangalam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_044', name: 'Marwa Aluva', town: 'Aluva', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_045', name: 'KRP', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_046', name: 'BHAVANI', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_047', name: 'Classio Hotel', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_048', name: 'Tiktok Hotel', town: 'Ernakulam', district: 'Ernakulam', category: 'Hotel / Restaurant', phone: '' },
  { id: 'c_hist_049', name: 'KMA PEZHAKKAPPILLY', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_050', name: 'AB Supermarket', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_051', name: 'GRAND KARUKAPPILLY', town: 'Ernakulam', district: 'Retailer', category: 'Retailer', phone: '' },
  { id: 'c_hist_052', name: 'PR ENTERPRISES', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_053', name: 'Edassery Supermarket', town: 'Ernakulam', district: 'Ernakulam', category: 'Retailer', phone: '' },
  { id: 'c_hist_054', name: 'Vettikkaattil Thodupuzha', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_055', name: 'Joyis Supermarket', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_056', name: 'MAS PARAVOOR', town: 'Paravoor', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_057', name: 'MK ALI AND SONS KALAMASSERY', town: 'Kalamassery', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_058', name: 'ALI SONS', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_059', name: 'PKBR', town: 'Elamakkara', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_060', name: 'TKM ASSOCIATES', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_061', name: 'ALIYAR PILLAI', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_062', name: 'Riyas Traders', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_063', name: 'Thattamattom', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_064', name: 'Safiya Trading Company', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_065', name: 'TAJ Perumbavoor', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_066', name: 'EDAKKATTU BAZAAR', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_067', name: 'CTC VALLAM', town: 'Vallam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_068', name: 'Vellooparambil', town: 'Ernakulam', district: 'Ernakulam', category: 'Wholesaler', phone: '' },
  { id: 'c_hist_069', name: 'MAK Aluva', town: 'Aluva', district: 'Ernakulam', category: 'Wholesaler', phone: '' }
];
const DEFAULT_CUSTOMERS = PRE_NOVEMBER_CANONICAL_CUSTOMERS;

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
const STORAGE_DELETED_CUSTOMERS = 'third_man_deleted_customers_v1';

// Deleted Customers Tombstone System (Permanently blocks deleted customers from resurrecting)
let deletedCustomerTombstones = [];

function loadDeletedCustomerTombstones() {
  try {
    const raw = localStorage.getItem(STORAGE_DELETED_CUSTOMERS);
    deletedCustomerTombstones = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(deletedCustomerTombstones)) deletedCustomerTombstones = [];
  } catch (e) {
    deletedCustomerTombstones = [];
  }
  // Ensure "test" and similar test-created customer names are permanently tombstoned so ghost test customers never resurrect
  const initialTestNames = ['test', 'customer test', 'test customer'];
  initialTestNames.forEach(tName => {
    if (!isCustomerTombstoned(tName, '')) {
      deletedCustomerTombstones.push({ id: '', name: tName, deletedAt: new Date().toISOString() });
    }
  });
  saveDeletedCustomerTombstones();
}

function saveDeletedCustomerTombstones() {
  try {
    localStorage.setItem(STORAGE_DELETED_CUSTOMERS, JSON.stringify(deletedCustomerTombstones));
  } catch (e) {}
}

function isCustomerTombstoned(name, id) {
  const normName = (name || '').trim().toLowerCase();
  const cleanId = (id || '').trim();
  if (!normName && !cleanId) return false;
  return (Array.isArray(deletedCustomerTombstones) ? deletedCustomerTombstones : []).some(t => {
    if (cleanId && t.id && t.id === cleanId) return true;
    if (normName && t.name && t.name.toLowerCase() === normName) return true;
    return false;
  });
}

function isCustomerInTrash(name, id) {
  if (!Array.isArray(trashList) || trashList.length === 0) return false;
  const normName = (name || '').trim().toLowerCase();
  const cleanId = (id || '').trim();
  return trashList.some(item => {
    if (item.type !== 'customer' || !item.data) return false;
    if (cleanId && item.data.id === cleanId) return true;
    if (normName && item.data.name && item.data.name.trim().toLowerCase() === normName) return true;
    return false;
  });
}

function addCustomerTombstone(cust) {
  if (!cust) return;
  const normName = (cust.name || '').trim().toLowerCase();
  const id = cust.id || '';
  if (!isCustomerTombstoned(normName, id)) {
    if (!Array.isArray(deletedCustomerTombstones)) deletedCustomerTombstones = [];
    deletedCustomerTombstones.push({
      id: id,
      name: normName,
      deletedAt: new Date().toISOString()
    });
    saveDeletedCustomerTombstones();
  }
}

function removeCustomerTombstone(name, id) {
  const normName = (name || '').trim().toLowerCase();
  const cleanId = (id || '').trim();
  if (!Array.isArray(deletedCustomerTombstones)) deletedCustomerTombstones = [];
  deletedCustomerTombstones = deletedCustomerTombstones.filter(t => {
    if (cleanId && t.id === cleanId) return false;
    if (normName && t.name === normName) return false;
    return true;
  });
  saveDeletedCustomerTombstones();
}

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

// ==================== PRODUCT TO ORDERS SYNCHRONIZATION ====================

/**
 * Cascades product updates (name, category, bag size, rate) to all previous and existing orders.
 * Ensures orders accurately reflect the product change, recalculates total kg and total amount,
 * and synchronizes changes to localStorage and Cloud Firestore.
 */
/**
 * Safely cascades product name and category display label updates to existing orders
 * STRICT RULE: Changing a product's bag size or rate in the catalog must NEVER alter
 * or recalculate any historical order's bagSize, perKgRate, totalKg, or totalAmount!
 */
function cascadeProductUpdateToOrders(productId, oldName, updatedProduct) {
  if (!Array.isArray(orders) || orders.length === 0 || !updatedProduct) return 0;

  const targetId = productId || updatedProduct.id;
  const targetOldName = (oldName || '').trim().toLowerCase();
  const newName = (updatedProduct.name || '').trim();
  const newCategory = updatedProduct.category || detectCategoryFromName(newName);

  // If the product name did not change, NEVER touch existing orders!
  if (!targetOldName || !newName || targetOldName === newName.toLowerCase()) {
    return 0;
  }

  let changedOrdersCount = 0;

  orders.forEach(order => {
    if (!order) return;
    let orderChanged = false;

    // 1. Update text label on items without altering historical bagSize, rate, kg, or amount
    if (Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach(it => {
        if (!it) return;
        const itName = (it.productName || it.name || '').trim().toLowerCase();
        const matchesId = targetId && (it.productId === targetId || it.id === targetId);
        const matchesOldName = targetOldName && itName === targetOldName;

        if (matchesId || matchesOldName) {
          if (it.productName !== newName) {
            it.productName = newName;
            orderChanged = true;
          }
          if (targetId && it.productId !== targetId) {
            it.productId = targetId;
            orderChanged = true;
          }
          if (newCategory && it.category !== newCategory) {
            it.category = newCategory;
            orderChanged = true;
          }
        }
      });

      // Update primary product display name on the order object
      const firstItem = order.items[0];
      const otherCount = order.items.length - 1;
      const expectedDisplayName = otherCount > 0
        ? `${firstItem.productName} (+${otherCount} more)`
        : firstItem.productName;

      if (!order.product || order.product.name !== expectedDisplayName) {
        if (!order.product) order.product = {};
        order.product.name = expectedDisplayName;
        order.product.id = firstItem.productId;
        orderChanged = true;
      }
    } else if (order.product) {
      // Single-item legacy order object: update display label only
      const ordProdName = (order.product?.name || order.productName || '').trim().toLowerCase();
      const ordProdId = order.product?.id || order.productId;
      const ordMatchesId = targetId && ordProdId === targetId;
      const ordMatchesOldName = targetOldName && (ordProdName === targetOldName || ordProdName.includes(targetOldName));

      if (ordMatchesId || ordMatchesOldName) {
        if (typeof order.product === 'object') {
          order.product.name = newName;
          if (targetId) order.product.id = targetId;
        } else {
          order.product = { id: targetId, name: newName };
        }
        orderChanged = true;
      }
    }

    if (orderChanged) {
      changedOrdersCount++;
    }
  });

  if (changedOrdersCount > 0) {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }

  return changedOrdersCount;
}

/**
 * Cascades canonical product names, IDs, and categories across all orders
 * while strictly preserving the recorded historical bagSize (e.g. 26kg, 30kg, 50kg).
 */
function cascadeCanonicalProductsToOrders(idRedirections = null) {
  if (!Array.isArray(orders) || orders.length === 0) return 0;
  let changedOrders = 0;

  orders.forEach(order => {
    if (!order) return;
    let orderChanged = false;

    // 1. Cascade items
    if (Array.isArray(order.items) && order.items.length > 0) {
      order.items.forEach(it => {
        if (!it) return;
        const canon = getCanonicalProduct(it);
        if (canon) {
          if (it.productId !== canon.id) {
            it.productId = canon.id;
            orderChanged = true;
          }
          if (it.productName !== canon.name) {
            it.productName = canon.name;
            orderChanged = true;
          }
          if (it.category !== canon.category) {
            it.category = canon.category;
            orderChanged = true;
          }
        } else if (idRedirections && idRedirections.has(it.productId)) {
          const newId = idRedirections.get(it.productId);
          const matchCanon = ALL_OFFICIAL_PRODUCTS.find(op => op.id === newId);
          it.productId = newId;
          if (matchCanon) {
            it.productName = matchCanon.name;
            it.category = matchCanon.category;
          }
          orderChanged = true;
        }
      });

      // Update primary product display on the order object
      const first = order.items[0];
      const otherCount = order.items.length - 1;
      const expectedDisplayName = otherCount > 0 ? `${first.productName} (+${otherCount} more)` : first.productName;
      if (!order.product || order.product.id !== first.productId || order.product.name !== expectedDisplayName) {
        order.product = { id: first.productId, name: expectedDisplayName };
        order.bagSize = first.bagSize;
        orderChanged = true;
      }
    } else if (order.product) {
      const canon = getCanonicalProduct(order.product);
      if (canon) {
        if (order.product.id !== canon.id || order.product.name !== canon.name) {
          order.product = { id: canon.id, name: canon.name };
          orderChanged = true;
        }
      }
    }

    if (orderChanged) {
      changedOrders++;
    }
  });

  if (changedOrders > 0) {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    } catch (e) {}
  }
  return changedOrders;
}

/**
 * Ensures zero duplicate products exist in catalog, localStorage, and Cloud Firestore.
 * Maps legacy/alias names (DC White, DOUBLE CHABI, MOHABBATH, SM 3ROSE) to canonical varieties
 * while strictly preserving user-uploaded photos and custom rates.
 */
function deduplicateProductsList(inputProducts = null, syncToCloud = true) {
  const source = Array.isArray(inputProducts) ? inputProducts : (Array.isArray(products) ? products : []);
  if (source.length === 0) {
    products = USER_CONFIRMED_PRODUCTS.map(p => ({ ...p }));
    return products;
  }

  const dedupedMap = new Map(); // targetId/normKey -> product object
  const idRedirections = new Map(); // oldId -> canonicalId

  source.forEach(raw => {
    if (!raw) return;
    const p = { ...raw };

    // Never keep demo sample products
    if (isDemoSampleProduct(p)) return;

    // Never keep aggregate order display strings (e.g. "Mohabbath Green (+1 more)") as products
    const nameStr = (p.name || '').trim();
    if (nameStr.includes('(+') || nameStr.includes('more)')) return;

    const pBagSize = parseFloat(p.bagSize);
    const hasValidBag = !isNaN(pBagSize) && pBagSize > 0;
    const pRate = parseFloat(p.defaultRateKg);
    const hasValidRate = !isNaN(pRate) && pRate > 0;
    const pImg = p.imageUrl || p.photoUrl || p.image || '';

    const canon = getCanonicalProduct(p);
    if (canon) {
      const targetId = canon.id;
      if (p.id && p.id !== targetId) {
        idRedirections.set(p.id, targetId);
      }
      if (dedupedMap.has(targetId)) {
        // Merge with existing canonical record: strictly preserve photos and customized rates & bag sizes
        const existing = dedupedMap.get(targetId);
        if (!existing.imageUrl && pImg) {
          existing.imageUrl = pImg;
        }

        const isPCustomized = Boolean(p.isCustomized);
        const pIsNewer = (p.updatedAt || 0) >= (existing.updatedAt || 0);

        if (isPCustomized || pIsNewer) {
          if (hasValidBag && (isPCustomized || pBagSize !== canon.bagSize)) {
            existing.bagSize = pBagSize;
            existing.isCustomized = true;
          }
          if (hasValidRate && (isPCustomized || pRate !== canon.defaultRateKg)) {
            existing.defaultRateKg = pRate;
            existing.isCustomized = true;
          }
          if (p.name && isPCustomized) {
            existing.name = p.name.trim();
          }
          if (p.category && isPCustomized) {
            existing.category = p.category;
          }
          if (pImg) {
            existing.imageUrl = pImg;
          }
          if (p.updatedAt) {
            existing.updatedAt = p.updatedAt;
          }
        } else {
          if (hasValidBag && pBagSize !== canon.bagSize && !existing.isCustomized) {
            existing.bagSize = pBagSize;
            existing.isCustomized = true;
          }
          if (hasValidRate && pRate !== canon.defaultRateKg && !existing.isCustomized) {
            existing.defaultRateKg = pRate;
            existing.isCustomized = true;
          }
        }
      } else {
        const validBag = hasValidBag ? pBagSize : (canon.bagSize || 26);
        const validRate = hasValidRate ? pRate : (canon.defaultRateKg || 90);
        const isCust = Boolean(p.isCustomized || (hasValidBag && pBagSize !== canon.bagSize) || (hasValidRate && pRate !== canon.defaultRateKg));

        const newObj = {
          id: canon.id,
          name: (p.isCustomized && p.name) ? p.name.trim() : canon.name,
          category: (p.isCustomized && p.category) ? p.category : (p.category || canon.category),
          bagSize: validBag,
          defaultRateKg: validRate,
          active: canon.active !== false && p.active !== false,
          imageUrl: pImg,
          isCustomized: isCust
        };
        if (p.updatedAt) newObj.updatedAt = p.updatedAt;
        dedupedMap.set(targetId, newObj);
      }
    } else {
      // Custom user variety (not matching any official variety)
      const normKey = nameStr.toLowerCase();
      if (!normKey) return;
      if (dedupedMap.has(normKey)) {
        const existing = dedupedMap.get(normKey);
        if (hasValidBag) existing.bagSize = pBagSize;
        if (hasValidRate) existing.defaultRateKg = pRate;
        if (!existing.imageUrl && pImg) existing.imageUrl = pImg;
        if (p.updatedAt) existing.updatedAt = p.updatedAt;
      } else {
        const customId = p.id || ('prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4));
        dedupedMap.set(normKey, {
          id: customId,
          name: nameStr,
          category: p.category || detectCategoryFromName(nameStr),
          bagSize: hasValidBag ? pBagSize : 26,
          defaultRateKg: hasValidRate ? pRate : 90,
          active: p.active !== false,
          imageUrl: pImg,
          isCustomized: true,
          updatedAt: p.updatedAt || Date.now()
        });
      }
    }
  });

  // Ensure the 6 primary confirmed varieties always exist in the catalog
  USER_CONFIRMED_PRODUCTS.forEach(up => {
    if (!dedupedMap.has(up.id)) {
      dedupedMap.set(up.id, { ...up });
    }
  });

  const cleanedProducts = Array.from(dedupedMap.values());
  products = cleanedProducts;

  // Persist cleaned catalog
  try {
    localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
    localStorage.setItem('biriyani_rice_products_v1', JSON.stringify(products));
    localStorage.setItem('biriyani_rice_products_fresh_v2', JSON.stringify(products));
  } catch (e) {}

  // Update UI dropdowns and manage list
  populateProductDropdown();
  if (typeof renderProductsManageList === 'function') renderProductsManageList();

  // Cascade any old product IDs or names in orders to their canonical version
  cascadeCanonicalProductsToOrders(idRedirections);

  // Sync to Cloud Firestore if enabled
  if (syncToCloud && typeof isFirestoreInitialized !== 'undefined' && isFirestoreInitialized && typeof db !== 'undefined' && db && !isReceivingCloudSettings) {
    syncCloudConfig();
  }

  return products;
}

function normalizeExistingDCOrdersAndProducts() {
  return deduplicateProductsList(products, true);
}

// ==================== INITIALIZATION ====================

function initApp() {
  try {
    loadDataFromStorage();
    deduplicateProductsList(products, true);
    cascadeCanonicalProductsToOrders();

    // Sanitize customers: strip any tombstoned customers or ghost test entries immediately
    customers = (Array.isArray(customers) ? customers : []).filter(c => {
      if (!c || !c.name) return false;
      const n = c.name.trim().toLowerCase();
      if (n === 'test' || isCustomerTombstoned(c.name, c.id) || isCustomerInTrash(c.name, c.id)) {
        addCustomerTombstone(c);
        deleteCloudCustomer(c.id, c.name);
        return false;
      }
      return true;
    });

    extractCustomersFromOrdersIfMissing(false);
    if (typeof normalizeOrderCustomerNames === 'function') {
      normalizeOrderCustomerNames();
    }
    if (typeof resetCustomersToPreNovemberSales === 'function') {
      customers = resetCustomersToPreNovemberSales(true);
    } else if (typeof deduplicateCustomersList === 'function') {
      customers = deduplicateCustomersList(customers, true);
      saveDataToStorage();
    }

    // Ensure tombstoned customers stay purged after rebuild
    customers = customers.filter(c => c && !isCustomerTombstoned(c.name, c.id) && !isCustomerInTrash(c.name, c.id));
    saveDataToStorage();

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

    // Initialize Dashboard Security PIN Lock
    initSecurityLock();
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
    loadDeletedCustomerTombstones();
    // 1. Load orders (try fresh_v2, then fallback to historical v1/unversioned orders without purging them)
    let parsedOrders = [];
    const storedOrders = localStorage.getItem(STORAGE_ORDERS);
    if (storedOrders) {
      try { parsedOrders = JSON.parse(storedOrders); } catch (e) {}
    }
    if (!Array.isArray(parsedOrders) || parsedOrders.length === 0) {
      const orderKeys = ['biriyani_rice_orders_v1', 'biriyani_rice_orders', 'orders'];
      for (const k of orderKeys) {
        const legacy = localStorage.getItem(k);
        if (legacy) {
          try {
            const pl = JSON.parse(legacy);
            if (Array.isArray(pl) && pl.length > 0) {
              parsedOrders = pl;
              try { localStorage.setItem(STORAGE_ORDERS, JSON.stringify(pl)); } catch (e) {}
              break;
            }
          } catch (e) {}
        }
      }
    }
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
          productName: o.product?.name || o.productName || 'Biriyani Rice',
          bagSize: parseFloat(o.bagSize) || 25,
          bagQty: parseFloat(o.bagQty) || 1,
          totalKg: parseFloat(o.totalKg) || (parseFloat(o.bagSize) || 25),
          perKgRate: parseFloat(o.perKgRate) || 95,
          totalAmount: parseFloat(o.totalAmount) || 0
        }];
      } else {
        // Repair items if dummy product overwrote genuine product name
        o.items.forEach(it => {
          if (!it.productName || isUnwantedDummyProduct({ name: it.productName })) {
            if (o.product?.name && !isUnwantedDummyProduct({ name: o.product.name })) {
              it.productName = o.product.name;
            } else if (o.productName && !isUnwantedDummyProduct({ name: o.productName })) {
              it.productName = o.productName;
            }
          }
        });
      }

      // Ensure numeric fields
      o.totalKg = parseFloat(o.totalKg) || o.items.reduce((sum, it) => sum + (parseFloat(it.totalKg) || 0), 0);
      o.totalAmount = parseFloat(o.totalAmount) || o.items.reduce((sum, it) => sum + (parseFloat(it.totalAmount) || 0), 0);
      o.deliveryStatus = o.deliveryStatus || 'Normal';

      // All existing/historical orders placed up to now are marked Delivered as requested by business owner
      if (!o.dispatchStatus || (o.date && o.date <= '2026-11-21' && o.dispatchStatus !== 'Delivered')) {
        o.dispatchStatus = 'Delivered';
        o.deliveredAt = o.deliveredAt || (o.date ? (o.date + 'T18:00:00.000Z') : '2026-11-21T14:30:00.000Z');
      }

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
          const clean = parsed.filter(p => !isUnwantedDummyProduct(p));
          if (clean.length > 0) loadedProducts = clean;
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
              const clean = parsed.filter(p => !isUnwantedDummyProduct(p));
              if (clean.length > 0) {
                loadedProducts = clean;
                break;
              }
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
              const clean = parsed.filter(p => !isUnwantedDummyProduct(p));
              if (clean.length > 0) {
                loadedProducts = clean;
                break;
              }
            }
          } catch (e) {}
        }
      }
    }

    // ==================== RESTORE USER'S PRODUCTS ====================
    let finalProducts = [];
    if (loadedProducts && loadedProducts.length > 0) {
      finalProducts = loadedProducts.filter(p => !isDemoSampleProduct(p));
    }

    if (finalProducts.length === 0) {
      finalProducts = USER_CONFIRMED_PRODUCTS.map(p => ({ ...p }));
    }

    // Clean, canonical deduplication
    products = deduplicateProductsList(finalProducts, false);

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

    // ==================== RESTORE CUSTOMERS ====================
    let loadedCust = null;
    const storedCustomers = localStorage.getItem(STORAGE_CUSTOMERS);
    if (storedCustomers) {
      try {
        const pc = JSON.parse(storedCustomers);
        if (Array.isArray(pc) && pc.length > 0) loadedCust = pc;
      } catch (e) {}
    }
    if (!loadedCust) {
      const altCustKeys = ['biriyani_rice_customers_v1', 'biriyani_rice_customers', 'customers'];
      for (const k of altCustKeys) {
        const raw = localStorage.getItem(k);
        if (raw) {
          try {
            const pc = JSON.parse(raw);
            if (Array.isArray(pc) && pc.length > 0) {
              loadedCust = pc;
              break;
            }
          } catch (e) {}
        }
      }
    }
    customers = (loadedCust && loadedCust.length > 0) ? loadedCust : DEFAULT_CUSTOMERS;
    // Filter out any tombstoned customer or trash customer
    customers = customers.filter(c => c && !isCustomerTombstoned(c.name, c.id) && !isCustomerInTrash(c.name, c.id));

    // Harmonize loaded customers with verified canonical records
    if (Array.isArray(customers) && typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined') {
      const canonMap = new Map(PRE_NOVEMBER_CANONICAL_CUSTOMERS.map(c => [c.id, c]));
      customers.forEach(c => {
        if (c && c.id && canonMap.has(c.id)) {
          const canon = canonMap.get(c.id);
          c.name = canon.name;
          c.town = canon.town;
          c.district = canon.district;
          c.category = canon.category;
        }
      });
      try {
        localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
      } catch (e) {}
    }

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

    // Automatic customer deduplication pass
    if (typeof deduplicateCustomersList === 'function') {
      customers = deduplicateCustomersList(customers, false);
    }
    if (typeof normalizeOrderCustomerNames === 'function') {
      normalizeOrderCustomerNames();
    }

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
    products = DEFAULT_PRODUCTS.filter(p => !isUnwantedDummyProduct(p));
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

// Automatically harvests and restores any genuine user products from order history
function restoreProductsFromOrdersHistory() {
  return deduplicateProductsList(products, false);
}

// Purges unwanted dummy products and protects user's custom products
function purgeUnwantedDummyProducts(syncToCloud = true) {
  return deduplicateProductsList(products, syncToCloud);
}

// Lock catalog to user's 6 confirmed official products
function resetToOfficialProductsPrompt() {
  showConfirmModal({
    title: 'Lock to My 6 Official Products?',
    message: `This will lock the catalog strictly to your 6 official confirmed rice varieties:
      <ul class="list-disc pl-5 mt-2 space-y-1 text-slate-700 font-bold">
        <li>Mohabbath Green [Kaima • 26kg]</li>
        <li>Mohabbath Gold [Kaima • 26kg]</li>
        <li>Jasmine [Basmati • 30kg]</li>
        <li>White Chabi [Basmati • 30kg]</li>
        <li>Golden Chabi [Basmati • 30kg]</li>
        <li>JMT Rose 2nd [Other • 26kg]</li>
      </ul>`,
    hint: '🛡️ Any custom rates or images you set for these products will be preserved.',
    confirmText: 'Keep Only Official Products',
    confirmClass: 'bg-blue-600 hover:bg-blue-700 text-white',
    onConfirm: () => {
      products = deduplicateProductsList(USER_CONFIRMED_PRODUCTS, true);
      showNotification('✓ Products catalog locked to your 6 official varieties!');
    }
  });
}
window.resetToOfficialProductsPrompt = resetToOfficialProductsPrompt;
window.cleanAllDemoProductsPrompt = resetToOfficialProductsPrompt;

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

let cloudSyncWatchdogTimer = null;

function updateCloudSyncStatus(status, text) {
  const dot = document.getElementById('cloudSyncDot');
  const label = document.getElementById('cloudSyncText');
  if (!dot || !label) return;

  label.textContent = text;
  dot.classList.remove('bg-emerald-400', 'bg-amber-400', 'bg-rose-400', 'bg-slate-400', 'animate-pulse');

  clearTimeout(cloudSyncWatchdogTimer);

  if (status === 'synced') {
    dot.classList.add('bg-emerald-400');
  } else if (status === 'syncing') {
    dot.classList.add('bg-amber-400', 'animate-pulse');
    // Safety auto-recovery watchdog: If stuck in 'syncing' for > 5s, auto-restore to synced state
    cloudSyncWatchdogTimer = setTimeout(() => {
      const currentText = label.textContent || '';
      if (currentText.includes('Syncing') || currentText.includes('Connecting') || currentText.includes('Saving') || currentText.includes('Uploading')) {
        dot.classList.remove('bg-amber-400', 'animate-pulse');
        dot.classList.add('bg-emerald-400');
        label.textContent = 'Live Synced 🟢';
      }
    }, 5000);
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

function processIncomingCloudCustomers(remoteCustomers) {
  if (!Array.isArray(remoteCustomers) || remoteCustomers.length === 0) return;

  isReceivingCloudCustomers = true;

  // Filter out any incoming remote customer that is tombstoned or in trash
  const cleanRemote = [];
  remoteCustomers.forEach(rc => {
    if (!rc) return;
    const rName = (rc.name || '').trim().toLowerCase();
    const rId = rc.id || '';
    if (isCustomerTombstoned(rName, rId) || isCustomerInTrash(rName, rId)) {
      // Actively purge from cloud in the background so Firestore stops sending it
      deleteCloudCustomer(rId, rc.name);
      return;
    }
    cleanRemote.push(rc);
  });

  const localById = new Map();
  const localByName = new Map();
  if (Array.isArray(customers)) {
    customers.forEach(c => {
      if (!c) return;
      if (c.id) localById.set(c.id, c);
      if (c.name) localByName.set(c.name.trim().toLowerCase(), c);
    });
  }

  const mergedCustomers = [];
  const processedIds = new Set();
  const processedNames = new Set();
  const needsCloudUpload = [];

  // 1. Process all incoming customers from Cloud Firestore
  cleanRemote.forEach(remoteCust => {
    if (!remoteCust || (!remoteCust.id && !remoteCust.name)) return;

    // Apply canonical alias if any (e.g. "Riyas" -> "Riyas Traders", "Thanima" -> "Thanima Hotel")
    const rawLower = (remoteCust.name || '').trim().toLowerCase();
    const alias = (typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined') ? CANONICAL_CUSTOMER_ALIASES[rawLower] : null;
    if (alias) {
      if (rawLower !== alias.canonicalName.toLowerCase() && remoteCust.id && !remoteCust.id.startsWith('c_hist_')) {
        if (db) {
          db.collection('customers').doc(remoteCust.id).delete().catch(err => console.warn('Clean alias doc error:', err));
        }
      }
      remoteCust.name = alias.canonicalName;
      if (!remoteCust.town || remoteCust.town === 'Ernakulam' || remoteCust.town === 'Local') {
        remoteCust.town = alias.town;
      }
    }

    const normName = (remoteCust.name || '').trim().toLowerCase();
    const localMatch = (remoteCust.id && localById.get(remoteCust.id)) ||
                       (normName && localByName.get(normName));

    let merged = { ...remoteCust };

    if (localMatch) {
      // Merge members from both remote (cloud) and local (this device)
      const remoteMembers = Array.isArray(remoteCust.members) ? [...remoteCust.members] : (typeof getCustomerMembers === 'function' ? getCustomerMembers(remoteCust) : []);
      const localMembers = Array.isArray(localMatch.members) ? [...localMatch.members] : (typeof getCustomerMembers === 'function' ? getCustomerMembers(localMatch) : []);

      let localHasNewMembers = false;
      localMembers.forEach(lm => {
        const lmP = typeof cleanPhoneNumber === 'function' ? cleanPhoneNumber(lm.phone) : (lm.phone || '');
        const lmName = (lm.name || '').trim().toLowerCase();
        const existsInRemote = remoteMembers.some(rm => {
          const rmP = typeof cleanPhoneNumber === 'function' ? cleanPhoneNumber(rm.phone) : (rm.phone || '');
          const rmName = (rm.name || '').trim().toLowerCase();
          return (rm.id && lm.id && rm.id === lm.id) || (lmP && rmP && lmP === rmP) || (lmName && rmName && lmName === rmName);
        });
        if (!existsInRemote) {
          remoteMembers.push(lm);
          localHasNewMembers = true;
        }
      });

      merged.members = remoteMembers;
      if (typeof syncCustomerMemberLegacyFields === 'function') {
        syncCustomerMemberLegacyFields(merged);
      }

      // Preserve local custom data if remote was empty
      if (!merged.ownerPhone && localMatch.ownerPhone) merged.ownerPhone = localMatch.ownerPhone;
      if (!merged.staffPhone && localMatch.staffPhone) merged.staffPhone = localMatch.staffPhone;
      if (!merged.phone && localMatch.phone) merged.phone = localMatch.phone;
      if (!merged.notes && localMatch.notes) merged.notes = localMatch.notes;

      // If local device had new members that cloud didn't have, queue customer to upload to cloud
      if (localHasNewMembers) {
        needsCloudUpload.push(merged);
      }
    } else {
      if (!Array.isArray(merged.members) || merged.members.length === 0) {
        merged.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(merged) : [];
      }
    }

    if (!merged.id) {
      merged.id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    }

    if (!processedIds.has(merged.id) && !processedNames.has(normName)) {
      processedIds.add(merged.id);
      if (normName) processedNames.add(normName);
      mergedCustomers.push(merged);
    }
  });

  // 2. Preserve any local customer that hasn't synced to cloud yet
  if (Array.isArray(customers)) {
    customers.forEach(localCust => {
      if (!localCust || !localCust.id) return;
      const lowerName = (localCust.name || '').trim().toLowerCase();
      if (isCustomerTombstoned(lowerName, localCust.id) || isCustomerInTrash(lowerName, localCust.id)) return;
      if (processedIds.has(localCust.id) || (lowerName && processedNames.has(lowerName))) return;

      processedIds.add(localCust.id);
      if (lowerName) processedNames.add(lowerName);
      if (!Array.isArray(localCust.members) || localCust.members.length === 0) {
        localCust.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(localCust) : [];
      }
      mergedCustomers.push(localCust);
      needsCloudUpload.push(localCust);
    });
  }

  // 3. Ensure all 69 canonical pre-November customers exist
  if (typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined' && Array.isArray(PRE_NOVEMBER_CANONICAL_CUSTOMERS)) {
    PRE_NOVEMBER_CANONICAL_CUSTOMERS.forEach(canon => {
      const key = canon.name.trim().toLowerCase();
      if (isCustomerTombstoned(key, canon.id) || isCustomerInTrash(key, canon.id)) return;
      const exists = mergedCustomers.some(c => (c.name && c.name.trim().toLowerCase() === key) || (c.id === canon.id));
      if (!exists) {
        const fresh = { ...canon };
        fresh.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(fresh) : [];
        mergedCustomers.push(fresh);
        needsCloudUpload.push(fresh);
      }
    });
  }

  // 4. Clean & deduplicate final list
  customers = (typeof deduplicateCustomersList === 'function')
    ? deduplicateCustomersList(mergedCustomers, false)
    : mergedCustomers;

  // Final sanity filter: Ensure no deleted customer or in-trash customer remains
  customers = customers.filter(c => c && !isCustomerTombstoned(c.name, c.id) && !isCustomerInTrash(c.name, c.id));

  // Harmonize incoming cloud customers with verified canonical records
  if (Array.isArray(customers) && typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined') {
    const canonMap = new Map(PRE_NOVEMBER_CANONICAL_CUSTOMERS.map(c => [c.id, c]));
    customers.forEach(c => {
      if (c && c.id && canonMap.has(c.id)) {
        const canon = canonMap.get(c.id);
        c.name = canon.name;
        c.town = canon.town;
        c.district = canon.district;
        c.category = canon.category;
      }
    });
  }

  try {
    localStorage.setItem(STORAGE_CUSTOMERS, JSON.stringify(customers));
  } catch (e) {}

  populateCustomerDropdown();
  if (typeof renderCustomersList === 'function') renderCustomersList();
  if (typeof populateSavedAreasDatalists === 'function') populateSavedAreasDatalists();
  if (typeof updateDashboard === 'function') updateDashboard();
  if (typeof renderLeaderboardSection === 'function') renderLeaderboardSection();

  // If customer detail modal is currently open, refresh members list and badge in real time!
  if (activeDetailCustomerId) {
    const currentOpenCust = customers.find(c => c.id === activeDetailCustomerId);
    if (currentOpenCust) {
      if (typeof renderCustomerMembersList === 'function') renderCustomerMembersList();
      const countBadge = document.getElementById('cdMembersCountBadge');
      if (countBadge) countBadge.textContent = (currentOpenCust.members || []).length;
    }
  }

  isReceivingCloudCustomers = false;

  // 5. Automatically sync back to Cloud Firestore if local had new members or new customers
  if (needsCloudUpload.length > 0 && typeof isFirestoreInitialized !== 'undefined' && isFirestoreInitialized && typeof db !== 'undefined' && db) {
    needsCloudUpload.forEach(c => {
      syncCloudCustomer(c);
    });
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

      // Ensure historical / past orders up to 2026-11-21 are Delivered
      const needsCloudDeliveredSync = [];
      remoteOrders.forEach(o => {
        if (!o.dispatchStatus || (o.date && o.date <= '2026-11-21' && o.dispatchStatus !== 'Delivered')) {
          o.dispatchStatus = 'Delivered';
          o.deliveredAt = o.deliveredAt || (o.date ? (o.date + 'T18:00:00.000Z') : '2026-11-21T14:30:00.000Z');
          needsCloudDeliveredSync.push(o);
        }
      });
      orders = remoteOrders;

      if (needsCloudDeliveredSync.length > 0 && db) {
        batchSyncOrdersDispatchStatus(needsCloudDeliveredSync);
      }

      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
      } catch (e) {}

      // Automatically harvest any customer from orders into customer directory only if directory is empty
      if (customers.length === 0) {
        extractCustomersFromOrdersIfMissing(true);
      }
      if (typeof deduplicateCustomersList === 'function') {
        customers = deduplicateCustomersList(customers, true);
      }

      // Ensure products catalog remains clean and verified
      purgeUnwantedDummyProducts(false);

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
      const remoteCustomers = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d && (d.id || d.name)) {
          remoteCustomers.push(d);
        }
      });

      // Merge cloud customers, preserve custom members, and update mobile UI in real time
      processIncomingCloudCustomers(remoteCustomers);
      updateCloudSyncStatus('synced', 'Live Synced 🟢');
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
        const cleanCloudProducts = cfg.products.filter(p => !isDemoSampleProduct(p));
        products = deduplicateProductsList([...products, ...cleanCloudProducts], false);
        cascadeCanonicalProductsToOrders();
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
  
  // Ensure all historical orders up to now are marked Delivered before seeding
  orders.forEach(o => {
    if (!o.dispatchStatus || (o.date && o.date <= '2026-11-21' && o.dispatchStatus !== 'Delivered')) {
      o.dispatchStatus = 'Delivered';
      o.deliveredAt = o.deliveredAt || (o.date ? (o.date + 'T18:00:00.000Z') : '2026-11-21T14:30:00.000Z');
    }
  });

  const CHUNK_SIZE = 400;
  for (let i = 0; i < orders.length; i += CHUNK_SIZE) {
    const chunk = orders.slice(i, i + CHUNK_SIZE);
    try {
      const batch = db.batch();
      chunk.forEach(order => {
        if (order && order.id) {
          const ref = db.collection('orders').doc(order.id);
          batch.set(ref, sanitizeForFirestore(order));
        }
      });
      batch.commit().then(() => {
        updateCloudSyncStatus('synced', 'Live Synced 🟢');
      }).catch(err => {
        console.error('Initial orders seed batch error:', err);
      });
    } catch (e) {
      console.warn('Batch seed error:', e);
    }
  }
}

function batchSyncOrdersDispatchStatus(orderList) {
  if (!db || !Array.isArray(orderList) || orderList.length === 0) return;
  const CHUNK_SIZE = 400;
  for (let i = 0; i < orderList.length; i += CHUNK_SIZE) {
    const chunk = orderList.slice(i, i + CHUNK_SIZE);
    try {
      const batch = db.batch();
      chunk.forEach(o => {
        if (o && o.id) {
          const ref = db.collection('orders').doc(o.id);
          batch.set(ref, {
            dispatchStatus: 'Delivered',
            deliveredAt: o.deliveredAt || new Date().toISOString()
          }, { merge: true });
        }
      });
      batch.commit().catch(err => console.warn('Orders dispatch status batch sync notice:', err));
    } catch (e) {
      console.warn('Batch dispatch commit error:', e);
    }
  }
}

function markAllCurrentOrdersDelivered(interactive = false) {
  if (interactive) {
    const pendingCount = (orders || []).filter(o => o.dispatchStatus !== 'Delivered').length;
    const msg = pendingCount > 0 
      ? `Mark all ${pendingCount} pending orders as Delivered?`
      : `Mark all existing orders as Delivered?`;
    if (!confirm(msg)) return;
  }

  const nowIso = new Date().toISOString();
  let updatedCount = 0;
  const toSync = [];

  (orders || []).forEach(o => {
    if (o.dispatchStatus !== 'Delivered') {
      o.dispatchStatus = 'Delivered';
      o.deliveredAt = o.deliveredAt || (o.date ? (o.date + 'T18:00:00.000Z') : nowIso);
      updatedCount++;
      toSync.push(o);
    }
  });

  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
  } catch (e) {}

  if (toSync.length > 0 && db) {
    batchSyncOrdersDispatchStatus(toSync);
  }

  updateDashboard();
  if (typeof renderOrdersTable === 'function') {
    renderOrdersTable();
  }

  if (typeof showNotification === 'function') {
    showNotification(`✓ ${updatedCount > 0 ? updatedCount : 'All'} orders marked as Delivered!`);
  }
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
    const cId = (typeof c === 'object' && c.id) ? c.id : '';
    if (!cName) return;

    // NEVER auto-recover customers that have been intentionally deleted or are in Recycle Bin
    if (isCustomerTombstoned(cName, cId) || isCustomerInTrash(cName, cId)) {
      return;
    }

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

  if (typeof deduplicateCustomersList === 'function') {
    customers = deduplicateCustomersList(customers, syncToCloud);
  }

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

function deleteCloudCustomer(customerId, customerName) {
  if (!db) return;
  // 1. Direct doc delete by ID
  if (customerId) {
    db.collection('customers').doc(customerId).delete().catch(err => {
      console.warn('Error deleting customer from Firestore doc:', err);
    });
    // Query delete if doc has id field matching customerId
    db.collection('customers').where('id', '==', customerId).get().then(snap => {
      if (snap && !snap.empty) {
        snap.forEach(doc => doc.ref.delete().catch(e => {}));
      }
    }).catch(e => {});
  }
  // 2. Query delete if name matches (clean, lower, upper, capitalized)
  if (customerName && typeof customerName === 'string') {
    const cleanN = customerName.trim();
    if (cleanN) {
      const variations = [cleanN, cleanN.toLowerCase(), cleanN.toUpperCase(), cleanN.charAt(0).toUpperCase() + cleanN.slice(1).toLowerCase()];
      const uniqueVars = Array.from(new Set(variations));
      uniqueVars.forEach(v => {
        db.collection('customers').where('name', '==', v).get().then(snap => {
          if (snap && !snap.empty) {
            snap.forEach(doc => doc.ref.delete().catch(e => {}));
          }
        }).catch(e => {});
      });
    }
  }
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

function manualTriggerCloudSync(isQuiet = false) {
  updateCloudSyncStatus('syncing', 'Syncing Cloud...');
  const refreshIcon = document.querySelector('#cloudSyncIndicator i[data-lucide="refresh-cw"]');
  if (refreshIcon) refreshIcon.classList.add('animate-spin');

  if (!db) {
    initFirebaseSync();
    if (refreshIcon) setTimeout(() => refreshIcon.classList.remove('animate-spin'), 600);
    return;
  }

  // Wake up network if sleeping (e.g. mobile screen unlock)
  if (typeof db.enableNetwork === 'function') {
    db.enableNetwork().catch(() => {});
  }

  // 1. Fetch latest customers from Firestore and process them
  const custPromise = db.collection('customers').get().then(snapshot => {
    if (!snapshot.empty) {
      const remote = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d && (d.id || d.name)) remote.push(d);
      });
      processIncomingCloudCustomers(remote);
    } else if (customers.length > 0) {
      seedLocalCustomersToCloud();
    }
  }).catch(err => {
    console.warn('Manual sync customers fetch error:', err);
    if (customers.length > 0) seedLocalCustomersToCloud();
  });

  // 2. Fetch latest orders from Firestore
  const ordersPromise = db.collection('orders').get().then(snapshot => {
    if (!snapshot.empty) {
      const remoteOrders = [];
      snapshot.forEach(doc => {
        const d = doc.data();
        if (d && d.id) remoteOrders.push(d);
      });
      remoteOrders.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
      orders = remoteOrders;
      try {
        localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
      } catch (e) {}
      updateDashboard();
    } else if (orders.length > 0) {
      seedLocalOrdersToCloud();
    }
  }).catch(err => {
    console.warn('Manual sync orders fetch error:', err);
    if (orders.length > 0) seedLocalOrdersToCloud();
  });

  // 3. Settings config sync
  const configPromise = db.collection('settings').doc('app_config').get().then(doc => {
    if (doc.exists) {
      const cfg = doc.data();
      if (Array.isArray(cfg.products) && cfg.products.length > 0) {
        const cleanCloudProducts = cfg.products.filter(p => !isDemoSampleProduct(p));
        products = deduplicateProductsList([...products, ...cleanCloudProducts], false);
      }
    }
  }).catch(err => {
    console.warn('Config manual sync error:', err);
  });

  syncCloudConfig();

  // All promises settled: Stop spin animation and ALWAYS set status to Live Synced 🟢
  Promise.allSettled([custPromise, ordersPromise, configPromise]).then(() => {
    updateCloudSyncStatus('synced', 'Live Synced 🟢');
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
    if (!isQuiet && typeof showNotification === 'function') {
      showNotification('✓ Cloud sync complete! Updated from cloud.');
    }
  });
}

// Auto-resync & socket wake-up when returning to app (e.g. mobile unlock, tab focus, online event)
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && db) {
      if (typeof db.enableNetwork === 'function') db.enableNetwork().catch(() => {});
      manualTriggerCloudSync(true);
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (db && typeof db.enableNetwork === 'function') db.enableNetwork().catch(() => {});
    manualTriggerCloudSync(true);
  });

  window.addEventListener('focus', () => {
    if (db && typeof db.enableNetwork === 'function') db.enableNetwork().catch(() => {});
  });

  // Periodic heartbeat every 45 seconds to keep Firestore socket active while app is in foreground
  setInterval(() => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible' && db) {
      if (typeof db.enableNetwork === 'function') db.enableNetwork().catch(() => {});
    }
  }, 45000);
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

// ==================== CUSTOMER DEDUPLICATION & NORMALIZATION ====================

const CANONICAL_CUSTOMER_ALIASES = {
  'thanima': { canonicalName: 'Thanima Hotel', town: 'Ernakulam' },
  'thanima hotel': { canonicalName: 'Thanima Hotel', town: 'Ernakulam' },
  'hotel thanima': { canonicalName: 'Thanima Hotel', town: 'Ernakulam' },
  'riyas': { canonicalName: 'Riyas Traders', town: 'Ernakulam' },
  'riyas traders': { canonicalName: 'Riyas Traders', town: 'Ernakulam' },
  'maj angamaly': { canonicalName: 'MAJ', town: 'Angamaly' },
  'maj': { canonicalName: 'MAJ', town: 'Angamaly' },
  'pkbr elamakkara': { canonicalName: 'PKBR', town: 'Elamakkara' },
  'pkbr': { canonicalName: 'PKBR', town: 'Elamakkara' },
  'al-safi food court, pukkattupady': { canonicalName: 'Al-Safi Food Court', town: 'Pukkattupady' },
  'al-safi food court': { canonicalName: 'Al-Safi Food Court', town: 'Pukkattupady' },
  'ub kalady': { canonicalName: 'Ubees kalady', town: 'Kalady' },
  'ubees kalady': { canonicalName: 'Ubees kalady', town: 'Kalady' },
  'ubees': { canonicalName: 'Ubees kalady', town: 'Kalady' },
  "ub's": { canonicalName: 'Ubees kalady', town: 'Kalady' },
  "ub's kalady": { canonicalName: 'Ubees kalady', town: 'Kalady' },
  'thattammattom': { canonicalName: 'Thattamattom', town: 'Ernakulam' },
  'misba': { canonicalName: 'MISBA SUPERMARKET', town: 'Ernakulam' },
  'mak': { canonicalName: 'MAK Aluva', town: 'Aluva' },
  'edavilayil': { canonicalName: 'Edavilayil Paravoor', town: 'Paravoor' },
  'parallex': { canonicalName: 'Parallex Hotel', town: 'Ernakulam' },
  'kerala rice bazar': { canonicalName: 'KERALA RICE BAZAR', town: 'Ernakulam' }
};

function normalizeOrderCustomerNames() {
  if (!Array.isArray(orders)) return false;
  let changed = false;
  orders.forEach(o => {
    if (!o) return;
    const curName = (typeof o.customer === 'object' ? (o.customer?.name || '') : String(o.customer || '')).trim();
    if (!curName) return;
    const rawLower = curName.toLowerCase();
    const alias = CANONICAL_CUSTOMER_ALIASES[rawLower];
    if (alias) {
      if (typeof o.customer === 'object') {
        if (o.customer.name !== alias.canonicalName) {
          o.customer.name = alias.canonicalName;
          changed = true;
        }
        if (!o.customer.town || o.customer.town === 'Ernakulam' || o.customer.town === 'Local') {
          o.customer.town = alias.town;
          changed = true;
        }
      } else {
        if (o.customer !== alias.canonicalName) {
          o.customer = alias.canonicalName;
          changed = true;
        }
      }
      if (o.customerName && o.customerName !== alias.canonicalName) {
        o.customerName = alias.canonicalName;
        changed = true;
      }
    }
  });
  if (changed) {
    try {
      localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
    } catch (e) {}
    if (typeof isFirestoreInitialized !== 'undefined' && isFirestoreInitialized && typeof db !== 'undefined' && db) {
      orders.forEach(o => {
        const cName = (typeof o.customer === 'object' ? (o.customer?.name || '') : String(o.customer || '')).trim();
        const alias = CANONICAL_CUSTOMER_ALIASES[cName.toLowerCase()];
        if (alias && o.id) {
          db.collection('orders').doc(o.id).set(sanitizeForFirestore(o), { merge: true }).catch(err => {});
        }
      });
    }
  }
  return changed;
}

/**
 * Rebuilds and synchronizes customer list strictly from verified pre-November sales records.
 * Purges manually typed duplicate/alias customers (e.g. 'Riyas' -> merged into 'Riyas Traders')
 * and synchronizes document deletions to Cloud Firestore.
 */
function resetCustomersToPreNovemberSales(syncToCloud = true) {
  if (typeof normalizeOrderCustomerNames === 'function') {
    normalizeOrderCustomerNames();
  }

  const existingByName = new Map();
  const existingById = new Map();
  if (Array.isArray(customers)) {
    customers.forEach(c => {
      if (!c) return;
      if (c.name) existingByName.set(c.name.trim().toLowerCase(), c);
      if (c.id) existingById.set(c.id, c);
    });
  }

  const rebuilt = [];
  const deletedCloudIds = [];
  const matchedExistingIds = new Set();

  PRE_NOVEMBER_CANONICAL_CUSTOMERS.forEach(canon => {
    const key = canon.name.trim().toLowerCase();
    const existing = existingByName.get(key) || existingById.get(canon.id);
    if (existing) {
      matchedExistingIds.add(existing.id);
      const merged = {
        ...canon,
        ...existing,
        name: canon.name,
        town: canon.town || existing.town || 'Ernakulam',
        district: canon.district || existing.district || 'Ernakulam',
        category: canon.category || existing.category || 'Wholesaler'
      };
      if (!Array.isArray(merged.members) || merged.members.length === 0) {
        merged.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(merged) : [];
      }
      rebuilt.push(merged);
    } else {
      const fresh = { ...canon };
      fresh.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(fresh) : [];
      rebuilt.push(fresh);
    }
  });

  if (Array.isArray(customers)) {
    customers.forEach(cust => {
      if (!cust || !cust.name) return;
      if (matchedExistingIds.has(cust.id)) return;

      const rawLower = cust.name.trim().toLowerCase();
      const alias = CANONICAL_CUSTOMER_ALIASES[rawLower];

      if (alias) {
        const target = rebuilt.find(c => c.name.toLowerCase() === alias.canonicalName.toLowerCase());
        if (target) {
          if (!target.phone && cust.phone) target.phone = cust.phone;
          if (!target.ownerPhone && cust.ownerPhone) target.ownerPhone = cust.ownerPhone;
          if (!target.staffPhone && cust.staffPhone) target.staffPhone = cust.staffPhone;
        }
        if (cust.id && (!target || cust.id !== target.id)) {
          deletedCloudIds.push(cust.id);
        }
      } else {
        // Skip any deleted or in-trash customer
        if (isCustomerTombstoned(cust.name, cust.id) || isCustomerInTrash(cust.name, cust.id)) {
          if (cust.id) deletedCloudIds.push(cust.id);
          return;
        }
        // Legitimate customer added after November - preserve in directory
        if (!Array.isArray(cust.members) || cust.members.length === 0) {
          cust.members = typeof getCustomerMembers === 'function' ? getCustomerMembers(cust) : [];
        }
        rebuilt.push(cust);
      }
    });
  }

  customers = rebuilt;
  saveDataToStorage();
  populateCustomerDropdown();
  if (typeof renderCustomersList === 'function') renderCustomersList();

  if (syncToCloud && typeof isFirestoreInitialized !== 'undefined' && isFirestoreInitialized && typeof db !== 'undefined' && db) {
    if (deletedCloudIds.length > 0) {
      deletedCloudIds.forEach(dupId => {
        try {
          deleteCloudCustomer(dupId);
        } catch (e) {}
      });
    }
    // Also push canonical customers that have members so cloud is always up to date
    rebuilt.forEach(c => {
      if (c && Array.isArray(c.members) && c.members.length > 0 && typeof syncCloudCustomer === 'function') {
        try {
          syncCloudCustomer(c);
        } catch (e) {}
      }
    });
  }

  return customers;
}

function deduplicateCustomersList(inputList = null, syncDeletionsToCloud = false) {
  const sourceList = Array.isArray(inputList) ? inputList : (Array.isArray(customers) ? customers : []);
  if (sourceList.length === 0) return [];

  const unique = [];
  const deletedIds = [];

  sourceList.forEach(rawItem => {
    if (!rawItem) return;
    const item = { ...rawItem };
    const rawName = (item.name || '').trim().replace(/\s+/g, ' ');
    if (!rawName && !item.id) return;
    item.name = rawName || 'Customer';

    const rawLowerName = item.name.toLowerCase();
    // Skip any deleted or in-trash customer
    if (isCustomerTombstoned(rawLowerName, item.id) || isCustomerInTrash(rawLowerName, item.id)) {
      if (item.id) deletedIds.push(item.id);
      return;
    }
    const aliasInfo = CANONICAL_CUSTOMER_ALIASES[rawLowerName];
    if (aliasInfo) {
      item.name = aliasInfo.canonicalName;
      if (!item.town || item.town === 'Ernakulam' || item.town === 'Local') {
        item.town = aliasInfo.town;
      }
    }

    const cleanP = cleanPhoneNumber(item.phone);
    const cleanOwn = cleanPhoneNumber(item.ownerPhone);
    const cleanStf = cleanPhoneNumber(item.staffPhone);
    const lowerName = item.name.toLowerCase();

    // Find match in unique so far
    let matchIndex = -1;

    // 1. Match by ID
    if (item.id) {
      matchIndex = unique.findIndex(u => u.id && u.id === item.id);
    }

    // 2. Match by exact normalized name (case-insensitive)
    if (matchIndex === -1 && lowerName) {
      matchIndex = unique.findIndex(u => u.name && u.name.trim().toLowerCase() === lowerName);
    }

    // 3. Match by normalized 10-digit primary phone or owner phone
    if (matchIndex === -1 && (cleanOwn || cleanP)) {
      matchIndex = unique.findIndex(u => {
        const uOwn = cleanPhoneNumber(u.ownerPhone);
        const uP = cleanPhoneNumber(u.phone);
        const uStf = cleanPhoneNumber(u.staffPhone);
        if (cleanOwn && (uOwn === cleanOwn || uP === cleanOwn || uStf === cleanOwn)) return true;
        if (cleanP && (uP === cleanP || uOwn === cleanP || uStf === cleanP)) return true;
        return false;
      });
    }

    if (matchIndex !== -1) {
      // Merge item into existing match
      const target = unique[matchIndex];

      // Prefer non-default location fields
      if ((!target.district || target.district === 'Ernakulam') && item.district && item.district !== 'Ernakulam') {
        target.district = item.district;
      }
      if ((!target.town || target.town === 'Ernakulam' || target.town === 'Local') && item.town && item.town !== 'Ernakulam' && item.town !== 'Local') {
        target.town = item.town;
      }
      if (!target.landmark && item.landmark) target.landmark = item.landmark;
      if (!target.panchayath && item.panchayath) target.panchayath = item.panchayath;
      if (!target.area && item.area) target.area = item.area;
      if (!target.place && item.place) target.place = item.place;
      if ((!target.location || target.location === 'Local' || target.location === 'Ernakulam') && item.location && item.location !== 'Local') {
        target.location = item.location;
      }

      // Merge category if target is default 'Caterer' and item has specific category
      if (target.category === 'Caterer' && item.category && item.category !== 'Caterer') {
        target.category = item.category;
      }

      // Merge owner/staff details if missing
      if (!target.ownerName && item.ownerName) target.ownerName = item.ownerName;
      if (!target.ownerPhone && cleanOwn) target.ownerPhone = cleanOwn;
      if (!target.staffName && item.staffName) target.staffName = item.staffName;
      if ((!target.staffRole || target.staffRole === 'Chef / Cook') && item.staffRole) target.staffRole = item.staffRole;
      if (!target.staffPhone && cleanStf) target.staffPhone = cleanStf;
      if (!target.phone && (cleanP || cleanOwn)) target.phone = cleanP || cleanOwn;

      // Merge notes
      if (item.notes && item.notes !== 'Auto-recovered from order' && item.notes !== 'Added from order') {
        if (!target.notes || target.notes === 'Auto-recovered from order' || target.notes === 'Added from order') {
          target.notes = item.notes;
        } else if (!target.notes.includes(item.notes)) {
          target.notes += ` | ${item.notes}`;
        }
      }

      // Merge members array without duplicates
      const targetMembers = getCustomerMembers(target);
      const itemMembers = getCustomerMembers(item);
      itemMembers.forEach(im => {
        const imP = cleanPhoneNumber(im.phone);
        const imName = (im.name || '').trim().toLowerCase();
        const exists = targetMembers.some(tm => {
          const tmP = cleanPhoneNumber(tm.phone);
          const tmName = (tm.name || '').trim().toLowerCase();
          return (imP && tmP && imP === tmP) || (imName && tmName && imName === tmName);
        });
        if (!exists) {
          targetMembers.push({
            id: 'm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            name: im.name,
            role: im.role || 'Staff',
            phone: im.phone || '',
            isPrimary: false
          });
        }
      });
      target.members = targetMembers;

      // Re-point any orders that used item.id or item.name to target
      if (item.id && item.id !== target.id) {
        deletedIds.push(item.id);
        if (Array.isArray(orders)) {
          orders.forEach(o => {
            if (o && o.customer) {
              const oCustName = typeof o.customer === 'object' ? (o.customer.name || '').trim().toLowerCase() : String(o.customer).trim().toLowerCase();
              const matchesThis = oCustName === lowerName || oCustName === rawLowerName;
              if (typeof o.customer === 'object') {
                if (o.customer.id === item.id || matchesThis) {
                  o.customer.id = target.id;
                  o.customer.name = target.name;
                }
              } else if (typeof o.customer === 'string' && matchesThis) {
                o.customer = target.name;
              }
            }
          });
        }
      }
    } else {
      // First time seeing this customer
      if (!item.id) {
        item.id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      }
      if (!Array.isArray(item.members) || item.members.length === 0) {
        item.members = getCustomerMembers(item);
      }
      unique.push(item);
    }
  });

  // Sync deletions of duplicate documents to Firestore
  if (syncDeletionsToCloud && deletedIds.length > 0 && typeof isFirestoreInitialized !== 'undefined' && isFirestoreInitialized && typeof db !== 'undefined' && db) {
    deletedIds.forEach(dupId => {
      try {
        deleteCloudCustomer(dupId);
      } catch (e) {}
    });
  }

  return unique;
}

function getCanonicalCustomerInfo(rawCustomer) {
  if (!rawCustomer) {
    return { id: 'unknown', name: 'Customer', category: 'Caterer', location: 'Local', phone: '' };
  }

  const rawId = (typeof rawCustomer === 'object' && rawCustomer.id) ? rawCustomer.id : null;
  let rawName = (typeof rawCustomer === 'string' ? rawCustomer : (rawCustomer.name || '')).trim().replace(/\s+/g, ' ');
  const rawPhone = (typeof rawCustomer === 'object' && rawCustomer.phone) ? rawCustomer.phone : '';
  const cleanP = cleanPhoneNumber(rawPhone);

  // Check alias dictionary first to resolve any historical or variant customer names
  let effectiveName = rawName;
  if (rawName && typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined') {
    const aliasInfo = CANONICAL_CUSTOMER_ALIASES[rawName.toLowerCase()];
    if (aliasInfo && aliasInfo.canonicalName) {
      effectiveName = aliasInfo.canonicalName;
    }
  }

  // 1. If effectiveName is present, match by canonical/alias name first
  let match = null;
  if (effectiveName) {
    const lower = effectiveName.toLowerCase();
    match = customers.find(c => c.name && c.name.trim().toLowerCase() === lower);
  }

  // 2. If no name match, match by customer ID in customers
  if (!match && rawId) {
    match = customers.find(c => c.id === rawId);
  }

  // 3. Safety check: If matched by rawId but effectiveName is present and conflicts with match.name,
  // ensure we never misattribute orders to an unrelated store
  if (match && effectiveName && match.name && match.name.trim().toLowerCase() !== effectiveName.toLowerCase()) {
    const nameMatch = customers.find(c => c.name && c.name.trim().toLowerCase() === effectiveName.toLowerCase());
    if (nameMatch) {
      match = nameMatch;
    }
  }

  // 4. Try rawName if different from effectiveName
  if (!match && rawName && rawName.toLowerCase() !== effectiveName.toLowerCase()) {
    const lowerRaw = rawName.toLowerCase();
    match = customers.find(c => c.name && c.name.trim().toLowerCase() === lowerRaw);
  }

  // 5. Match by phone
  if (!match && cleanP) {
    match = customers.find(c => cleanPhoneNumber(c.phone) === cleanP || cleanPhoneNumber(c.ownerPhone) === cleanP);
  }

  // 6. Fallback search in pre-November canonical customers catalog
  if (!match && effectiveName && typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined') {
    const lower = effectiveName.toLowerCase();
    match = PRE_NOVEMBER_CANONICAL_CUSTOMERS.find(c => c.name && c.name.trim().toLowerCase() === lower);
  }
  if (!match && rawId && typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined') {
    match = PRE_NOVEMBER_CANONICAL_CUSTOMERS.find(c => c.id === rawId);
  }

  if (match) {
    return {
      id: match.id,
      name: match.name,
      category: match.category || (typeof rawCustomer === 'object' && rawCustomer.category) || 'Caterer',
      location: getCustomerLocation(match) || 'Local',
      phone: match.phone || match.ownerPhone || ''
    };
  }

  return {
    id: rawId || ('anon_' + effectiveName.toLowerCase().replace(/[^a-z0-9]/g, '_')),
    name: effectiveName || 'Customer',
    category: (typeof rawCustomer === 'object' && rawCustomer.category) ? rawCustomer.category : 'Caterer',
    location: (typeof rawCustomer === 'object') ? getCustomerLocation(rawCustomer) : 'Local',
    phone: cleanP || rawPhone || ''
  };
}

function runManualCustomerDeduplication() {
  const initialCount = customers.length;
  if (typeof normalizeOrderCustomerNames === 'function') {
    normalizeOrderCustomerNames();
  }
  const cleaned = resetCustomersToPreNovemberSales(true);
  const diff = initialCount - cleaned.length;

  customers = cleaned;
  saveDataToStorage();
  populateCustomerDropdown();
  renderCustomersList();
  updateDashboard();

  if (diff > 0) {
    showNotification(`✓ ${diff} manual duplicate customer(s) cleaned up & synced with pre-November sales!`);
    alert(`Success!\n\n${diff} manual duplicate customer(s) have been cleaned up.\nCustomer directory is now 100% unified with your verified pre-November sales.`);
  } else {
    showNotification('✓ Customer directory is completely verified & matched with pre-November sales!');
  }
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

  const seenIds = new Set();
  const seenNames = new Set();
  customers.forEach(c => {
    if (!c || !c.name) return;
    const normName = c.name.trim().toLowerCase();
    if (seenIds.has(c.id) || seenNames.has(normName)) return;
    seenIds.add(c.id);
    seenNames.add(normName);

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
    const custInfo = getCanonicalCustomerInfo(order.customer);
    const selectedCustIdEl = document.getElementById('selectedCustomerId');
    if (selectedCustIdEl) selectedCustIdEl.value = custInfo.id || '';
    const custName = custInfo.name;
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
          productName: it.productName,
          bagSize: parseFloat(it.bagSize) || defaultRememberedBagSize,
          bagQty: parseFloat(it.bagQty) || 1,
          perKgRate: parseFloat(it.perKgRate) || 95
        });
      });
    } else {
      addOrderItemRow({
        productId: order.product?.id || 'p1',
        productName: order.product?.name || order.productName,
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
  let currentProd = null;
  if (itemData) {
    // 1. Resolve canonical product first
    const canon = getCanonicalProduct(itemData);
    if (canon) {
      currentProd = products.find(p => p.id === canon.id || (p.name || '').trim().toLowerCase() === canon.name.toLowerCase());
      if (!currentProd) {
        currentProd = { ...canon };
        products.push(currentProd);
        deduplicateProductsList(products, false);
      }
    } else {
      if (itemData.productId) {
        currentProd = products.find(p => p.id === itemData.productId);
      }
      if (!currentProd && itemData.productName) {
        const pNameLower = itemData.productName.trim().toLowerCase();
        currentProd = products.find(p => (p.name || '').trim().toLowerCase() === pNameLower);
      }
      // Never create a product from aggregate strings like "(+1 more)" or dummy sample names
      const pName = (itemData.productName || '').trim();
      const isAggregate = pName.includes('(+') || pName.includes('more)');
      if (!currentProd && pName && !isAggregate && !isUnwantedDummyProduct({ name: pName })) {
        currentProd = {
          id: itemData.productId || ('prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
          name: pName,
          category: detectCategoryFromName(pName),
          bagSize: parseFloat(itemData.bagSize) || 26,
          defaultRateKg: parseFloat(itemData.perKgRate) || 90
        };
        products.push(currentProd);
        saveDataToStorage();
        populateProductDropdown();
        if (typeof renderProductsManageList === 'function') renderProductsManageList();
      }
    }
  }

  if (!currentProd) {
    currentProd = products[0] || USER_CONFIRMED_PRODUCTS[0];
  }

  const prodId = currentProd.id;
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
    productName: currentProd.name,
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
      const isSelected = (p.id === item.productId) || (item.productName && p.name.trim().toLowerCase() === item.productName.trim().toLowerCase());
      return `<option value="${p.id}" ${isSelected ? 'selected' : ''}>${cat}${escapeHtml(p.name)}${star} (₹${p.defaultRateKg}/kg${bag})</option>`;
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
  if (currentProd) {
    orderItems[index].productName = currentProd.name;
    if (currentProd.bagSize) {
      orderItems[index].bagSize = currentProd.bagSize;
    }
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

  const seenKeys = new Set();
  const uniqueMatches = [];
  matches.forEach(c => {
    if (!c || !c.name) return;
    const nameKey = c.name.trim().toLowerCase();
    const idKey = c.id || '';
    if (seenKeys.has(nameKey) || (idKey && seenKeys.has(idKey))) return;
    seenKeys.add(nameKey);
    if (idKey) seenKeys.add(idKey);
    uniqueMatches.push(c);
  });

  uniqueMatches.slice(0, 8).forEach(c => {
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
  const custIdEl = document.getElementById('selectedCustomerId');
  if (custIdEl) custIdEl.value = '';
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

  const selectedCustIdEl = document.getElementById('selectedCustomerId');
  if (selectedCustIdEl) selectedCustIdEl.value = cust.id;

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

  // Pre-populate existing customer details if editing or customer exists
  const selectedCustId = document.getElementById('selectedCustomerId')?.value || '';
  let cust = null;
  if (selectedCustId && Array.isArray(customers)) {
    cust = customers.find(c => c.id === selectedCustId);
  }
  if (!cust && currentName && Array.isArray(customers)) {
    const lower = currentName.toLowerCase();
    cust = customers.find(c => c.name && c.name.trim().toLowerCase() === lower);
  }

  if (cust) {
    const catEl = document.getElementById('customerCategory');
    if (catEl && cust.category) catEl.value = cust.category;

    const dist = getCustomerDistrict(cust);
    const distEl = document.getElementById('orderDistrictSelect');
    if (distEl && dist) {
      distEl.value = dist;
      if (typeof onOrderDistrictChange === 'function') onOrderDistrictChange(dist);
    }

    const townEl = document.getElementById('orderTownInput');
    if (townEl && getCustomerTown(cust)) townEl.value = getCustomerTown(cust);

    const lmEl = document.getElementById('orderLandmarkInput');
    if (lmEl && getCustomerLandmark(cust)) lmEl.value = getCustomerLandmark(cust);

    const panEl = document.getElementById('orderPanchayathInput');
    if (panEl && getCustomerPanchayath(cust)) panEl.value = getCustomerPanchayath(cust);

    const ownerNameEl = document.getElementById('customerOwnerName');
    if (ownerNameEl && cust.ownerName) ownerNameEl.value = cust.ownerName;

    const ownerPhoneEl = document.getElementById('customerOwnerPhone');
    if (ownerPhoneEl && (cust.ownerPhone || cust.phone)) ownerPhoneEl.value = cust.ownerPhone || cust.phone;

    const staffNameEl = document.getElementById('customerStaffName');
    if (staffNameEl && cust.staffName) staffNameEl.value = cust.staffName;

    const staffRoleEl = document.getElementById('customerStaffRole');
    if (staffRoleEl && cust.staffRole) staffRoleEl.value = cust.staffRole;

    const staffPhoneEl = document.getElementById('customerStaffPhone');
    if (staffPhoneEl && cust.staffPhone) staffPhoneEl.value = cust.staffPhone;
  }

  // Ensure modal is strictly displayed in foreground above orderModal
  modal.style.zIndex = '75';
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

    let existingIndex = -1;
    const selectedCustId = document.getElementById('selectedCustomerId')?.value || '';
    if (selectedCustId) {
      existingIndex = customers.findIndex(c => c.id === selectedCustId);
    }
    if (existingIndex === -1) {
      const lowerQuick = quickName.toLowerCase();
      existingIndex = customers.findIndex(c => c.name && c.name.trim().toLowerCase() === lowerQuick);
    }
    if (existingIndex === -1 && (ownerPhone || staffPhone)) {
      existingIndex = customers.findIndex(c => {
        const cOwn = cleanPhoneNumber(c.ownerPhone);
        const cStf = cleanPhoneNumber(c.staffPhone);
        const cP = cleanPhoneNumber(c.phone);
        if (ownerPhone && (cOwn === ownerPhone || cP === ownerPhone || cStf === ownerPhone)) return true;
        if (staffPhone && (cStf === staffPhone || cOwn === staffPhone || cP === staffPhone)) return true;
        return false;
      });
    }

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
      const selectedCustIdEl = document.getElementById('selectedCustomerId');
      if (selectedCustIdEl) selectedCustIdEl.value = customers[existingIndex].id;
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
      removeCustomerTombstone(quickName);
      customers.push(newCust);
      syncCloudCustomer(newCust);
      const selectedCustIdEl = document.getElementById('selectedCustomerId');
      if (selectedCustIdEl) selectedCustIdEl.value = newCust.id;
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
  let activeCustomerId = document.getElementById('selectedCustomerId')?.value || '';
  let existingIndex = -1;

  if (customerName) {
    const cleanLower = customerName.trim().toLowerCase();
    const aliasInfo = typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined' && CANONICAL_CUSTOMER_ALIASES[cleanLower];
    if (aliasInfo) {
      customerName = aliasInfo.canonicalName;
      if (!customerTown || customerTown === 'Ernakulam' || customerTown === 'Local') {
        customerTown = aliasInfo.town;
      }
    }
  }

  if (activeCustomerId) {
    existingIndex = customers.findIndex(c => c.id === activeCustomerId);
  }
  if (existingIndex === -1 && customerName) {
    const cleanLower = customerName.trim().toLowerCase();
    existingIndex = customers.findIndex(c => c.name && c.name.trim().toLowerCase() === cleanLower);
  }
  if (existingIndex === -1 && (cleanOwnerPhone || cleanStaffPhone)) {
    existingIndex = customers.findIndex(c => {
      const cOwn = cleanPhoneNumber(c.ownerPhone);
      const cStf = cleanPhoneNumber(c.staffPhone);
      const cPh = cleanPhoneNumber(c.phone);
      return (cleanOwnerPhone && (cOwn === cleanOwnerPhone || cPh === cleanOwnerPhone)) ||
             (cleanStaffPhone && (cStf === cleanStaffPhone || cPh === cleanStaffPhone));
    });
  }

  let finalCustomerId = activeCustomerId;

  if (existingIndex === -1) {
    if (shouldSaveCust && customerName) {
      finalCustomerId = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      const newCust = {
        id: finalCustomerId,
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
      removeCustomerTombstone(customerName);
      customers.push(newCust);
      saveDataToStorage();
      syncCloudCustomer(newCust);
      populateCustomerDropdown();
      populateSavedAreasDatalists();
    }
  } else {
    finalCustomerId = customers[existingIndex].id;
    if (shouldSaveCust) {
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

    const prod = products.find(p => p.id === item.productId) ||
                 products.find(p => item.productName && (p.name || '').trim().toLowerCase() === item.productName.trim().toLowerCase()) ||
                 { name: item.productName || 'Biriyani Rice' };

    return {
      productId: item.productId || prod.id || 'p1',
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
          id: finalCustomerId || (prevOrder.customer && prevOrder.customer.id) || ('c_' + Date.now()),
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
        id: finalCustomerId || ('c_' + Date.now()),
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
      dispatchStatus: 'Pending',
      deliveryNote: '',
      deliveredAt: null,
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
  switchMainView('monthly-history');
}

function closeMonthlyHistoryModal() {
  switchMainView('overview');
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
  switchMainView('overview');
  setFilterSpecificMonth(year, monthIndex);
  showNotification(`Viewing ${MONTH_NAMES_FULL[monthIndex]} ${year} sales & incentives`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function printInvoice() {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('printing-history', 'printing-dashboard');
    document.body.classList.add('printing-invoice');
  }
  try {
    window.print();
  } finally {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.body.classList.remove('printing-invoice');
      }, 1000);
    }
  }
}

function printMonthlyHistory() {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('printing-invoice', 'printing-dashboard');
    document.body.classList.add('printing-history');
  }
  try {
    window.print();
  } finally {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.body.classList.remove('printing-history');
      }, 1000);
    }
  }
}

function printDashboardReport() {
  if (typeof document !== 'undefined') {
    document.body.classList.remove('printing-invoice', 'printing-history');
    document.body.classList.add('printing-dashboard');
  }
  try {
    window.print();
  } finally {
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        document.body.classList.remove('printing-dashboard');
      }, 1000);
    }
  }
}

// Global browser print event listeners for auto-detecting print intent (e.g. Ctrl+P)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeprint', () => {
    const invoiceModal = document.getElementById('invoiceModal');
    const monthlyView = document.getElementById('viewMonthlyHistory') || document.getElementById('monthlyHistoryModal');

    if (invoiceModal && !invoiceModal.classList.contains('hidden')) {
      document.body.classList.add('printing-invoice');
      document.body.classList.remove('printing-history', 'printing-dashboard');
    } else if (monthlyView && !monthlyView.classList.contains('hidden')) {
      document.body.classList.add('printing-history');
      document.body.classList.remove('printing-invoice', 'printing-dashboard');
    } else {
      document.body.classList.add('printing-dashboard');
      document.body.classList.remove('printing-invoice', 'printing-history');
    }
  });

  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-invoice', 'printing-history', 'printing-dashboard');
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

    // 5.1 Update Sidebar & Mobile Order Count Badge
    const sideBadge = document.getElementById('sidebarOrderCountBadge');
    if (sideBadge) sideBadge.textContent = orders.length;
    const mobileBadge = document.getElementById('mobileOrderCountBadge');
    if (mobileBadge) {
      mobileBadge.textContent = orders.length;
      if (orders.length > 0) mobileBadge.classList.remove('hidden');
      else mobileBadge.classList.add('hidden');
    }

    // 6. Update Leaderboards if view is open
    const lbView = document.getElementById('viewLeaderboard') || document.getElementById('leaderboardModal');
    if (lbView && !lbView.classList.contains('hidden')) {
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
  const seenOrderIds = new Set();

  (filteredOrders || []).forEach(o => {
    if (!o || typeof o !== 'object') return;
    if (o.isCancelled || o.status === 'Cancelled' || o.status === 'cancelled' ||
        o.dispatchStatus === 'Cancelled' || o.dispatchStatus === 'cancelled' ||
        o.deliveryStatus === 'Cancelled' || o.deliveryStatus === 'cancelled' ||
        o.isDeleted || o.deleted) {
      return;
    }
    if (o.id) {
      if (seenOrderIds.has(o.id)) return;
      seenOrderIds.add(o.id);
    }

    const info = getCanonicalCustomerInfo(o.customer);
    const key = (info.id && !info.id.startsWith('anon_')) ? info.id : ('cust_' + info.name.toLowerCase().trim());
    if (!customerMap[key]) {
      customerMap[key] = {
        name: info.name,
        id: info.id || null,
        kg: 0
      };
    }
    const oKg = parseFloat(o.totalKg) || (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0) : 0);
    customerMap[key].kg += oKg;
  });

  const sorted = Object.values(customerMap).sort((a, b) => b.kg - a.kg).slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="text-xs text-slate-400 py-3 text-center">No orders in period</p>';
    return;
  }

  container.innerHTML = '';
  sorted.forEach((itemData, idx) => {
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
        <span class="font-bold text-slate-800 truncate">${escapeHtml(itemData.name)}</span>
      </div>
      <span class="font-black text-blue-600 shrink-0">${Math.round(itemData.kg).toLocaleString('en-IN')} kg</span>
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

// ==================== RESPONSIVE MOBILE NAVIGATION (BOTTOM BAR & MORE DRAWER) ====================

let activeMobileTab = 'home'; // 'home', 'orders', 'customers', 'incentives', 'more'

function updateBottomNavActiveTab(tabName) {
  activeMobileTab = tabName || 'home';
  const tabIds = ['home', 'orders', 'customers', 'incentives', 'more'];

  tabIds.forEach(t => {
    const btn = document.getElementById(`tabBtn${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (!btn) return;

    if (t === activeMobileTab) {
      // Active tab: vibrant indigo accent for icon, label and soft pill background
      btn.className = 'bottom-nav-tab flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 text-indigo-600 bg-indigo-50/70 font-bold active:scale-95';
    } else {
      // Inactive tab: subtle muted gray
      btn.className = 'bottom-nav-tab flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-150 text-slate-400 hover:text-slate-600 font-medium active:scale-95';
    }
  });

  // Sync mobile orders count badge with total orders
  const mobileBadge = document.getElementById('mobileOrderCountBadge');
  const desktopBadge = document.getElementById('sidebarOrderCountBadge');
  if (mobileBadge) {
    const count = orders ? orders.length : 0;
    mobileBadge.textContent = count;
    if (count > 0) {
      mobileBadge.classList.remove('hidden');
    } else {
      mobileBadge.classList.add('hidden');
    }
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

let drawerCloseTimeout = null;

function handleBottomNavClick(tabName) {
  if (tabName === 'more') {
    toggleMobileMoreDrawer();
    return;
  }
  closeMobileMoreDrawer();
  if (tabName === 'home') {
    switchMainView('overview');
  } else if (tabName === 'orders') {
    switchMainView('sales-register');
  } else if (tabName === 'customers') {
    switchMainView('customers');
  } else if (tabName === 'incentives') {
    switchMainView('incentives');
  }
}

function openMobileMoreDrawer() {
  if (drawerCloseTimeout) {
    clearTimeout(drawerCloseTimeout);
    drawerCloseTimeout = null;
  }
  const overlay = document.getElementById('mobileMoreDrawerOverlay');
  const drawer = document.getElementById('mobileMoreDrawer');
  if (!drawer || !overlay) return;

  overlay.classList.remove('hidden', 'opacity-0');
  overlay.classList.add('opacity-100');
  drawer.classList.remove('hidden', 'translate-y-full');
  drawer.classList.add('translate-y-0');

  updateBottomNavActiveTab('more');

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeMobileMoreDrawer() {
  if (drawerCloseTimeout) {
    clearTimeout(drawerCloseTimeout);
    drawerCloseTimeout = null;
  }
  const overlay = document.getElementById('mobileMoreDrawerOverlay');
  const drawer = document.getElementById('mobileMoreDrawer');
  if (!drawer || !overlay) return;

  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0');
  drawer.classList.remove('translate-y-0');
  drawer.classList.add('translate-y-full');

  drawerCloseTimeout = setTimeout(() => {
    overlay.classList.add('hidden');
    drawer.classList.add('hidden');
    drawerCloseTimeout = null;
  }, 300);

  // Restore active tab to current main view
  if (currentMainView === 'overview') {
    updateBottomNavActiveTab('home');
  } else if (currentMainView === 'sales-register') {
    updateBottomNavActiveTab('orders');
  } else if (currentMainView === 'customers') {
    updateBottomNavActiveTab('customers');
  } else if (currentMainView === 'incentives') {
    updateBottomNavActiveTab('incentives');
  } else {
    updateBottomNavActiveTab('more');
  }
}

function toggleMobileMoreDrawer() {
  const drawer = document.getElementById('mobileMoreDrawer');
  if (drawer && !drawer.classList.contains('hidden') && !drawer.classList.contains('translate-y-full')) {
    closeMobileMoreDrawer();
  } else {
    openMobileMoreDrawer();
  }
}

function closeAllOpenModals() {
  const modalIds = [
    'customerDetailModal',
    'editTownModal',
    'trashModal',
    'safeConfirmModal',
    'shareDeliveryModal',
    'orderModal',
    'invoiceModal'
  ];
  modalIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.classList.contains('hidden')) {
      el.classList.add('hidden');
    }
  });
}

// ==================== MAIN VIEW SWITCHING (OVERVIEW vs SALES REGISTER) ====================

let currentMainView = 'overview'; // 'overview' or 'sales-register'

function switchMainView(viewName, subTab) {
  currentMainView = viewName || 'overview';

  // If navigating away from Customers or if clicking main Customers nav button, reset profile view state
  if (currentMainView !== 'customers' || subTab !== 'profile') {
    if (typeof closeCustomerProfile === 'function' && currentMainView !== 'customers') {
      currentProfileCustomerId = null;
      const profContainer = document.getElementById('customerProfileContainer');
      const dirContainer = document.getElementById('customersDirectoryContainer');
      if (profContainer) profContainer.classList.add('hidden');
      if (dirContainer) dirContainer.classList.remove('hidden');
    }
  }

  const viewIds = [
    'viewOverview',
    'viewSalesRegister',
    'viewCustomers',
    'viewIncentives',
    'viewMonthlyHistory',
    'viewLeaderboard',
    'viewSettings',
    'viewViews'
  ];

  viewIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  const targetViewMap = {
    'overview': 'viewOverview',
    'sales-register': 'viewSalesRegister',
    'customers': 'viewCustomers',
    'incentives': 'viewIncentives',
    'monthly-history': 'viewMonthlyHistory',
    'leaderboard': 'viewLeaderboard',
    'settings': 'viewSettings',
    'views': 'viewViews'
  };

  const targetViewId = targetViewMap[currentMainView] || 'viewOverview';
  const targetViewEl = document.getElementById(targetViewId);
  if (targetViewEl) {
    targetViewEl.classList.remove('hidden');
  }

  // Header Title & Subtitle
  const mainTitle = document.getElementById('mainViewHeaderTitle');
  const mainSubtitle = document.getElementById('mainViewHeaderSubtitle');
  const titlesMap = {
    'overview': { title: 'OVERVIEW', subtitle: 'Performance at a Glance' },
    'sales-register': { title: 'SALES REGISTER', subtitle: 'Order Entries & Dispatch Ledger' },
    'customers': { title: 'CUSTOMERS DIRECTORY', subtitle: 'Wholesale Buyers & Contact Management' },
    'incentives': { title: 'INCENTIVE SCHEME', subtitle: 'Slab Unlocks & Turnover Calculations' },
    'monthly-history': { title: 'MONTHLY SALES & INCENTIVES', subtitle: 'Multi-Month Performance & Annual Ledger' },
    'leaderboard': { title: 'SALES LEADERBOARDS', subtitle: 'Live Rankings & Category Champions' },
    'settings': { title: 'SETTINGS & ADMINISTRATION', subtitle: 'System Configuration, Products & Backups' },
    'views': { title: 'VIEWS & PORTALS', subtitle: 'Staff Delivery Portals & External Access' }
  };
  const info = titlesMap[currentMainView] || titlesMap['overview'];
  if (mainTitle) mainTitle.textContent = info.title;
  if (mainSubtitle) mainSubtitle.textContent = info.subtitle;

  // Toggle Date / Period Filter Controls in Top Bar
  const isDateView = (currentMainView === 'overview' || currentMainView === 'sales-register');
  const mainPeriodControls = document.getElementById('mainPeriodFilterControls');
  const periodIndicator = document.getElementById('activePeriodIndicator');
  const topMonthlyBtn = document.getElementById('topBtnMonthlyHistory');
  const customRangeBtn = document.getElementById('btnToggleCustomRange');
  const printBtn = document.getElementById('topBtnPrintDashboard');

  if (mainPeriodControls) {
    if (isDateView) mainPeriodControls.classList.remove('hidden');
    else mainPeriodControls.classList.add('hidden');
  }
  if (periodIndicator) {
    if (isDateView) periodIndicator.classList.remove('hidden');
    else periodIndicator.classList.add('hidden');
  }
  if (topMonthlyBtn) {
    if (isDateView) topMonthlyBtn.classList.remove('hidden');
    else topMonthlyBtn.classList.add('hidden');
  }
  if (customRangeBtn) {
    if (isDateView) customRangeBtn.classList.remove('hidden');
    else customRangeBtn.classList.add('hidden');
  }
  if (printBtn) {
    if (isDateView) printBtn.classList.remove('hidden');
    else printBtn.classList.add('hidden');
  }

  // Update Desktop Left Sidebar Nav Buttons
  const sidebarButtons = [
    { id: 'navBtnOverview', view: 'overview' },
    { id: 'navBtnSalesRegister', view: 'sales-register' },
    { id: 'navBtnCustomers', view: 'customers' },
    { id: 'navBtnLeaderboard', view: 'leaderboard' },
    { id: 'navBtnMonthlyHistory', view: 'monthly-history' },
    { id: 'navBtnProducts', view: 'settings', subTab: 'products' },
    { id: 'navBtnIncentives', view: 'incentives' },
    { id: 'navBtnViews', view: 'views' },
    { id: 'navBtnSettings', view: 'settings' }
  ];

  sidebarButtons.forEach(btnObj => {
    const btn = document.getElementById(btnObj.id);
    if (!btn) return;
    let isActive = false;
    if (btnObj.id === 'navBtnProducts') {
      isActive = (currentMainView === 'settings' && subTab === 'products');
    } else if (btnObj.id === 'navBtnSettings') {
      isActive = (currentMainView === 'settings' && subTab !== 'products');
    } else {
      isActive = (currentMainView === btnObj.view);
    }

    if (isActive) {
      btn.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-md shadow-blue-600/30 transition group cursor-pointer';
    } else {
      btn.className = 'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition group cursor-pointer';
    }
  });

  // Close Mobile More Drawer if open
  closeMobileMoreDrawer();

  // Mobile Bottom Navigation Sync
  let mobileTab = 'more';
  if (currentMainView === 'overview') mobileTab = 'home';
  else if (currentMainView === 'sales-register') mobileTab = 'orders';
  else if (currentMainView === 'customers') mobileTab = 'customers';
  else if (currentMainView === 'incentives') mobileTab = 'incentives';
  updateBottomNavActiveTab(mobileTab);

  // Trigger View-Specific Renderers
  if (currentMainView === 'sales-register') {
    renderOrdersTable();
  } else if (currentMainView === 'customers') {
    cancelEditCustomer();
    renderCustomersList();
  } else if (currentMainView === 'monthly-history') {
    populateFilterYearSelect();
    const historyYearSelect = document.getElementById('historyYearSelect');
    const targetYear = historyYearSelect ? parseInt(historyYearSelect.value, 10) || filterSelectedYear : filterSelectedYear;
    renderMonthlyHistoryList(targetYear);
  } else if (currentMainView === 'leaderboard') {
    renderLeaderboard();
  } else if (currentMainView === 'settings') {
    cancelProductEdit();
    setSettingsTab(subTab || 'towns');
  } else if (currentMainView === 'incentives') {
    const dateInput = document.getElementById('schemeEffectiveDateInput');
    if (dateInput && !dateInput.value) {
      dateInput.value = incentiveSchemeEffectiveDate || '2026-05-01';
    }
    const filteredOrders = getFilteredOrders();
    const totalKg = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.totalKg) || 0), 0);
    updateIncentiveCard(filteredOrders, totalKg);
  }

  try {
    localStorage.setItem('biriyani_rice_active_view', currentMainView);
  } catch (e) {}

  window.scrollTo({ top: 0, behavior: 'smooth' });

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
  const mobileBadge = document.getElementById('mobileOrderCountBadge');
  if (mobileBadge) {
    mobileBadge.textContent = orders.length;
    if (orders.length > 0) mobileBadge.classList.remove('hidden');
    else mobileBadge.classList.add('hidden');
  }

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

    let rateDisplay = '';
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
      rateDisplay = `<span class="font-bold text-slate-900 text-xs">₹${items[0].perKgRate}</span><span class="text-[10px] text-slate-400 font-normal">/kg</span>`;
    } else {
      itemsHtml = `
        <div class="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>${escapeHtml(items[0].productName)}</span>
          ${specialBrandTag}
          <span class="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[9px] font-black">+${items.length - 1} more</span>
        </div>
        <div class="text-[10px] text-slate-600 mt-1 space-y-1">
          ${items.map(it => `
            <div class="flex items-center justify-between gap-2 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              <span class="font-semibold text-slate-800 truncate">${escapeHtml(it.productName)}:</span>
              <span class="text-slate-600 whitespace-nowrap">${it.bagQty} bags (${it.bagSize}kg)</span>
            </div>
          `).join('')}
        </div>
      `;
      rateDisplay = `
        <div class="space-y-1 text-right">
          ${items.map(it => {
            const shortName = (it.productName || 'Rice').split(' ')[0];
            return `
              <div class="text-[11px] whitespace-nowrap flex items-center justify-end gap-1">
                <span class="text-[10px] text-slate-400 font-normal truncate max-w-[85px]">${escapeHtml(shortName)}:</span>
                <span class="font-bold text-slate-900">₹${it.perKgRate}</span><span class="text-[9px] text-slate-400 font-normal">/kg</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    const totalBagsCount = (o.bagQty !== undefined) ? o.bagQty : items.reduce((s, i) => s + (i.bagQty || 0), 0);

    const isUrgent = (o.deliveryStatus === 'Urgent');
    let dispatchBadgeHtml = '';
    if (o.dispatchStatus === 'Delivered') {
      dispatchBadgeHtml = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200" title="Delivered: ${escapeHtml(o.deliveredAt || '')}">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
        Delivered
      </span>`;
    } else if (o.dispatchStatus === 'OutForDelivery') {
      dispatchBadgeHtml = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
        <span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        Out for Delivery
      </span>`;
    } else {
      dispatchBadgeHtml = `<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
        Pending
      </span>`;
    }

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center gap-1.5">
          <div class="font-mono font-bold text-blue-700 text-xs">${escapeHtml(o.id)}</div>
          ${isUrgent ? '<span class="px-1 py-0.2 rounded text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200">Urgent</span>' : ''}
        </div>
        <div class="text-[11px] text-slate-500 font-medium">${escapeHtml(o.date)}</div>
        <div class="mt-1">${dispatchBadgeHtml}</div>
      </td>
      <td class="px-4 py-3">
        <div class="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">${escapeHtml(getCustomerName(o.customer))}</div>
        ${o.notes ? `
          <div class="text-[10px] text-slate-500 mt-0.5 flex items-start gap-1 max-w-[260px]">
            <span class="font-semibold text-slate-700 shrink-0">📝 Note:</span>
            <span class="truncate" title="${escapeHtml(o.notes)}">${escapeHtml(o.notes)}</span>
          </div>
        ` : ''}
        ${o.deliveryNote ? `
          <div class="text-[10px] text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded border border-emerald-200 mt-1 flex items-start gap-1 max-w-[260px]">
            <span class="font-bold shrink-0">🚚 Staff:</span>
            <span class="truncate" title="${escapeHtml(o.deliveryNote)}">${escapeHtml(o.deliveryNote)}</span>
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
  const isUrgent = (String(order.deliveryStatus || '').toLowerCase() === 'urgent');
  const deliveryStatusText = isUrgent ? '⚡ Delivery: URGENT' : '🚚 Delivery: NORMAL';
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

  const maxNameLen = Math.max(...items.map(it => (it.productName || '').length), 10);
  const itemsText = items.map(it => {
    const qty = it.bagQty || 0;
    const pName = (it.productName || 'Biriyani Rice').padEnd(maxNameLen + 2, ' ');
    return `🌾 ${pName} × ${qty} Bags`;
  }).join('\n');

  const noteText = (order.notes && order.notes.trim()) ? order.notes.trim() : '-';

  const message =
`🛒 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━

🆔 Order ID: ${orderId}
${deliveryStatusText}

👤 Customer: ${customerName}

📦 *ITEMS*

${itemsText}

━━━━━━━━━━━━━━━━━━
🛍️ Total: ${totalBags} Bags
━━━━━━━━━━━━━━━━━━

📝 Note: ${noteText}`;

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

// ==================== STAFF DELIVERY PORTAL SHARING ====================

function getDeliveryPortalUrl() {
  if (window.location.protocol === 'file:') {
    return 'delivery.html';
  }
  const url = new URL('delivery.html', window.location.href);
  return url.href;
}

function openShareDeliveryModal() {
  const modal = document.getElementById('shareDeliveryModal');
  const input = document.getElementById('deliveryPortalUrlInput');
  if (!modal) return;

  const portalUrl = getDeliveryPortalUrl();
  if (input) {
    input.value = portalUrl;
  }

  modal.classList.remove('hidden');
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function closeShareDeliveryModal() {
  const modal = document.getElementById('shareDeliveryModal');
  if (modal) modal.classList.add('hidden');
}

function copyDeliveryPortalLink() {
  const input = document.getElementById('deliveryPortalUrlInput');
  const copyBtnText = document.getElementById('copyDeliveryBtnText');
  const url = input ? input.value : getDeliveryPortalUrl();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy Link';
      }, 2500);
      showNotification('Delivery Portal Link copied!');
    }).catch(() => {
      fallbackCopyText(url);
    });
  } else {
    fallbackCopyText(url);
  }
}

function fallbackCopyText(text) {
  const temp = document.createElement('textarea');
  temp.value = text;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand('copy');
  document.body.removeChild(temp);
  showNotification('Delivery Portal Link copied!');
}

function shareDeliveryPortalWhatsApp() {
  const portalUrl = getDeliveryPortalUrl();
  const text =
`🚚 *THIRD MAN - DELIVERY & DISPATCH PORTAL*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Delivery portal link for shop and delivery vehicle staff:
${portalUrl}

✅ Open link to view assigned orders and update delivery status.`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}

// ==================== VIEWS & PORTALS HUB ====================

function openViewsModal() {
  switchMainView('views');
}

function closeViewsModal() {
  switchMainView('overview');
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
  switchMainView('incentives');
}

function closeIncentiveDetails() {
  switchMainView('overview');
}

// ==================== SETTINGS (MASTER DATA, TOWNS & PRODUCTS) MODAL ====================

let currentSettingsTab = 'towns';

function updateSettingsDataTab() {
  const count = trashList ? trashList.length : 0;
  const countBadge = document.getElementById('settingsTrashCountBadge');
  if (countBadge) {
    countBadge.textContent = `${count} ${count === 1 ? 'Item' : 'Items'} in Bin`;
    if (count > 0) {
      countBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300';
    } else {
      countBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  const subText = document.getElementById('settingsTrashSubtext');
  if (subText) {
    subText.textContent = count > 0
      ? `${count} items safely preserved in trash. You can restore them anytime.`
      : 'Recycle Bin is currently empty. Deleted orders, customers or products will appear here.';
  }

  // Check safety snapshot
  const snapshotNotice = document.getElementById('settingsSnapshotNotice');
  if (snapshotNotice) {
    const rawSnap = localStorage.getItem(STORAGE_SAFETY_SNAPSHOT);
    if (rawSnap) {
      snapshotNotice.classList.remove('hidden');
    } else {
      snapshotNotice.classList.add('hidden');
    }
  }
}

function updateSchemeEffectiveDateFromSettings() {
  const input = document.getElementById('settingsSchemeEffectiveDateInput');
  if (!input || !input.value) {
    showNotification('Please select a valid date');
    return;
  }
  updateSchemeEffectiveDate(input.value);
  showNotification(`Incentive scheme start date updated to ${formatSchemeDate(input.value)}`);
}

// ==================== DASHBOARD SECURITY PIN LOCK ====================
const STORAGE_SECURITY_PIN = 'third_man_security_pin_v1';
const STORAGE_SECURITY_ENABLED = 'third_man_security_enabled_v1';
const STORAGE_PIN_UNLOCKED = 'third_man_pin_unlocked_v1';

let enteredPin = '';

function getSecurityPin() {
  try {
    return localStorage.getItem(STORAGE_SECURITY_PIN) || '1234';
  } catch (e) {
    return '1234';
  }
}

function isSecurityEnabled() {
  try {
    return localStorage.getItem(STORAGE_SECURITY_ENABLED) !== 'false';
  } catch (e) {
    return true;
  }
}

function isDashboardUnlocked() {
  if (!isSecurityEnabled()) return true;
  try {
    return sessionStorage.getItem(STORAGE_PIN_UNLOCKED) === 'true' ||
           localStorage.getItem(STORAGE_PIN_UNLOCKED) === 'true';
  } catch (e) {
    return false;
  }
}

function updatePinDots() {
  for (let i = 0; i < 4; i++) {
    const dot = document.getElementById(`pinDot${i}`);
    if (dot) {
      if (i < enteredPin.length) {
        dot.className = 'w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-400 shadow-md shadow-cyan-400/50 scale-110 transition-all duration-150';
      } else {
        dot.className = 'w-4 h-4 rounded-full border-2 border-slate-600 bg-slate-800 transition-all duration-150';
      }
    }
  }
}

function enterPinDigit(digit) {
  if (enteredPin.length < 6) {
    enteredPin += String(digit);
    updatePinDots();
    const errEl = document.getElementById('pinErrorMessage');
    if (errEl) errEl.textContent = '';

    if (enteredPin.length === 4) {
      setTimeout(() => {
        submitPinUnlock();
      }, 150);
    }
  }
}

function backspacePinDigit() {
  if (enteredPin.length > 0) {
    enteredPin = enteredPin.slice(0, -1);
    updatePinDots();
    const errEl = document.getElementById('pinErrorMessage');
    if (errEl) errEl.textContent = '';
  }
}

function clearPin() {
  enteredPin = '';
  updatePinDots();
  const errEl = document.getElementById('pinErrorMessage');
  if (errEl) errEl.textContent = '';
}

function submitPinUnlock() {
  const correctPin = getSecurityPin();
  const errEl = document.getElementById('pinErrorMessage');
  const overlay = document.getElementById('appSecurityLockOverlay');
  const dotsWrapper = document.getElementById('pinDotsWrapper');

  if (enteredPin === correctPin) {
    try {
      sessionStorage.setItem(STORAGE_PIN_UNLOCKED, 'true');
      const remCheck = document.getElementById('pinRememberMeCheckbox');
      if (remCheck && remCheck.checked) {
        localStorage.setItem(STORAGE_PIN_UNLOCKED, 'true');
      } else {
        localStorage.removeItem(STORAGE_PIN_UNLOCKED);
      }
    } catch (e) {}

    if (overlay) {
      overlay.classList.add('transition-opacity', 'duration-300', 'opacity-0');
      setTimeout(() => {
        overlay.classList.add('hidden');
        overlay.classList.remove('opacity-0');
        overlay.style.display = 'none';
      }, 300);
    }

    clearPin();
    if (typeof showNotification === 'function') {
      showNotification('✓ Dashboard Unlocked!');
    }
  } else {
    if (errEl) {
      errEl.textContent = 'Incorrect PIN! Please try again.';
    }
    if (dotsWrapper) {
      dotsWrapper.classList.add('animate-bounce');
      setTimeout(() => dotsWrapper.classList.remove('animate-bounce'), 500);
    }
    if (navigator.vibrate) {
      try { navigator.vibrate(200); } catch (e) {}
    }
    setTimeout(() => {
      clearPin();
    }, 600);
  }
}

function lockDashboard() {
  try {
    sessionStorage.removeItem(STORAGE_PIN_UNLOCKED);
    localStorage.removeItem(STORAGE_PIN_UNLOCKED);
  } catch (e) {}

  clearPin();
  const overlay = document.getElementById('appSecurityLockOverlay');
  if (overlay) {
    overlay.classList.remove('hidden', 'opacity-0');
    overlay.style.display = 'flex';
  }

  const closeSettings = document.getElementById('settingsModal');
  if (closeSettings) closeSettings.classList.add('hidden');

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
  if (typeof showNotification === 'function') {
    showNotification('Dashboard Locked.');
  }
}

let pinKeydownAttached = false;
function initSecurityLock() {
  const overlay = document.getElementById('appSecurityLockOverlay');
  if (!overlay) return;

  if (isDashboardUnlocked()) {
    overlay.classList.add('hidden');
    overlay.style.display = 'none';
  } else {
    overlay.classList.remove('hidden');
    overlay.style.display = 'flex';
    clearPin();
  }

  if (!pinKeydownAttached) {
    pinKeydownAttached = true;
    window.addEventListener('keydown', (e) => {
      const lockOverlay = document.getElementById('appSecurityLockOverlay');
      if (lockOverlay && !lockOverlay.classList.contains('hidden') && lockOverlay.style.display !== 'none') {
        if (e.key >= '0' && e.key <= '9') {
          e.preventDefault();
          enterPinDigit(e.key);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          backspacePinDigit();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          submitPinUnlock();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          clearPin();
        }
      }
    });
  }
}

function handleSaveNewPin() {
  const curInput = document.getElementById('inputCurrentPin');
  const newInput = document.getElementById('inputNewPin');
  const confInput = document.getElementById('inputConfirmPin');

  const curVal = curInput ? curInput.value.trim() : '';
  const newVal = newInput ? newInput.value.trim() : '';
  const confVal = confInput ? confInput.value.trim() : '';

  const activePin = getSecurityPin();

  if (curVal !== activePin) {
    alert('Current PIN is incorrect! (Default is 1234)');
    if (curInput) curInput.focus();
    return;
  }

  if (newVal.length < 4) {
    alert('New PIN must be at least 4 digits!');
    if (newInput) newInput.focus();
    return;
  }

  if (newVal !== confVal) {
    alert('New PIN and Confirm PIN do not match!');
    if (confInput) confInput.focus();
    return;
  }

  try {
    localStorage.setItem(STORAGE_SECURITY_PIN, newVal);
  } catch (e) {}

  if (curInput) curInput.value = '';
  if (newInput) newInput.value = '';
  if (confInput) confInput.value = '';

  updateSettingsSecurityTab();
  showNotification('✓ Security PIN changed successfully!');
}

function onSecurityToggleChange(enabled) {
  try {
    localStorage.setItem(STORAGE_SECURITY_ENABLED, enabled ? 'true' : 'false');
  } catch (e) {}
  updateSettingsSecurityTab();
  showNotification(enabled ? 'PIN Lock Enabled' : 'PIN Lock Disabled');
}

function updateSettingsSecurityTab() {
  const toggle = document.getElementById('settingsSecurityLockToggle');
  const badge = document.getElementById('securityStatusBadge');
  const enabled = isSecurityEnabled();

  if (toggle) toggle.checked = enabled;
  if (badge) {
    if (enabled) {
      badge.textContent = 'ACTIVE';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300';
    } else {
      badge.textContent = 'DISABLED';
      badge.className = 'px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-300';
    }
  }
}

function setSettingsTab(tabName) {
  currentSettingsTab = tabName || 'towns';
  if (currentSettingsTab === 'general') currentSettingsTab = 'data';

  const tabTowns = document.getElementById('settingsTabContent-towns');
  const tabProducts = document.getElementById('settingsTabContent-products');
  const tabIncentive = document.getElementById('settingsTabContent-incentive');
  const tabBranding = document.getElementById('settingsTabContent-branding');
  const tabData = document.getElementById('settingsTabContent-data');
  const tabSecurity = document.getElementById('settingsTabContent-security');

  const btnTowns = document.getElementById('settingsTabBtn-towns');
  const btnProducts = document.getElementById('settingsTabBtn-products');
  const btnIncentive = document.getElementById('settingsTabBtn-incentive');
  const btnBranding = document.getElementById('settingsTabBtn-branding');
  const btnData = document.getElementById('settingsTabBtn-data');
  const btnSecurity = document.getElementById('settingsTabBtn-security');

  const allTabs = [tabTowns, tabProducts, tabIncentive, tabBranding, tabData, tabSecurity];
  const allBtns = [btnTowns, btnProducts, btnIncentive, btnBranding, btnData, btnSecurity];

  // Reset tab button styles
  allBtns.forEach(btn => {
    if (btn) {
      btn.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-white text-slate-600 hover:text-slate-900 border border-slate-200';
    }
  });

  // Hide all contents
  allTabs.forEach(tab => {
    if (tab) tab.classList.add('hidden');
  });

  if (currentSettingsTab === 'towns') {
    if (tabTowns) tabTowns.classList.remove('hidden');
    if (btnTowns) btnTowns.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    renderSettingsTownsList();
  } else if (currentSettingsTab === 'products') {
    if (tabProducts) tabProducts.classList.remove('hidden');
    if (btnProducts) btnProducts.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    populateBagSizesDropdown();
    renderProductsManageList();
    renderBagSizesBadges();
  } else if (currentSettingsTab === 'incentive') {
    if (tabIncentive) tabIncentive.classList.remove('hidden');
    if (btnIncentive) btnIncentive.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    const dateInput = document.getElementById('settingsSchemeEffectiveDateInput');
    if (dateInput) dateInput.value = incentiveSchemeEffectiveDate || '2026-05-01';
  } else if (currentSettingsTab === 'branding') {
    if (tabBranding) tabBranding.classList.remove('hidden');
    if (btnBranding) btnBranding.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
  } else if (currentSettingsTab === 'data') {
    if (tabData) tabData.classList.remove('hidden');
    if (btnData) btnData.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    updateSettingsDataTab();
  } else if (currentSettingsTab === 'security') {
    if (tabSecurity) tabSecurity.classList.remove('hidden');
    if (btnSecurity) btnSecurity.className = 'settings-tab-btn px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 bg-blue-600 text-white shadow-xs';
    updateSettingsSecurityTab();
  }

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

function openSettingsModal(initialTab = 'towns') {
  switchMainView('settings', initialTab);
}

function closeSettingsModal() {
  cancelProductEdit();
  switchMainView('overview');
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
  ['all', 'Kaima', 'Kolam', 'Basmati', 'Other'].forEach(cat => {
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
  if (bagSelect) {
    const targetBag = parseFloat(prod.bagSize) || 26;
    let found = false;
    for (let i = 0; i < bagSelect.options.length; i++) {
      if (parseFloat(bagSelect.options[i].value) === targetBag) {
        found = true;
        break;
      }
    }
    if (!found) {
      const opt = document.createElement('option');
      opt.value = targetBag;
      opt.textContent = `${targetBag} kg ${targetBag >= 50 ? 'Sack' : 'Bag'}`;
      bagSelect.appendChild(opt);
    }
    bagSelect.value = targetBag;
  }
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
    alert('Please enter a product name (e.g. Mohabbath Green, White Chabi).');
    if (nameInput) nameInput.focus();
    return;
  }

  if (isNaN(rate) || rate <= 0) {
    alert('Please enter a valid rate per kg (₹).');
    if (rateInput) rateInput.focus();
    return;
  }

  // Ensure this bagSize is included in global bagSizes
  if (!bagSizes.includes(bagSize)) {
    bagSizes.push(bagSize);
    bagSizes.sort((a, b) => a - b);
    try {
      localStorage.setItem(STORAGE_BAG_SIZES, JSON.stringify(bagSizes));
      localStorage.setItem('biriyani_rice_bag_sizes_fresh_v2', JSON.stringify(bagSizes));
    } catch (e) {}
    populateBagSizesDropdown();
    if (typeof renderBagSizesBadges === 'function') renderBagSizesBadges();
  }

  if (editingId) {
    // EDIT EXISTING PRODUCT
    const index = products.findIndex(p => p.id === editingId);
    if (index !== -1) {
      const oldProd = { ...products[index] };
      const oldName = oldProd.name;

      products[index].name = name;
      products[index].category = category;
      products[index].bagSize = bagSize;
      products[index].defaultRateKg = rate;
      products[index].isCustomized = true;
      products[index].updatedAt = Date.now();
      if (imageUrl) {
        products[index].imageUrl = imageUrl;
      } else if (imgInput && imgInput.dataset.removed === 'true') {
        products[index].imageUrl = '';
      }

      // ONLY cascade to orders if the product NAME changed (historical rates, bag sizes & totals are strictly protected)
      let ordersUpdated = 0;
      if (oldName && oldName.trim().toLowerCase() !== name.toLowerCase()) {
        ordersUpdated = cascadeProductUpdateToOrders(editingId, oldName, products[index]);
      }

      saveDataToStorage();
      if (typeof syncCloudConfig === 'function') syncCloudConfig();
      populateProductDropdown();
      renderProductsManageList();
      cancelProductEdit();
      updateDashboard();
      if (typeof renderOrdersTable === 'function') renderOrdersTable();

      const orderNote = ordersUpdated > 0 ? ` (${ordersUpdated} past order labels updated)` : '';
      showNotification(`Product '${name}' updated successfully!${orderNote}`);
    }
  } else {
    // Check if product with same name already exists to prevent duplicate creation
    const existingIndex = products.findIndex(p => (p.name || '').trim().toLowerCase() === name.toLowerCase());
    if (existingIndex !== -1) {
      const oldProd = { ...products[existingIndex] };
      products[existingIndex].category = category;
      products[existingIndex].bagSize = bagSize;
      products[existingIndex].defaultRateKg = rate;
      products[existingIndex].isCustomized = true;
      products[existingIndex].updatedAt = Date.now();
      if (imageUrl) {
        products[existingIndex].imageUrl = imageUrl;
      } else if (imgInput && imgInput.dataset.removed === 'true') {
        products[existingIndex].imageUrl = '';
      }

      saveDataToStorage();
      if (typeof syncCloudConfig === 'function') syncCloudConfig();
      populateProductDropdown();
      renderProductsManageList();
      cancelProductEdit();
      updateDashboard();
      if (typeof renderOrdersTable === 'function') renderOrdersTable();

      showNotification(`Product '${name}' updated successfully!`);
      return;
    }

    // ADD NEW PRODUCT
    const newProduct = {
      id: 'p_' + Date.now(),
      name: name,
      category: category,
      bagSize: bagSize,
      defaultRateKg: rate,
      imageUrl: imageUrl || '',
      isCustomized: true,
      updatedAt: Date.now()
    };

    products.push(newProduct);
    saveDataToStorage();
    if (typeof syncCloudConfig === 'function') syncCloudConfig();
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
      recordDeletedProductKey(removed.id, removed.name);
      products = products.filter(p => p.id !== prodId);
      saveDataToStorage();
      populateProductDropdown();
      renderProductsManageList();
      if (typeof syncCloudConfig === 'function') syncCloudConfig();

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
  switchMainView('customers');
}

function closeCustomersModal() {
  cancelEditCustomer();
  switchMainView('overview');
}

function handleCustomerFormSubmit(event) {
  event.preventDefault();
  try {
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
      let idx = customers.findIndex(c => c.id === editId);
      if (idx === -1) {
        // Fallback: search by name
        idx = customers.findIndex(c => c.name && c.name.trim().toLowerCase() === name.trim().toLowerCase());
      }

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

        // Keep members in sync if owner or staff contact fields were updated
        if (Array.isArray(customers[idx].members)) {
          if (ownerName || cleanOwnerPhone) {
            const ownerMember = customers[idx].members.find(m => m.role === 'Owner' || m.isPrimary);
            if (ownerMember) {
              if (ownerName) ownerMember.name = ownerName;
              if (cleanOwnerPhone) ownerMember.phone = cleanOwnerPhone;
            }
          }
          if (staffName || cleanStaffPhone) {
            const staffMember = customers[idx].members.find(m => m.role === staffRole || m.role === 'Chef / Cook' || m.role === 'Staff');
            if (staffMember) {
              if (staffName) staffMember.name = staffName;
              if (staffRole) staffMember.role = staffRole;
              if (cleanStaffPhone) staffMember.phone = cleanStaffPhone;
            }
          }
        }

        // Also update customer references in existing orders if name or contact changed
        orders.forEach(o => {
          if (!o || !o.customer) return;
          const matchesPrev = (typeof o.customer === 'object' && o.customer.id && o.customer.id === editId) ||
                              (getCustomerName(o.customer).trim().toLowerCase() === prevName.trim().toLowerCase());
          if (matchesPrev) {
            if (typeof o.customer === 'object') {
              o.customer.id = editId;
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
            } else if (typeof o.customer === 'string') {
              o.customer = name;
            }
          }
        });

        saveDataToStorage();
        if (customers[idx]) syncCloudCustomer(customers[idx]);
        populateCustomerDropdown();
        populateSavedAreasDatalists();
        cancelEditCustomer();
        renderCustomersList();
        updateDashboard();
        showNotification(`Customer '${name}' updated successfully!`);
      } else {
        // Fallback: customer was somehow not found, save as new entry
        const fallbackCust = {
          id: editId || ('c_' + Date.now()),
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
        customers.push(fallbackCust);
        saveDataToStorage();
        syncCloudCustomer(fallbackCust);
        populateCustomerDropdown();
        populateSavedAreasDatalists();
        cancelEditCustomer();
        renderCustomersList();
        updateDashboard();
        showNotification(`Customer '${name}' saved!`);
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
      removeCustomerTombstone(name);
      customers.push(newCust);

      saveDataToStorage();
      syncCloudCustomer(newCust);
      populateCustomerDropdown();
      populateSavedAreasDatalists();
      renderCustomersList();
      cancelEditCustomer();

      showNotification(`Customer '${name}' added!`);
    }
  } catch (err) {
    console.error('Error submitting customer form:', err);
    showNotification('Error saving customer: ' + (err.message || 'Unknown error'));
  }
}

function handleAddNewCustomer(event) {
  handleCustomerFormSubmit(event);
}

function editCustomerFromDetail() {
  if (!activeDetailCustomerId) return;
  const custId = activeDetailCustomerId;
  closeCustomerDetailModal();
  openCustomersModal();
  setTimeout(() => {
    editCustomer(custId);
  }, 100);
}

function editCustomer(customerId) {
  try {
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
      formCard.classList.remove('hidden', 'bg-blue-50/60', 'border-blue-200/70', 'border-blue-400/80');
      formCard.classList.add('bg-amber-50/80', 'border-amber-300', 'ring-2', 'ring-amber-300/40');
      formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const custFormCard = document.getElementById('customerFormCard');
    if (custFormCard) {
      custFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    nameInput?.focus();
  } catch (err) {
    console.error('Error opening customer edit form:', err);
  }
}

function openAddCustomerForm() {
  cancelEditCustomer();
  const formCard = document.getElementById('customerFormCard');
  const titleText = document.getElementById('custFormTitleText');
  const submitText = document.getElementById('custSubmitText');
  const cancelBtn = document.getElementById('custCancelEditBtn');
  const nameInput = document.getElementById('custNameInput');

  if (titleText) titleText.textContent = 'Add New Customer';
  if (submitText) submitText.textContent = 'Save Customer';
  if (cancelBtn) cancelBtn.classList.remove('hidden');

  if (formCard) {
    formCard.classList.remove('hidden', 'bg-amber-50/80', 'border-amber-300', 'ring-2', 'ring-amber-300/40');
    formCard.classList.add('bg-white', 'border-blue-400/80');
    formCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  nameInput?.focus();

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
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
    formCard.classList.add('hidden');
    formCard.classList.remove('bg-amber-50/80', 'border-amber-300', 'ring-2', 'ring-amber-300/40');
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

  const seenIds = new Set();
  const seenNames = new Set();
  const uniqueFiltered = [];
  filtered.forEach(c => {
    if (!c || !c.name) return;
    const norm = c.name.trim().toLowerCase();
    if (seenIds.has(c.id) || seenNames.has(norm)) return;
    seenIds.add(c.id);
    seenNames.add(norm);
    uniqueFiltered.push(c);
  });

  if (countBadge) countBadge.textContent = customers.length;
  if (filteredBadge) {
    const isFilterActive = (customerDistrictFilter !== 'all' || customerTownFilter !== 'all' || customerAreaFilter !== 'all' || customerCategoryFilter !== 'all');
    if (!isFilterActive) {
      filteredBadge.textContent = `${uniqueFiltered.length} customers`;
    } else {
      filteredBadge.textContent = `${uniqueFiltered.length} of ${customers.length}`;
    }
  }

  container.innerHTML = '';

  if (uniqueFiltered.length === 0) {
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

  uniqueFiltered.forEach(c => {
    const custOrders = orders.filter(o => {
      if (!o || !o.customer) return false;
      if (typeof o.customer === 'object' && o.customer.id && o.customer.id === c.id) return true;
      return getCustomerName(o.customer).trim().toLowerCase() === c.name.trim().toLowerCase();
    });
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
          <button type="button" onclick="openCustomerProfile('${c.id}')" class="font-bold text-slate-900 text-xs hover:text-blue-600 hover:underline flex items-center gap-1 text-left" title="Click to view Customer Profile &amp; Complete Order History">
            <span>${escapeHtml(c.name)}</span>
            <i data-lucide="chevron-right" class="w-3.5 h-3.5 text-blue-500"></i>
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
        <button type="button" onclick="openCustomerProfile('${c.id}')" title="View Detailed Customer Profile &amp; Complete Order History" class="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg transition inline-flex items-center gap-1.5 border border-indigo-200/70 shadow-2xs active:scale-95">
          <i data-lucide="user-check" class="w-3.5 h-3.5"></i>
          <span>Profile &amp; Orders</span>
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

  const custOrders = (Array.isArray(orders) ? orders : []).filter(o => {
    if (!o || !o.customer) return false;
    const oName = (typeof o.customer === 'string' ? o.customer : (o.customer.name || '')).trim().toLowerCase();
    const oId = (typeof o.customer === 'object' && o.customer.id) ? o.customer.id : '';
    return (customerId && oId === customerId) || (cust.name && oName === cust.name.trim().toLowerCase());
  });

  const orderWarning = custOrders.length > 0
    ? `<br><br><span class="text-amber-600 text-xs font-semibold">ℹ️ This customer has ${custOrders.length} existing order(s). Their order history will remain preserved in sales records, but this customer profile will be moved to the Recycle Bin.</span>`
    : '';

  showConfirmModal({
    title: `Delete Customer: ${cust.name}?`,
    message: `Move customer <strong>${escapeHtml(cust.name)}</strong> (${escapeHtml(cust.category || 'Customer')}) to the Recycle Bin?${orderWarning}`,
    hint: '🛡️ Customer details will be safely preserved in the Recycle Bin and can be restored anytime.',
    confirmText: 'Move to Recycle Bin',
    confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
    onConfirm: () => {
      const editId = document.getElementById('custEditId')?.value;
      if (editId === customerId) {
        cancelEditCustomer();
      }

      const removed = cust;
      // 1. Add Tombstone so cloud sync or order scans will NEVER resurrect this customer
      addCustomerTombstone(removed);

      // 2. Remove from active customers list
      customers = customers.filter(c => c.id !== customerId && c.name?.trim().toLowerCase() !== removed.name?.trim().toLowerCase());
      saveDataToStorage();

      // 3. Robust Cloud Deletion (by doc ID AND by query)
      deleteCloudCustomer(customerId, removed.name);

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

function deleteCustomerFromDetail() {
  if (!activeDetailCustomerId) return;
  const custId = activeDetailCustomerId;
  closeCustomerDetailModal();
  deleteCustomer(custId);
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
  // If not explicitly opening the team member form, open the clean inline Customer Profile page view!
  if (!openAddFormImmediately) {
    openCustomerProfile(customerId);
    return;
  }

  const cust = customers.find(c => c.id === customerId);
  if (!cust) return;

  activeDetailCustomerId = cust.id;

  // Initialize members array if not already initialized
  if (!Array.isArray(cust.members)) {
    cust.members = getCustomerMembers(cust);
    saveDataToStorage();
    if (typeof syncCloudCustomer === 'function') {
      syncCloudCustomer(cust);
    }
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
  const custOrders = orders.filter(o => {
    if (!o || !o.customer) return false;
    if (typeof o.customer === 'object' && o.customer.id && o.customer.id === cust.id) return true;
    return getCustomerName(o.customer).trim().toLowerCase() === cust.name.trim().toLowerCase();
  });
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
  if (typeof syncCloudCustomer === 'function') {
    syncCloudCustomer(cust);
  }
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
      if (typeof syncCloudCustomer === 'function') {
        syncCloudCustomer(cust);
      }
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

// ==================== DATA BACKUP & RESTORE ====================

function exportDataJSON() {
  const exportPayload = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    schemeEffectiveDate: incentiveSchemeEffectiveDate,
    orders: orders,
    products: products,
    bagSizes: bagSizes,
    customers: customers,
    savedDistrictTowns: savedDistrictTowns,
    savedAreas: savedAreas
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `third_man_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showNotification('Backup JSON exported successfully!');
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
        // Smart Merge: Preserve any existing orders (like manual November orders) while adding incoming
        const incomingIds = new Set(data.orders.map(o => o.id));
        const preservedExisting = orders.filter(o => o && o.id && !incomingIds.has(o.id));
        const merged = [...data.orders, ...preservedExisting];
        merged.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
        orders = merged;
        if (typeof normalizeOrderCustomerNames === 'function') {
          normalizeOrderCustomerNames();
        }
        restoredOrders = orders.length;
      }
      if (Array.isArray(data.customers)) {
        // Preserve existing customer records (phones, members) and append new historical customers
        const existingByName = new Map();
        customers.forEach(c => {
          if (c && c.name) existingByName.set(c.name.trim().toLowerCase(), c);
        });

        data.customers.forEach(incCust => {
          if (!incCust || !incCust.name) return;
          const rawLower = incCust.name.trim().toLowerCase();
          const alias = typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined' && CANONICAL_CUSTOMER_ALIASES[rawLower];
          if (alias) {
            incCust.name = alias.canonicalName;
            if (!incCust.town || incCust.town === 'Ernakulam' || incCust.town === 'Local') incCust.town = alias.town;
          }
          const key = incCust.name.trim().toLowerCase();
          if (!existingByName.has(key)) {
            customers.push(incCust);
            existingByName.set(key, incCust);
          } else {
            const target = existingByName.get(key);
            if (!target.category && incCust.category) target.category = incCust.category;
            if (!target.town && incCust.town) target.town = incCust.town;
          }
        });

        if (typeof deduplicateCustomersList === 'function') {
          customers = deduplicateCustomersList(customers, true);
        }
        restoredCustomers = customers.length;
      }
      if (Array.isArray(data.products) && data.products.length > 0) {
        products = deduplicateProductsList([...products, ...data.products], true);
      }
      if (Array.isArray(data.bagSizes) && data.bagSizes.length > 0) {
        bagSizes = data.bagSizes;
      }
      if (data.savedDistrictTowns && typeof data.savedDistrictTowns === 'object') {
        savedDistrictTowns = data.savedDistrictTowns;
        try {
          localStorage.setItem(STORAGE_SAVED_TOWNS, JSON.stringify(savedDistrictTowns));
        } catch (err) {}
      }
      if (Array.isArray(data.savedAreas)) {
        savedAreas = data.savedAreas;
        try {
          localStorage.setItem(STORAGE_SAVED_AREAS, JSON.stringify(savedAreas));
        } catch (err) {}
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
      populateSavedAreasDatalists();
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

// Sample and demo data generation is permanently disabled to safeguard official business data.
function seedInitialDemoData() {
  console.warn("Sample data generation is permanently disabled. Only official records are permitted.");
}

function loadSampleDemoData() {
  console.warn("Sample data generation is permanently disabled. Only official records are permitted.");
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
  const sideSettingsIndicator = document.getElementById('settingsTrashCountIndicator');
  const topBadge = document.getElementById('topTrashCountBadge');
  const modalBadge = document.getElementById('trashModalTotalBadge');
  const settingsBadge = document.getElementById('settingsTrashCountBadge');

  if (sideBadge) {
    sideBadge.textContent = count;
    if (count > 0) sideBadge.classList.remove('hidden');
    else sideBadge.classList.add('hidden');
  }

  if (sideSettingsIndicator) {
    sideSettingsIndicator.textContent = count;
    if (count > 0) sideSettingsIndicator.classList.remove('hidden');
    else sideSettingsIndicator.classList.add('hidden');
  }

  if (topBadge) {
    topBadge.textContent = count;
    if (count > 0) topBadge.classList.remove('hidden');
    else topBadge.classList.add('hidden');
  }

  if (modalBadge) {
    modalBadge.textContent = `${count} ${count === 1 ? 'Item' : 'Items'}`;
  }

  if (settingsBadge) {
    settingsBadge.textContent = `${count} ${count === 1 ? 'Item' : 'Items'} in Bin`;
    if (count > 0) {
      settingsBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300';
    } else {
      settingsBadge.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200';
    }
  }

  const subText = document.getElementById('settingsTrashSubtext');
  if (subText) {
    subText.textContent = count > 0
      ? `${count} items safely preserved in trash. You can restore them anytime.`
      : 'Recycle Bin is currently empty. Deleted orders, customers or products will appear here.';
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
    removeCustomerTombstone(item.data.name, item.data.id);
    const exists = customers.some(c => c.id === item.data.id || (c.name && c.name.trim().toLowerCase() === (item.data.name || '').trim().toLowerCase()));
    if (!exists) {
      customers.push(item.data);
    }
    saveDataToStorage();
    syncCloudCustomer(item.data);
    populateCustomerDropdown();
    renderCustomersList();
    showNotification(`✓ Customer '${item.data.name}' restored!`);

  } else if (item.type === 'product') {
    const exists = products.some(p => p.id === item.data.id);
    if (!exists) {
      products.push(item.data);
    }
    unrecordDeletedProductKey(item.data.id, item.data.name);
    saveDataToStorage();
    populateProductDropdown();
    renderProductsManageList();
    if (typeof syncCloudConfig === 'function') syncCloudConfig();
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
          removeCustomerTombstone(item.data.name, item.data.id);
          if (!customers.some(c => c.id === item.data.id || (c.name && c.name.trim().toLowerCase() === (item.data.name || '').trim().toLowerCase()))) {
            customers.push(item.data);
            syncCloudCustomer(item.data);
          }
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
    hint: '⚠️ This will permanently remove the item from local storage and cloud.',
    confirmText: 'Delete Permanently',
    confirmClass: 'bg-rose-700 hover:bg-rose-800 text-white',
    onConfirm: () => {
      const item = trashList.find(t => t.trashId === trashId);
      if (item && item.type === 'customer' && item.data) {
        addCustomerTombstone(item.data);
        deleteCloudCustomer(item.data.id, item.data.name);
      }
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
      trashList.forEach(item => {
        if (item && item.type === 'customer' && item.data) {
          addCustomerTombstone(item.data);
          deleteCloudCustomer(item.data.id, item.data.name);
        }
      });
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
window.openAddCustomerForm = openAddCustomerForm;
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
window.updateSchemeEffectiveDateFromSettings = updateSchemeEffectiveDateFromSettings;
window.updateSettingsDataTab = updateSettingsDataTab;
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
window.setFilterPeriod = setFilterPeriod;
window.purgeUnwantedDummyProducts = purgeUnwantedDummyProducts;
window.restoreProductsFromOrdersHistory = restoreProductsFromOrdersHistory;
// ==================== SALES LEADERBOARDS ====================

let leaderboardPeriod = 'all'; // 'all', 'month', 'week', 'today'
let leaderboardActiveTab = 'customers'; // 'customers', 'products', 'champions', 'locations', 'milestones'
let leaderboardCustomerMetric = 'kg'; // 'kg', 'revenue', 'orders'

function openLeaderboardModal() {
  switchMainView('leaderboard');
}

function closeLeaderboardModal() {
  switchMainView('overview');
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
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentDate = String(now.getDate()).padStart(2, '0');
  const todayStr = `${currentYear}-${currentMonth}-${currentDate}`;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const seenOrderIds = new Set();

  return (orders || []).filter(order => {
    // 1. Must be a valid object
    if (!order || typeof order !== 'object') return false;

    // 2. Exclude cancelled, deleted or invalid orders
    if (order.isCancelled === true ||
        order.status === 'Cancelled' || order.status === 'cancelled' ||
        order.dispatchStatus === 'Cancelled' || order.dispatchStatus === 'cancelled' ||
        order.deliveryStatus === 'Cancelled' || order.deliveryStatus === 'cancelled' ||
        order.isDeleted === true || order.deleted === true) {
      return false;
    }

    // 3. Exclude duplicate order IDs so every order is counted exactly once
    if (order.id) {
      if (seenOrderIds.has(order.id)) return false;
      seenOrderIds.add(order.id);
    }

    // 4. Must have a valid date for period filtering
    if (!order.date) {
      return leaderboardPeriod === 'all';
    }

    const orderDateStr = String(order.date).split('T')[0];

    if (leaderboardPeriod === 'today') {
      return orderDateStr === todayStr;
    } else if (leaderboardPeriod === 'week') {
      const orderDate = new Date(orderDateStr);
      return !isNaN(orderDate.getTime()) && orderDate >= sevenDaysAgo;
    } else if (leaderboardPeriod === 'month') {
      return orderDateStr.startsWith(`${currentYear}-${currentMonth}`);
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
    const info = getCanonicalCustomerInfo(o.customer);
    // Group strictly by canonical ID or canonical normalized name
    const key = (info.id && !info.id.startsWith('anon_')) ? info.id : ('cust_' + info.name.toLowerCase().trim());
    if (!map[key]) {
      map[key] = {
        name: info.name,
        id: info.id || null,
        category: info.category || 'Caterer',
        location: info.location || 'Local',
        phone: info.phone || '',
        totalKg: 0,
        totalRevenue: 0,
        ordersCount: 0,
        lastDate: o.date
      };
    }

    // Safely parse numeric kg with fallback to items
    let oKg = parseFloat(o.totalKg);
    if (isNaN(oKg) || oKg <= 0) {
      if (Array.isArray(o.items) && o.items.length > 0) {
        oKg = o.items.reduce((sum, it) => sum + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0);
      } else {
        oKg = 0;
      }
    }

    // Safely parse numeric revenue with fallback to items
    let oAmt = parseFloat(o.totalAmount);
    if (isNaN(oAmt) || oAmt <= 0) {
      if (Array.isArray(o.items) && o.items.length > 0) {
        oAmt = o.items.reduce((sum, it) => {
          const itKg = parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0));
          return sum + (parseFloat(it.totalAmount) || (itKg * (parseFloat(it.perKgRate) || 0)));
        }, 0);
      } else {
        oAmt = 0;
      }
    }

    map[key].totalKg += oKg;
    map[key].totalRevenue += oAmt;
    map[key].ordersCount += 1;
    if (o.date && (!map[key].lastDate || o.date > map[key].lastDate)) {
      map[key].lastDate = o.date;
    }
  });

  const list = Object.values(map);

  if (leaderboardCustomerMetric === 'revenue') {
    list.sort((a, b) => b.totalRevenue - a.totalRevenue || b.totalKg - a.totalKg);
  } else if (leaderboardCustomerMetric === 'orders') {
    list.sort((a, b) => b.ordersCount - a.ordersCount || b.totalKg - a.totalKg);
  } else {
    list.sort((a, b) => b.totalKg - a.totalKg || b.totalRevenue - a.totalRevenue);
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
          <button type="button" onclick="openCustomerProfile('')" class="font-extrabold text-xs text-slate-900 hover:text-blue-600 hover:underline truncate max-w-full px-1 block" title="View Customer Profile">${escapeHtml(cust.name)}</button>
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
          <button type="button" onclick="openCustomerProfile('')" class="font-bold text-slate-900 text-xs hover:text-blue-600 hover:underline text-left inline-flex items-center gap-1" title="View Detailed Customer Profile &amp; Order History"><span>${escapeHtml(c.name)}</span><i data-lucide="chevron-right" class="w-3 h-3 text-blue-500"></i></button>
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
      const canon = (typeof getCanonicalProduct === 'function')
        ? (getCanonicalProduct(it) || getCanonicalProduct(it.productName))
        : null;
      const pName = canon ? canon.name : (it.productName || 'Rice Variety');
      const size = parseFloat(it.bagSize) || (canon?.bagSize) || 25;
      const qty = parseFloat(it.bagQty) || 0;
      const kg = parseFloat(it.totalKg) || (size * qty);
      const rate = parseFloat(it.perKgRate) || (canon?.defaultRateKg) || 0;
      const amt = parseFloat(it.totalAmount) || (kg * rate);

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
    const custMap = {};
    lbOrders.forEach(o => {
      const info = getCanonicalCustomerInfo(o.customer);
      const custCat = info.category || 'Caterer';
      if (custCat !== cat.key) return;

      const key = (info.id && !info.id.startsWith('anon_')) ? info.id : ('cust_' + info.name.toLowerCase().trim());
      if (!custMap[key]) {
        custMap[key] = {
          name: info.name,
          id: info.id || null,
          category: custCat,
          location: info.location,
          phone: info.phone,
          kg: 0,
          revenue: 0,
          orders: 0
        };
      }
      const oKg = parseFloat(o.totalKg) || (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0) : 0);
      const oRev = parseFloat(o.totalAmount) || (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (parseFloat(it.totalAmount) || 0), 0) : 0);
      custMap[key].kg += oKg;
      custMap[key].revenue += oRev;
      custMap[key].orders += 1;
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
          <h4 class="font-extrabold text-sm text-slate-900 leading-tight"><button type="button" onclick="openCustomerProfile('')" class="hover:text-blue-600 hover:underline text-left leading-tight">${escapeHtml(champion.name)}</button></h4>
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
    const info = getCanonicalCustomerInfo(o.customer);
    const kg = parseFloat(o.totalKg) || 0;
    const rev = parseFloat(o.totalAmount) || 0;

    if (!locMap[loc]) {
      locMap[loc] = { name: loc, kg: 0, revenue: 0, orders: 0, buyers: new Set() };
    }
    locMap[loc].kg += kg;
    locMap[loc].revenue += rev;
    locMap[loc].orders += 1;
    locMap[loc].buyers.add(info.name);
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

  const lbOrders = getLeaderboardOrders();
  const custMap = {};
  lbOrders.forEach(o => {
    const info = getCanonicalCustomerInfo(o.customer);
    const key = (info.id && !info.id.startsWith('anon_')) ? info.id : ('cust_' + info.name.toLowerCase().trim());
    if (!custMap[key]) {
      custMap[key] = {
        name: info.name,
        id: info.id || null,
        category: info.category || 'Caterer',
        location: info.location || 'Local',
        kg: 0,
        revenue: 0,
        orders: 0
      };
    }
    const oKg = parseFloat(o.totalKg) || (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0) : 0);
    const oRev = parseFloat(o.totalAmount) || (Array.isArray(o.items) ? o.items.reduce((s, it) => s + (parseFloat(it.totalAmount) || 0), 0) : 0);
    custMap[key].kg += oKg;
    custMap[key].revenue += oRev;
    custMap[key].orders += 1;
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
              <button type="button" onclick="openCustomerProfile('')" class="font-extrabold text-slate-900 hover:text-blue-600 hover:underline text-left">${escapeHtml(m.name)}</button>
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
      // Use uploaded-logo.png if present, fallback to logo.svg
      applyAppLogo('uploaded-logo.png', false);
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
      if (this.src && this.src.indexOf('uploaded-logo.png') !== -1) {
        this.src = DEFAULT_LOGO_URL;
      } else {
        this.onerror = null;
        this.src = EMBEDDED_DEFAULT_LOGO_SVG;
      }
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

    // Apple Touch Icon for iOS 'Add to Home Screen'
    // iOS Safari SpringBoard strictly requires a PNG/JPEG URL and completely fails on SVG or data: URIs.
    // Static apple-touch-icon.png in root provides the actual high-res solid brand photo.
    const appleTouchIcons = document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
    if (isCustom && logoUrl && !logoUrl.startsWith('data:') && !logoUrl.endsWith('.svg') && !logoUrl.includes('image/svg+xml')) {
      appleTouchIcons.forEach(link => {
        link.href = logoUrl;
      });
    } else {
      appleTouchIcons.forEach(link => {
        link.href = 'apple-touch-icon.png';
      });
    }
  } else {
    if (sidebarImg) sidebarImg.classList.add('hidden');
    if (sidebarFallback) sidebarFallback.classList.remove('hidden');

    if (invoiceImg) invoiceImg.classList.add('hidden');
    if (invoiceFallback) invoiceFallback.classList.remove('hidden');

    if (settingsImg) settingsImg.classList.add('hidden');
    if (settingsFallback) settingsFallback.classList.remove('hidden');

    const appleTouchIcons = document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
    appleTouchIcons.forEach(link => {
      link.href = 'apple-touch-icon.png';
    });
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
      const dataUrl = canvas.toDataURL('image/png');
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

function downloadAppLogoForHomeIcon() {
  let logoData = null;
  try {
    logoData = localStorage.getItem(STORAGE_APP_LOGO);
  } catch (e) {}

  if (!logoData) {
    // If not in localStorage, offer apple-touch-icon.png
    logoData = 'apple-touch-icon.png';
  }

  const a = document.createElement('a');
  a.href = logoData;
  a.download = 'apple-touch-icon.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showNotification('✓ apple-touch-icon.png downloaded!');
}

// Global Exports

// ==========================================
// 14. CUSTOMER PROFILE & COMPLETE ORDER HISTORY
// ==========================================

let currentProfileCustomerId = null;
let currentProfileOrders = [];

/**
 * Retrieves every order placed by a specific customer, accurately resolving
 * customer IDs, canonical names, aliases, and phone numbers.
 * Excludes cancelled or deleted orders by default.
 * Returns orders sorted in strict reverse-chronological order (newest first).
 */
function getCustomerOrders(customerOrId, includeCancelled = false) {
  if (!customerOrId) return [];
  const cust = (typeof customerOrId === 'string')
    ? (customers.find(c => c.id === customerOrId || (c.name && c.name.trim().toLowerCase() === customerOrId.trim().toLowerCase())) || { id: customerOrId, name: customerOrId })
    : customerOrId;

  const targetId = cust.id || null;
  const targetName = (cust.name || '').trim().toLowerCase();

  // Collect aliases
  const aliasNames = new Set();
  if (targetName) aliasNames.add(targetName);
  if (typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined') {
    for (const [alias, info] of Object.entries(CANONICAL_CUSTOMER_ALIASES)) {
      if (info && info.canonicalName && info.canonicalName.trim().toLowerCase() === targetName) {
        aliasNames.add(alias.trim().toLowerCase());
      }
    }
  }

  const cleanPhones = [
    cleanPhoneNumber(cust.phone),
    cleanPhoneNumber(cust.ownerPhone),
    cleanPhoneNumber(cust.staffPhone)
  ].filter(Boolean);

  const seenOrderIds = new Set();
  const matched = [];

  (orders || []).forEach(o => {
    if (!o || typeof o !== 'object') return;

    if (!includeCancelled) {
      if (o.isCancelled === true ||
          o.status === 'Cancelled' || o.status === 'cancelled' ||
          o.dispatchStatus === 'Cancelled' || o.dispatchStatus === 'cancelled' ||
          o.deliveryStatus === 'Cancelled' || o.deliveryStatus === 'cancelled' ||
          o.isDeleted === true || o.deleted === true) {
        return;
      }
    }

    // Exclude duplicates
    if (o.id) {
      if (seenOrderIds.has(o.id)) return;
      seenOrderIds.add(o.id);
    }

    let isMatch = false;

    // Match 1: By Customer ID
    if (targetId && o.customer && typeof o.customer === 'object' && o.customer.id && o.customer.id === targetId) {
      isMatch = true;
    }

    // Match 2: By Canonical customer info
    if (!isMatch) {
      const info = getCanonicalCustomerInfo(o.customer);
      if (info) {
        if (targetId && info.id && info.id === targetId) isMatch = true;
        else if (targetName && info.name && info.name.trim().toLowerCase() === targetName) isMatch = true;
      }
    }

    // Match 3: By raw order customer name or alias
    if (!isMatch) {
      const rawName = (typeof o.customer === 'object' ? (o.customer?.name || '') : String(o.customer || '')).trim().toLowerCase();
      if (rawName && (rawName === targetName || aliasNames.has(rawName))) {
        isMatch = true;
      }
    }

    // Match 4: By phone number
    if (!isMatch && cleanPhones.length > 0) {
      const oPhone = cleanPhoneNumber(typeof o.customer === 'object' ? (o.customer?.phone || o.customer?.ownerPhone || o.customer?.staffPhone) : '');
      if (oPhone && cleanPhones.includes(oPhone)) {
        isMatch = true;
      }
    }

    if (isMatch) {
      matched.push(o);
    }
  });

  // Strict reverse-chronological sorting (latest date and highest ID first)
  matched.sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.id || '').localeCompare(a.id || ''));
  return matched;
}

/**
 * Opens detailed Customer Profile inline page view
 */
function openCustomerProfile(customerId, openAddMemberImmediately = false) {
  if (!customerId) return;

  // Find customer by ID, or by name / alias
  let cust = customers.find(c => c.id === customerId);
  if (!cust && typeof customerId === 'string') {
    const cleanId = customerId.trim().toLowerCase();
    cust = customers.find(c => c.name && c.name.trim().toLowerCase() === cleanId);
    if (!cust && typeof CANONICAL_CUSTOMER_ALIASES !== 'undefined' && CANONICAL_CUSTOMER_ALIASES[cleanId]) {
      const canonName = CANONICAL_CUSTOMER_ALIASES[cleanId].canonicalName.toLowerCase();
      cust = customers.find(c => c.name && c.name.trim().toLowerCase() === canonName);
    }
    if (!cust && typeof PRE_NOVEMBER_CANONICAL_CUSTOMERS !== 'undefined') {
      cust = PRE_NOVEMBER_CANONICAL_CUSTOMERS.find(c => c.id === customerId || (c.name && c.name.trim().toLowerCase() === cleanId));
    }
  }

  if (!cust) {
    showNotification('Customer record not found.');
    return;
  }

  currentProfileCustomerId = cust.id;
  activeDetailCustomerId = cust.id;

  // Initialize members array if needed
  if (!Array.isArray(cust.members)) {
    cust.members = getCustomerMembers(cust);
  }

  // Switch to Customers view if not already there
  if (currentMainView !== 'customers') {
    switchMainView('customers', 'profile');
  }

  // Toggle containers: hide directory, show inline profile
  const dirContainer = document.getElementById('customersDirectoryContainer');
  const profContainer = document.getElementById('customerProfileContainer');
  if (dirContainer) dirContainer.classList.add('hidden');
  if (profContainer) profContainer.classList.remove('hidden');

  // Update header title
  const mainTitle = document.getElementById('mainViewHeaderTitle');
  const mainSubtitle = document.getElementById('mainViewHeaderSubtitle');
  if (mainTitle) mainTitle.textContent = 'CUSTOMER PROFILE';
  if (mainSubtitle) mainSubtitle.textContent = `${cust.name} • Complete Order History & Lifetime Value`;

  // Fetch all orders for this customer (excluding cancelled)
  currentProfileOrders = getCustomerOrders(cust, false);

  // Calculate lifetime totals
  const ordersCount = currentProfileOrders.length;
  let totalBags = 0;
  let totalKg = 0;
  let totalSpend = 0;

  currentProfileOrders.forEach(o => {
    let oKg = parseFloat(o.totalKg);
    let oBags = parseFloat(o.bagQty);
    let oAmt = parseFloat(o.totalAmount);

    if (Array.isArray(o.items) && o.items.length > 0) {
      if (isNaN(oKg) || oKg <= 0) {
        oKg = o.items.reduce((s, it) => s + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0);
      }
      if (isNaN(oBags) || oBags <= 0) {
        oBags = o.items.reduce((s, it) => s + (parseFloat(it.bagQty) || 0), 0);
      }
      if (isNaN(oAmt) || oAmt <= 0) {
        oAmt = o.items.reduce((s, it) => {
          const itemKg = parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0));
          return s + (parseFloat(it.totalAmount) || (itemKg * (parseFloat(it.perKgRate) || 0)));
        }, 0);
      }
    }

    totalBags += (oBags || 0);
    totalKg += (oKg || 0);
    totalSpend += (oAmt || 0);
  });

  const avgOrderValue = ordersCount > 0 ? Math.round(totalSpend / ordersCount) : 0;
  const lastOrderDate = ordersCount > 0 ? (currentProfileOrders[0].date || 'Recent') : 'No orders yet';

  // 1. Populate Customer Summary Header
  const nameEl = document.getElementById('cpCustomerName');
  const avatarEl = document.getElementById('cpAvatar');
  const catBadgeEl = document.getElementById('cpCategoryBadge');
  const milestoneBadgeEl = document.getElementById('cpMilestoneBadge');
  const locEl = document.getElementById('cpLocationText');
  const quickContactsEl = document.getElementById('cpQuickContactActions');

  if (nameEl) nameEl.textContent = cust.name;
  if (avatarEl) avatarEl.textContent = (cust.name || 'C').charAt(0).toUpperCase();
  if (catBadgeEl) catBadgeEl.innerHTML = getCustomerCategoryBadge(cust.category || 'Caterer');

  // Milestone tier badge
  if (milestoneBadgeEl) {
    if (totalKg >= 10000) {
      milestoneBadgeEl.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 border border-amber-300 shadow-2xs';
      milestoneBadgeEl.textContent = '💎 10 Ton Elite Club';
      milestoneBadgeEl.classList.remove('hidden');
    } else if (totalKg >= 5000) {
      milestoneBadgeEl.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200';
      milestoneBadgeEl.textContent = '🥇 5 Ton Champion';
      milestoneBadgeEl.classList.remove('hidden');
    } else if (totalKg >= 1000) {
      milestoneBadgeEl.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200';
      milestoneBadgeEl.textContent = '🥈 1 Ton Wholesaler';
      milestoneBadgeEl.classList.remove('hidden');
    } else {
      milestoneBadgeEl.className = 'text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200';
      milestoneBadgeEl.textContent = '🌱 Growing Buyer';
      milestoneBadgeEl.classList.remove('hidden');
    }
  }

  // Location Badges
  const cDist = getCustomerDistrict(cust);
  const cTown = getCustomerTown(cust);
  const cLandmark = getCustomerLandmark(cust);
  const cPanch = getCustomerPanchayath(cust);
  if (locEl) {
    let locHtml = [];
    if (cLandmark) locHtml.push(`<span class="inline-flex items-center gap-1 font-semibold text-slate-800"><i data-lucide="map-pin" class="w-3.5 h-3.5 text-rose-500"></i><span>${escapeHtml(cLandmark)}</span></span>`);
    if (cTown) locHtml.push(`<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">🏙️ ${escapeHtml(cTown)}${cDist && cDist.toLowerCase() !== cTown.toLowerCase() ? `, ${escapeHtml(cDist)}` : ''}</span>`);
    else if (cDist) locHtml.push(`<span class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">📍 ${escapeHtml(cDist)}</span>`);
    if (cPanch) locHtml.push(`<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">🏛️ ${escapeHtml(cPanch)}</span>`);
    locEl.innerHTML = locHtml.length > 0 ? locHtml.join(' ') : `<span class="text-slate-500">📍 ${escapeHtml(getCustomerLocation(cust))}</span>`;
  }

  // Quick contact links
  const primaryPhone = cust.ownerPhone || cust.phone || cust.staffPhone || '';
  if (quickContactsEl) {
    let btns = '';
    if (primaryPhone) {
      const clean = cleanPhoneNumber(primaryPhone);
      btns += `<a href="tel:${clean}" class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 transition inline-flex items-center gap-1.5 shadow-2xs active:scale-95"><i data-lucide="phone" class="w-3.5 h-3.5 text-emerald-600"></i><span>Call</span></a>`;
      btns += `<a href="https://wa.me/91${clean}" target="_blank" rel="noopener" class="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold rounded-xl border border-green-200 transition inline-flex items-center gap-1.5 shadow-2xs active:scale-95"><i data-lucide="message-circle" class="w-3.5 h-3.5 text-green-600"></i><span>WhatsApp</span></a>`;
    }
    quickContactsEl.innerHTML = btns;
  }

  // Owner box
  const ownerNameEl = document.getElementById('cpOwnerName');
  const ownerPhoneLinkEl = document.getElementById('cpOwnerPhoneLink');
  if (ownerNameEl) ownerNameEl.textContent = cust.ownerName || 'Not specified';
  if (ownerPhoneLinkEl) {
    if (cust.ownerPhone) {
      const clean = cleanPhoneNumber(cust.ownerPhone);
      ownerPhoneLinkEl.innerHTML = `<a href="tel:${clean}" class="font-mono text-blue-700 font-bold hover:underline inline-flex items-center gap-1"><i data-lucide="phone" class="w-3 h-3"></i><span>${escapeHtml(cust.ownerPhone)}</span></a>`;
    } else {
      ownerPhoneLinkEl.innerHTML = '<span class="text-slate-400 font-mono text-[10px]">No phone</span>';
    }
  }

  // Staff box
  const staffNameEl = document.getElementById('cpStaffName');
  const staffRoleLabelEl = document.getElementById('cpStaffRoleLabel');
  const staffPhoneLinkEl = document.getElementById('cpStaffPhoneLink');
  if (staffNameEl) staffNameEl.textContent = cust.staffName || 'Not specified';
  if (staffRoleLabelEl) staffRoleLabelEl.textContent = cust.staffRole || 'Staff In-Charge';
  if (staffPhoneLinkEl) {
    if (cust.staffPhone) {
      const clean = cleanPhoneNumber(cust.staffPhone);
      staffPhoneLinkEl.innerHTML = `<a href="tel:${clean}" class="font-mono text-indigo-700 font-bold hover:underline inline-flex items-center gap-1"><i data-lucide="phone" class="w-3 h-3"></i><span>${escapeHtml(cust.staffPhone)}</span></a>`;
    } else {
      staffPhoneLinkEl.innerHTML = '<span class="text-slate-400 font-mono text-[10px]">No phone</span>';
    }
  }

  // Notes box
  const notesTextEl = document.getElementById('cpNotesText');
  if (notesTextEl) notesTextEl.textContent = cust.notes && cust.notes.trim() ? cust.notes : 'No extra notes recorded';

  // 2. Metrics Cards
  const totalOrdersEl = document.getElementById('cpTotalOrders');
  const totalBagsEl = document.getElementById('cpTotalBags');
  const totalSpendEl = document.getElementById('cpTotalSpend');
  const avgOrderValEl = document.getElementById('cpAvgOrderValue');
  const totalKgEl = document.getElementById('cpTotalKg');
  const totalTonnesEl = document.getElementById('cpTotalTonnes');
  const lastOrderDateEl = document.getElementById('cpLastOrderDate');
  const activeStatusEl = document.getElementById('cpActiveStatus');

  if (totalOrdersEl) totalOrdersEl.textContent = `${ordersCount} Orders`;
  if (totalBagsEl) totalBagsEl.textContent = `${totalBags.toLocaleString('en-IN')} Bags`;
  if (totalSpendEl) totalSpendEl.textContent = `₹${Math.round(totalSpend).toLocaleString('en-IN')}`;
  if (avgOrderValEl) avgOrderValEl.textContent = ordersCount > 0 ? `₹${avgOrderValue.toLocaleString('en-IN')} / order` : '₹0 / order';
  if (totalKgEl) totalKgEl.textContent = `${totalKg.toLocaleString('en-IN')} kg`;
  if (totalTonnesEl) totalTonnesEl.textContent = `${(totalKg / 1000).toFixed(2)} Tonnes`;
  if (lastOrderDateEl) lastOrderDateEl.textContent = lastOrderDate;
  if (activeStatusEl) activeStatusEl.textContent = ordersCount > 0 ? 'Active Buyer 🟢' : 'New Account 🌱';

  // 3. Team Members Section
  renderProfileMembersList(cust);

  // 4. Complete Order History Section
  const searchInput = document.getElementById('cpOrderSearchInput');
  if (searchInput) searchInput.value = '';
  renderCustomerOrderHistory(currentProfileOrders);

  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Returns from Customer Profile view back to Customers Directory list
 */
function closeCustomerProfile() {
  currentProfileCustomerId = null;
  activeDetailCustomerId = null;

  const dirContainer = document.getElementById('customersDirectoryContainer');
  const profContainer = document.getElementById('customerProfileContainer');
  if (profContainer) profContainer.classList.add('hidden');
  if (dirContainer) dirContainer.classList.remove('hidden');

  const mainTitle = document.getElementById('mainViewHeaderTitle');
  const mainSubtitle = document.getElementById('mainViewHeaderSubtitle');
  if (mainTitle) mainTitle.textContent = 'CUSTOMERS DIRECTORY';
  if (mainSubtitle) mainSubtitle.textContent = 'Wholesale Buyers & Contact Management';

  renderCustomersList();
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
}

/**
 * Renders the complete order history list & table for customer profile
 */
function renderCustomerOrderHistory(ordersList) {
  const tableBody = document.getElementById('cpOrderHistoryTableBody');
  const mobileList = document.getElementById('cpOrderHistoryMobileList');
  const emptyNotice = document.getElementById('cpOrderHistoryEmpty');
  const countBadge = document.getElementById('cpOrderHistoryCountBadge');

  if (countBadge) {
    countBadge.textContent = `${ordersList.length} Orders`;
  }

  if (ordersList.length === 0) {
    if (tableBody) tableBody.innerHTML = '';
    if (mobileList) mobileList.innerHTML = '';
    if (emptyNotice) emptyNotice.classList.remove('hidden');
    return;
  }
  if (emptyNotice) emptyNotice.classList.add('hidden');

  // 1. Desktop Table Rows
  if (tableBody) {
    tableBody.innerHTML = '';
    ordersList.forEach(o => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50/80 transition border-b border-slate-100';

      // Status pill
      const isUrgent = (o.deliveryStatus === 'Urgent');
      const isDelivered = (o.dispatchStatus === 'Delivered');
      const isOut = (o.dispatchStatus === 'OutForDelivery');

      let statusBadge = '';
      if (isDelivered) {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs"><span>Delivered</span> 🟢</span>`;
      } else if (isOut) {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200 shadow-2xs"><span>Out for Delivery</span> 🚚</span>`;
      } else {
        statusBadge = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs"><span>Pending</span> ⏳</span>`;
      }

      const urgencyBadge = isUrgent
        ? `<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200 mt-1">⚡ URGENT</span>`
        : `<span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-slate-400 mt-1">Normal</span>`;

      // Items list
      const items = (Array.isArray(o.items) && o.items.length > 0) ? o.items : [{
        productName: o.product?.name || o.productName || 'Biriyani Rice',
        bagSize: o.bagSize || 25,
        bagQty: o.bagQty || 1,
        perKgRate: o.perKgRate || 95,
        totalKg: o.totalKg || 25,
        totalAmount: o.totalAmount || 0
      }];

      const itemsHtml = items.map(it => {
        const pName = it.productName || 'Rice Variety';
        const bSize = parseFloat(it.bagSize) || 25;
        const bQty = parseFloat(it.bagQty) || 0;
        const rate = parseFloat(it.perKgRate) || 0;
        return `
          <div class="flex items-center gap-1.5 flex-wrap py-0.5 text-xs">
            <span class="font-extrabold text-slate-900">${escapeHtml(pName)}</span>
            <span class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">${bSize} kg</span>
            <span class="text-[10px] text-slate-500 font-semibold">${bQty} bags</span>
            <span class="text-[10px] text-slate-400 font-mono">@ ₹${rate}/kg</span>
          </div>
        `;
      }).join('');

      const oKg = parseFloat(o.totalKg) || items.reduce((s, it) => s + (parseFloat(it.totalKg) || ((parseFloat(it.bagSize) || 25) * (parseFloat(it.bagQty) || 0))), 0);
      const oBags = parseFloat(o.bagQty) || items.reduce((s, it) => s + (parseFloat(it.bagQty) || 0), 0);
      const oAmt = parseFloat(o.totalAmount) || items.reduce((s, it) => s + (parseFloat(it.totalAmount) || 0), 0);

      tr.innerHTML = `
        <td class="px-4 py-3">
          <div class="font-black text-slate-900 text-xs">${escapeHtml(o.id || 'ORD')}</div>
          <div class="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
            <i data-lucide="calendar" class="w-3 h-3 text-slate-400"></i>
            <span>${escapeHtml(o.date || '')}</span>
          </div>
        </td>
        <td class="px-4 py-3">
          <div class="space-y-0.5 max-w-md">
            ${itemsHtml}
          </div>
          ${o.notes ? `<div class="text-[10px] text-slate-400 italic mt-1">📝 ${escapeHtml(o.notes)}</div>` : ''}
        </td>
        <td class="px-4 py-3 text-right">
          <div class="font-black text-slate-900 text-xs">${oKg.toLocaleString('en-IN')} kg</div>
          <div class="text-[10px] text-slate-500 font-semibold mt-0.5">${oBags.toLocaleString('en-IN')} Bags</div>
        </td>
        <td class="px-4 py-3 text-right">
          <div class="font-black text-blue-700 text-xs">₹${Math.round(oAmt).toLocaleString('en-IN')}</div>
          <div class="text-[10px] text-slate-400">Total Bill</div>
        </td>
        <td class="px-4 py-3 text-center">
          <div class="flex flex-col items-center">
            ${statusBadge}
            ${urgencyBadge}
          </div>
        </td>
        <td class="px-4 py-3 text-center">
          <div class="flex items-center justify-center gap-1.5">
            <button type="button" onclick="shareOrderToWhatsApp('${escapeHtml(o.id)}')" title="Share Order on WhatsApp" class="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition active:scale-95">
              <i data-lucide="message-circle" class="w-4 h-4"></i>
            </button>
            <button type="button" onclick="editOrder('${escapeHtml(o.id)}')" title="View / Edit in Sales Register" class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition active:scale-95">
              <i data-lucide="edit-3" class="w-4 h-4"></i>
            </button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // 2. Mobile Responsive Cards
  if (mobileList) {
    mobileList.innerHTML = '';
    ordersList.forEach(o => {
      const isUrgent = (o.deliveryStatus === 'Urgent');
      const isDelivered = (o.dispatchStatus === 'Delivered');
      const isOut = (o.dispatchStatus === 'OutForDelivery');

      let statusBadge = isDelivered
        ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">Delivered 🟢</span>`
        : (isOut
          ? `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">Out 🚚</span>`
          : `<span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">Pending ⏳</span>`);

      const items = (Array.isArray(o.items) && o.items.length > 0) ? o.items : [{
        productName: o.product?.name || o.productName || 'Biriyani Rice',
        bagSize: o.bagSize || 25,
        bagQty: o.bagQty || 1,
        perKgRate: o.perKgRate || 95,
        totalKg: o.totalKg || 25,
        totalAmount: o.totalAmount || 0
      }];

      const oKg = parseFloat(o.totalKg) || items.reduce((s, it) => s + (parseFloat(it.totalKg) || 0), 0);
      const oBags = parseFloat(o.bagQty) || items.reduce((s, it) => s + (parseFloat(it.bagQty) || 0), 0);
      const oAmt = parseFloat(o.totalAmount) || items.reduce((s, it) => s + (parseFloat(it.totalAmount) || 0), 0);

      const itemsSummary = items.map(it => `${it.productName} (${it.bagQty} × ${it.bagSize}kg)`).join(', ');

      const card = document.createElement('div');
      card.className = 'p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2';
      card.innerHTML = `
        <div class="flex items-center justify-between text-xs">
          <div class="flex items-center gap-2">
            <span class="font-black text-slate-900">${escapeHtml(o.id || 'ORD')}</span>
            <span class="text-[11px] text-slate-500 font-medium">${escapeHtml(o.date || '')}</span>
          </div>
          <div class="flex items-center gap-1.5">
            ${statusBadge}
            ${isUrgent ? '<span class="text-[9px] font-black px-1.5 py-0.5 rounded bg-rose-100 text-rose-700">⚡</span>' : ''}
          </div>
        </div>
        <div class="text-xs text-slate-800 font-semibold">${escapeHtml(itemsSummary)}</div>
        <div class="flex items-center justify-between pt-1 border-t border-slate-200/70 text-xs">
          <span class="font-extrabold text-slate-700">${oBags} Bags • ${oKg.toLocaleString('en-IN')} kg</span>
          <span class="font-black text-blue-700 text-sm">₹${Math.round(oAmt).toLocaleString('en-IN')}</span>
        </div>
        <div class="flex items-center justify-end gap-2 pt-1">
          <button type="button" onclick="shareOrderToWhatsApp('${escapeHtml(o.id)}')" class="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 border border-green-200">
            <i data-lucide="message-circle" class="w-3.5 h-3.5"></i>
            <span>WhatsApp</span>
          </button>
          <button type="button" onclick="editOrder('${escapeHtml(o.id)}')" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 border border-blue-200">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
            <span>Edit</span>
          </button>
        </div>
      `;
      mobileList.appendChild(card);
    });
  }
}

/**
 * Live search filter inside the customer order history
 */
function filterCustomerOrderHistory() {
  const input = document.getElementById('cpOrderSearchInput');
  const query = (input?.value || '').trim().toLowerCase();
  if (!query) {
    renderCustomerOrderHistory(currentProfileOrders);
    return;
  }
  const filtered = currentProfileOrders.filter(o => {
    const idMatch = (o.id || '').toLowerCase().includes(query);
    const dateMatch = (o.date || '').toLowerCase().includes(query);
    const statusMatch = (o.dispatchStatus || '').toLowerCase().includes(query) || (o.deliveryStatus || '').toLowerCase().includes(query);
    const notesMatch = (o.notes || '').toLowerCase().includes(query);
    const itemsMatch = Array.isArray(o.items) && o.items.some(it => (it.productName || '').toLowerCase().includes(query));
    return idMatch || dateMatch || statusMatch || notesMatch || itemsMatch;
  });
  renderCustomerOrderHistory(filtered);
}

function startOrderFromCustomerProfile() {
  if (!currentProfileCustomerId) return;
  const custId = currentProfileCustomerId;
  openNewOrderModal(custId);
}

function editCustomerFromProfile() {
  if (!currentProfileCustomerId) return;
  const custId = currentProfileCustomerId;
  closeCustomerProfile();
  editCustomer(custId);
}

function openAddMemberFormForProfile() {
  if (!currentProfileCustomerId) return;
  openCustomerDetailModal(currentProfileCustomerId, true);
}

function renderProfileMembersList(cust) {
  const container = document.getElementById('cpMembersContainer');
  const countBadge = document.getElementById('cpMembersCountBadge');
  if (!container) return;

  const members = getCustomerMembers(cust);
  if (countBadge) countBadge.textContent = members.length;

  if (members.length === 0) {
    container.innerHTML = '<span class="text-xs text-slate-400 py-1">No team members added yet. Click "+ Add Member" to add Chef, Manager or Staff.</span>';
    return;
  }

  container.innerHTML = members.map(m => {
    const roleBadge = getDesignationBadge(m.role);
    const cleanPhone = cleanPhoneNumber(m.phone);
    const callBtn = cleanPhone ? `<a href="tel:${cleanPhone}" class="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded" title="Call"><i data-lucide="phone" class="w-3 h-3"></i></a>` : '';
    const waBtn = cleanPhone ? `<a href="https://wa.me/91${cleanPhone}" target="_blank" rel="noopener" class="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded" title="WhatsApp"><i data-lucide="message-circle" class="w-3 h-3"></i></a>` : '';

    return `
      <div class="inline-flex items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs hover:border-slate-300 transition">
        <button type="button" onclick="openCustomerProfile('')" class="font-extrabold text-slate-900 hover:text-blue-600 hover:underline text-left">${escapeHtml(m.name)}</button>
        ${roleBadge}
        ${m.isPrimary ? '<span class="text-[9px] font-black text-amber-700 bg-amber-100 px-1 rounded">★ Primary</span>' : ''}
        ${cleanPhone ? `<span class="font-mono text-slate-500 text-[11px] ml-1">${escapeHtml(m.phone)}</span>` : ''}
        <div class="flex items-center gap-0.5 ml-1">
          ${callBtn}
          ${waBtn}
          <button type="button" onclick="editCustomerMember('${cust.id}', '${m.id}')" class="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Edit Member"><i data-lucide="edit-3" class="w-3 h-3"></i></button>
          <button type="button" onclick="deleteCustomerMember('${cust.id}', '${m.id}')" class="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded" title="Delete Member"><i data-lucide="trash-2" class="w-3 h-3"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

window.initApp = initApp;
window.openCustomerProfile = openCustomerProfile;
window.closeCustomerProfile = closeCustomerProfile;
window.getCustomerOrders = getCustomerOrders;
window.filterCustomerOrderHistory = filterCustomerOrderHistory;
window.startOrderFromCustomerProfile = startOrderFromCustomerProfile;
window.editCustomerFromProfile = editCustomerFromProfile;
window.openAddMemberFormForProfile = openAddMemberFormForProfile;
window.renderProfileMembersList = renderProfileMembersList;
window.renderCustomerOrderHistory = renderCustomerOrderHistory;
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
window.downloadAppLogoForHomeIcon = downloadAppLogoForHomeIcon;
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
window.printInvoice = printInvoice;
window.printDashboardReport = printDashboardReport;

// Customer Deduplication Exports
window.deduplicateCustomersList = deduplicateCustomersList;
window.getCanonicalCustomerInfo = getCanonicalCustomerInfo;
window.runManualCustomerDeduplication = runManualCustomerDeduplication;
window.editCustomerFromDetail = editCustomerFromDetail;
window.deleteCustomerFromDetail = deleteCustomerFromDetail;
window.isCustomerTombstoned = isCustomerTombstoned;
window.addCustomerTombstone = addCustomerTombstone;
window.removeCustomerTombstone = removeCustomerTombstone;
window.resetCustomersToPreNovemberSales = resetCustomersToPreNovemberSales;
window.processIncomingCloudCustomers = processIncomingCloudCustomers;
window.PRE_NOVEMBER_CANONICAL_CUSTOMERS = PRE_NOVEMBER_CANONICAL_CUSTOMERS;

// Product & Orders Cascading Exports
window.cascadeProductUpdateToOrders = cascadeProductUpdateToOrders;
window.normalizeExistingDCOrdersAndProducts = normalizeExistingDCOrdersAndProducts;
window.saveProductForm = saveProductForm;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.cancelProductEdit = cancelProductEdit;
window.deduplicateProductsList = deduplicateProductsList;
window.getCanonicalProduct = getCanonicalProduct;
window.cascadeCanonicalProductsToOrders = cascadeCanonicalProductsToOrders;
window.ALL_OFFICIAL_PRODUCTS = ALL_OFFICIAL_PRODUCTS;

// Security PIN Lock Exports
window.enterPinDigit = enterPinDigit;
window.backspacePinDigit = backspacePinDigit;
window.clearPin = clearPin;
window.submitPinUnlock = submitPinUnlock;
window.lockDashboard = lockDashboard;
window.initSecurityLock = initSecurityLock;
window.handleSaveNewPin = handleSaveNewPin;
window.onSecurityToggleChange = onSecurityToggleChange;
window.updateSettingsSecurityTab = updateSettingsSecurityTab;

// Staff Delivery Portal Exports
window.openShareDeliveryModal = openShareDeliveryModal;
window.closeShareDeliveryModal = closeShareDeliveryModal;
window.copyDeliveryPortalLink = copyDeliveryPortalLink;
window.shareDeliveryPortalWhatsApp = shareDeliveryPortalWhatsApp;
window.getDeliveryPortalUrl = getDeliveryPortalUrl;

// Views & Portals Hub Exports
window.openViewsModal = openViewsModal;
window.closeViewsModal = closeViewsModal;
window.markAllCurrentOrdersDelivered = markAllCurrentOrdersDelivered;
window.batchSyncOrdersDispatchStatus = batchSyncOrdersDispatchStatus;

// Responsive Mobile Navigation Exports
window.handleBottomNavClick = handleBottomNavClick;
window.updateBottomNavActiveTab = updateBottomNavActiveTab;
window.openMobileMoreDrawer = openMobileMoreDrawer;
window.closeMobileMoreDrawer = closeMobileMoreDrawer;
window.toggleMobileMoreDrawer = toggleMobileMoreDrawer;
window.closeAllOpenModals = closeAllOpenModals;
