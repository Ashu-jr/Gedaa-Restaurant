// ==========================================
// HOTEL MENU DIGITAL - Core Data & State
// GEDAA RESTAURANT - OROMO GEDAA BRANDING
// HARDENED SECURITY & SANITIZATION ENGINE
// ==========================================

// Security: High-performance HTML Sanitizer to prevent XSS
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
window.escapeHtml = escapeHtml;

// Security: Safe URL Validator to prevent javascript: or data: injection
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
  }
  const trimmed = url.trim();
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/uploads/') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
}
window.sanitizeUrl = sanitizeUrl;

// Security: Authentication Header Provider
function getAdminHeaders() {
  const token = sessionStorage.getItem('gedaa_admin_token') || '';
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['X-Admin-Token'] = token;
  }
  return headers;
}
window.getAdminHeaders = getAdminHeaders;

const TRANSLATIONS = {
  en: {
    restaurantName: "Gedaa Restaurant",
    restaurantSubtitle: "Order from the table.",
    exploreMenu: "Explore menu",
    searchPlaceholder: "Search dishes, ingredients...",
    callWaiter: "Call waiter",
    callWaiterActive: "Calling waiter...",
    callWaiterSuccess: "Waiter called for Table 04!",
    featured: "Featured",
    menu: "Menu",
    order: "Order",
    offers: "Offers",
    more: "More",
    all: "All",
    yourCartEmpty: "Your cart is empty",
    addDishPrompt: "Add a dish from the menu to get started.",
    browseMenu: "Browse menu",
    subtotal: "Subtotal",
    serviceCharge: "Service charge (10%)",
    vat: "VAT (15%)",
    total: "Total",
    dineIn: "Dine in",
    takeaway: "Takeaway",
    yourName: "Your name",
    phone: "Phone",
    noteCouponTiming: "Note, coupon & timing",
    specialInstructionsPlaceholder: "Special instructions, allergies...",
    couponPlaceholder: "Enter coupon code",
    placeOrder: "Place order",
    noOffersTitle: "Offers",
    noOffersDesc: "No offers on the board right now.",
    orderHistory: "Order history",
    orderHistoryDesc: "View your past orders and re-order",
    preferences: "PREFERENCES",
    language: "Language",
    languageDesc: "Choose your preferred language",
    callRestaurant: "Call restaurant",
    callRestaurantDesc: "Speak with our team",
    restaurantInfo: "RESTAURANT INFO",
    openingHours: "Opening hours",
    openingHoursValue: "Today 8:00 AM - 10:00 PM",
    addressDirections: "Address & directions",
    addressValue: "Bole Road / Adama, Oromia, Ethiopia",
    supportLegal: "SUPPORT & LEGAL",
    privacy: "Privacy",
    privacyDesc: "How we protect your data",
    terms: "Terms & conditions",
    termsDesc: "Read our terms of service",
    helpSupport: "Help & support",
    helpSupportDesc: "FAQs and contact options",
    poweredBy: "DEVELOPED BY ORIVEX TECH 2026",
    currency: "ETB",
    tableLabel: "TABLE 04",
    orderPlacedSuccess: "Order placed successfully!",
    orderSentToKitchen: "Your ticket has landed in the kitchen.",
    soldOut: "Sold Out",
    available: "Available",
    heroTitle: "Run your restaurant with Gedaa.",
    heroSubtitle: "A QR menu, digital menu, and restaurant management — orders, kitchen, staff, and reports for restaurants, cafés, and hotels.",
    todaysSales: "Today's sales",
    totalOrders: "Total orders",
    tryDemoBtn: "Try the Gedaa demo",
    openRestaurantBtn: "Open a restaurant",
    accessSystems: "Access your systems",
    packagesTitle: "Four packages. A clear reason to upgrade.",
    packagesSubtitle: "Every package includes a branded digital menu in English, Afaan Oromoo and Amharic, live menu updates, photos and prices, table QR, tax and service charge, and an owner login.",
    starter: "Starter",
    business: "Business",
    premium: "Premium",
    enterprise: "Enterprise",
    mostPopular: "MOST POPULAR",
    runFloor: "Run the floor"
  },
  om: {
    restaurantName: "Reestoraantii Gadaa",
    restaurantSubtitle: "Meezaa keessan irraa ajajaa.",
    exploreMenu: "Menii ilaalaa",
    searchPlaceholder: "Nyaata, dhugaatii barbaadaa...",
    callWaiter: "Keessummeessituu waamaa",
    callWaiterActive: "Keessummeessituun waamamaa jira...",
    callWaiterSuccess: "Meezaa 04-f keessummeessituun waamameera!",
    featured: "Filatamaa",
    menu: "Menii",
    order: "Ajaja",
    offers: "Hir'isa",
    more: "Dabalata",
    all: "Hunda",
    yourCartEmpty: "Kuni duwwaadha",
    addDishPrompt: "Nyaata filachuun jalqabaa.",
    browseMenu: "Menii bani",
    subtotal: "Ida'ama",
    serviceCharge: "Kaffaltii Tajaajilaa (10%)",
    vat: "VAT (15%)",
    total: "Waliigala",
    dineIn: "Asitti Nyaachuu",
    takeaway: "Fudhatanii Deemuu",
    yourName: "Maqaa keessan",
    phone: "Lakkoofsa Bilbilaa",
    noteCouponTiming: "Yaada, kuuppoonii fi yeroo",
    specialInstructionsPlaceholder: "Qajeelfama addaa ykn alarjikii...",
    couponPlaceholder: "Koodii kuuppoonii galchaa",
    placeOrder: "Ajaja Ergaa",
    noOffersTitle: "Hir'isa",
    noOffersDesc: "Yeroo ammaa dhiheessiin hir'isaa hin jiru.",
    orderHistory: "Seenaa Ajajaa",
    orderHistoryDesc: "Ajajawwan kanaan duraa ilaalaa",
    preferences: "FILANNOO",
    language: "Afaan",
    languageDesc: "Afaan barbaaddan filadhaa",
    callRestaurant: "Reestoraantichaaf bilbilaa",
    callRestaurantDesc: "Garee keenya waliin dubbadhaa",
    restaurantInfo: "ODEEFFANNOO REESTORAANTII",
    openingHours: "Sa'aatii Hojii",
    openingHoursValue: "Har'a Ganama 2:00 - Galgala 4:00",
    addressDirections: "Teessoo & Kallattii",
    addressValue: "Daandii Boolee / Adaamaa, Oromiyaa",
    supportLegal: "DEEGGARSA & SEERA",
    privacy: "Iccitii Eeguu",
    privacyDesc: "Odeeffannoo keessan akkamitti akka eegnu",
    terms: "Waliigaltee Tajaajilaa",
    termsDesc: "Ulaagaalee tajaajilaa dubbisaa",
    helpSupport: "Gargaarsa & Deeggarsa",
    helpSupportDesc: "Gaaffiilee deddeebi'anii ka'an",
    poweredBy: "DEVELOPED BY ORIVEX TECH 2026",
    currency: "ETB",
    tableLabel: "MEEZAA 04",
    orderPlacedSuccess: "Ajajni keessan milkaa'inaan darbeera!",
    orderSentToKitchen: "Ajajni gara mana bilcheessuutti darbeera.",
    soldOut: "Dhumateera",
    available: "Ni jira",
    heroTitle: "Reestoraantii keessan Gadaadhaan hogganaa.",
    heroSubtitle: "QR menii, menii dijiitaalaa fi hoggansa reestoraantii — ajajawwan, kushiinaa fi gabaasa.",
    todaysSales: "Gurgurtaa Har'aa",
    totalOrders: "Waliigala Ajajawwan",
    tryDemoBtn: "Gadaa Demo Yaalaa",
    openRestaurantBtn: "Reestoraantii Banaa",
    accessSystems: "Sirnoota keessan banaa",
    packagesTitle: "Paakeejota Afur. Sababa ifa ta'e fooyyessuuf.",
    packagesSubtitle: "Paakeejiin hundi menii Afaan Oromoo, Ingiliffaa fi Amaariffaa of keessaa qaba.",
    starter: "Jalqabaa (Starter)",
    business: "Daldalaa (Business)",
    premium: "Piriimiyemii (Premium)",
    enterprise: "Enterpiraayizii (Enterprise)",
    mostPopular: "BAAY'EE FILATAMAA",
    runFloor: "Hojii Guutuu Hogganaa"
  },
  am: {
    restaurantName: "ገዳ ሬስቶራንት",
    restaurantSubtitle: "ከጠረጴዛዎ ሆነው ያዝዙ።",
    exploreMenu: "ሜኑ ይመልከቱ",
    searchPlaceholder: "ምግቦችን፣ ግብአቶችን ይፈልጉ...",
    callWaiter: "አስተናጋጅ ጥራ",
    callWaiterActive: "አስተናጋጅ እየተጠራ ነው...",
    callWaiterSuccess: "ለጠረጴዛ 04 አስተናጋጅ ተጠርቷል!",
    featured: "ተመራጭ ምግቦች",
    menu: "ሜኑ",
    order: "ትዕዛዝ",
    offers: "ቅናሾች",
    more: "ተጨማሪ",
    all: "ሁሉም",
    yourCartEmpty: "ቅርጫትዎ ባዶ ነው",
    addDishPrompt: "ለመጀመር ከሜኑ ውስጥ ምግብ ይምረጡ።",
    browseMenu: "ሜኑ ይመልከቱ",
    subtotal: "ድምር",
    serviceCharge: "የአገልግሎት ክፍያ (10%)",
    vat: "ተ.እ.ታ / VAT (15%)",
    total: "አጠቃላይ ድምር",
    dineIn: "እዚህ መመገብ",
    takeaway: "ይዞ መሄድ",
    yourName: "ስምዎ",
    phone: "ስልክ ቁጥር",
    noteCouponTiming: "ማስታወሻ፣ ኩፖን እና ሰዓት",
    specialInstructionsPlaceholder: "ልዩ ትዕዛዝ ወይም አለርጂ ካለ...",
    couponPlaceholder: "የኩፖን ኮድ ያስገቡ",
    placeOrder: "ትዕዛዝ ይላኩ",
    noOffersTitle: "ቅናሾች",
    noOffersDesc: "በአሁኑ ሰዓት ምንም አይነት ቅናሽ የለም።",
    orderHistory: "የትዕዛዝ ታሪክ",
    orderHistoryDesc: "ያለፉትን ትዕዛዞች ይመልከቱ እና ደግመው ያዝዙ",
    preferences: "ምርጫዎች",
    language: "ቋንቋ",
    languageDesc: "የሚመርጡትን ቋንቋ ይምረጡ",
    callRestaurant: "ሬስቶራንቱን ይደውሉ",
    callRestaurantDesc: "ከቡድናችን ጋር ይነጋገሩ",
    restaurantInfo: "የሬስቶራንቱ መረጃ",
    openingHours: "የስራ ሰዓት",
    openingHoursValue: "ዛሬ 2:00 ጠዋት - 4:00 ማታ",
    addressDirections: "አድራሻ እና አቅጣጫ",
    addressValue: "ቦሌ መንገድ / አዳማ፣ ኦሮሚያ፣ ኢትዮጵያ",
    supportLegal: "ድጋፍ እና ህጋዊ",
    privacy: "የግላዊነት ፖሊሲ",
    privacyDesc: "መረጃዎን እንዴት እንደምንጠብቅ",
    terms: "የአገልግሎት ውሎች",
    termsDesc: "የአገልግሎት ውሎችን ያንብቡ",
    helpSupport: "እርዳታ እና ድጋፍ",
    helpSupportDesc: "ተደጋግመው የሚጠየቁ ጥያቄዎች",
    poweredBy: "DEVELOPED BY ORIVEX TECH 2026",
    currency: "ብር",
    tableLabel: "ጠረጴዛ 04",
    orderPlacedSuccess: "ትዕዛዝዎ በተሳካ ሁኔታ ተልኳል!",
    orderSentToKitchen: "ትዕዛዝዎ ወደ ማእድ ቤት ደርሷል።",
    soldOut: "አልቋል",
    available: "አለ",
    heroTitle: "ሬስቶራንትዎን በGedaa ይምሩ።",
    heroSubtitle: "QR ሜኑ፣ ዲጂታል ሜኑ እና የሬስቶራንት አስተዳደር — ትዕዛዞች፣ ኩሽና፣ ሰራተኞች እና ሪፖርቶች ለሆቴሎች፣ ሬስቶራንቶች እና ካፌዎች።",
    todaysSales: "የዛሬ ሽያጭ",
    totalOrders: "ጠቅላላ ትዕዛዞች",
    tryDemoBtn: "የገዳ ዴሞን ይሞክሩ",
    openRestaurantBtn: "ሬስቶራንት ይክፈቱ",
    accessSystems: "ስርዓቶችዎን ያግኙ",
    packagesTitle: "አራት ፓኬጆች። ለማሻሻል ግልጽ ምክንያት።",
    packagesSubtitle: "እያንዳንዱ ፓኬጅ በእንግሊዝኛ፣ በአፋን ኦሮሞ እና በአማርኛ የተዘጋጀ ዲጂታል ሜኑን ያካትታል።",
    starter: "ጀማሪ (Starter)",
    business: "ቢዝነስ (Business)",
    premium: "ፕሪሚየም (Premium)",
    enterprise: "ኢንተርፕራይዝ (Enterprise)",
    mostPopular: "በጣም ተመራጭ",
    runFloor: "ሙሉ ስራውን ይቆጣጠሩ"
  }
};

