/* ==========================================================================
   Catalog data. Replace with the client's real catalog / API response.
   Every string that a shopper reads has an English and an Arabic version.
   Prices are in Algerian dinars (DA), integers, VAT included.
   ========================================================================== */

const img = (name) => `img/${name}.webp`;

export const CATEGORIES = [
  { id: 'kitchens',   en: 'Kitchens',     ar: 'المطابخ',        img: img('kitchen-island-sm'),
    subs: [
      { title: ['By width', 'حسب العرض'], links: [['Kitchens 180 cm', 'مطابخ 180 سم'], ['Kitchens 240 cm', 'مطابخ 240 سم'], ['Kitchens 300 cm', 'مطابخ 300 سم'], ['Corner kitchens', 'مطابخ زاوية']] },
      { title: ['By style', 'حسب الطراز'], links: [['Modern', 'عصري'], ['Classic', 'كلاسيكي'], ['Compact', 'مدمج'], ['With island', 'مع جزيرة']] },
      { title: ['Complete it', 'أكمل مطبخك'], links: [['Sinks & taps', 'أحواض وحنفيات'], ['Built-in appliances', 'أجهزة مدمجة'], ['Worktops', 'أسطح عمل'], ['Free 3D design', 'تصميم ثلاثي الأبعاد مجاني']] },
    ],
    promo: { img: img('kitchen-white-sm'), en: 'Kitchens from 159 000 DA', ar: 'مطابخ ابتداءً من 159 000 دج' } },
  { id: 'bedrooms',   en: 'Bedrooms',     ar: 'غرف النوم',      img: img('bedroom-lux-sm'),
    subs: [
      { title: ['Bedroom sets', 'أطقم غرف النوم'], links: [['Complete sets', 'أطقم كاملة'], ['Wedding packages', 'باقات العرسان'], ['Modern', 'عصري'], ['Classic', 'كلاسيكي']] },
      { title: ['Furniture', 'الأثاث'], links: [['Beds', 'أسرّة'], ['Wardrobes', 'خزائن'], ['Dressers', 'تسريحات'], ['Bedside tables', 'طاولات جانبية']] },
      { title: ['Sleep', 'النوم'], links: [['Mattresses', 'أفرشة'], ['Pillows', 'وسائد'], ['Bed linen', 'مفارش']] },
    ],
    promo: { img: img('bedroom-calm-sm'), en: 'Wedding package: save 15%', ar: 'باقة العرسان: وفّر 15%' } },
  { id: 'living',     en: 'Living rooms', ar: 'الصالونات',      img: img('living-warm-sm'),
    subs: [
      { title: ['Seating', 'الجلوس'], links: [['Sofas', 'أرائك'], ['Corner sofas', 'أرائك زاوية'], ['Armchairs', 'كراسي'], ['Traditional salons', 'صالونات تقليدية']] },
      { title: ['Furniture', 'الأثاث'], links: [['TV units', 'طاولات التلفاز'], ['Coffee tables', 'طاولات القهوة'], ['Sideboards', 'بوفيهات'], ['Bookcases', 'مكتبات']] },
    ],
    promo: { img: img('living-beige-sm'), en: 'Corner sofas -28%', ar: 'أرائك الزاوية -28%' } },
  { id: 'sofas',      en: 'Sofas',        ar: 'الأرائك',        img: img('living-tufted-sm'),
    subs: [
      { title: ['By size', 'حسب الحجم'], links: [['2 seats', 'مقعدان'], ['3 seats', '3 مقاعد'], ['Corner', 'زاوية'], ['Modular', 'معيارية']] },
      { title: ['By fabric', 'حسب القماش'], links: [['Velvet', 'مخمل'], ['Bouclé', 'بوكليه'], ['Leather look', 'جلد صناعي'], ['Linen', 'كتان']] },
    ],
    promo: { img: img('living-rattan-sm'), en: 'Choose your fabric in 3D', ar: 'اختر قماشك بتقنية 3D' } },
  { id: 'kids',       en: "Kids' rooms",  ar: 'غرف الأطفال',    img: img('bedroom-boho-sm'),
    subs: [ { title: ['Kids', 'الأطفال'], links: [['Kids beds', 'أسرّة أطفال'], ['Desks', 'مكاتب'], ['Storage', 'تخزين'], ['Bunk beds', 'أسرّة طابقية']] } ],
    promo: { img: img('bedroom-boho-sm'), en: 'Back-to-school desks', ar: 'مكاتب الدخول المدرسي' } },
  { id: 'bathrooms',  en: 'Bathrooms',    ar: 'الحمّامات',      img: img('bath-tub-sm'),
    subs: [ { title: ['Bathroom', 'الحمّام'], links: [['Vanities', 'خزائن الحمّام'], ['Bathtubs', 'أحواض استحمام'], ['Mirrors', 'مرايا'], ['Taps', 'حنفيات']] } ],
    promo: { img: img('bath-plants-sm'), en: 'Vanities from 59 000 DA', ar: 'خزائن من 59 000 دج' } },
  { id: 'dining',     en: 'Dining',       ar: 'غرف الطعام',     img: img('dining-green-sm'),
    subs: [ { title: ['Dining', 'الطعام'], links: [['Dining sets', 'أطقم طعام'], ['Tables', 'طاولات'], ['Chairs', 'كراسي'], ['Bar stools', 'كراسي بار']] } ],
    promo: { img: img('dining-wood-sm'), en: 'Table + 6 chairs deals', ar: 'عروض طاولة و6 كراسي' } },
  { id: 'outdoor',    en: 'Outdoor',      ar: 'الحديقة',        img: img('outdoor-pool-sm'),
    subs: [ { title: ['Outdoor', 'الخارج'], links: [['Lounge sets', 'أطقم جلوس'], ['Dining sets', 'أطقم طعام'], ['Parasols', 'مظلات']] } ],
    promo: { img: img('outdoor-pool-sm'), en: 'Terrace season', ar: 'موسم التراس' } },
  { id: 'appliances', en: 'Appliances',   ar: 'الأجهزة',        img: img('kitchen-counter-sm'),
    subs: [ { title: ['Appliances', 'الأجهزة'], links: [['Ovens', 'أفران'], ['Hobs', 'مواقد'], ['Hoods', 'شفاطات'], ['Fridges', 'ثلاجات']] } ],
    promo: { img: img('kitchen-counter-sm'), en: 'Oven + hob packs', ar: 'باقات فرن وموقد' } },
  { id: 'decor',      en: 'Home décor',   ar: 'الديكور',        img: img('decor-shelves-sm'),
    subs: [ { title: ['Décor', 'الديكور'], links: [['Rugs', 'زرابي'], ['Mirrors', 'مرايا'], ['Lighting', 'إنارة'], ['Shelves', 'رفوف']] } ],
    promo: { img: img('decor-rug-sm'), en: 'Handwoven rugs', ar: 'زرابي منسوجة يدويًا' } },
];

