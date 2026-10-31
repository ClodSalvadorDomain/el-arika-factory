/* ==========================================================================
   Site chrome behaviour: ticker, sticky header, mega-menu, mobile drawer,
   search suggestions, language switch, cart/wishlist counts, toast, cookies,
   flow reveals.
   ========================================================================== */
import { CATEGORIES, PRODUCTS, STORES } from './data.js';
import { L, t, setLang, lang, price, isAr } from './i18n.js';
import { cart, wish } from './store.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---- toast */
let toastTimer;
export function toast(msg, action) {
  const el = $('[data-toast]');
  if (!el) return;
  el.innerHTML = `<svg class="i" aria-hidden="true"><use href="#i-check"/></svg><span>${msg}</span>${action ? `<a class="btn btn--primary btn--sm" href="${action.href}">${action.label}</a>` : ''}`;
  el.hidden = false;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 3200);
}

/* ---- ticker */
function ticker() {
  const items = $$('[data-ticker] li');
  if (items.length < 2) return;
  let i = 0;
  let paused = false;
  const box = $('[data-ticker]');
  box.addEventListener('mouseenter', () => { paused = true; });
  box.addEventListener('mouseleave', () => { paused = false; });
  setInterval(() => {
    if (paused || document.hidden) return;
    items[i].classList.remove('is-on');
    i = (i + 1) % items.length;
    items[i].classList.add('is-on');
  }, reduced ? 7000 : 4200);
}

/* ---- header shadow on scroll */
function headerState() {
  const h = $('[data-header]');
  if (!h) return;
  const on = () => h.classList.toggle('is-scrolled', scrollY > 24);
  addEventListener('scroll', on, { passive: true });
  on();
}

/* ---- department nav + mega-menu */
function renderNav() {
  const list = $('[data-mainnav]');
  if (!list) return;
  list.innerHTML = CATEGORIES.map((c) => `<li><button class="mainnav__btn" type="button" aria-expanded="false" aria-controls="mega" data-cat="${c.id}">${L(c)}<svg class="i" aria-hidden="true"><use href="#i-chevron-down"/></svg></button></li>`).join('')
    + `<li><a class="mainnav__btn mainnav__btn--promo" href="category.html?c=promotions">${t('promotions')}</a></li>`
    + `<li class="mainnav__push"><a class="mainnav__btn mainnav__btn--showroom" href="showroom.html"><svg class="i" aria-hidden="true"><use href="#i-cube"/></svg>${t('showroom')}</a></li>`;
}

function megaHTML(c) {
  const cols = c.subs.map((s) => `<div class="mega__col"><h3>${isAr() ? s.title[1] : s.title[0]}</h3><ul>${s.links.map((l) => `<li><a href="category.html?c=${c.id}">${isAr() ? l[1] : l[0]}</a></li>`).join('')}</ul></div>`);
  while (cols.length < 3) cols.push('<div class="mega__col" aria-hidden="true"></div>');
  return `${cols.join('')}
    <a class="mega__promo" href="category.html?c=${c.id}">
      <img src="${c.promo.img}" alt="" width="640" height="480" loading="lazy">
      <span class="glass">${L(c.promo)}</span>
    </a>
    <a class="mega__all" href="category.html?c=${c.id}">${t('all_in', L(c).toLowerCase())}<svg class="i flip-rtl" aria-hidden="true"><use href="#i-arrow"/></svg></a>`;
}

