/* ==========================================================================
   Product card, skeleton, carousel and countdown: shared by every page.
   Cards are rendered from data so the markup is ready for a real catalog API.
   ========================================================================== */
import { L, t, priceHTML, fmt, isAr } from './i18n.js';
import { cart, wish } from './store.js';
import { toast } from './ui.js';

export const monthly = (amount, months = 24) => Math.ceil(amount / months / 100) * 100;
export const discount = (p) => (p.old ? Math.round((1 - p.price / p.old) * 100) : 0);

export function specLine(p) {
  return `${t('width', p.width)} · ${L(p.finish)}`;
}

export function badgesHTML(p, max = 2) {
  return p.badges.slice(0, max).map((b) => `<span class="badge badge--${b}">${t(`badge_${b}`)}</span>`).join('');
}

export function priceBlock(p, cls = 'price--card') {
  const d = discount(p);
  return `<div class="price ${cls}">
      <span class="price__now">${priceHTML(p.price)}</span>
      ${p.old ? `<s class="price__old"><span class="sr-only">${isAr() ? 'السعر السابق' : 'Was'} </span>${fmt(p.old)}</s><span class="disc">-${d}%</span>` : ''}
    </div>`;
}

export function cardHTML(p, { eager = false } = {}) {
  const wished = wish.has(p.id);
  const url = `product.html?id=${p.id}`;
  return `<article class="pcard" data-pid="${p.id}">
    <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">
      <img src="${p.img}" alt="" width="640" height="480" loading="${eager ? 'eager' : 'lazy'}" decoding="async">
      <img class="pcard__img2" src="${p.img2}" alt="" width="640" height="480" loading="lazy" decoding="async">
    </a>
    <div class="pcard__badges">${badgesHTML(p)}</div>
    <button class="pcard__wish glass" type="button" data-wish="${p.id}" aria-pressed="${wished}" aria-label="${t('wish_add')}: ${L(p.name)}">
      <svg class="i" aria-hidden="true"><use href="#i-heart"/></svg>
    </button>
    <div class="pcard__body">
      <h3 class="pcard__name"><a href="${url}">${L(p.name)}</a></h3>
      <p class="pcard__spec">${specLine(p)}</p>
      ${priceBlock(p)}
      <p class="fin-line">${t('per_month', `${fmt(monthly(p.price))} ${isAr() ? 'دج' : 'DA'}`, 24)}</p>
      <button class="btn btn--primary btn--block pcard__cta" type="button" data-add="${p.id}">
        <svg class="i" aria-hidden="true"><use href="#i-bag"/></svg>${t('add_to_cart')}
      </button>
    </div>
  </article>`;
}

export function skeletonHTML(n = 4) {
  return Array.from({ length: n }, () => `<div class="pcard pcard--skeleton" aria-hidden="true">
      <div class="pcard__media"><div class="skel"></div></div>
      <div class="pcard__body">
        <div class="skel" style="height:16px;width:85%"></div>
        <div class="skel" style="height:12px;width:55%"></div>
        <div class="skel" style="height:24px;width:60%;margin-top:10px"></div>
      </div>
    </div>`).join('');
}

/* Delegated handlers, bound once for the whole document. */
let bound = false;
export function bindCardActions() {
  if (bound) return;
  bound = true;
  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      e.preventDefault();
      cart.add(add.dataset.add, 1, add.dataset.color || null);
      toast(t('added'), { href: 'cart.html', label: t('view_cart') });
      return;
    }
    const w = e.target.closest('[data-wish]');
    if (w) {
      e.preventDefault();
      const on = wish.toggle(w.dataset.wish);
      document.querySelectorAll(`[data-wish="${w.dataset.wish}"]`).forEach((b) => b.setAttribute('aria-pressed', on));
      toast(t(on ? 'wish_added' : 'wish_removed'));
    }
  });
}

/* Carousel: native scroll-snap track, arrows outside, dots below. */
export function carousel(root) {
  const track = root.querySelector('.carousel__track');
  const prev = root.querySelector('.carousel__arrow--prev');
  const next = root.querySelector('.carousel__arrow--next');
  const dots = root.querySelector('.carousel__dots');
  if (!track) return;
  const dir = () => (document.documentElement.dir === 'rtl' ? -1 : 1);
  const pageW = () => track.clientWidth;
  const pages = () => Math.max(1, Math.round(track.scrollWidth / pageW()));
  const pos = () => Math.abs(track.scrollLeft);

  function sync() {
    const max = track.scrollWidth - track.clientWidth - 2;
    if (prev) prev.disabled = pos() <= 2;
    if (next) next.disabled = pos() >= max;
    if (!dots) return;
    const n = pages();
    if (dots.children.length !== n) {
      dots.innerHTML = Array.from({ length: n }, (_, i) => `<button type="button" aria-label="${i + 1} / ${n}"></button>`).join('');
      [...dots.children].forEach((b, i) => b.addEventListener('click', () => track.scrollTo({ left: i * pageW() * dir() })));
    }
    const cur = Math.round(pos() / pageW());
    [...dots.children].forEach((b, i) => b.setAttribute('aria-current', i === cur));
  }
  prev?.addEventListener('click', () => track.scrollBy({ left: -pageW() * dir() }));
  next?.addEventListener('click', () => track.scrollBy({ left: pageW() * dir() }));
  track.addEventListener('scroll', () => requestAnimationFrame(sync), { passive: true });
  addEventListener('resize', sync);
  addEventListener('langchange', () => requestAnimationFrame(sync));
  sync();
  return { sync };
}

/* Countdown to an end date; writes into [data-d] [data-h] [data-m] [data-s]. */
export function countdown(root, end) {
  const set = (k, v) => { const el = root.querySelector(`[data-${k}]`); if (el) el.textContent = String(v).padStart(2, '0'); };
  function tick() {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const d = Math.floor(s / 86400); s -= d * 86400;
    const h = Math.floor(s / 3600); s -= h * 3600;
    const m = Math.floor(s / 60); s -= m * 60;
    set('d', d); set('h', h); set('m', m); set('s', s);
  }
  tick();
  return setInterval(tick, 1000);
}

/** Next Thursday 23:59 local: weekly offers roll over before the Algerian weekend. */
export function endOfWeek() {
  const d = new Date();
  const add = (4 - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + add);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}