export const COLORS = {
  white:     { hex: '#F4F1EC', en: 'White',      ar: 'أبيض' },
  ivory:     { hex: '#E9E0D2', en: 'Ivory',      ar: 'عاجي' },
  beige:     { hex: '#CDBBA3', en: 'Beige',      ar: 'بيج' },
  oak:       { hex: '#B98A5A', en: 'Oak',        ar: 'بلوط' },
  walnut:    { hex: '#6B4630', en: 'Walnut',     ar: 'جوز' },
  grey:      { hex: '#9A9A9C', en: 'Grey',       ar: 'رمادي' },
  anthracite:{ hex: '#3B3D42', en: 'Anthracite', ar: 'أنثراسيت' },
  green:     { hex: '#2F5D50', en: 'Green',      ar: 'أخضر' },
  blue:      { hex: '#7F9DB5', en: 'Blue',       ar: 'أزرق' },
  terracotta:{ hex: '#C0633B', en: 'Terracotta', ar: 'طوبي' },
  yellow:    { hex: '#E3B23C', en: 'Yellow',     ar: 'أصفر' },
  black:     { hex: '#1F1C1D', en: 'Black',      ar: 'أسود' },
};

export const MATERIALS = {
  fabric:  { en: 'Fabric',        ar: 'قماش' },
  velvet:  { en: 'Velvet',        ar: 'مخمل' },
  wood:    { en: 'Solid wood',    ar: 'خشب صلب' },
  panel:   { en: 'Melamine panel', ar: 'لوح ميلامين' },
  lacquer: { en: 'Lacquered',     ar: 'مطلي' },
  metal:   { en: 'Metal',         ar: 'معدن' },
  wool:    { en: 'Wool',          ar: 'صوف' },
  foam:    { en: 'Memory foam',   ar: 'إسفنج ذكي' },
};

