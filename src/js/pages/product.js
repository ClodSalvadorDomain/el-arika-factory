/* Product detail page: ?id=<product id> */
import { boot, whenNear } from '../app.js';
import '../../styles/product.css';
import { PRODUCTS, CATEGORIES, COLORS, MATERIALS, STORES, byId } from '../data.js';
import { L, t, price, priceHTML, fmt, isAr } from '../i18n.js';
import { cardHTML, badgesHTML, monthly, carousel } from '../cards.js';
import { cart, wish, DELIVERY_FEE, DELIVERY_FREE_FROM, ASSEMBLY_RATE } from '../store.js';
import { toast } from '../ui.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

boot();

const p = byId(new URLSearchParams(location.search).get('id')) || PRODUCTS[0];
const cat = CATEGORIES.find((c) => c.id === p.cat);
const state = { colour: p.colors[0], size: null, months: 24, qty: 1, img: 0, mode: 'photo' };

/* Size variants: kitchens by run length, the mattress by bed size. Prices scale from the base. */
const SIZES = p.cat === 'kitchens'
  ? [180, 240, 270, 300].map((w) => ({ id: w, en: `${w} cm`, ar: `${w} سم`, price: Math.round((p.price * w) / p.width / 1000) * 1000 }))
  : p.id === 'nour-mattress'
    ? [[140, 190, 0.86], [160, 190, 1], [180, 200, 1.22]].map(([a, b, k]) => ({ id: `${a}x${b}`, en: `${a}×${b}`, ar: `${a}×${b}`, price: Math.round((p.price * k) / 1000) * 1000 }))
    : null;
if (SIZES) state.size = SIZES.find((s) => s.price === p.price) || SIZES[1];
const unitPrice = () => state.size?.price ?? p.price;
const unitOld = () => (p.old ? Math.round((unitPrice() * p.old) / p.price / 100) * 100 : null);

/* ---- remember recently viewed */
try {
  const seen = JSON.parse(localStorage.getItem('eaf-viewed') || '[]').filter((x) => x !== p.id);
  localStorage.setItem('eaf-viewed', JSON.stringify([p.id, ...seen].slice(0, 12)));
} catch { /* storage blocked */ }

/* ---- gallery */
const photos = p.gallery.length ? p.gallery : [p.img];
let sofa = null;
function thumbs() {
  $('[data-thumbs]').innerHTML = photos.map((src, i) => `<button class="thumb" type="button" role="listitem" data-img="${i}" aria-current="${state.mode === 'photo' && i === state.img}" aria-label="${i + 1} / ${photos.length}"><img src="${src}" alt="" width="96" height="72" loading="lazy"></button>`).join('')
    + (p.sofa3d ? `<button class="thumb thumb--3d" type="button" role="listitem" data-mode="3d" aria-current="${state.mode === '3d'}"><svg class="i" aria-hidden="true"><use href="#i-cube"/></svg>3D</button>` : '');
}
function showImage(i) {
  state.img = i;
  const img = $('[data-main]');
  img.style.opacity = '0.3';
  img.onload = () => { img.style.opacity = '1'; };
  img.src = photos[i];
  img.alt = `${L(p.name)}, ${L(p.finish)}`;
  setMode('photo');
}
function setMode(mode) {
  if (mode === '3d' && !p.sofa3d) return;
  state.mode = mode;
  $('[data-view="photo"]').hidden = mode !== 'photo';
  $('[data-view="3d"]').hidden = mode !== '3d';
  $$('.gallery__modes [data-mode]').forEach((b) => b.setAttribute('aria-selected', b.dataset.mode === mode));
  if (mode === '3d' && !sofa) {
    const host = $('[data-sofa3d]');
    import('../../react/sofa.jsx').then(({ mountSofa }) => { sofa = mountSofa(host, { mode: 'spin', color: COLORS[state.colour]?.hex || p.sofa3d }); });
  }
  thumbs();
}
$('[data-thumbs]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-img], [data-mode]');
  if (!b) return;
  if (b.dataset.mode) setMode('3d'); else showImage(+b.dataset.img);
});
$('.gallery__modes').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
if (!p.sofa3d) $('.gallery__modes').hidden = true;

