/* ==========================================================================
   i18n: English (default, authored in the HTML) and Arabic (RTL).
   - Static markup: data-i18n="key" (innerHTML), data-i18n-ph (placeholder),
     data-i18n-aria (aria-label). The English original is cached on first
     switch, so the HTML stays the single source for English.
   - Script-rendered text: t('key') from STR, L({en, ar}) for data objects.
   ========================================================================== */
import { AR } from './ar.js';

const KEY = 'eaf-lang';

export const lang = () => (document.documentElement.lang === 'ar' ? 'ar' : 'en');
export const isAr = () => lang() === 'ar';
export const L = (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang()] ?? o.en);

export const STR = {
  add_to_cart:    ['Add to cart', 'أضف إلى السلة'],
  added:          ['Added to your cart', 'أُضيف إلى سلتك'],
  view_cart:      ['View cart', 'عرض السلة'],
  wish_add:       ['Add to wishlist', 'أضف إلى المفضلة'],
  wish_added:     ['Saved to your wishlist', 'حُفظ في المفضلة'],
  wish_removed:   ['Removed from your wishlist', 'أُزيل من المفضلة'],
  per_month:      ['or <b>{0}</b>/month over {1} months', 'أو <b>{0}</b> شهريًا على {1} شهرًا'],
  width:          ['W {0} cm', 'العرض {0} سم'],
  results:        ['{0} products', '{0} منتج'],
  no_results:     ['No products match these filters.', 'لا توجد منتجات تطابق هذه الفلاتر.'],
  search_none:    ['No match. Press Enter to search the whole catalog.', 'لا نتائج. اضغط Enter للبحث في كامل الكتالوج.'],
  all_in:         ['All {0}', 'كل {0}'],
  promotions:     ['Promotions', 'العروض'],
  showroom:       ['3D showroom', 'المعرض ثلاثي الأبعاد'],
  days:           ['days', 'أيام'],
  hours:          ['hrs', 'سا'],
  mins:           ['min', 'د'],
  secs:           ['sec', 'ث'],
  badge_new:      ['New', 'جديد'],
  badge_promo:    ['Promo', 'عرض'],
  badge_best:     ['Best price', 'أفضل سعر'],
  badge_delivery: ['Free delivery', 'توصيل مجاني'],
  badge_assembly: ['Assembly included', 'التركيب مشمول'],
  in_stock:       ['In stock, delivered in 5 to 10 days', 'متوفر، التوصيل خلال 5 إلى 10 أيام'],
  low_stock:      ['Only a few left', 'كمية محدودة'],
  on_order:       ['Made to order, 3 to 4 weeks', 'حسب الطلب، 3 إلى 4 أسابيع'],
  qty:            ['Quantity', 'الكمية'],
  remove:         ['Remove', 'حذف'],
  free:           ['Free', 'مجاني'],
  cart_empty:     ['Your cart is empty.', 'سلتك فارغة.'],
  wishlist:       ['Wishlist', 'المفضلة'],
  search_for:     ['Results for “{0}”', 'نتائج البحث عن «{0}»'],
  stock_yes:      ['Available', 'متوفر'],
  stock_low:      ['A few left', 'كمية قليلة'],
  stock_no:       ['On order', 'حسب الطلب'],
  directions:     ['Get directions', 'الاتجاهات'],
  call:           ['Call', 'اتصال'],
  flagship:       ['Flagship', 'المعرض الرئيسي'],
  factory:        ['Factory', 'المصنع'],
  stores_count:   ['{0} showrooms', '{0} معارض'],
  colour:         ['Colour', 'اللون'],
  close:          ['Close', 'إغلاق'],
  order_no:       ['Order number', 'رقم الطلب'],
  delivery_fee:   ['Delivery', 'التوصيل'],
  assembly_fee:   ['Assembly', 'التركيب'],
  each:           ['each', 'للقطعة'],
  rating_of:      ['{0} out of 5, {1} reviews', '{0} من 5، {1} تقييم'],
  view_product:   ['Discover', 'اكتشف'],
  home:           ['Home', 'الرئيسية'],
  catalog:        ['All furniture', 'كل الأثاث'],
  show_n:         ['Show {0} products', 'عرض {0} منتج'],
  shown:          ['You have seen {0} of {1} products', 'شاهدت {0} من {1} منتج'],
  w_lt180:        ['Under 180 cm', 'أقل من 180 سم'],
  w_180_240:      ['180 to 240 cm', '180 إلى 240 سم'],
  w_240_300:      ['240 to 300 cm', '240 إلى 300 سم'],
  w_gt300:        ['Over 300 cm', 'أكثر من 300 سم'],
  range:          ['{0} to {1}', 'من {0} إلى {1}'],
  remove_filter:  ['Remove filter', 'إزالة الفلتر'],
  seo_title:      ['{0} at factory prices', '{0} بأسعار المصنع'],
  seo_p1:         ['Every piece in our {0} range is designed and built in our Blida factory, then sold without a middleman. That is how a corner sofa, a fitted kitchen or a complete bedroom costs less here than in a classic furniture store, with the same materials and a real warranty.', 'كل قطعة في تشكيلة {0} مصمّمة ومصنوعة في مصنعنا بالبليدة، وتُباع دون وسيط. لهذا تكلّف أريكة الزاوية أو المطبخ أو غرفة النوم الكاملة أقل عندنا من متجر أثاث تقليدي، بنفس المواد وبضمان حقيقي.'],
  seo_p2:         ['We deliver to every wilaya and our own fitters assemble your furniture on the day you choose. Because our furniture is made in Algeria, you can pay in installments through your bank\'s consumer credit: bring your ID and pay slip to any showroom and we prepare the file with you.', 'نوصل إلى كل الولايات ويركّب عمالنا أثاثك في اليوم الذي تختاره. ولأن أثاثنا مصنوع في الجزائر، يمكنك الدفع بالتقسيط عبر القرض الاستهلاكي لبنكك: أحضر بطاقة التعريف وكشف الراتب إلى أي معرض ونجهّز الملف معك.'],
  search_title:   ['Search', 'بحث'],
  you_save:       ['You save {0}', 'توفّر {0}'],
  d_width:        ['Width', 'العرض'],
  d_depth:        ['Depth', 'العمق'],
  d_height:       ['Height', 'الارتفاع'],
  front:          ['Front view', 'منظر أمامي'],
  side:           ['Side view', 'منظر جانبي'],
  material:       ['Material', 'المادة'],
  finish:         ['Finish', 'التشطيب'],
  colours:        ['Colours', 'الألوان'],
  origin:         ['Made in', 'صُنع في'],
  origin_v:       ['Blida, Algeria', 'البليدة، الجزائر'],
  care:           ['Care', 'العناية'],
  desc_intro:     ['{0} is designed and built in our Blida factory. The {1} finish is chosen to live with a family every day: easy to clean, steady in colour, and covered by our warranty.', 'صُمّم {0} وصُنع في مصنعنا بالبليدة. اخترنا تشطيب {1} ليعيش مع العائلة كل يوم: سهل التنظيف، ثابت اللون، ومشمول بضماننا.'],
  desc_more:      ['Come and try it in any showroom before you decide. Our advisers can show you every colour in real fabric or finish.', 'تعال وجرّبه في أي معرض قبل أن تقرّر. يمكن لمستشارينا أن يُروك كل الألوان بالقماش أو التشطيب الحقيقي.'],
  desc_why:       ['Why you will like it', 'لماذا سيعجبك'],
  pt1:            ['Delivered and assembled by our own team', 'التوصيل والتركيب من فريقنا'],
  pt2:            ['Warranty on frame and structure', 'ضمان على الهيكل'],
  pt3:            ['Made in Algeria, eligible for bank installments', 'صُنع في الجزائر، مؤهّل للتقسيط البنكي'],
  pt4:            ['Spare parts and fabric kept in stock', 'قطع الغيار والقماش متوفرة دائمًا'],
  dl_assembly:    ['Assembly instructions', 'دليل التركيب'],
  dl_sheet:       ['Technical sheet', 'البطاقة التقنية'],
  dl_care:        ['Care guide', 'دليل العناية'],
  dl_meta:        ['PDF', 'PDF'],
  size:           ['Size', 'المقاس'],
  hint_dims:      ['Measurements in centimetres. Check door and stair widths before delivery day.', 'القياسات بالسنتيمتر. تحقّق من عرض الأبواب والدرج قبل يوم التوصيل.'],
  care_fabric:    ['Vacuum weekly. Dab stains with a damp cloth, never rub.', 'نظّف بالمكنسة أسبوعيًا. امسح البقع بقطعة مبللة دون فرك.'],
  care_velvet:    ['Brush in the direction of the pile. Keep out of direct sun.', 'نظّف بالفرشاة في اتجاه الوبر. أبعده عن الشمس المباشرة.'],
  care_wood:      ['Dust with a dry cloth. Feed with wood oil twice a year.', 'امسح الغبار بقطعة جافة. عالج الخشب بالزيت مرتين في السنة.'],
  care_panel:     ['Wipe with a soft damp cloth and dry immediately.', 'امسح بقطعة ناعمة مبللة وجفّف فورًا.'],
  care_lacquer:   ['Mild soap and a microfibre cloth. No abrasive products.', 'صابون خفيف وقطعة ميكروفايبر. لا منتجات كاشطة.'],
  care_metal:     ['Wipe with a damp cloth. Felt pads protect your floor.', 'امسح بقطعة مبللة. اللبّاد يحمي أرضيتك.'],
  care_wool:      ['Vacuum without the beater bar. Turn twice a year.', 'نظّف بالمكنسة دون الفرشاة الدوّارة. اقلبها مرتين في السنة.'],
  care_foam:      ['Rotate every three months. Use a protector.', 'اقلبه كل ثلاثة أشهر. استعمل غطاءً واقيًا.'],
  c_go1:          ['Checkout', 'إتمام الطلب'],
  c_go2:          ['Continue to payment', 'المتابعة إلى الدفع'],
  c_go3:          ['Place order', 'تأكيد الطلب'],
  subtotal:       ['Subtotal ({0} items)', 'المجموع الفرعي ({0} قطع)'],
  savings:        ['Your savings', 'توفيرك'],
  total:          ['Total', 'المجموع'],
  required:       ['This field is required.', 'هذا الحقل مطلوب.'],
  phone_bad:      ['Enter a mobile number starting with 05, 06 or 07.', 'أدخل رقم هاتف يبدأ بـ 05 أو 06 أو 07.'],
  terms_bad:      ['Please accept the terms of sale.', 'يرجى قبول شروط البيع.'],
  choose:         ['Choose…', 'اختر…'],
  assembly_opt:   ['Assembly', 'التركيب'],
  included:       ['included', 'مشمول'],
  fin_credit:     ['From {0}/month over 36 months', 'ابتداءً من {0} شهريًا على 36 شهرًا'],
  open_now:       ['Open now · closes at {0}', 'مفتوح الآن · يغلق على {0}'],
  closed_now:     ['Closed · opens at {0}', 'مغلق · يفتح على {0}'],
  km:             ['{0} km', '{0} كم'],
  geo_fail:       ['Location unavailable. Type your city instead.', 'تعذّر تحديد الموقع. اكتب مدينتك.'],
  show_map:       ['Show on map', 'عرض على الخريطة'],
  from_lbl:       ['from', 'ابتداءً من'],
  nl_ok:['Thank you. Check your inbox to confirm.', 'شكرًا لك. تفقّد بريدك لتأكيد الاشتراك.'],
  nl_bad:         ['Please enter a valid email address.', 'يرجى إدخال بريد إلكتروني صحيح.'],
};