export const STYLES = {
  modern:  { en: 'Modern',  ar: 'عصري' },
  classic: { en: 'Classic', ar: 'كلاسيكي' },
  compact: { en: 'Compact', ar: 'مدمج' },
};

/* p(): compact product factory so the list below stays readable.
   finish: [en, ar]. colors: keys of COLORS. badges: new | promo | delivery | assembly | best */
const p = (id, cat, en, ar, finish, w, price, old, pics, opts = {}) => ({
  id, cat, name: { en, ar }, finish: { en: finish[0], ar: finish[1] }, width: w,
  price, old, img: img(pics[0]), img2: img(pics[1] || pics[0]),
  gallery: (opts.gallery || pics).map(img),
  sku: `EAF-${String(cat).slice(0, 3).toUpperCase()}-${(Math.abs([...id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7)) % 90000) + 10000}`,
  colors: opts.colors || ['white'], material: opts.material || 'panel', style: opts.style || 'modern',
  stock: opts.stock || 'in', badges: opts.badges || [], rating: opts.rating || 4.6, reviews: opts.reviews || 24,
  sofa3d: opts.sofa3d || null, tags: opts.tags || [], dims: opts.dims || { w, d: 90, h: 85 },
});

export const PRODUCTS = [
  // ---- sofas & living
  p('tassili-corner', 'sofas', 'Tassili corner sofa', 'أريكة زاوية تاسيلي', ['bouclé ivory', 'بوكليه عاجي'], 285, 129000, 179000,
    ['living-beige-sm', 'living-warm-sm'], { gallery: ['living-beige', 'living-warm', 'living-lux'], colors: ['ivory', 'beige', 'grey'], material: 'fabric', badges: ['promo', 'delivery'], rating: 4.8, reviews: 112, sofa3d: '#E9E0D2', tags: ['living', 'best'], dims: { w: 285, d: 165, h: 82 } }),
  p('hoggar-3', 'sofas', 'Hoggar 3-seat velvet sofa', 'أريكة هقار مخملية 3 مقاعد', ['forest green velvet', 'مخمل أخضر غامق'], 220, 89000, 119000,
    ['p-sofa-green', 'living-rattan-sm'], { gallery: ['p-sofa-green', 'living-rattan', 'living-boho'], colors: ['green', 'blue', 'terracotta'], material: 'velvet', badges: ['promo', 'best'], rating: 4.9, reviews: 86, sofa3d: '#2F5D50', tags: ['living', 'best'], dims: { w: 220, d: 92, h: 84 } }),
  p('casbah-2', 'sofas', 'Casbah 2-seat sofa', 'أريكة القصبة بمقعدين', ['saffron weave', 'نسيج زعفراني'], 175, 64900, 79000,
    ['p-sofa-yellow', 'living-light-sm'], { gallery: ['p-sofa-yellow', 'living-light'], colors: ['yellow', 'grey'], material: 'fabric', badges: ['promo'], sofa3d: '#E3B23C', tags: ['living', 'best'], dims: { w: 175, d: 88, h: 80 } }),
  p('medina-tufted', 'sofas', 'Medina tufted sofa', 'أريكة المدينة المنجّدة', ['pearl grey', 'رمادي لؤلؤي'], 230, 99000, 129000,
    ['p-sofa-tufted', 'living-tufted-sm'], { gallery: ['p-sofa-tufted', 'living-tufted'], colors: ['grey', 'beige'], material: 'fabric', style: 'classic', badges: ['promo'], rating: 4.7, reviews: 41, sofa3d: '#9A9A9C', tags: ['living'], dims: { w: 230, d: 95, h: 86 } }),
  p('oasis-3', 'sofas', 'Oasis 3-seat sofa', 'أريكة الواحة 3 مقاعد', ['terracotta', 'طوبي'], 210, 79000, 99000,
    ['p-sofa-orange', 'decor-orange-sm'], { gallery: ['p-sofa-orange', 'decor-orange'], colors: ['terracotta', 'beige'], material: 'velvet', badges: ['new', 'promo'], sofa3d: '#C0633B', tags: ['living', 'best'], dims: { w: 210, d: 90, h: 82 } }),
  p('tipaza-modular', 'sofas', 'Tipaza modular sofa', 'أريكة تيبازة المعيارية', ['anthracite', 'أنثراسيت'], 320, 189000, 239000,
    ['living-dark-sm', 'living-grey-sm'], { gallery: ['living-dark', 'living-grey', 'living-modern'], colors: ['anthracite', 'grey'], material: 'fabric', badges: ['new'], rating: 4.6, reviews: 18, sofa3d: '#3B3D42', tags: ['living'], dims: { w: 320, d: 170, h: 80 } }),
  p('sahel-armchair', 'living', 'Sahel lounge armchair', 'كرسي الساحل للاسترخاء', ['mustard', 'خردلي'], 82, 34900, 42900,
    ['p-armchair-yellow', 'living-boho-sm'], { colors: ['yellow', 'green'], material: 'fabric', badges: ['promo'], tags: ['best'], dims: { w: 82, d: 80, h: 92 } }),
  p('chenoua-armchair', 'living', 'Chenoua reading armchair', 'كرسي شنوة للقراءة', ['mist blue', 'أزرق ضبابي'], 90, 39900, null,
    ['p-armchair-blue', 'living-white-sm'], { colors: ['blue', 'grey'], material: 'fabric', badges: ['new'], dims: { w: 90, d: 86, h: 98 } }),
  p('ghardaia-tv', 'living', 'Ghardaïa TV unit', 'طاولة تلفاز غرداية', ['natural oak', 'بلوط طبيعي'], 200, 34900, 44900,
    ['living-modern-sm', 'living-grey-sm'], { colors: ['oak', 'white'], material: 'panel', badges: ['promo', 'assembly'], dims: { w: 200, d: 42, h: 50 } }),
  p('djemila-coffee', 'living', 'Djemila coffee table', 'طاولة قهوة جميلة', ['travertine look', 'مظهر الترافرتين'], 90, 18900, 24900,
    ['decor-console-sm', 'living-white-sm'], { colors: ['beige', 'walnut'], material: 'wood', badges: ['promo'], tags: ['best'], dims: { w: 90, d: 90, h: 38 } }),

  // ---- kitchens
  p('djurdjura-240', 'kitchens', 'Djurdjura kitchen 240 cm', 'مطبخ جرجرة 240 سم', ['white gloss & oak', 'أبيض لامع وبلوط'], 240, 289000, 359000,
    ['kitchen-island-sm', 'kitchen-white-sm'], { gallery: ['kitchen-island', 'kitchen-white'], colors: ['white', 'oak'], material: 'lacquer', style: 'modern', badges: ['promo', 'assembly'], rating: 4.8, reviews: 64, tags: ['best'], dims: { w: 240, d: 60, h: 220 } }),
  p('atlas-300', 'kitchens', 'Atlas kitchen 300 cm', 'مطبخ الأطلس 300 سم', ['anthracite matt', 'أنثراسيت مطفي'], 300, 449000, 529000,
    ['kitchen-grey-sm', 'kitchen-counter-sm'], { gallery: ['kitchen-grey', 'kitchen-counter'], colors: ['anthracite', 'oak'], material: 'lacquer', style: 'modern', badges: ['promo', 'assembly'], rating: 4.7, reviews: 23, dims: { w: 300, d: 60, h: 220 } }),
  p('cirta-270', 'kitchens', 'Cirta kitchen 270 cm', 'مطبخ سيرتا 270 سم', ['navy & walnut', 'كحلي وجوز'], 270, 379000, null,
    ['kitchen-wood-sm', 'kitchen-island-sm'], { gallery: ['kitchen-wood', 'kitchen-island'], colors: ['blue', 'walnut'], material: 'wood', style: 'classic', badges: ['new', 'assembly'], dims: { w: 270, d: 60, h: 220 } }),
  p('hippone-240', 'kitchens', 'Hippone classic kitchen 240 cm', 'مطبخ هيبون الكلاسيكي 240 سم', ['ivory shaker', 'عاجي كلاسيكي'], 240, 319000, 369000,
    ['kitchen-white-sm', 'kitchen-counter-sm'], { gallery: ['kitchen-white', 'kitchen-counter'], colors: ['ivory', 'white'], material: 'wood', style: 'classic', badges: ['promo'], dims: { w: 240, d: 60, h: 220 } }),
  p('saoura-180', 'kitchens', 'Saoura compact kitchen 180 cm', 'مطبخ الساورة المدمج 180 سم', ['white & concrete', 'أبيض وإسمنتي'], 180, 159000, 189000,
    ['kitchen-counter-sm', 'kitchen-white-sm'], { gallery: ['kitchen-counter', 'kitchen-white'], colors: ['white', 'grey'], material: 'panel', style: 'compact', badges: ['promo', 'best'], rating: 4.5, reviews: 57, tags: ['best'], dims: { w: 180, d: 60, h: 210 } }),
  p('mansourah-200', 'kitchens', 'Mansourah compact kitchen 200 cm', 'مطبخ المنصورة المدمج 200 سم', ['soft white', 'أبيض ناعم'], 200, 179000, null,
    ['dining-loft-sm', 'kitchen-counter-sm'], { gallery: ['dining-loft', 'kitchen-counter'], colors: ['white', 'oak'], material: 'panel', style: 'compact', badges: ['new'], dims: { w: 200, d: 60, h: 210 } }),

  // ---- bedrooms
  p('seybouse-set', 'bedrooms', 'Seybouse bedroom set, 4-door', 'غرفة نوم سيبوس، خزانة 4 أبواب', ['white oak', 'بلوط أبيض'], 200, 249000, 319000,
    ['bedroom-lux-sm', 'bedroom-calm-sm'], { gallery: ['bedroom-lux', 'bedroom-calm', 'bedroom-hotel'], colors: ['white', 'oak'], material: 'panel', badges: ['promo', 'delivery', 'assembly'], rating: 4.8, reviews: 97, tags: ['best'], dims: { w: 200, d: 60, h: 230 } }),
  p('timgad-bed', 'bedrooms', 'Timgad upholstered bed 160×200', 'سرير تيمقاد منجّد 160×200', ['grey velvet', 'مخمل رمادي'], 176, 79000, 99000,
    ['bedroom-chandelier-sm', 'bedroom-art-sm'], { gallery: ['bedroom-chandelier', 'bedroom-art'], colors: ['grey', 'beige'], material: 'velvet', style: 'classic', badges: ['promo'], dims: { w: 176, d: 215, h: 120 } }),
  p('aures-wardrobe', 'bedrooms', 'Aurès wardrobe, 4 doors', 'خزانة الأوراس 4 أبواب', ['natural oak', 'بلوط طبيعي'], 200, 99000, 129000,
    ['storage-wardrobe-sm', 'bedroom-minimal-sm'], { colors: ['oak', 'white'], material: 'panel', badges: ['promo', 'assembly'], dims: { w: 200, d: 58, h: 236 } }),
  p('tamanrasset-set', 'bedrooms', 'Tamanrasset bedroom set', 'غرفة نوم تمنراست', ['anthracite & walnut', 'أنثراسيت وجوز'], 180, 299000, null,
    ['bedroom-dark-sm', 'bedroom-classic-sm'], { gallery: ['bedroom-dark', 'bedroom-classic'], colors: ['anthracite', 'walnut'], material: 'panel', badges: ['new'], dims: { w: 180, d: 60, h: 230 } }),
  p('nour-mattress', 'bedrooms', 'Nour memory-foam mattress 160×190', 'فراش نور من الإسفنج الذكي 160×190', ['medium-firm', 'متوسط الصلابة'], 160, 42000, 56000,
    ['bedroom-hotel-sm', 'bedroom-calm-sm'], { colors: ['white'], material: 'foam', badges: ['promo', 'delivery'], rating: 4.7, reviews: 133, tags: ['best'], dims: { w: 160, d: 190, h: 26 } }),

  // ---- kids
  p('kenza-kids-bed', 'kids', 'Kenza kids bed 90×190', 'سرير أطفال كنزة 90×190', ['white & sage', 'أبيض وأخضر فاتح'], 96, 45000, 54000,
    ['bedroom-boho-sm', 'decor-shelves-sm'], { colors: ['white', 'green'], material: 'wood', badges: ['promo'], dims: { w: 96, d: 196, h: 90 } }),
  p('amine-desk', 'kids', 'Amine desk with shelves', 'مكتب أمين مع رفوف', ['white & oak', 'أبيض وبلوط'], 120, 24900, null,
    ['decor-shelves-sm', 'bedroom-boho-sm'], { colors: ['white', 'oak'], material: 'panel', badges: ['new', 'assembly'], dims: { w: 120, d: 55, h: 140 } }),

  // ---- dining
  p('zibane-set', 'dining', 'Zibane dining set, table + 6 chairs', 'طقم طعام الزيبان: طاولة و6 كراسي', ['walnut & green velvet', 'جوز ومخمل أخضر'], 180, 119000, 149000,
    ['dining-green-sm', 'dining-wood-sm'], { gallery: ['dining-green', 'dining-wood'], colors: ['walnut', 'green'], material: 'wood', badges: ['promo', 'best'], rating: 4.8, reviews: 52, tags: ['best'], dims: { w: 180, d: 90, h: 76 } }),
  p('kabylie-table', 'dining', 'Kabylie solid wood table 220', 'طاولة القبائل من الخشب الصلب 220', ['natural walnut', 'جوز طبيعي'], 220, 89000, null,
    ['dining-wood-sm', 'dining-green-sm'], { colors: ['walnut', 'oak'], material: 'wood', style: 'classic', dims: { w: 220, d: 100, h: 76 } }),
  p('nora-chair', 'dining', 'Nora dining chair', 'كرسي طعام نورة', ['matt black', 'أسود مطفي'], 48, 6900, 8900,
    ['p-chair-black', 'dining-loft-sm'], { colors: ['black', 'white'], material: 'metal', badges: ['promo'], dims: { w: 48, d: 52, h: 82 } }),
  p('kalaa-stool', 'dining', 'Kalaa bar stool', 'كرسي بار القلعة', ['bleached ash', 'دردار فاتح'], 40, 5900, null,
    ['p-stool', 'kitchen-island-sm'], { colors: ['white', 'oak'], material: 'wood', dims: { w: 40, d: 40, h: 75 } }),

  // ---- bathrooms
  p('hammam-bath', 'bathrooms', 'Hammam freestanding bath + vanity', 'حوض حمّام قائم مع خزانة', ['matt white', 'أبيض مطفي'], 170, 129000, 159000,
    ['bath-tub-sm', 'bath-plants-sm'], { colors: ['white'], material: 'lacquer', badges: ['promo', 'assembly'], dims: { w: 170, d: 80, h: 60 } }),
  p('babor-vanity', 'bathrooms', 'Babor bathroom vanity 100 cm', 'خزانة حمّام بابور 100 سم', ['white & oak', 'أبيض وبلوط'], 100, 59000, null,
    ['bath-plants-sm', 'bath-tub-sm'], { colors: ['white', 'oak'], material: 'panel', badges: ['new'], dims: { w: 100, d: 46, h: 85 } }),

  // ---- outdoor
  p('corniche-lounge', 'outdoor', 'Corniche outdoor lounge set', 'طقم حديقة الكورنيش', ['sand & teak', 'رملي وخشب الساج'], 260, 129000, 169000,
    ['outdoor-pool-sm', 'living-white-sm'], { colors: ['beige', 'oak'], material: 'wood', badges: ['promo', 'delivery'], dims: { w: 260, d: 180, h: 70 } }),

  // ---- appliances
  p('duo-oven-hob', 'appliances', 'Duo oven + induction hob pack', 'طقم فرن وموقد تحريضي', ['black glass', 'زجاج أسود'], 60, 89000, 109000,
    ['kitchen-counter-sm', 'kitchen-grey-sm'], { colors: ['black'], material: 'metal', badges: ['promo'], dims: { w: 60, d: 56, h: 60 } }),

  // ---- decor
  p('amazigh-rug', 'decor', 'Amazigh wool rug 200×300', 'زربية أمازيغية من الصوف 200×300', ['natural & ochre', 'طبيعي ومغرة'], 200, 24900, 32900,
    ['decor-rug-sm', 'living-boho-sm'], { colors: ['beige', 'terracotta'], material: 'wool', badges: ['promo'], tags: ['best'], dims: { w: 200, d: 300, h: 1 } }),
  p('oran-sideboard', 'decor', 'Oran sideboard 180', 'بوفيه وهران 180', ['oak & cane', 'بلوط وخيزران'], 180, 54900, 64900,
    ['decor-sideboard-sm', 'decor-orange-sm'], { colors: ['oak'], material: 'wood', badges: ['promo'], dims: { w: 180, d: 45, h: 78 } }),
  p('bejaia-console', 'decor', 'Béjaïa console & mirror', 'كونسول ومرآة بجاية', ['white & brass', 'أبيض ونحاسي'], 120, 19900, null,
    ['storage-white-sm', 'decor-console-sm'], { colors: ['white'], material: 'panel', badges: ['new'], dims: { w: 120, d: 35, h: 80 } }),
];