/* hover zoom follows the pointer (fine pointers only) */
const view = $('[data-view="photo"]');
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  view.addEventListener('pointermove', (e) => {
    const r = view.getBoundingClientRect();
    $('[data-main]').style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
  });
  view.addEventListener('click', () => view.classList.toggle('is-zoom'));
  view.addEventListener('pointerleave', () => view.classList.remove('is-zoom'));
}

/* ---- buy box */
function buybox() {
  document.title = `${L(p.name)} · El Arika Factory`;
  $('[data-crumbs]').innerHTML = `<li><a href="index.html">${t('home')}</a></li><li><a href="category.html?c=${p.cat}">${L(cat)}</a></li><li><span aria-current="page">${L(p.name)}</span></li>`;
  $('[data-sku]').textContent = p.sku;
  $('[data-name]').textContent = L(p.name);
  const stars = [1, 2, 3, 4, 5].map((n) => `<svg class="i${n <= Math.round(p.rating) ? '' : ' is-off'}" aria-hidden="true"><use href="#i-star"/></svg>`).join('');
  $('[data-rating]').innerHTML = `<span class="stars">${stars}</span><span>${t('rating_of', p.rating.toFixed(1), p.reviews)}</span>`;
  $('[data-badges]').innerHTML = badgesHTML(p, 3);
  const w = $('[data-wish]');
  w.dataset.wish = p.id;
  w.setAttribute('aria-pressed', wish.has(p.id));
  prices();
  colours();
  sizes();
  const order = p.stock !== 'in';
  const st = $('[data-stock]');
  st.textContent = t(p.stock === 'in' ? 'in_stock' : p.stock === 'low' ? 'low_stock' : 'on_order');
  st.classList.toggle('is-order', order);
}

function prices() {
  const now = unitPrice();
  const old = unitOld();
  const d = old ? Math.round((1 - now / old) * 100) : 0;
  $('[data-price]').innerHTML = `<div class="price">
      <span class="price__now">${priceHTML(now)}</span>
      ${old ? `<s class="price__old">${fmt(old)}</s><span class="disc">-${d}%</span>` : ''}
    </div>${old ? `<p class="buybox__save">${t('you_save', price(old - now))}</p>` : ''}`;
  $('[data-fin]').innerHTML = t('per_month', price(monthly(now, state.months)), state.months);
  $('[data-buybar-price]').innerHTML = `<span class="price"><span class="price__now">${priceHTML(now)}</span></span>`;
  $('[data-fee-home]').textContent = now >= DELIVERY_FREE_FROM ? t('free') : price(DELIVERY_FEE);
  $('[data-fee-assembly]').textContent = p.badges.includes('assembly') ? t('free') : `+${price(Math.max(2000, Math.round((now * ASSEMBLY_RATE) / 100) * 100))}`;
  $('[data-assembly]').checked = p.badges.includes('assembly');
  $('[data-assembly]').disabled = p.badges.includes('assembly');
}

function colours() {
  $('[data-colours]').innerHTML = p.colors.map((k) => `<button class="swatch" type="button" role="radio" style="--sw:${COLORS[k].hex}" data-colour="${k}" aria-checked="${k === state.colour}" aria-label="${L(COLORS[k])}" title="${L(COLORS[k])}"></button>`).join('');
  $('[data-colour-name]').textContent = L(COLORS[state.colour]);
}
$('[data-colours]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-colour]');
  if (!b) return;
  state.colour = b.dataset.colour;
  colours();
  $(`[data-colour="${state.colour}"]`).focus();
  if (p.sofa3d) {
    if (state.mode !== '3d') setMode('3d');
    sofa?.setColor(COLORS[state.colour].hex);
  }
});

function sizes() {
  const box = $('[data-size-opt]');
  if (!SIZES) { box.hidden = true; return; }
  box.hidden = false;
  $('[data-sizes]').innerHTML = SIZES.map((s) => `<button class="chip" type="button" role="radio" data-size="${s.id}" aria-checked="${s === state.size}">${L(s)}</button>`).join('');
  $('[data-size-name]').textContent = L(state.size);
}
$('[data-sizes]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-size]');
  if (!b) return;
  state.size = SIZES.find((s) => String(s.id) === b.dataset.size);
  sizes();
  prices();
});

