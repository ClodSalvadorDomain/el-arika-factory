/* Showroom: scrollcraft acts + ShaderGradient + liquid-metal emblem + R3F sofa */
import { boot, idle, whenNear } from '../app.js';
import '../../styles/showroom.css';
import '../../vendor/scrollcraft.js';
import { CATEGORIES, byId, productsIn } from '../data.js';
import { L, t, isAr, priceHTML } from '../i18n.js';
import { mountLiquidLogo } from '../liquid-logo.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

boot();

/* ---- 4. rooms rail (rendered before the engine measures the pan) */
const ROOMS = [
  ['living', 'living-lux'], ['kitchens', 'kitchen-island'], ['bedrooms', 'bedroom-chandelier'],
  ['dining', 'dining-green'], ['kids', 'bedroom-boho'], ['bathrooms', 'bath-tub'], ['outdoor', 'outdoor-pool'],
];
function rooms() {
  $('[data-rooms]').innerHTML = ROOMS.map(([id, img]) => {
    const c = CATEGORIES.find((x) => x.id === id);
    const from = Math.min(...productsIn(id).map((p) => p.price));
    return `<a class="room glass glass--strong" href="category.html?c=${id}">
      <div class="room__img" data-sc-tilt="5"><img src="img/${img}.webp" alt="" width="1400" height="933" loading="lazy"></div>
      <div class="room__body"><h3>${L(c)}</h3><span><small>${t('from_lbl')}</small><span class="price"><span class="price__now">${priceHTML(from)}</span></span></span></div>
    </a>`;
  }).join('');
}
rooms();

/* ---- 2. build: sofa progress, chapter rail, fabric dock */
const build = $('.sr-build');
const progress = () => parseFloat(build.style.getPropertyValue('--sc-p')) || 0;
let sofa = null;
let fabric = '#2F5D50';
whenNear(build, () => import('../../react/sofa.jsx').then(({ mountSofa }) => { sofa = mountSofa($('[data-sofa]'), { mode: 'scroll', progress, color: fabric }); }), '900px');

const railItems = $$('[data-rail] li');
let lastStep = -1;
function railTick() {
  const p = progress();
  let cur = 0;
  railItems.forEach((li, i) => { if (p >= +li.dataset.at) cur = i; });
  if (cur !== lastStep) {
    lastStep = cur;
    railItems.forEach((li, i) => { li.classList.toggle('is-done', i <= cur); li.classList.toggle('is-current', i === cur); });
  }
  requestAnimationFrame(railTick);
}
requestAnimationFrame(railTick);

function dockText() {
  const on = $('[data-fabric][aria-checked="true"]');
  $('[data-fabric-name]').textContent = isAr() ? on.dataset.nameAr : on.dataset.nameEn;
  $('[data-sr-price]').innerHTML = priceHTML(byId('hoggar-3').price);
}
$('.sr-dock__swatches').addEventListener('click', (e) => {
  const s = e.target.closest('[data-fabric]');
  if (!s) return;
  fabric = s.dataset.fabric;
  $$('[data-fabric]').forEach((x) => x.setAttribute('aria-checked', x === s));
  sofa?.setColor(fabric);
  dockText();
});
dockText();

/* ---- the bar turns to smoked glass over the dark finale */
const bar = $('[data-header]');
new IntersectionObserver(([e]) => bar.classList.toggle('is-night', e.isIntersecting), { rootMargin: '0px 0px -92% 0px' }).observe($('.sr-close'));

/* ---- engine */
window.ScrollCraft.mount(document.body);

/* ---- 1. arrival: liquid gradient + liquid-metal emblem */
mountLiquidLogo($('[data-liquid-logo]'), { dark: '#221A1B', light: '#FFFFFF', patternScale: 2, refraction: 0.016, liquid: 0.08, speed: 0.3 });
idle(() => {
  const g = $('[data-gradient="showroom"]');
  import('../../react/gradient.jsx').then(({ mountGradient }) => mountGradient(g, 'hero', { uSpeed: 0.18 }));
});

addEventListener('langchange', () => {
  rooms();
  dockText();
  window.ScrollCraft.instances.forEach((i) => i.layout());
});