/* Living rooms show their own items plus all sofas. */
export function productsIn(cat) {
  if (!cat || cat === 'all') return PRODUCTS;
  if (cat === 'promotions') return PRODUCTS.filter((x) => x.old);
  if (cat === 'living') return PRODUCTS.filter((x) => x.cat === 'living' || x.cat === 'sofas');
  return PRODUCTS.filter((x) => x.cat === cat);
}
export const byId = (id) => PRODUCTS.find((x) => x.id === id);

/* Showroom locations. Coordinates are approximate city centres; replace with
   the client's real addresses before launch. */
export const STORES = [
  { id: 'alger-bab-ezzouar', city: 'Alger',       cityAr: 'الجزائر العاصمة', area: 'Bab Ezzouar',  areaAr: 'باب الزوار', lat: 36.7213, lng: 3.1840, phone: '+213 23 00 00 01', flagship: true },
  { id: 'alger-cheraga',     city: 'Alger',       cityAr: 'الجزائر العاصمة', area: 'Chéraga',      areaAr: 'الشراقة',    lat: 36.7660, lng: 2.9590, phone: '+213 23 00 00 02' },
  { id: 'blida',             city: 'Blida',       cityAr: 'البليدة',         area: 'Factory showroom', areaAr: 'معرض المصنع', lat: 36.4700, lng: 2.8277, phone: '+213 25 00 00 03', factory: true },
  { id: 'oran',              city: 'Oran',        cityAr: 'وهران',           area: 'Es Senia',     areaAr: 'السانية',    lat: 35.6460, lng: -0.6200, phone: '+213 41 00 00 04' },
  { id: 'constantine',       city: 'Constantine', cityAr: 'قسنطينة',         area: 'Ali Mendjeli', areaAr: 'علي منجلي',  lat: 36.2480, lng: 6.5710, phone: '+213 31 00 00 05' },
  { id: 'setif',             city: 'Sétif',       cityAr: 'سطيف',            area: 'El Hidhab',    areaAr: 'الهضاب',     lat: 36.1900, lng: 5.4100, phone: '+213 36 00 00 06' },
  { id: 'annaba',            city: 'Annaba',      cityAr: 'عنابة',           area: 'Sidi Amar',    areaAr: 'سيدي عمار',  lat: 36.8190, lng: 7.7130, phone: '+213 38 00 00 07' },
  { id: 'tlemcen',           city: 'Tlemcen',     cityAr: 'تلمسان',          area: 'Kiffane',      areaAr: 'الكيفان',    lat: 34.8800, lng: -1.3200, phone: '+213 43 00 00 08' },
];

