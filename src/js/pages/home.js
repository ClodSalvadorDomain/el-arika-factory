/* Homepage */
import { boot, idle, whenNear } from '../app.js';
import '../../styles/home.css';
import '../../vendor/scrollcraft.js';
import { CATEGORIES, PRODUCTS, STORES, REVIEWS, byId } from '../data.js';
import { L, t, isAr, priceHTML } from '../i18n.js';
import { cardHTML, skeletonHTML, carousel, countdown, endOfWeek } from '../cards.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

boot();

/* ---- 4. hero carousel: autoplay, dots, arrows, swipe; pauses on hover/focus */
function hero() {
  const frame = $('[data-hero]');
  const slides = $$('.hero__slide', frame);
  const dots = $('[data-hero-dots]');
  let i = 0;
  let timer;
  dots.innerHTML = slides.map((_, k) => `<button type="button" aria-label="${k + 1} / ${slides.length}" aria-current="${k === 0}"></button>`).join('');
  const go = (n) => {
    const next = (n + slides.length) % slides.length;
    if (next === i) return;
    slides[i].classList.remove('is-on', 'is-entering');
    slides[i].hidden = true;
    i = next;
    slides[i].hidden = false;
    slides[i].classList.add('is-on', 'is-entering');
    $$('button', dots).forEach((b, k) => b.setAttribute('aria-current', k === i));
  };
  const play = () => { if (!reduced) { clearInterval(timer); timer = setInterval(() => go(i + 1), 7000); } };
  const stop = () => clearInterval(timer);
  $('[data-hero-next]').addEventListener('click', () => { go(i + 1); play(); });
  $('[data-hero-prev]').addEventListener('click', () => { go(i - 1); play(); });
  $$('button', dots).forEach((b, k) => b.addEventListener('click', () => { go(k); play(); }));
  frame.addEventListener('mouseenter', stop);
  frame.addEventListener('mouseleave', play);
  frame.addEventListener('focusin', stop);
  let x0 = null;
  frame.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') x0 = e.clientX; });
  frame.addEventListener('pointerup', (e) => {
    if (x0 == null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 50) { go(i + ((dx < 0) !== isAr() ? 1 : -1)); play(); }
  });
  play();
}

/* ---- 5. category shortcuts */
function cats() {
  $('[data-cats]').innerHTML = CATEGORIES.map((c) => `<li><a class="ctile" href="category.html?c=${c.id}">
      <span class="ctile__img"><img src="${c.img}" alt="" width="104" height="104" loading="lazy"></span><span>${L(c)}</span></a></li>`).join('')
    + `<li><a class="ctile ctile--promo" href="category.html?c=promotions"><span class="ctile__img"><b>%</b></span><span>${t('promotions')}</span></a></li>`;
}

/* ---- 6. weekly offers: deepest discounts first */
let offersCarousel;
function offers() {
  const track = $('[data-offers]');
  const list = PRODUCTS.filter((p) => p.old).sort((a, b) => (b.old - b.price) / b.old - (a.old - a.price) / a.old).slice(0, 10);
  track.innerHTML = list.map((p) => cardHTML(p)).join('');
  if (!offersCarousel) offersCarousel = carousel($('[data-carousel]'));
  else offersCarousel.sync();
}

/* ---- 8. featured kitchens */
let kitchenStyle = 'all';
function kitchens(withSkeleton) {
  const grid = $('[data-kitchen-grid]');
  const list = PRODUCTS.filter((p) => p.cat === 'kitchens' && (kitchenStyle === 'all' || p.style === kitchenStyle));
  if (withSkeleton) {
    grid.innerHTML = skeletonHTML(Math.min(3, list.length));
    setTimeout(() => { grid.innerHTML = list.map((p) => cardHTML(p)).join(''); }, 260);
  } else grid.innerHTML = list.map((p) => cardHTML(p)).join('');
}
function kitchenTabs() {
  const tabs = $('[data-kitchen-tabs]');
  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('[data-style]');
    if (!b) return;
    kitchenStyle = b.dataset.style;
    $$('[data-style]', tabs).forEach((x) => x.setAttribute('aria-selected', x === b));
    kitchens(true);
  });
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const all = $$('[role="tab"]', tabs);
    const k = all.indexOf(document.activeElement);
    const step = (e.key === 'ArrowRight') !== isAr() ? 1 : -1;
    all[(k + step + all.length) % all.length].focus();
  });
}