$('[data-months]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-m]');
  if (!b) return;
  state.months = +b.dataset.m;
  $$('[data-m]').forEach((x) => x.setAttribute('aria-checked', x === b));
  prices();
});

const qtyInput = $('[data-qty] input');
$('[data-qty]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-q]');
  if (!b) return;
  state.qty = Math.max(1, Math.min(20, state.qty + +b.dataset.q));
  qtyInput.value = state.qty;
});
qtyInput.addEventListener('change', () => { state.qty = Math.max(1, Math.min(20, +qtyInput.value || 1)); qtyInput.value = state.qty; });

$$('[data-add-main]').forEach((b) => b.addEventListener('click', () => {
  cart.add(p.id, state.qty, state.colour);
  const line = cart.lines().find((l) => l.key === `${p.id}|${state.colour}`);
  if (line) cart.setAssembly(line.key, $('[data-assembly]').checked);
  toast(t('added'), { href: 'cart.html', label: t('view_cart') });
}));

/* ---- in-store availability (deterministic demo stock per store) */
const dialog = $('[data-avail-dialog]');
const hash = (s) => [...s].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 5381);
function availability() {
  $('[data-avail-list]').innerHTML = STORES.map((s) => {
    const n = hash(p.id + s.id) % 10;
    const st = s.factory || n > 3 ? 'yes' : n > 1 ? 'low' : 'no';
    return `<li><b>${isAr() ? `${s.cityAr} · ${s.areaAr}` : `${s.city} · ${s.area}`}</b>
      <span class="avail avail--${st}">${t(`stock_${st}`)}</span>
      <small><a href="stores.html?s=${s.id}">${t('directions')}</a> · <a href="tel:${s.phone.replace(/\s/g, '')}" dir="ltr">${s.phone}</a></small></li>`;
  }).join('');
}
$('[data-availability]').addEventListener('click', () => { availability(); dialog.showModal(); });
$('[data-dialog-close]').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

/* ---- tabs */
const tabs = $$('[data-ptabs] [role="tab"]');
function selectTab(tab) {
  tabs.forEach((x) => {
    const on = x === tab;
    x.setAttribute('aria-selected', on);
    x.tabIndex = on ? 0 : -1;
    $(`#${x.getAttribute('aria-controls')}`).hidden = !on;
  });
}
$('[data-ptabs]').addEventListener('click', (e) => { const b = e.target.closest('[role="tab"]'); if (b) selectTab(b); });
$('[data-ptabs]').addEventListener('keydown', (e) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const i = tabs.indexOf(document.activeElement);
  const step = (e.key === 'ArrowRight') !== isAr() ? 1 : -1;
  const n = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (i + step + tabs.length) % tabs.length;
  tabs[n].focus();
  selectTab(tabs[n]);
});

/* technical drawing: front and side elevations with dimension lines */
function drawing() {
  const { w, d, h } = p.dims;
  const s = Math.min(300 / w, 150 / Math.max(h, 30));
  const fw = w * s;
  const fh = Math.max(h * s, 6);
  const sw = Math.min(d * s, 140);
  const gy = 200;
  const fx = 40;
  const sx = fx + fw + 80;
  const dimH = (x1, x2, y, label) => `<path class="dim" d="M${x1} ${y}H${x2}M${x1} ${y - 5}v10M${x2} ${y - 5}v10"/><text x="${(x1 + x2) / 2}" y="${y + 18}" text-anchor="middle">${label}</text>`;
  const dimV = (x, y1, y2, label) => `<path class="dim" d="M${x} ${y1}V${y2}M${x - 5} ${y1}h10M${x - 5} ${y2}h10"/><text x="${x - 10}" y="${(y1 + y2) / 2 + 4}" text-anchor="end">${label}</text>`;
  return `<svg class="drawing" viewBox="0 0 ${sx + sw + 40} 250" role="img" aria-label="${t('d_width')} ${w} · ${t('d_depth')} ${d} · ${t('d_height')} ${h} cm" direction="ltr">
    <text class="cap" x="${fx}" y="20">${t('front')}</text>
    <rect class="body" x="${fx}" y="${gy - fh}" width="${fw}" height="${fh}" rx="6"/>
    ${dimH(fx, fx + fw, gy + 20, `${w} cm`)}
    ${dimV(fx + fw + 22, gy - fh, gy, `${h}`)}
    <text class="cap" x="${sx}" y="20">${t('side')}</text>
    <rect class="body" x="${sx}" y="${gy - fh}" width="${sw}" height="${fh}" rx="6"/>
    ${dimH(sx, sx + sw, gy + 20, `${d} cm`)}
  </svg>`;
}