export const HOURS = { en: 'Sat to Thu · 9:00 to 20:00 · Fri 14:00 to 20:00', ar: 'من السبت إلى الخميس · 9:00 إلى 20:00 · الجمعة 14:00 إلى 20:00' };

/* All wilayas could be listed here; the checkout only needs the ones served. */
export const WILAYAS = ['Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa', 'Relizane'];

/* Placeholder reviews for layout only. Replace with verified customer reviews before launch. */
export const REVIEWS = [
  { name: 'Amina B.', city: 'Blida', stars: 5, en: 'We furnished the whole salon for our wedding. Delivery came on the agreed day and the fitters assembled everything in two hours.', ar: 'أثّثنا الصالون كاملًا لعرسنا. وصل التوصيل في اليوم المتفق عليه وركّب العمال كل شيء في ساعتين.' },
  { name: 'Yacine K.', city: 'Oran', stars: 5, en: 'The 3D kitchen plan helped a lot. The Djurdjura kitchen fits our wall to the centimetre.', ar: 'ساعدني مخطط المطبخ ثلاثي الأبعاد كثيرًا. مطبخ جرجرة يناسب الجدار بالسنتيمتر.' },
  { name: 'Sarah M.', city: 'Constantine', stars: 4, en: 'Very good price for the quality. I paid in installments through my bank, the file was ready in one visit.', ar: 'سعر ممتاز مقابل الجودة. دفعت بالتقسيط عبر بنكي وكان الملف جاهزًا من زيارة واحدة.' },
];