/* ---- 10. inspiration hotspots */
function inspiration() {
  const box = $('[data-insp]');
  const pop = $('[data-hotspot-pop]');
  const list = $('[data-insp-list]');
  const room = () => $('.insp__room:not([hidden])', box);
  const renderList = () => {
    list.innerHTML = $$('[data-hotspot]', room()).map((h) => {
      const p = byId(h.dataset.hotspot);
      return `<li><a class="insp-item" href="product.html?id=${p.id}" data-item="${p.id}">
        <img src="${p.img}" alt="" width="84" height="63" loading="lazy">
        <span><b>${L(p.name)}</b><span class="price"><span class="price__now">${priceHTML(p.price)}</span></span></span></a></li>`;
    }).join('');
    $$('[data-hotspot]', room()).forEach((h) => h.setAttribute('aria-label', L(byId(h.dataset.hotspot).name)));
  };
  const close = () => {
    pop.hidden = true;
    $$('[data-hotspot]', box).forEach((h) => h.setAttribute('aria-expanded', 'false'));
    $$('.insp-item', box).forEach((x) => x.classList.remove('is-active'));
  };
  box.addEventListener('click', (e) => {
    const h = e.target.closest('[data-hotspot]');
    if (!h) { if (!e.target.closest('[data-hotspot-pop]')) close(); return; }
    const open = h.getAttribute('aria-expanded') === 'true';
    close();
    if (open) return;
    const p = byId(h.dataset.hotspot);
    pop.innerHTML = `<img src="${p.img}" alt="" width="72" height="54"><div><a href="product.html?id=${p.id}"><b>${L(p.name)}</b></a>
      <span class="price"><span class="price__now">${priceHTML(p.price)}</span></span>
      <a class="link-arrow small" href="product.html?id=${p.id}">${t('view_product')}<svg class="i flip-rtl" aria-hidden="true"><use href="#i-arrow"/></svg></a></div>`;
    pop.hidden = false;
    h.setAttribute('aria-expanded', 'true');
    $(`.insp-item[data-item="${p.id}"]`, box)?.classList.add('is-active');
    const br = box.getBoundingClientRect();
    const hr = h.getBoundingClientRect();
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    let left = hr.left - br.left + hr.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, room().offsetWidth - pw - 8));
    let top = hr.top - br.top - ph - 12;
    if (top < 8) top = hr.bottom - br.top + 12;
    pop.style.left = `${left}px`;
    pop.style.top = `${top}px`;
  });
  box.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
  $('[data-insp-tabs]').addEventListener('click', (e) => {
    const b = e.target.closest('[data-room]');
    if (!b) return;
    close();
    $$('[data-insp-tabs] [data-room]').forEach((x) => x.setAttribute('aria-selected', x === b));
    $$('.insp__room', box).forEach((f) => { const on = f.dataset.room === b.dataset.room; f.hidden = !on; f.classList.toggle('is-on', on); });
    renderList();
  });
  renderList();
  return renderList;
}

/* ---- 11. scroll act: the sofa assembles under the reader's scroll */
function sofaAct() {
  const act = $('.act-sofa');
  const host = $('[data-sofa]', act);
  let api = null;
  let color = '#E30613';
  const progress = () => parseFloat(act.style.getPropertyValue('--sc-p')) || 0;
  whenNear(act, () => {
    import('../../react/sofa.jsx').then(({ mountSofa }) => { api = mountSofa(host, { mode: 'scroll', progress, color }); });
  }, '600px');
  $('.swatch-dock', act).addEventListener('click', (e) => {
    const s = e.target.closest('[data-fabric]');
    if (!s) return;
    color = s.dataset.fabric;
    $$('[data-fabric]', act).forEach((x) => x.setAttribute('aria-checked', x === s));
    api?.setColor(color);
  });
}