function panels() {
  const tick = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>';
  $('[data-desc]').innerHTML = `<div class="desc">
      <div><h3 class="h3">${L(p.name)}</h3><p>${t('desc_intro', L(p.name), L(p.finish))}</p><p>${t('desc_more')}</p></div>
      <div><h3 class="h3">${t('desc_why')}</h3><ul>${['pt1', 'pt2', 'pt3', 'pt4'].map((k) => `<li>${tick}<span>${t(k)}</span></li>`).join('')}</ul></div>
    </div>`;
  $('[data-dims]').innerHTML = `<div class="dims">${drawing()}
      <div><table class="spec-table"><tbody>
        <tr><th>${t('d_width')}</th><td class="nums">${p.dims.w} cm</td></tr>
        <tr><th>${t('d_depth')}</th><td class="nums">${p.dims.d} cm</td></tr>
        <tr><th>${t('d_height')}</th><td class="nums">${p.dims.h} cm</td></tr>
      </tbody></table><p class="small muted" style="margin-top:12px">${t('hint_dims')}</p></div></div>`;
  $('[data-mat]').innerHTML = `<table class="spec-table"><tbody>
      <tr><th>${t('material')}</th><td>${L(MATERIALS[p.material])}</td></tr>
      <tr><th>${t('finish')}</th><td>${L(p.finish)}</td></tr>
      <tr><th>${t('colours')}</th><td>${p.colors.map((k) => L(COLORS[k])).join(', ')}</td></tr>
      <tr><th>${t('origin')}</th><td>${t('origin_v')}</td></tr>
      <tr><th>${t('care')}</th><td>${t(`care_${p.material}`)}</td></tr>
    </tbody></table>`;
  const dl = (k, kb) => `<a class="download" href="#" download><svg class="i" aria-hidden="true"><use href="#i-download"/></svg><span><b>${t(k)}</b><small>${t('dl_meta')} · ${kb} KB</small></span></a>`;
  $('[data-dl]').innerHTML = `<div class="downloads">${dl('dl_assembly', 840)}${dl('dl_sheet', 320)}${dl('dl_care', 210)}</div>`;
}

/* ---- carousels */
const LOOK = { sofas: ['living', 'decor'], living: ['sofas', 'decor'], kitchens: ['appliances', 'dining'], bedrooms: ['bedrooms', 'decor'], dining: ['dining', 'decor'], kids: ['kids', 'decor'] };
let looks;
let vieweds;
function rails() {
  const want = LOOK[p.cat] || ['decor', 'living'];
  const look = PRODUCTS.filter((x) => x.id !== p.id && want.includes(x.cat)).slice(0, 8);
  let seen = [];
  try { seen = JSON.parse(localStorage.getItem('eaf-viewed') || '[]').filter((id) => id !== p.id).map(byId).filter(Boolean); } catch { /* blocked */ }
  const viewed = [...new Set([...seen, ...PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id), ...PRODUCTS.filter((x) => x.tags.includes('best'))])].filter((x) => x.id !== p.id).slice(0, 10);
  $('[data-look]').innerHTML = look.map((x) => cardHTML(x)).join('');
  $('[data-viewed]').innerHTML = viewed.map((x) => cardHTML(x)).join('');
  looks = looks || carousel($('[data-carousel="look"]'));
  vieweds = vieweds || carousel($('[data-carousel="viewed"]'));
  looks.sync();
  vieweds.sync();
}

/* ---- mobile sticky bar appears once the main button scrolls away */
const bar = $('[data-buybar]');
new IntersectionObserver(([e]) => bar.classList.toggle('is-on', !e.isIntersecting && e.boundingClientRect.top < 0)).observe($('.buybox__add'));

buybox();
showImage(0);
panels();
whenNear($('[data-look]'), rails, '400px');
addEventListener('langchange', () => { buybox(); panels(); thumbs(); if (looks) rails(); });