const CATEGORIES = [
  { id: "all", nameEn: "All", nameAm: "ሁሉም", nameOm: "Hunda", icon: "layout-grid" },
  { id: "traditional", nameEn: "Traditional", nameAm: "ባህላዊ ምግቦች", nameOm: "Aadaa", icon: "utensils" },
  { id: "breakfast", nameEn: "Breakfast", nameAm: "ቁርስ", nameOm: "Ciree", icon: "coffee" },
  { id: "fasting", nameEn: "Fasting", nameAm: "የጾም ምግቦች", nameOm: "Sooma", icon: "leaf" },
  { id: "modern", nameEn: "Modern Kitchen", nameAm: "ዘመናዊ ኩሽና", nameOm: "Ammayyaa", icon: "pizza" },
  { id: "hot_drinks", nameEn: "Hot Drinks", nameAm: "ትኩስ መጠጦች", nameOm: "Ho'aa", icon: "cup-soda" },
  { id: "fresh_juice", nameEn: "Fresh Juice", nameAm: "ትኩስ ጁስ", nameOm: "Chuuma", icon: "glass-water" },
  { id: "soft_drinks", nameEn: "Soft Drinks & Water", nameAm: "ለስላሳ እና ውሃ", nameOm: "Lallaafaa & Bishaan", icon: "bottle-wine" },
  { id: "bar", nameEn: "Beer, Wine & Tej", nameAm: "ቢራ፣ ወይን እና ጠጅ", nameOm: "Biiraa & Daadhii", icon: "wine" }
];

