/* Category / listing page: ?c=<category|promotions|wishlist|all>&q=<search> */
import { boot } from '../app.js';
import '../../styles/category.css';
import { CATEGORIES, COLORS, MATERIALS, STYLES, productsIn } from '../data.js';
import { L, t, price } from '../i18n.js';
import { cardHTML, skeletonHTML, discount } from '../cards.js';
import { wish } from '../store.js';
import { searchProducts } from '../ui.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const catId = params.get('c') || 'all';
const query = params.get('q') || '';
const PAGE = 8;

boot();

const WIDTHS = [
  { id: 'lt180', test: (w) => w < 180 },
  { id: '180_240', test: (w) => w >= 180 && w <= 240 },
  { id: '240_300', test: (w) => w > 240 && w <= 300 },
  { id: 'gt300', test: (w) => w > 300 },
];

/* Base set for this page before filters. */
function baseSet() {
  if (query) return searchProducts(query);
  if (catId === 'wishlist') return productsIn('all').filter((p) => wish.has(p.id));
  return productsIn(catId);
}
const base = baseSet();
const priceMin = base.length ? Math.floor(Math.min(...base.map((p) => p.price)) / 1000) * 1000 : 0;
const priceMax = Math.ceil(Math.max(...base.map((p) => p.price), 1000) / 1000) * 1000;

const state = {
  pmin: priceMin, pmax: priceMax, widths: new Set(), colours: new Set(), materials: new Set(), styles: new Set(),
  instock: false, promo: catId === 'promotions', sort: 'relevance', shown: PAGE,
};

const cat = CATEGORIES.find((c) => c.id === catId);
const title = () => {
  if (query) return t('search_for', query);
  if (cat) return L(cat);
  if (catId === 'promotions') return t('promotions');
  if (catId === 'wishlist') return t('wishlist');
  return t('catalog');
};

function filtered() {
  const list = base.filter((p) => p.price >= state.pmin && p.price <= state.pmax
    && (!state.widths.size || WIDTHS.some((w) => state.widths.has(w.id) && w.test(p.width)))
    && (!state.colours.size || p.colors.some((c) => state.colours.has(c)))
    && (!state.materials.size || state.materials.has(p.material))
    && (!state.styles.size || state.styles.has(p.style))
    && (!state.instock || p.stock === 'in')
    && (!state.promo || p.old));
  const by = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    discount: (a, b) => discount(b) - discount(a),
    rating: (a, b) => b.rating - a.rating,
  }[state.sort];
  return by ? [...list].sort(by) : list;
}

/* ---- header: crumbs, title, count, sub-category chips */
function head(count) {
  $('[data-crumbs]').innerHTML = `<li><a href="index.html">${t('home')}</a></li>`
    + (cat || catId !== 'all' || query ? `<li><a href="category.html">${t('catalog')}</a></li>` : '')
    + `<li><span aria-current="page">${title()}</span></li>`;
  $('[data-cat-title]').textContent = title();
  $('[data-cat-count]').textContent = t('results', count);
  document.title = `${title()} · El Arika Factory`;
  $('[data-cat-subs]').innerHTML = CATEGORIES.map((c) => `<li><a class="chip${c.id === catId ? ' is-active' : ''}" href="category.html?c=${c.id}"${c.id === catId ? ' aria-current="page"' : ''}>${L(c)}</a></li>`).join('')
    + `<li><a class="chip${catId === 'promotions' ? ' is-active' : ''}" href="category.html?c=promotions">${t('promotions')}</a></li>`;
}

/* ---- filter controls (built from what the base set actually contains) */
const countBy = (fn) => base.reduce((m, p) => { [].concat(fn(p)).forEach((k) => m.set(k, (m.get(k) || 0) + 1)); return m; }, new Map());

function buildFilters() {
  const widths = WIDTHS.filter((w) => base.some((p) => w.test(p.width)));
  $('[data-widths]').innerHTML = widths.map((w) => `<button class="chip" type="button" data-width="${w.id}" aria-pressed="${state.widths.has(w.id)}">${t(`w_${w.id}`)}</button>`).join('');

  const colours = countBy((p) => p.colors);
  $('[data-colours]').innerHTML = [...colours.keys()].map((k) => `<button class="swatch" type="button" style="--sw:${COLORS[k].hex}" data-colour="${k}" aria-pressed="${state.colours.has(k)}" aria-label="${L(COLORS[k])}" title="${L(COLORS[k])}"></button>`).join('');

  const mats = countBy((p) => p.material);
  $('[data-materials]').innerHTML = [...mats].map(([k, n]) => `<label class="check"><input type="checkbox" data-material="${k}"${state.materials.has(k) ? ' checked' : ''}><span>${L(MATERIALS[k])}</span><span class="count">${n}</span></label>`).join('');

  const styles = countBy((p) => p.style);
  $('[data-styles]').innerHTML = [...styles].map(([k, n]) => `<label class="check"><input type="checkbox" data-style="${k}"${state.styles.has(k) ? ' checked' : ''}><span>${L(STYLES[k])}</span><span class="count">${n}</span></label>`).join('');

  const form = $('[data-filter-form]');
  form.instock.checked = state.instock;
  form.promo.checked = state.promo;
  for (const name of ['pmin', 'pmax']) {
    form[name].min = priceMin;
    form[name].max = priceMax;
  }
  form.pmin.value = state.pmin;
  form.pmax.value = state.pmax;
  rangeUI();
}