function mega() {
  const header = $('[data-header]');
  const wrap = $('[data-mega]');
  const panel = $('[data-mega-panel]');
  if (!wrap || !panel) return;
  wrap.id = 'mega';
  let current = null;
  let closeT;
  let openT;

  const open = (btn) => {
    clearTimeout(closeT);
    if (current === btn) return;
    const c = CATEGORIES.find((x) => x.id === btn.dataset.cat);
    panel.innerHTML = megaHTML(c);
    $$('.mainnav__btn[aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', b === btn));
    current = btn;
    wrap.hidden = false;
    requestAnimationFrame(() => wrap.classList.add('is-open'));
  };
  const close = (now) => {
    clearTimeout(openT);
    const run = () => {
      if (!current) return;
      wrap.classList.remove('is-open');
      $$('.mainnav__btn[aria-expanded]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
      current = null;
      setTimeout(() => { if (!current) wrap.hidden = true; }, 160);
    };
    if (now) run(); else closeT = setTimeout(run, 140);
  };

  header.addEventListener('mouseover', (e) => {
    const btn = e.target.closest('.mainnav__btn[data-cat]');
    if (btn && matchMedia('(hover: hover)').matches) {
      clearTimeout(openT);
      openT = setTimeout(() => open(btn), current ? 0 : 90);
    } else if (e.target.closest('.mainnav__btn:not([data-cat])')) close();
  });
  header.addEventListener('mouseleave', () => close());
  wrap.addEventListener('mouseenter', () => clearTimeout(closeT));
  header.addEventListener('click', (e) => {
    const btn = e.target.closest('.mainnav__btn[data-cat]');
    if (!btn) return;
    if (current === btn) close(true); else open(btn);
  });
  header.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && current) { const b = current; close(true); b.focus(); }
    if (e.key === 'ArrowDown' && e.target.matches('.mainnav__btn[data-cat]')) {
      e.preventDefault();
      open(e.target);
      requestAnimationFrame(() => panel.querySelector('a')?.focus());
    }
  });
  header.addEventListener('focusout', (e) => { if (!header.contains(e.relatedTarget)) close(true); });
  addEventListener('langchange', () => { renderNav(); close(true); });
}

/* ---- mobile drawer */
function drawer() {
  const d = $('[data-drawer]');
  const body = $('[data-drawer-body]');
  const toggle = $('[data-drawer-open]');
  if (!d) return;
  const render = () => {
    body.innerHTML = CATEGORIES.map((c, i) => `<div class="acc">
        <button class="acc__btn" type="button" aria-expanded="false" aria-controls="acc-${i}">${L(c)}<svg class="i" aria-hidden="true"><use href="#i-chevron-down"/></svg></button>
        <div class="acc__panel" id="acc-${i}" hidden>
          ${c.subs.map((s) => `<h4>${isAr() ? s.title[1] : s.title[0]}</h4>${s.links.map((l) => `<a href="category.html?c=${c.id}">${isAr() ? l[1] : l[0]}</a>`).join('')}`).join('')}
          <a class="link-arrow" href="category.html?c=${c.id}">${t('all_in', L(c).toLowerCase())}</a>
        </div></div>`).join('')
      + `<div class="acc"><a class="acc__btn acc__btn--promo" href="category.html?c=promotions">${t('promotions')}</a></div>`;
  };
  render();
  addEventListener('langchange', render);
  const open = () => {
    d.hidden = false;
    toggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { d.classList.add('is-open'); $('[data-drawer-close].icon-btn', d)?.focus(); });
  };
  const close = () => {
    d.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { d.hidden = true; }, 300);
    toggle?.focus();
  };
  toggle?.addEventListener('click', open);
  d.addEventListener('click', (e) => {
    if (e.target.closest('[data-drawer-close]')) close();
    const acc = e.target.closest('.acc__btn[aria-controls]');
    if (acc) {
      const on = acc.getAttribute('aria-expanded') !== 'true';
      acc.setAttribute('aria-expanded', on);
      $(`#${acc.getAttribute('aria-controls')}`).hidden = !on;
    }
  });
  d.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