/* ---- 12. dot map of northern Algeria with showroom pins */
const COAST = [[-2.2, 35.08], [-1.3, 35.3], [-0.6, 35.75], [0.1, 35.9], [1.3, 36.5], [2.4, 36.6], [3.05, 36.78], [3.9, 36.9], [5.1, 36.75], [5.75, 36.83], [6.9, 37.08], [7.75, 36.95], [8.62, 36.94],
  [8.4, 36.5], [8.25, 35.6], [7.75, 34.3], [7.6, 33.7], [8.4, 33.1], [9.1, 32.4], [9.5, 31.5], [-3.6, 31.5], [-2.9, 31.9], [-1.3, 32.3], [-1.4, 33.2], [-1.7, 34.0], [-1.8, 34.6]];
const proj = ([lng, lat]) => [((lng + 3.8) / 13.6) * 400, 8 + ((37.4 - lat) / 6) * 214];
function inside([x, y], poly) {
  let hit = false;
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xa, ya] = poly[a];
    const [xb, yb] = poly[b];
    if ((ya > y) !== (yb > y) && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) hit = !hit;
  }
  return hit;
}
function dotmap() {
  const svg = $('[data-dotmap]');
  const poly = COAST.map(proj);
  let dots = '';
  for (let y = 6; y < 230; y += 9) for (let x = 6; x < 400; x += 9) if (inside([x, y], poly)) dots += `<circle class="d" cx="${x}" cy="${y}" r="2.1"/>`;
  const seen = new Set();
  const pins = STORES.map((s) => {
    const [x, y] = proj([s.lng, s.lat]);
    const label = seen.has(s.city) ? '' : `<text x="${x + 10}" y="${y + 4}">${isAr() ? s.cityAr : s.city}</text>`;
    seen.add(s.city);
    return `<g class="pin${s.factory ? ' pin--factory' : ''}"><circle cx="${x}" cy="${y}" r="10"/><circle cx="${x}" cy="${y}" r="4.5"/>${label}</g>`;
  }).join('');
  svg.innerHTML = dots + pins;
  $('[data-store-count]').textContent = STORES.filter((s) => !s.factory).length;
  $('[data-city-list]').innerHTML = [...new Set(STORES.map((s) => (isAr() ? s.cityAr : s.city)))].map((c) => `<option value="${c}">`).join('');
}

/* ---- 13. reviews (placeholders until real reviews are connected) */
function reviews() {
  const star = (on) => `<svg class="i${on ? '' : ' is-off'}" aria-hidden="true"><use href="#i-star"/></svg>`;
  $('[data-reviews]').innerHTML = REVIEWS.map((r) => `<figure class="review glass glass--strong">
      <span class="stars" role="img" aria-label="${r.stars}/5">${[1, 2, 3, 4, 5].map((n) => star(n <= r.stars)).join('')}</span>
      <blockquote>${L(r)}</blockquote>
      <footer><span class="avatar" aria-hidden="true">${r.name[0]}</span><span><b>${r.name}</b> · ${r.city}</span></footer>
    </figure>`).join('');
}

/* ---- 14. newsletter */
function newsletter() {
  const f = $('[data-newsletter]');
  const msg = $('[data-nl-msg]', f);
  const input = $('input', f);
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = input.checkValidity();
    input.setAttribute('aria-invalid', !ok);
    msg.classList.toggle('is-ok', ok);
    msg.textContent = t(ok ? 'nl_ok' : 'nl_bad');
    if (ok) f.reset();
  });
}

hero();
cats();
offers();
kitchenTabs();
kitchens(false);
const renderInsp = inspiration();
sofaAct();
dotmap();
reviews();
newsletter();
countdown($('[data-countdown]'), endOfWeek());

window.ScrollCraft.mount(document.body);

idle(() => {
  const g = $('[data-gradient="hero"]');
  whenNear(g, () => import('../../react/gradient.jsx').then(({ mountGradient }) => mountGradient(g, 'hero')));
});

addEventListener('langchange', () => {
  cats();
  offers();
  kitchens(false);
  renderInsp();
  dotmap();
  reviews();
});