export function t(key, ...args) {
  const e = STR[key];
  let s = e ? e[isAr() ? 1 : 0] : key;
  args.forEach((a, i) => { s = s.replace(`{${i}}`, a); });
  return s;
}

/** Western digits with a narrow no-break space as thousands separator, as used on Algerian price tags. */
export function fmt(n) {
  return Math.round(n).toLocaleString('fr-FR').replace(/[\s  ]/g, ' ');
}
export function price(n) {
  return `${fmt(n)} ${isAr() ? 'دج' : 'DA'}`;
}
export function priceHTML(n) {
  return `${fmt(n)}<small>${isAr() ? 'دج' : 'DA'}</small>`;
}

export function applyI18n(root = document) {
  const ar = isAr();
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    if (el.dataset.en == null) el.dataset.en = el.innerHTML;
    const k = el.dataset.i18n;
    el.innerHTML = ar && AR[k] != null ? AR[k] : el.dataset.en;
  });
  root.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    if (el.dataset.enPh == null) el.dataset.enPh = el.getAttribute('placeholder') || '';
    const k = el.dataset.i18nPh;
    el.setAttribute('placeholder', ar && AR[k] != null ? AR[k] : el.dataset.enPh);
  });
  root.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    if (el.dataset.enAria == null) el.dataset.enAria = el.getAttribute('aria-label') || '';
    const k = el.dataset.i18nAria;
    el.setAttribute('aria-label', ar && AR[k] != null ? AR[k] : el.dataset.enAria);
  });
  const title = document.querySelector('meta[name="eaf-title-ar"]');
  if (title) {
    if (!document.documentElement.dataset.titleEn) document.documentElement.dataset.titleEn = document.title;
    document.title = ar ? title.content : document.documentElement.dataset.titleEn;
  }
}

export function setLang(next) {
  const l = next === 'ar' ? 'ar' : 'en';
  try { localStorage.setItem(KEY, l); } catch { /* private mode */ }
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  applyI18n();
  dispatchEvent(new CustomEvent('langchange', { detail: { lang: l } }));
}