/* ---- search with suggestions */
export function searchProducts(q) {
  const n = q.trim().toLowerCase();
  if (!n) return [];
  return PRODUCTS.filter((p) => `${p.name.en} ${p.name.ar} ${p.finish.en} ${p.finish.ar} ${p.cat}`.toLowerCase().includes(n));
}
function search() {
  const form = $('[data-search]');
  if (!form) return;
  const input = $('input', form);
  const box = $('[data-suggest]', form);
  let idx = -1;
  const items = () => $$('.suggest__item', box);
  const hide = () => { box.hidden = true; input.setAttribute('aria-expanded', 'false'); idx = -1; };
  input.addEventListener('input', () => {
    const q = input.value;
    if (q.trim().length < 2) return hide();
    const hits = searchProducts(q).slice(0, 6);
    box.innerHTML = hits.length
      ? hits.map((p, i) => `<a class="suggest__item" role="option" id="sg-${i}" aria-selected="false" href="product.html?id=${p.id}"><img src="${p.img}" alt="" width="52" height="40"><b>${esc(L(p.name))}</b><span>${price(p.price)}</span></a>`).join('')
      : `<p class="suggest__empty">${t('search_none')}</p>`;
    box.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    idx = -1;
  });
  input.addEventListener('keydown', (e) => {
    const list = items();
    if (e.key === 'Escape') return hide();
    if (!list.length || !['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
    if (e.key === 'Enter') { if (idx >= 0) { e.preventDefault(); location.href = list[idx].href; } return; }
    e.preventDefault();
    idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length;
    list.forEach((el, i) => el.setAttribute('aria-selected', i === idx));
    input.setAttribute('aria-activedescendant', list[idx].id);
  });
  document.addEventListener('click', (e) => { if (!form.contains(e.target)) hide(); });
  const q = new URLSearchParams(location.search).get('q');
  if (q) input.value = q;
}

/* ---- counts */
function counts() {
  const set = (sel, n, bump) => {
    $$(sel).forEach((b) => {
      b.textContent = n;
      b.hidden = n === 0;
      if (bump && !reduced) { b.classList.remove('is-bump'); void b.offsetWidth; b.classList.add('is-bump'); }
    });
  };
  const all = (bump) => { set('[data-cart-count]', cart.count(), bump === 'eaf-cart'); set('[data-wish-count]', wish.ids().length, bump === 'eaf-wish'); };
  all();
  addEventListener('store:change', (e) => all(e.detail.key));
  addEventListener('storage', () => all());
}

/* ---- language */
function language() {
  $$('[data-lang-toggle]').forEach((b) => b.addEventListener('click', () => setLang(lang() === 'ar' ? 'en' : 'ar')));
}

/* ---- cookies */
function cookies() {
  const el = $('[data-cookie]');
  if (!el) return;
  const KEY = 'eaf-cookies';
  let choice = null;
  try { choice = localStorage.getItem(KEY); } catch { /* blocked */ }
  if (!choice) setTimeout(() => { el.hidden = false; }, 1200);
  el.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cookie-choice]');
    if (!b) return;
    try { localStorage.setItem(KEY, b.dataset.cookieChoice); } catch { /* blocked */ }
    el.hidden = true;
  });
  $$('[data-cookie-settings]').forEach((b) => b.addEventListener('click', () => { el.hidden = false; }));
}

/* ---- footer store list */
function footerStores() {
  const ul = $('[data-footer-stores]');
  if (!ul) return;
  const render = () => {
    const cities = [...new Map(STORES.map((s) => [s.city, s])).values()];
    ul.innerHTML = cities.map((s) => `<li><a href="stores.html?s=${s.id}">${isAr() ? s.cityAr : s.city}</a></li>`).join('');
  };
  render();
  addEventListener('langchange', render);
  if (matchMedia('(max-width: 640px)').matches) $$('.footer__col').forEach((d) => d.removeAttribute('open'));
}

/* ---- reveal on scroll for .reveal (outside scroll acts) */
export function reveals(root = document) {
  const els = $$('.reveal:not(.is-in)', root);
  if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach((e) => io.observe(e));
}

export function initChrome() {
  renderNav();
  ticker();
  headerState();
  mega();
  drawer();
  search();
  counts();
  language();
  cookies();
  footerStores();
  reveals();
}