function rangeUI() {
  const span = priceMax - priceMin || 1;
  const a = ((state.pmin - priceMin) / span) * 100;
  const b = ((state.pmax - priceMin) / span) * 100;
  const fill = $('[data-range-fill]');
  fill.style.insetInlineStart = `${a}%`;
  fill.style.width = `${b - a}%`;
  $('[data-range-out]').textContent = t('range', price(state.pmin), price(state.pmax));
}

/* ---- active filter chips */
function activeChips() {
  const chips = [];
  if (state.pmin > priceMin || state.pmax < priceMax) chips.push(['price', '', t('range', price(state.pmin), price(state.pmax))]);
  state.widths.forEach((w) => chips.push(['width', w, t(`w_${w}`)]));
  state.colours.forEach((c) => chips.push(['colour', c, L(COLORS[c])]));
  state.materials.forEach((m) => chips.push(['material', m, L(MATERIALS[m])]));
  state.styles.forEach((s) => chips.push(['style', s, L(STYLES[s])]));
  $('[data-active]').innerHTML = chips.map(([k, v, label]) => `<button class="chip" type="button" data-clear="${k}" data-value="${v}" aria-label="${t('remove_filter')}: ${label}">${label}<svg class="i" aria-hidden="true"><use href="#i-close"/></svg></button>`).join('');
}

/* ---- results */
let first = true;
function render() {
  const list = filtered();
  head(list.length);
  activeChips();
  const grid = $('[data-grid]');
  const show = () => {
    grid.innerHTML = list.slice(0, state.shown).map((p, i) => cardHTML(p, { eager: i < 4 })).join('');
    const empty = $('[data-empty]');
    empty.hidden = list.length > 0;
    empty.textContent = t('no_results');
    const shown = Math.min(state.shown, list.length);
    $('[data-loadmore]').hidden = list.length === 0;
    $('[data-shown]').textContent = t('shown', shown, list.length);
    $('[data-shown-bar]').style.width = `${(shown / Math.max(1, list.length)) * 100}%`;
    $('[data-more]').hidden = shown >= list.length;
    $('[data-apply]').textContent = t('show_n', list.length);
  };
  if (first) {
    first = false;
    grid.innerHTML = skeletonHTML(Math.min(PAGE, Math.max(4, list.length)));
    setTimeout(show, 350);
  } else show();
}

/* ---- SEO block */
function seo() {
  const name = cat ? L(cat) : t('catalog');
  $('[data-seo-title]').textContent = t('seo_title', name);
  $('[data-seo-text]').innerHTML = `<p>${t('seo_p1', name.toLowerCase())}</p><p>${t('seo_p2')}</p>`;
}

/* ---- events */
const form = $('[data-filter-form]');
form.addEventListener('input', (e) => {
  const el = e.target;
  if (el.name === 'pmin') state.pmin = Math.min(+el.value, state.pmax - 1000);
  if (el.name === 'pmax') state.pmax = Math.max(+el.value, state.pmin + 1000);
  if (el.name === 'pmin' || el.name === 'pmax') { form.pmin.value = state.pmin; form.pmax.value = state.pmax; rangeUI(); }
  if (el.name === 'instock') state.instock = el.checked;
  if (el.name === 'promo') state.promo = el.checked;
  if (el.dataset.material) state.materials[el.checked ? 'add' : 'delete'](el.dataset.material);
  if (el.dataset.style) state.styles[el.checked ? 'add' : 'delete'](el.dataset.style);
  state.shown = PAGE;
  render();
});
form.addEventListener('click', (e) => {
  const w = e.target.closest('[data-width]');
  const c = e.target.closest('[data-colour]');
  const b = w || c;
  if (!b) return;
  const set = w ? state.widths : state.colours;
  const key = w ? w.dataset.width : c.dataset.colour;
  const on = !set.has(key);
  set[on ? 'add' : 'delete'](key);
  b.setAttribute('aria-pressed', on);
  state.shown = PAGE;
  render();
});
$('[data-active]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-clear]');
  if (!b) return;
  const { clear, value } = b.dataset;
  if (clear === 'price') { state.pmin = priceMin; state.pmax = priceMax; }
  if (clear === 'width') state.widths.delete(value);
  if (clear === 'colour') state.colours.delete(value);
  if (clear === 'material') state.materials.delete(value);
  if (clear === 'style') state.styles.delete(value);
  buildFilters();
  render();
});
$('[data-reset]').addEventListener('click', () => {
  Object.assign(state, { pmin: priceMin, pmax: priceMax, instock: false, promo: catId === 'promotions', shown: PAGE });
  ['widths', 'colours', 'materials', 'styles'].forEach((k) => state[k].clear());
  buildFilters();
  render();
});
$('[data-sort]').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
$('[data-more]').addEventListener('click', () => {
  const grid = $('[data-grid]');
  const before = grid.children.length;
  state.shown += PAGE;
  render();
  grid.children[before]?.querySelector('a[href]:not([tabindex])')?.focus({ preventScroll: true });
});

/* mobile filter sheet */
const sheet = $('[data-filters]');
$('[data-filters-open]').addEventListener('click', () => {
  sheet.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  $('.filters__close', sheet).focus();
});
const closeSheet = () => { sheet.classList.remove('is-open'); document.body.style.overflow = ''; };
$$('[data-filters-close]', sheet).forEach((b) => b.addEventListener('click', closeSheet));
sheet.addEventListener('click', (e) => { if (e.target === sheet) closeSheet(); });
sheet.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

buildFilters();
render();
seo();
addEventListener('langchange', () => { buildFilters(); render(); seo(); });
addEventListener('store:change', (e) => { if (e.detail.key === 'eaf-wish' && catId === 'wishlist') location.reload(); });