const DEFAULT_DISHES = [
  {
    id: "checkla_tibs", category: "traditional", featured: true,
    title_en: "Checkla Tibs 1kg", title_am: "ቸክላ ጥብስ 1 ኪሎ",
    desc_en: "Sautéed beef with rosemary, onion and berbere served sizzling in clay bowl.",
    desc_am: "በሮዝመሪ፣ ቀይ ሽንኩርት እና በርበሬ የተጠበሰ የበሬ ስጋ በሸክላ የቀረበ።",
    price: 1400.0, badges: ["spicy"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3MCNk4DoOaZaXFz7mGfqYkYBzq4BnzDXXGi_RUC6-b-6QSpY_d9yFVTL2&s=10",
    is_available: true
  },
  {
    id: "doro_wot", category: "traditional", featured: true,
    title_en: "Doro Wot", title_am: "ዶሮ ወጥ",
    desc_en: "Slow-cooked chicken in berbere sauce with boiled egg and ayib.",
    desc_am: "በደቀቀ ሽንኩርትና የጓያ በርበሬ የበሰለ የሀበሻ ዶሮ ወጥ ከእንቁላል እና አይብ ጋር።",
    price: 950.0, badges: ["spicy"],
    image: "https://www.diversivore.com/wp-content/uploads/2023/05/Doro-Wat-vertical-2.jpg",
    is_available: true
  },
  {
    id: "kitfo", category: "traditional", featured: true,
    title_en: "Kitfo", title_am: "ክትፎ",
    desc_en: "Minced beef with mitmita and spiced butter, served with ayib and gomen.",
    desc_am: "በልዩ ቅቤና ሚጥሚጣ የተዘጋጀ የለስላሳ ስጋ ክትፎ ከአይብና ጎመን ጋር።",
    price: 850.0, badges: ["popular"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN18ZK6oq79Ox9UJH9Ywv8b8kU3hf3YLIyFBaC4G9mfw7kqXZCuG9e33I&s=10",
    is_available: true
  },
  {
    id: "chechebsa", category: "breakfast", featured: false,
    title_en: "Chechebsa", title_am: "ጨጨብሳ",
    desc_en: "Flaky flatbread pieces with berbere and spiced butter, served with honey.",
    desc_am: "በቅቤና በርበሬ የተፈተፈተ ቀጭን ቂጣ ከማር ጋር የቀረበ።",
    price: 300.0, badges: ["gluten"],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCKIn1eNp3uFRP0FSwEBJZ4RbmrL61rsXdrfZyKXOWd0p2TsqWlZinIiMB&s=10",
    is_available: true
  },
  {
    id: "enkulal_firfir", category: "breakfast", featured: false,
    title_en: "Enkulal Firfir", title_am: "የእንቁላል ፍርፍር",
    desc_en: "Scrambled eggs with onion, tomato and green chili, served with fresh bread.",
    desc_am: "በቀይ ሽንኩርት፣ ቲማቲም እና ቃሪያ የተጠበሰ እንቁላል ከትኩስ ዳቦ ጋር።",
    price: 260.0, badges: ["eggs"],
    image: "https://www.mealplanme.com/storage/media/recipes/ethiopian-scrambled-eggs-enkulal-firfir/main_image/conversions/Ethiopian-Scrambled-Eggs-%28Enkulal-Firfir%29-square-large.jpg",
    is_available: true
  },
  {
    id: "beyaynetu", category: "fasting", featured: false,
    title_en: "Beyaynetu", title_am: "በያይነቱ",
    desc_en: "A colourful platter of shiro, misir wot, kik alicha, gomen, and atkilt on injera.",
    desc_am: "የተለያዩ የጾም ወጦች ክምችት፡ ሽሮ፣ ምስር፣ ክክ፣ ጎመን፣ ድንችና ካሮት በእንጀራ።",
    price: 450.0, badges: ["fasting"],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "atkilt_wot", category: "fasting", featured: false,
    title_en: "Atkilt Wot", title_am: "የአትክልት ወጥ",
    desc_en: "Cabbage, potato and carrot slow-cooked with garlic, ginger and turmeric.",
    desc_am: "ጥቅል ጎመን፣ ድንችና ካሮት በእርድ እና ነጭ ሽንኩርት ተዘጋጅቶ የቀረበ።",
    price: 300.0, badges: ["fasting"],
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "beef_burger", category: "modern", featured: false,
    title_en: "Beef Burger", title_am: "ቢፍ በርገር",
    desc_en: "Grilled prime beef patty, melted cheddar cheese, lettuce, tomato and crispy fries.",
    desc_am: "የተጠበሰ የበሬ ስጋ፣ ቺዝ፣ ሰላጣ፣ ቲማቲም እና የተጠበሰ ድንች (ቺፕስ)።",
    price: 650.0, badges: ["gluten"],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "chicken_wings", category: "modern", featured: false,
    title_en: "Spicy Chicken Wings", title_am: "ስፓይሲ ቺከን ዊንግስ",
    desc_en: "Crispy grilled chicken wings tossed in spicy glaze with garlic dipping sauce.",
    desc_am: "በቅመም የተጠበሰ የዶሮ ክንፍ ከነጭ ሽንኩርት መጥመቂያ ጋር።",
    price: 600.0, badges: ["spicy"],
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "jebena_buna", category: "hot_drinks", featured: false,
    title_en: "Jebena Buna", title_am: "ጀበና ቡና",
    desc_en: "Traditional Ethiopian coffee brewed in clay pot, served with fresh popcorn.",
    desc_am: "በሸክላ ጀበና የተፈላ ባህላዊ የሀበሻ ቡና ከፈንድሻ ጋር።",
    price: 80.0, badges: ["popular"],
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "cappuccino", category: "hot_drinks", featured: false,
    title_en: "Cappuccino", title_am: "ካፑቺኖ",
    desc_en: "Rich double shot espresso layered with silky steamed milk foam.",
    desc_am: "የጣሊያን ኤስፕሬሶ ከተመታ ለስላሳ ወተት ጋር።",
    price: 130.0, badges: ["dairy"],
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "avocado_juice", category: "fresh_juice", featured: false,
    title_en: "Fresh Avocado Juice", title_am: "ትኩስ የአቮካዶ ጁስ",
    desc_en: "Creamy fresh blended Ethiopian avocado layered with Vimto and lime.",
    desc_am: "በሎሚና ቪምቶ የተዘጋጀ ድቡሽቡሽ የሀበሻ አቮካዶ ጁስ።",
    price: 200.0, badges: ["fasting"],
    image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "mango_juice", category: "fresh_juice", featured: false,
    title_en: "Fresh Mango Juice", title_am: "ትኩስ የማንጎ ጁስ",
    desc_en: "100% pure seasonal tropical mango nectar.",
    desc_am: "ከተፈጥሮ ጣፋጭ ማንጎ የተጨመቀ ንጹህ ጁስ።",
    price: 200.0, badges: ["fasting"],
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "tej_special", category: "bar", featured: false,
    title_en: "Tej Honey Wine (Berle)", title_am: "ማር ጠጅ (በብርሌ)",
    desc_en: "Authentic fermented Ethiopian honey wine served in the traditional flask.",
    desc_am: "ከንጹህ የተፈጥሮ ማር የተጣራ ጥራት ያለው የሀበሻ ጠጅ በብርሌ የቀረበ።",
    price: 150.0, badges: ["popular"],
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=80",
    is_available: true
  },
  {
    id: "meta_beer", category: "bar", featured: false,
    title_en: "Habesha / Meta Beer", title_am: "ሀበሻ / ሜታ ቢራ",
    desc_en: "Chilled cold bottled Ethiopian lager 330ml.",
    desc_am: "ቀዝቃዛ የታሸገ የሀበሻ ቢራ 330 ሚሊ ሊትር።",
    price: 120.0, badges: [],
    image: "https://images.unsplash.com/photo-1608270199187-573516584c66?w=600&auto=format&fit=crop&q=80",
    is_available: true
  }
];

// Application Global State
window.appState = {
  lang: "en",
  currentView: "menu",
  currentTab: "menu",
  adminTab: "menu_manager",
  selectedCategory: "all",
  searchQuery: "",
  cart: {},
  orderType: "dine_in",
  customerName: "",
  customerPhone: "",
  orderNotes: "",
  couponCode: "",
  tableNumber: "04",
  tableOrderNumber: 84,
  dishes: [...DEFAULT_DISHES],
  orders: [],
  waiterCalls: [],
  stats: {
    todaySales: 0,
    totalOrders: 0,
    completedOrders: 0,
    activeTables: 0,
    currency: "ETB"
  },
  posOrder: {
    table: "01",
    type: "dine_in",
    items: {},
    notes: "",
    customerName: "",
    customerPhone: ""
  }
};

// ==========================================
// BACKEND API CLIENT FUNCTIONS
// ==========================================

// Public Menu Loader (Safe: only loads public menu items)
async function loadBackendData() {
  try {
    const resDishes = await fetch('/api/dishes');
    if (resDishes.ok) {
      window.appState.dishes = await resDishes.json();
    }
  } catch (err) {
    console.warn("Backend API offline or error, using local state", err);
  }
  if (typeof renderApp === 'function') renderApp();
}

// Authenticated Admin Data Loader (Loads private orders, stats, and waiter calls)
async function loadAdminBackendData() {
  try {
    const headers = getAdminHeaders();
    
    // 1. Dishes
    const resDishes = await fetch('/api/dishes');
    if (resDishes.ok) {
      window.appState.dishes = await resDishes.json();
    }

    // 2. Orders (Protected)
    const resOrders = await fetch('/api/orders', { headers });
    if (resOrders.ok) {
      window.appState.orders = await resOrders.json();
    } else if (resOrders.status === 401 && typeof requireAdminAuth === 'function') {
      requireAdminAuth();
      return;
    }

    // 3. Stats (Protected)
    const resStats = await fetch('/api/stats', { headers });
    if (resStats.ok) {
      window.appState.stats = await resStats.json();
    }

    // 4. Waiter Calls (Protected)
    const resCalls = await fetch('/api/waiter-calls', { headers });
    if (resCalls.ok) {
      window.appState.waiterCalls = await resCalls.json();
    }
  } catch (err) {
    console.warn("Admin backend data load error", err);
  }
  if (typeof renderAdminPage === 'function') renderAdminPage();
}

async function apiAddDish(dishData) {
  try {
    const res = await fetch('/api/dishes', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(dishData)
    });
    if (res.ok) {
      await loadAdminBackendData();
      showNotification("New dish added to Gedaa Restaurant menu!", "success");
      return true;
    } else if (res.status === 401) {
      showNotification("Unauthorized: Please sign in as staff.", "error");
      if (typeof requireAdminAuth === 'function') requireAdminAuth();
    }
  } catch (e) {
    console.error("Failed to add dish", e);
  }
  return false;
}

async function apiUpdateDish(dishId, updateData) {
  try {
    const res = await fetch(`/api/dishes/${encodeURIComponent(dishId)}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(updateData)
    });
    if (res.ok) {
      await loadAdminBackendData();
      showNotification("Dish updated successfully!", "success");
      return true;
    } else if (res.status === 401) {
      showNotification("Unauthorized: Please sign in as staff.", "error");
      if (typeof requireAdminAuth === 'function') requireAdminAuth();
    }
  } catch (e) {
    console.error("Failed to update dish", e);
  }
  return false;
}

async function apiDeleteDish(dishId) {
  if (!confirm("Are you sure you want to remove this dish from Gedaa Restaurant?")) return;
  try {
    const res = await fetch(`/api/dishes/${encodeURIComponent(dishId)}`, {
      method: 'DELETE',
      headers: getAdminHeaders()
    });
    if (res.ok) {
      await loadAdminBackendData();
      showNotification("Dish removed from menu.", "info");
    } else if (res.status === 401) {
      showNotification("Unauthorized: Please sign in as staff.", "error");
      if (typeof requireAdminAuth === 'function') requireAdminAuth();
    }
  } catch (e) {
    console.error("Failed to delete dish", e);
  }
}

async function apiUpdateOrderStatus(orderId, newStatus) {
  try {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}/status`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      await loadAdminBackendData();
    } else if (res.status === 401) {
      showNotification("Unauthorized: Please sign in as staff.", "error");
      if (typeof requireAdminAuth === 'function') requireAdminAuth();
    }
  } catch (e) {
    console.error("Failed to update order status", e);
  }
}

async function apiUploadImage(file) {
  return new Promise((resolve, reject) => {
    // Validate file size on client-side before sending
    if (file.size > 5 * 1024 * 1024) {
      showNotification("Image exceeds 5MB size limit", "error");
      reject(new Error("File too large"));
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: JSON.stringify({
            image_base64: reader.result,
            filename: file.name
          })
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Upload failed");
        }
        const data = await res.json();
        resolve(data.url);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ==========================================
// STATE HELPER FUNCTIONS
// ==========================================

function t(key) {
  const lang = window.appState.lang;
  return (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS["en"][key] || key;
}

function getItemTranslation(item, field) {
  const lang = window.appState.lang;
  if (field === "title") {
    if (lang === "am") return item.title_am || item.titleAm;
    return item.title_en || item.titleEn;
  }
  if (field === "desc") {
    if (lang === "am") return item.desc_am || item.descAm;
    return item.desc_en || item.descEn;
  }
  return item[field];
}

function setLanguage(newLang) {
  window.appState.lang = newLang;
  document.documentElement.lang = newLang;
  if (typeof renderApp === 'function') renderApp();
  if (typeof renderAdminPage === 'function') renderAdminPage();
}

function switchView(viewName) {
  window.appState.currentView = viewName;
  if (typeof renderApp === 'function') renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchTab(tabName) {
  window.appState.currentTab = tabName;
  if (typeof renderApp === 'function') renderApp();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setCategory(catId) {
  window.appState.selectedCategory = catId;
  if (typeof renderApp === 'function') renderApp();
}

function addToCart(itemId) {
  const dish = window.appState.dishes.find(d => d.id === itemId);
  if (dish && dish.is_available === false) {
    showNotification("This item is currently sold out.", "error");
    return;
  }

  if (!window.appState.cart[itemId]) {
    window.appState.cart[itemId] = 1;
  } else {
    window.appState.cart[itemId] += 1;
  }
  if (typeof renderApp === 'function') renderApp();
}

function removeFromCart(itemId) {
  if (window.appState.cart[itemId]) {
    window.appState.cart[itemId] -= 1;
    if (window.appState.cart[itemId] <= 0) {
      delete window.appState.cart[itemId];
    }
  }
  if (typeof renderApp === 'function') renderApp();
}

function getCartCount() {
  return Object.values(window.appState.cart).reduce((sum, qty) => sum + qty, 0);
}

function calculateBill(customCart = null) {
  const targetCart = customCart || window.appState.cart;
  let subtotal = 0;
  for (const [id, qty] of Object.entries(targetCart)) {
    const item = window.appState.dishes.find(m => m.id === id);
    if (item) {
      subtotal += item.price * qty;
    }
  }
  const serviceCharge = Math.round(subtotal * 0.10 * 100) / 100;
  const vat = Math.round((subtotal + serviceCharge) * 0.15 * 100) / 100;
  const total = Math.round((subtotal + serviceCharge + vat) * 100) / 100;

  return { subtotal, serviceCharge, vat, total };
}

async function triggerCallWaiter() {
  try {
    const res = await fetch('/api/waiter-calls', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ table_number: window.appState.tableNumber })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      showNotification(err.error || "Please wait a moment before calling again.", "error");
      return;
    }
  } catch (e) {
    console.warn("Waiter call backend err", e);
  }
  showNotification(t("callWaiterSuccess"), "success");
}

async function placeOrder() {
  const { subtotal, serviceCharge, vat, total } = calculateBill();
  if (subtotal === 0) return;

  const itemsList = Object.entries(window.appState.cart).map(([id, qty]) => {
    const item = window.appState.dishes.find(m => m.id === id);
    return {
      id,
      title: item.title_en || item.titleEn,
      qty,
      price: item.price
    };
  });

  const payload = {
    table_number: window.appState.tableNumber,
    order_type: window.appState.orderType,
    customer_name: window.appState.customerName,
    customer_phone: window.appState.customerPhone,
    notes: window.appState.orderNotes,
    items: itemsList,
    subtotal,
    service_charge: serviceCharge,
    vat,
    total
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const createdOrder = await res.json();
      window.appState.cart = {};
      await loadBackendData();
      showOrderSuccessModal(createdOrder);
      return;
    } else {
      const err = await res.json().catch(() => ({}));
      showNotification(err.error || "Failed to place order. Please check inputs.", "error");
      return;
    }
  } catch (err) {
    console.warn("Placing order offline", err);
  }

  const orderNum = ++window.appState.tableOrderNumber;
  const fallbackOrder = {
    id: `ORD-${orderNum}`,
    table_number: window.appState.tableNumber,
    items: itemsList,
    total,
    status: "pending"
  };
  window.appState.cart = {};
  showOrderSuccessModal(fallbackOrder);
}

// XSS-Safe Notification Toast
function showNotification(msg, type = "info") {
  const existing = document.getElementById("app-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "app-toast";
  toast.className = `fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-2xl text-white font-bold text-xs flex items-center gap-2 transition-all transform duration-300 ${
    type === "success" ? "bg-emerald-900 border border-emerald-500" :
    type === "error" ? "bg-rose-900 border border-rose-500" :
    "bg-neutral-900 border border-neutral-700"
  }`;
  
  // Safe DOM construction preventing XSS injection
  const iconSpan = document.createElement("span");
  iconSpan.innerHTML = `
    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
  `;
  const textSpan = document.createElement("span");
  textSpan.textContent = msg;

  toast.appendChild(iconSpan);
  toast.appendChild(textSpan);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// XSS-Safe Order Confirmation Modal
function showOrderSuccessModal(order) {
  const existing = document.getElementById("orderSuccessModal");
  if (existing) existing.remove();

  const modal = document.createElement("div");
  modal.id = "orderSuccessModal";
  modal.className = "fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4";
  
  const safeId = escapeHtml(order.id || '');
  const safeTable = escapeHtml(order.table_number || '04');
  const safeTotal = Number(order.total || 0).toLocaleString();
  const safeCurrency = escapeHtml(t("currency"));

  const itemsHtml = (order.items || []).map(it => {
    const qty = Number(it.quantity || it.qty || 1);
    const title = escapeHtml(it.title || 'Item');
    const itemTotal = (Number(it.price || 0) * qty).toLocaleString();
    return `
      <div class="flex justify-between py-1">
        <span>${qty}x ${title}</span>
        <span>${itemTotal} ${safeCurrency}</span>
      </div>
    `;
  }).join("");

  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 animate-scaleUp">
      <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-800">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="text-xl font-black text-stone-900 mb-1">${escapeHtml(t("orderPlacedSuccess"))}</h3>
      <p class="text-xs text-stone-600 mb-4">${escapeHtml(t("orderSentToKitchen"))} (${safeId})</p>
      
      <div class="bg-stone-50 rounded-2xl p-4 text-left mb-5 border border-stone-100 text-xs space-y-2">
        <div class="flex justify-between font-bold text-stone-800">
          <span>TABLE ${safeTable}</span>
          <span class="text-emerald-700">${safeTotal} ${safeCurrency}</span>
        </div>
        <div class="text-stone-500 divide-y divide-stone-200/60 pt-1">
          ${itemsHtml}
        </div>
      </div>

      <div class="flex gap-2">
        <button onclick="document.getElementById('orderSuccessModal').remove(); switchTab('menu');" 
          class="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold">
          Back to Menu
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// Global exports
window.t = t;
window.setLanguage = setLanguage;
window.switchView = switchView;
window.switchTab = switchTab;
window.setCategory = setCategory;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.triggerCallWaiter = triggerCallWaiter;
window.placeOrder = placeOrder;
window.loadBackendData = loadBackendData;
window.loadAdminBackendData = loadAdminBackendData;
window.apiAddDish = apiAddDish;
window.apiUpdateDish = apiUpdateDish;
window.apiDeleteDish = apiDeleteDish;
window.apiUpdateOrderStatus = apiUpdateOrderStatus;
window.apiUploadImage = apiUploadImage;
window.showNotification = showNotification;
window.showOrderSuccessModal = showOrderSuccessModal;

document.addEventListener("DOMContentLoaded", () => {
  loadBackendData();
});
